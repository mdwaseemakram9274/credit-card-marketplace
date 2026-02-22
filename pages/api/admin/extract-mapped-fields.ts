import type { NextApiRequest, NextApiResponse } from 'next';

type Body = {
  sourceUrl?: string;
  uploadedImageData?: string;
  uploadedImageDataList?: string[];
};

type ExtractedFields = {
  benefitTags?: string;
  primaryCardType?: string;
  joiningFee?: string;
  annualFeeInput?: string;
  foreignMarkup?: string;
  minAge?: string;
  minIncome?: string;
  applicationUrl?: string;
  baseRewardRule?: string;
  redemptionOptions?: string;
  keyTerms?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const body = req.body as Body;
    const sourceUrl = (body.sourceUrl || '').trim();
    const uploadedImageData = (body.uploadedImageData || '').trim();
    const uploadedImageDataList = Array.isArray(body.uploadedImageDataList)
      ? body.uploadedImageDataList.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      : [];

    let urlText = '';
    if (sourceUrl) {
      try {
        const url = new URL(sourceUrl);
        const html = await fetchHtml(url.toString());
        urlText = normalizeWhitespace(stripTags(html));
      } catch {
        urlText = '';
      }
    }

    const urlMapped = extractFromText(urlText, sourceUrl);
    let merged: ExtractedFields = { ...urlMapped };

    const imageInputs = uploadedImageDataList.length ? uploadedImageDataList : uploadedImageData ? [uploadedImageData] : [];

    let imageText = '';
    if (imageInputs.length) {
      for (const imageData of imageInputs) {
        try {
          const extractedText = await extractTextFromImage(imageData);
          if (!extractedText) {
            continue;
          }

          imageText = `${imageText} ${extractedText}`.trim();

          const temporaryMerge = mergePreferExisting(merged, extractFromText(imageText, sourceUrl));
          const remaining = requiredFieldKeys().filter((key) => !(temporaryMerge[key] || '').trim());
          if (!remaining.length) {
            merged = temporaryMerge;
            break;
          }
        } catch {
          continue;
        }
      }
    }

    const missingRequired = requiredFieldKeys().filter((key) => !(merged[key] || '').trim());

    if (missingRequired.length > 0 && imageText) {
      const imageMapped = extractFromText(imageText, sourceUrl);
      merged = mergePreferExisting(merged, imageMapped);
    }

    const stillMissing = requiredFieldKeys().filter((key) => !(merged[key] || '').trim());

    return res.status(200).json({
      ok: true,
      mappedFields: merged,
      usedSources: {
        url: Boolean(urlText),
        image: Boolean(imageText),
      },
      missingRequired: stillMissing,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : 'Extraction failed',
    });
  }
}

function extractFromText(text: string, sourceUrl: string): ExtractedFields {
  if (!text) {
    return sourceUrl ? { applicationUrl: sourceUrl } : {};
  }

  const lower = text.toLowerCase();

  const tags = collectTags(lower);

  const annualFee =
    matchRegex(text, /annual fee\s*[:\-]?\s*(₹\s?[\d,]+(?:\.\d+)?|lifetime free|nil|waived)/i) || '';
  const joiningFee =
    matchRegex(text, /joining fee\s*[:\-]?\s*(₹\s?[\d,]+(?:\.\d+)?|lifetime free|nil|waived)/i) || '';
  const foreignMarkup =
    matchRegex(text, /(foreign (?:currency )?markup(?: fee)?\s*[:\-]?\s*[\d.]+\s*%)/i) ||
    matchRegex(text, /(\d+(?:\.\d+)?\s*%\s*foreign markup)/i) ||
    '';

  const minAge =
    matchRegex(text, /(?:minimum age|min age|age)\s*[:\-]?\s*(\d{2})/i) ||
    matchRegex(text, /(\d{2})\s*(?:years?)\s*(?:and above|minimum)/i) ||
    '';

  const minIncome =
    matchRegex(text, /(?:minimum income|min income|income)\s*[:\-]?\s*(₹\s?[\d,.]+\s*(?:lakh|lakhs|per annum|p\.a\.)?)/i) ||
    '';

  const baseRewardRule =
    matchRegex(text, /(\d+\s*(?:reward points?|rp)\s*(?:for|per)\s*₹?\s*\d+)/i) ||
    matchRegex(text, /(earn\s+[^.]{0,120}reward[^.]{0,120})/i) ||
    '';

  const redemptionOptions = collectRedemptionOptions(lower);

  const keyTerms =
    matchRegex(text, /(terms and conditions[^.]{0,180}\.)/i) ||
    matchRegex(text, /(fees and charges[^.]{0,180}\.)/i) ||
    '';

  return {
    benefitTags: tags.join(', '),
    primaryCardType: inferPrimaryType(tags, lower),
    joiningFee,
    annualFeeInput: annualFee,
    foreignMarkup,
    minAge,
    minIncome,
    applicationUrl: sourceUrl || '',
    baseRewardRule,
    redemptionOptions,
    keyTerms,
  };
}

