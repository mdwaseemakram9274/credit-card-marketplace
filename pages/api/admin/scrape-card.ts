import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import {
  createCardHtml,
  ensureDir,
  loadMarketplaceFile,
  marketplacePaths,
  saveMarketplaceFile,
  toSlug,
  upsertBankAndCard,
} from '../../../lib/marketplace';
import { getSupabaseServerClient, hasSupabaseConfig } from '../../../lib/supabase-server';

type Body = {
  bankName?: string;
  cardName?: string;
  sourceUrl?: string;
  bankSlug?: string;
  cardSlug?: string;
  description?: string;
  imageUrl?: string;
  uploadedImageData?: string;
  uploadedImageName?: string;
  useScrapedImage?: boolean;
};

type WriteResult = {
  persisted: boolean;
  warnings: string[];
  imageUrl?: string;
  target?: 'cloud' | 'local';
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const body = req.body as Body;
    const bankName = (body.bankName || '').trim();
    const cardName = (body.cardName || '').trim();
    const sourceUrl = (body.sourceUrl || '').trim();

    if (!bankName || !cardName || !sourceUrl) {
      return res.status(400).json({ ok: false, error: 'bankName, cardName, and sourceUrl are required.' });
    }

    let validatedUrl: URL;
    try {
      validatedUrl = new URL(sourceUrl);
    } catch {
      return res.status(400).json({ ok: false, error: 'Invalid sourceUrl.' });
    }

    const bankSlug = (body.bankSlug || toSlug(bankName)).trim();
    const cardSlug = (body.cardSlug || toSlug(cardName)).trim();

    const html = await fetchHtml(validatedUrl.toString());
    const extracted = extractCardDetails(html);
    const imageCandidates = extractImageCandidates(html, validatedUrl);

    const annualFee = extracted.annualFee;
    const keyBenefits = extracted.keyBenefits;
    const description = (body.description || extracted.description || '').trim();
    const overrideImageUrl = (body.imageUrl || '').trim();
    const useScrapedImage = body.useScrapedImage !== false;
    const selectedImageUrl = overrideImageUrl || (useScrapedImage ? imageCandidates[0] || '' : '');
    const uploadedImageData = (body.uploadedImageData || '').trim();
    const uploadedImageName = (body.uploadedImageName || '').trim();

    const root = process.cwd();
    const fileName = `${cardSlug}.html`;

    let writeResult: WriteResult;

    if (hasSupabaseConfig()) {
      const cloudResult = await writeMarketplaceToSupabase({
        bankSlug,
        bankName,
        cardSlug,
        cardName,
        sourceUrl: validatedUrl.toString(),
        imageUrl: selectedImageUrl || undefined,
        uploadedImageData: uploadedImageData || undefined,
        uploadedImageName: uploadedImageName || undefined,
        annualFee,
        description,
        keyBenefits,
      });

      if (cloudResult.persisted) {
        writeResult = cloudResult;
      } else {
        const localFallback = writeMarketplaceFiles({
          root,
          bankSlug,
          bankName,
          cardName,
          fileName,
          sourceUrl: validatedUrl.toString(),
          imageUrl: selectedImageUrl || undefined,
          uploadedImageData: uploadedImageData || undefined,
          uploadedImageName: uploadedImageName || undefined,
          annualFee,
          description,
          keyBenefits,
        });
        writeResult = {
          ...localFallback,
          warnings: [...cloudResult.warnings, ...localFallback.warnings],
        };
      }
    } else {
      writeResult = writeMarketplaceFiles({
        root,
        bankSlug,
        bankName,
        cardName,
        fileName,
        sourceUrl: validatedUrl.toString(),
        imageUrl: selectedImageUrl || undefined,
        uploadedImageData: uploadedImageData || undefined,
        uploadedImageName: uploadedImageName || undefined,
        annualFee,
        description,
        keyBenefits,
      });
    }

    return res.status(200).json({
      ok: true,
      persisted: writeResult.persisted,
      warnings: writeResult.warnings,
      bankSlug,
      cardSlug,
      annualFee: annualFee || null,
      imageUrl: writeResult.imageUrl || null,
      imageCandidates,
      keyBenefits: keyBenefits || [],
      bankPageUrl: `/bank.html?bank=${encodeURIComponent(bankSlug)}`,
      cardQueryUrl: `/card.html?bank=${encodeURIComponent(bankSlug)}&card=${encodeURIComponent(cardSlug)}`,
      generatedCardUrl: writeResult.target === 'local' && writeResult.persisted ? `/cards/${bankSlug}/${cardSlug}.html` : null,
      cardDraft: {
        title: cardName,
        filename: fileName,
        imageUrl: writeResult.imageUrl || null,
        annualFee: annualFee || null,
        description: description || null,
        keyBenefits: keyBenefits || [],
      },
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : 'Unexpected server error',
    });
  }
}

