import type { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseServerClient, hasSupabaseConfig } from '../../../lib/supabase-server';

type AdminCardPayload = {
  id?: string;
  bank?: string;
  cardName?: string;
  rating?: string;
  network?: string;
  cardImageUrl?: string;
  description?: string;
  joiningFee?: string;
  annualFee?: string;
  financeCharges?: string;
  cashWithdrawalFee?: string;
  redemptionFee?: string;
  latePaymentCharges?: string;
  cashbackRate?: string;
  cashbackCap?: string;
  rewardsRate?: string;
  keyBenefits?: string;
  welcomeBonus?: string;
  milestoneBenefits?: string;
  loungeAccess?: string;
  forexMarkup?: string;
  golfBenefits?: string;
  pros?: string;
  cons?: string;
  bestFor?: string;
  cardType?: string;
  merchantExclusions?: string;
};

type AdminMeta = {
  __adminData: AdminCardPayload;
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '8mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!hasSupabaseConfig()) {
    return res.status(500).json({ ok: false, error: 'Supabase is not configured.' });
  }

  const supabase = getSupabaseServerClient();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('cards')
        .select('id, slug, title, annual_fee, image_url, description, key_benefits, bank_id, banks!inner(name, slug)')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      const cards = (data || []).map((row: any) => {
        const meta = extractAdminMeta(row.key_benefits);
        const bankName = row.banks?.name || '';

        return {
          id: row.id,
          bank: meta.bank || bankName,
          cardName: meta.cardName || row.title || '',
          rating: meta.rating || '',
          network: meta.network || '',
          cardImageUrl: meta.cardImageUrl || row.image_url || '',
          description: meta.description ?? row.description ?? '',
          joiningFee: meta.joiningFee || '',
          annualFee: meta.annualFee || row.annual_fee || '',
          financeCharges: meta.financeCharges || '',
          cashWithdrawalFee: meta.cashWithdrawalFee || '',
          redemptionFee: meta.redemptionFee || '',
          latePaymentCharges: meta.latePaymentCharges || '',
          cashbackRate: meta.cashbackRate || '',
          cashbackCap: meta.cashbackCap || '',
          rewardsRate: meta.rewardsRate || '',
          keyBenefits: meta.keyBenefits || '',
          welcomeBonus: meta.welcomeBonus || '',
          milestoneBenefits: meta.milestoneBenefits || '',
          loungeAccess: meta.loungeAccess || '',
          forexMarkup: meta.forexMarkup || '',
          golfBenefits: meta.golfBenefits || '',
          pros: meta.pros || '',
          cons: meta.cons || '',
          bestFor: meta.bestFor || '',
          cardType: meta.cardType || '',
          merchantExclusions: meta.merchantExclusions || '',
        };
      });

      return res.status(200).json({ ok: true, cards });
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const payload = sanitizePayload(req.body || {});
      if (!payload.bank || !payload.cardName) {
        return res.status(400).json({ ok: false, error: 'Bank and card name are required.' });
      }

      const bankSlug = toSlug(payload.bank);
      const cardSlug = toSlug(payload.cardName);

      const { data: bankRow, error: bankError } = await supabase
        .from('banks')
        .upsert(
          {
            slug: bankSlug,
            name: payload.bank,
            description: '',
          },
          { onConflict: 'slug' }
        )
        .select('id, name, slug')
        .single();

      if (bankError || !bankRow) {
        throw new Error(bankError?.message || 'Unable to upsert bank.');
      }

      const cardRow = {
        bank_id: bankRow.id,
        slug: cardSlug,
        title: payload.cardName,
        image_url: payload.cardImageUrl || null,
        annual_fee: payload.annualFee || null,
        description: payload.description || null,
        source_url: null,
        key_benefits: {
          __adminData: payload,
        } as AdminMeta,
      };

      if (req.method === 'PUT' && payload.id) {
        const { error: updateError } = await supabase.from('cards').update(cardRow).eq('id', payload.id);
        if (updateError) {
          throw new Error(updateError.message);
        }
      } else {
        const { error: upsertError } = await supabase
          .from('cards')
          .upsert(cardRow, { onConflict: 'bank_id,slug' });

        if (upsertError) {
          throw new Error(upsertError.message);
        }
      }

      return res.status(200).json({ ok: true });
    }

    if (req.method === 'DELETE') {
      const id = String(req.query.id || '').trim();
      if (!id) {
        return res.status(400).json({ ok: false, error: 'Card id is required.' });
      }

      const { error } = await supabase.from('cards').delete().eq('id', id);
      if (error) {
        throw new Error(error.message);
      }

      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ ok: false, error: 'Method not allowed.' });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : 'Unexpected server error.',
    });
  }
}

function extractAdminMeta(raw: unknown): AdminCardPayload {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return {};
  }

  const maybeMeta = raw as Partial<AdminMeta>;
  if (!maybeMeta.__adminData || typeof maybeMeta.__adminData !== 'object') {
    return {};
  }

  return sanitizePayload(maybeMeta.__adminData);
}

function sanitizePayload(input: any): AdminCardPayload {
  const payload: AdminCardPayload = {
    id: sanitizeString(input.id),
    bank: sanitizeString(input.bank),
    cardName: sanitizeString(input.cardName),
    rating: sanitizeString(input.rating),
    network: sanitizeString(input.network),
    cardImageUrl: sanitizeString(input.cardImageUrl),
    description: sanitizeString(input.description),
    joiningFee: sanitizeString(input.joiningFee),
    annualFee: sanitizeString(input.annualFee),
    financeCharges: sanitizeString(input.financeCharges),
    cashWithdrawalFee: sanitizeString(input.cashWithdrawalFee),
    redemptionFee: sanitizeString(input.redemptionFee),
    latePaymentCharges: sanitizeString(input.latePaymentCharges),
    cashbackRate: sanitizeString(input.cashbackRate),
    cashbackCap: sanitizeString(input.cashbackCap),
    rewardsRate: sanitizeString(input.rewardsRate),
    keyBenefits: sanitizeString(input.keyBenefits),
    welcomeBonus: sanitizeString(input.welcomeBonus),
    milestoneBenefits: sanitizeString(input.milestoneBenefits),
    loungeAccess: sanitizeString(input.loungeAccess),
    forexMarkup: sanitizeString(input.forexMarkup),
    golfBenefits: sanitizeString(input.golfBenefits),
    pros: sanitizeString(input.pros),
    cons: sanitizeString(input.cons),
    bestFor: sanitizeString(input.bestFor),
    cardType: sanitizeString(input.cardType),
    merchantExclusions: sanitizeString(input.merchantExclusions),
  };

  return payload;
}

function sanitizeString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}
