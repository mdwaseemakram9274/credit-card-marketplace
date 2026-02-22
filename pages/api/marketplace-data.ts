import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { getSupabaseServerClient, hasSupabaseConfig } from '../../lib/supabase-server';

type MarketplaceResponse = {
  source: 'cloud' | 'local';
  banks: Array<{
    slug: string;
    name: string;
    description?: string;
    cards: Array<{
      slug: string;
      name: string;
      description?: string;
      imageUrl?: string;
      annualFee?: string;
      sourceUrl?: string;
    }>;
  }>;
};

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    if (hasSupabaseConfig()) {
      const cloudData = await readFromSupabase();
      if (cloudData.banks.length > 0) {
        return res.status(200).json(cloudData);
      }
    }

    const localData = readFromLocalFile();
    return res.status(200).json(localData);
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unable to load marketplace data',
    });
  }
}

async function readFromSupabase(): Promise<MarketplaceResponse> {
  const supabase = getSupabaseServerClient();

  const { data: banks, error: banksError } = await supabase
    .from('banks')
    .select('id, slug, name, description')
    .order('name', { ascending: true });

  if (banksError) {
    throw new Error(`Failed to load banks from Supabase: ${banksError.message}`);
  }

  const { data: cards, error: cardsError } = await supabase
    .from('cards')
    .select('bank_id, slug, title, description, image_url, annual_fee, source_url, key_benefits')
    .order('title', { ascending: true });

  if (cardsError) {
    throw new Error(`Failed to load cards from Supabase: ${cardsError.message}`);
  }

  const cardMap = new Map<string, MarketplaceResponse['banks'][number]['cards']>();
  for (const card of cards || []) {
    if (!isCardEnabled(card.key_benefits)) {
      continue;
    }

    const list = cardMap.get(card.bank_id) || [];
    list.push({
      slug: card.slug,
      name: card.title,
      description: card.description || '',
      imageUrl: card.image_url || undefined,
      annualFee: card.annual_fee || undefined,
      sourceUrl: card.source_url || undefined,
    });
    cardMap.set(card.bank_id, list);
  }

  return {
    source: 'cloud',
    banks: (banks || [])
      .map((bank) => ({
        slug: bank.slug,
        name: bank.name,
        description: bank.description || '',
        cards: cardMap.get(bank.id) || [],
      }))
      .filter((bank) => bank.cards.length > 0),
  };
}

function readFromLocalFile(): MarketplaceResponse {
  const localPath = path.join(process.cwd(), 'public', 'data', 'marketplace-data.js');
  const content = fs.readFileSync(localPath, 'utf8');
  const sandbox: { window: { marketplaceData?: any } } = { window: {} };
  vm.runInNewContext(content, sandbox);

  const data = sandbox.window.marketplaceData;
  if (!data || !data.banks) {
    return { source: 'local', banks: [] };
  }

  if (!Array.isArray(data.banks) && typeof data.banks === 'object') {
    const banks = Object.entries(data.banks).map(([slug, bank]) => {
      const bankRow = bank as any;
      return {
        slug,
        name: bankRow.name || slug,
        description: bankRow.description || '',
        cards: (bankRow.cards || [])
          .filter((card: any) => card?.isEnabled !== false)
          .map((card: any) => ({
          slug: (card.filename || '').replace(/\.html$/i, '') || card.slug || '',
          name: card.title || card.name || '',
          description: card.description || '',
          imageUrl: card.imageUrl || undefined,
          annualFee: card.annualFee || undefined,
          sourceUrl: card.sourceUrl || undefined,
          })),
      };
    });

    return {
      source: 'local',
      banks,
    };
  }

  if (!Array.isArray(data.banks)) {
    return { source: 'local', banks: [] };
  }

  return {
    source: 'local',
    banks: data.banks
      .map((bank: any) => ({
        ...bank,
        cards: (bank.cards || []).filter((card: any) => card?.isEnabled !== false),
      }))
      .filter((bank: any) => (bank.cards || []).length > 0),
  };
}

function isCardEnabled(raw: unknown): boolean {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return true;
  }

  const maybeMeta = raw as { __adminData?: { isEnabled?: unknown } };
  if (!maybeMeta.__adminData || typeof maybeMeta.__adminData !== 'object') {
    return true;
  }

  return maybeMeta.__adminData.isEnabled !== false;
}