function writeMarketplaceFiles(params: {
  root: string;
  bankSlug: string;
  bankName: string;
  cardName: string;
  fileName: string;
  sourceUrl: string;
  imageUrl?: string;
  uploadedImageData?: string;
  uploadedImageName?: string;
  annualFee?: string;
  description?: string;
  keyBenefits?: string[];
}): WriteResult {
  const {
    root,
    bankSlug,
    bankName,
    cardName,
    fileName,
    sourceUrl,
    imageUrl,
    uploadedImageData,
    uploadedImageName,
    annualFee,
    description,
    keyBenefits,
  } = params;

  const warnings: string[] = [];
  let persisted = true;
  let finalImageUrl = imageUrl;

  if (uploadedImageData) {
    try {
      finalImageUrl = saveUploadedImage({
        root,
        bankSlug,
        cardName,
        fileName,
        uploadedImageData,
        uploadedImageName,
      });
    } catch (error) {
      if (isReadOnlyFsError(error)) {
        persisted = false;
        warnings.push('Read-only filesystem detected. Uploaded image was not saved on this environment.');
      } else {
        throw error;
      }
    }
  }

  for (const dataPath of marketplacePaths(root)) {
    if (!fs.existsSync(dataPath)) {
      continue;
    }

    try {
      const data = loadMarketplaceFile(dataPath);
      upsertBankAndCard({
        data,
        bankSlug,
        bankName,
        card: {
          title: cardName,
          filename: fileName,
          imageUrl: finalImageUrl,
          annualFee,
          description,
          keyBenefits,
        },
      });
      saveMarketplaceFile(dataPath, data);
    } catch (error) {
      if (isReadOnlyFsError(error)) {
        persisted = false;
        warnings.push('Read-only filesystem detected. Data file was not updated on this environment.');
        continue;
      }
      throw error;
    }
  }

  try {
    const cardDir = path.join(root, 'public', 'cards', bankSlug);
    ensureDir(cardDir);

    const cardFilePath = path.join(cardDir, fileName);
    fs.writeFileSync(
      cardFilePath,
      createCardHtml({
        bankName,
        cardName,
        sourceUrl,
        imageUrl: finalImageUrl,
        annualFee,
        description,
        keyBenefits,
      }),
      'utf8'
    );
  } catch (error) {
    if (isReadOnlyFsError(error)) {
      persisted = false;
      warnings.push('Read-only filesystem detected. Card HTML file was not generated on this environment.');
    } else {
      throw error;
    }
  }

  if (!persisted && warnings.length === 0) {
    warnings.push('Changes were not persisted in this environment.');
  }

  return {
    persisted,
    warnings,
    imageUrl: finalImageUrl,
    target: 'local',
  };
}

