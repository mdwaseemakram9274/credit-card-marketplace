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

    const annualFee = extracted.annualFee;
    const keyBenefits = extracted.keyBenefits;
    const description = (body.description || extracted.description || '').trim();

    const root = process.cwd();
    const fileName = `${cardSlug}.html`;

    for (const dataPath of marketplacePaths(root)) {
      if (!fs.existsSync(dataPath)) {
        continue;
      }

      const data = loadMarketplaceFile(dataPath);
      upsertBankAndCard({
        data,
        bankSlug,
        bankName,
        card: {
          title: cardName,
          filename: fileName,
          annualFee,
          description,
          keyBenefits,
        },
      });
      saveMarketplaceFile(dataPath, data);
    }

    const cardDir = path.join(root, 'public', 'cards', bankSlug);
    ensureDir(cardDir);

    const cardFilePath = path.join(cardDir, fileName);
    fs.writeFileSync(
      cardFilePath,
      createCardHtml({
        bankName,
        cardName,
        sourceUrl: validatedUrl.toString(),
        annualFee,
        description,
        keyBenefits,
      }),
      'utf8'
    );

    return res.status(200).json({
      ok: true,
      bankSlug,
      cardSlug,
      annualFee: annualFee || null,
      keyBenefits: keyBenefits || [],
      bankPageUrl: `/bank.html?bank=${encodeURIComponent(bankSlug)}`,
      cardQueryUrl: `/card.html?bank=${encodeURIComponent(bankSlug)}&card=${encodeURIComponent(cardSlug)}`,
      generatedCardUrl: `/cards/${bankSlug}/${cardSlug}.html`,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : 'Unexpected server error',
    });
  }
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