function collectTags(lower: string): string[] {
  const map: Array<{ key: string; label: string }> = [
    { key: 'cashback', label: 'Cashback' },
    { key: 'travel', label: 'Travel' },
    { key: 'fuel', label: 'Fuel' },
    { key: 'shopping', label: 'Shopping' },
    { key: 'reward', label: 'Rewards' },
    { key: 'lounge', label: 'Lounge Access' },
    { key: 'dining', label: 'Dining' },
  ];

  const out: string[] = [];
  for (const item of map) {
    if (lower.includes(item.key)) {
      out.push(item.label);
    }
  }

  if (!out.length) {
    out.push('Rewards');
  }

  return out;
}

function inferPrimaryType(tags: string[], lower: string): string {
  if (tags.includes('Travel')) return 'travel';
  if (tags.includes('Fuel')) return 'fuel';
  if (tags.includes('Cashback')) return 'cashback';
  if (tags.includes('Shopping')) return 'shopping';
  if (lower.includes('co-branded') || lower.includes('cobranded')) return 'co-branded';
  if (lower.includes('business')) return 'business';
  if (lower.includes('premium')) return 'premium';
  return 'lifestyle';
}

function collectRedemptionOptions(lower: string): string {
  const options: string[] = [];
  if (lower.includes('statement credit')) options.push('Statement Credit');
  if (lower.includes('voucher')) options.push('Vouchers');
  if (lower.includes('air miles') || lower.includes('airmiles')) options.push('Air Miles');
  if (lower.includes('cashback')) options.push('Cashback');
  return options.join(', ');
}

function mergePreferExisting(primary: ExtractedFields, secondary: ExtractedFields): ExtractedFields {
  const merged: ExtractedFields = { ...primary };

  (Object.keys(secondary) as Array<keyof ExtractedFields>).forEach((key) => {
    if (!(merged[key] || '').trim() && (secondary[key] || '').trim()) {
      merged[key] = secondary[key];
    }
  });

  return merged;
}

function requiredFieldKeys(): Array<keyof ExtractedFields> {
  return [
    'benefitTags',
    'primaryCardType',
    'joiningFee',
    'annualFeeInput',
    'foreignMarkup',
    'minAge',
    'minIncome',
    'applicationUrl',
    'baseRewardRule',
    'redemptionOptions',
    'keyTerms',
  ];
}

async function extractTextFromImage(dataUrl: string): Promise<string> {
  const parsed = parseDataUrl(dataUrl);
  if (!parsed) {
    return '';
  }

  const { createWorker } = await import('tesseract.js');
  const worker = await createWorker('eng');
  try {
    const result = await worker.recognize(parsed.buffer);
    return normalizeWhitespace(result.data.text || '');
  } finally {
    await worker.terminate();
  }
}

function parseDataUrl(dataUrl: string): { buffer: Buffer } | null {
  const match = dataUrl.match(/^data:image\/[a-zA-Z0-9.+-]+;base64,(.+)$/);
  if (!match) {
    return null;
  }

  const buffer = Buffer.from(match[1], 'base64');
  if (!buffer.length) {
    return null;
  }

  return { buffer };
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

function matchRegex(input: string, regex: RegExp): string {
  const match = input.match(regex);
  if (!match) {
    return '';
  }
  return (match[1] || match[0] || '').trim();
}