async function writeMarketplaceToSupabase(params: {
  bankSlug: string;
  bankName: string;
  cardSlug: string;
  cardName: string;
  sourceUrl: string;
  imageUrl?: string;
  uploadedImageData?: string;
  uploadedImageName?: string;
  annualFee?: string;
  description?: string;
  keyBenefits?: string[];
}): Promise<WriteResult> {
  const {
    bankSlug,
    bankName,
    cardSlug,
    cardName,
    sourceUrl,
    imageUrl,
    uploadedImageData,
    uploadedImageName,
    annualFee,
    description,
    keyBenefits,
  } = params;

  const warnings: string[] = [];

  try {
    const supabase = getSupabaseServerClient();

    const { data: bankRow, error: bankError } = await supabase
      .from('banks')
      .upsert(
        {
          slug: bankSlug,
          name: bankName,
          description: null,
        },
        { onConflict: 'slug' }
      )
      .select('id')
      .single();

    if (bankError || !bankRow?.id) {
      throw new Error(bankError?.message || 'Failed to upsert bank in Supabase.');
    }

    let finalImageUrl = imageUrl;

    if (uploadedImageData) {
      try {
        finalImageUrl = await uploadImageToSupabaseStorage({
          supabase,
          bankSlug,
          cardSlug,
          cardName,
          uploadedImageData,
          uploadedImageName,
        });
      } catch (error) {
        warnings.push(
          error instanceof Error
            ? `Image upload to Supabase failed: ${error.message}`
            : 'Image upload to Supabase failed.'
        );
      }
    }

    const { error: cardError } = await supabase.from('cards').upsert(
      {
        bank_id: bankRow.id,
        slug: cardSlug,
        title: cardName,
        source_url: sourceUrl,
        image_url: finalImageUrl || null,
        annual_fee: annualFee || null,
        description: description || null,
        key_benefits: keyBenefits || [],
      },
      { onConflict: 'bank_id,slug' }
    );

    if (cardError) {
      throw new Error(cardError.message || 'Failed to upsert card in Supabase.');
    }

    return {
      persisted: true,
      warnings,
      imageUrl: finalImageUrl,
      target: 'cloud',
    };
  } catch (error) {
    return {
      persisted: false,
      warnings: [
        error instanceof Error
          ? `Supabase save failed: ${error.message}`
          : 'Supabase save failed.',
      ],
      imageUrl,
      target: 'cloud',
    };
  }
}

