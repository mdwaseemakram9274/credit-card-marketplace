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

type Body = {
  bankName?: string;
  cardName?: string;
  sourceUrl?: string;
  bankSlug?: string;
  cardSlug?: string;
  description?: string;
  imageUrl?: string;
  useScrapedImage?: boolean;
};

type WriteResult = {
  persisted: boolean;
  warnings: string[];
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
    const imageUrl = overrideImageUrl || (useScrapedImage ? imageCandidates[0] || '' : '');

    const root = process.cwd();
    const fileName = `${cardSlug}.html`;

    const writeResult = writeMarketplaceFiles({
      root,
      bankSlug,
      bankName,
      cardName,
      fileName,
      sourceUrl: validatedUrl.toString(),
      imageUrl: imageUrl || undefined,
      annualFee,
      description,
      keyBenefits,
    });

    return res.status(200).json({
      ok: true,
      persisted: writeResult.persisted,
      warnings: writeResult.warnings,
      bankSlug,
      cardSlug,
      annualFee: annualFee || null,
      imageUrl: imageUrl || null,
      imageCandidates,
      keyBenefits: keyBenefits || [],
      bankPageUrl: `/bank.html?bank=${encodeURIComponent(bankSlug)}`,
      cardQueryUrl: `/card.html?bank=${encodeURIComponent(bankSlug)}&card=${encodeURIComponent(cardSlug)}`,
      generatedCardUrl: writeResult.persisted ? `/cards/${bankSlug}/${cardSlug}.html` : null,
      cardDraft: {
        title: cardName,
        filename: fileName,
        imageUrl: imageUrl || null,
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
    annualFee,
    description,
    keyBenefits,
  } = params;

  const warnings: string[] = [];
  let persisted = true;

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
          imageUrl,
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
        imageUrl,
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
  };
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