async function uploadImageToSupabaseStorage(params: {
  supabase: ReturnType<typeof getSupabaseServerClient>;
  bankSlug: string;
  cardSlug: string;
  cardName: string;
  uploadedImageData: string;
  uploadedImageName?: string;
}): Promise<string> {
  const { supabase, bankSlug, cardSlug, cardName, uploadedImageData, uploadedImageName } = params;

  const parsed = parseDataUrl(uploadedImageData);
  if (!parsed) {
    throw new Error('Invalid uploaded image payload.');
  }

  const extension =
    extensionFromMime(parsed.mimeType) ||
    extensionFromFilename(uploadedImageName || '') ||
    'png';

  const baseName = cardSlug || toSlug(cardName) || 'card';
  const storagePath = `cards/${bankSlug}/${baseName}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from('card-images')
    .upload(storagePath, parsed.buffer, {
      upsert: true,
      contentType: parsed.mimeType,
    });

  if (uploadError) {
    throw new Error(uploadError.message || 'Supabase storage upload error.');
  }

  const { data } = supabase.storage.from('card-images').getPublicUrl(storagePath);
  if (!data?.publicUrl) {
    throw new Error('Could not resolve public URL for uploaded image.');
  }

  return data.publicUrl;
}

function saveUploadedImage(params: {
  root: string;
  bankSlug: string;
  cardName: string;
  fileName: string;
  uploadedImageData: string;
  uploadedImageName?: string;
}): string {
  const { root, bankSlug, cardName, fileName, uploadedImageData, uploadedImageName } = params;

  const parsed = parseDataUrl(uploadedImageData);
  if (!parsed) {
    throw new Error('Invalid uploaded image data.');
  }

  const extension =
    extensionFromMime(parsed.mimeType) ||
    extensionFromFilename(uploadedImageName || '') ||
    'png';

  const baseName = fileName.replace(/\.html$/i, '') || toSlug(cardName) || 'card';
  const imageFileName = `${baseName}.${extension}`;
  const imageDir = path.join(root, 'public', 'uploads', 'cards', bankSlug);
  ensureDir(imageDir);

  const outputPath = path.join(imageDir, imageFileName);
  fs.writeFileSync(outputPath, parsed.buffer);

  return `/uploads/cards/${bankSlug}/${imageFileName}`;
}

function isReadOnlyFsError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const nodeError = error as NodeJS.ErrnoException;
  return nodeError.code === 'EROFS' || nodeError.code === 'EPERM';
}

async function fetchHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml',
    },
  });

  if (!response.ok) {
    throw new Error(`Unable to fetch source URL. Status: ${response.status}`);
  }

  return response.text();
}

function extractCardDetails(html: string): {
  annualFee?: string;
  description?: string;
  keyBenefits?: string[];
} {
  const text = normalizeWhitespace(stripTags(html));

  const feeMatch = text.match(
    /(?:annual fee|joining fee|fee)\s*[:\-]?\s*(₹\s?[\d,]+(?:\.\d+)?(?:\s*[a-zA-Z]+)?|[\d,]+\s*(?:INR|Rs\.?|rupees)?|lifetime\s*free|nil|waived)/i
  );

  const liMatches: string[] = [];
  const liRegex = /<li[^>]*>(.*?)<\/li>/gis;
  let liMatch: RegExpExecArray | null;

  while ((liMatch = liRegex.exec(html)) !== null && liMatches.length < 6) {
    const normalized = normalizeWhitespace(stripTags(liMatch[1] || ''));
    if (normalized.length > 20) {
      liMatches.push(normalized);
    }
  }

  const descriptionMatch = html.match(
    /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i
  );

  return {
    annualFee: feeMatch ? feeMatch[1] : undefined,
    description: descriptionMatch ? normalizeWhitespace(descriptionMatch[1]) : undefined,
    keyBenefits: liMatches.length ? liMatches : undefined,
  };
}

function stripTags(input: string): string {
  return input
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function parseDataUrl(dataUrl: string): { mimeType: string; buffer: Buffer } | null {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) {
    return null;
  }

  const mimeType = match[1].toLowerCase();
  const base64 = match[2];
  const buffer = Buffer.from(base64, 'base64');

  if (!buffer.length) {
    return null;
  }

  return { mimeType, buffer };
}

function extensionFromMime(mimeType: string): string | null {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
  };
  return map[mimeType] || null;
}

function extensionFromFilename(fileName: string): string | null {
  const match = fileName.toLowerCase().match(/\.([a-z0-9]+)$/);
  if (!match) {
    return null;
  }

  const ext = match[1];
  if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext)) {
    return ext === 'jpeg' ? 'jpg' : ext;
  }

  return null;
}

function extractImageCandidates(html: string, baseUrl: URL): string[] {
  const candidates: string[] = [];

  const pushCandidate = (url: string) => {
    const normalized = toAbsoluteUrl(url, baseUrl);
    if (!normalized) {
      return;
    }
    if (!candidates.includes(normalized)) {
      candidates.push(normalized);
    }
  };

  const metaRegex = /<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]+content=["']([^"']+)["'][^>]*>/gi;
  let metaMatch: RegExpExecArray | null;
  while ((metaMatch = metaRegex.exec(html)) !== null && candidates.length < 8) {
    pushCandidate(metaMatch[1]);
  }

  const linkImageRegex = /<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["'][^>]*>/gi;
  let linkMatch: RegExpExecArray | null;
  while ((linkMatch = linkImageRegex.exec(html)) !== null && candidates.length < 8) {
    pushCandidate(linkMatch[1]);
  }

  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let imgMatch: RegExpExecArray | null;
  while ((imgMatch = imgRegex.exec(html)) !== null && candidates.length < 12) {
    const src = imgMatch[1] || '';
    const low = src.toLowerCase();
    if (low.includes('card') || low.includes('credit') || low.includes('product') || low.includes('hero')) {
      pushCandidate(src);
    }
  }

  return candidates.slice(0, 6);
}

function toAbsoluteUrl(value: string, baseUrl: URL): string | null {
  try {
    const url = new URL(value, baseUrl);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}
