import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { getSupabaseServerClient, hasSupabaseConfig } from '../../../lib/supabase-server';

type JwtPayload = {
  adminId?: string;
  email?: string;
  role?: string | null;
};

const JWT_SECRET = process.env.JWT_SECRET;

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => asString(item)).filter(Boolean);
}

function asObject(value: unknown): Record<string, any> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as Record<string, any>;
}

function extractAdminData(raw: unknown): Record<string, any> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const maybeMeta = raw as { __adminData?: unknown };
  if (!maybeMeta.__adminData || typeof maybeMeta.__adminData !== 'object' || Array.isArray(maybeMeta.__adminData)) {
    return {};
  }
  return maybeMeta.__adminData as Record<string, any>;
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

function getIdOrSlug(value: string | string[] | undefined): string {
  const normalized = Array.isArray(value) ? value[0] : value;
  return normalized ? String(normalized).trim() : '';
}

function getBearerToken(req: NextApiRequest): string {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return '';
  return authHeader.slice('Bearer '.length).trim();
}

function getAdminIdFromRequest(req: NextApiRequest): string {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured.');
  }

  const token = getBearerToken(req);
  if (!token) {
    throw new Error('Unauthorized');
  }

  const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
  if (!decoded?.adminId) {
    throw new Error('Unauthorized');
  }

  return decoded.adminId;
}

function normalizeCardRow(row: any) {
  const adminData = extractAdminData(row?.key_benefits);
  const benefits = asStringArray(row?.benefits);
  const legacyBenefitsFromAdmin = asStringArray(adminData?.keyBenefits);
  const legacyBenefitsFromKeyBenefits = Array.isArray(row?.key_benefits)
    ? asStringArray(row.key_benefits)
    : asStringArray(row?.key_benefits?.items);
  const categories = asStringArray(row?.categories);
  const legacyCategoriesFromAdmin = asStringArray(adminData?.categories);
  const normalizedCategories = categories.length
    ? categories
    : legacyCategoriesFromAdmin.length
      ? legacyCategoriesFromAdmin
      : (asString(adminData.cardType) ? [asString(adminData.cardType)] : []);

  const normalizedStatus =
    asString(row?.status) ||
    asString(adminData.status) ||
    (adminData.isEnabled === false ? 'disabled' : 'enabled');

  const normalizedBenefits = benefits.length
    ? benefits
    : legacyBenefitsFromAdmin.length
      ? legacyBenefitsFromAdmin
      : legacyBenefitsFromKeyBenefits;

  return {
    id: row?.id,
    slug: row?.slug || null,
    card_name: asString(row?.card_name) || asString(row?.title) || asString(adminData.cardName),
    bank_id: row?.bank_id || '',
    card_image_url: asString(row?.card_image_url) || asString(row?.image_url) || asString(adminData.cardImageUrl) || null,
    joining_fee: asString(row?.joining_fee) || asString(adminData.joiningFee) || null,
    annual_fee: asString(row?.annual_fee) || asString(adminData.annualFee) || null,
    interest_rate: asString(row?.interest_rate) || null,
    reward_program_name: asString(row?.reward_program_name) || null,
    welcome_bonus: asString(row?.welcome_bonus) || asString(adminData.welcomeBonus) || null,
    card_type_id: row?.card_type_id || null,
    card_orientation: asString(row?.card_orientation) || asString(adminData.cardOrientation) || 'horizontal',
    network_id: row?.network_id || null,
    status: normalizedStatus,
    benefits: normalizedBenefits,
    categories: normalizedCategories,
    network: asString(row?.network) || asString(adminData.network) || null,
    product_description: asString(row?.product_description) || asString(row?.description) || asString(adminData.description) || null,
    product_features: asStringArray(row?.product_features),
    special_perks: asStringArray(row?.special_perks),
    eligibility_criteria: row?.eligibility_criteria || null,
    pros: asStringArray(row?.pros),
    cons: asStringArray(row?.cons),
    custom_fees: row?.custom_fees || null,
    banks: row?.banks
      ? {
          id: row.banks.id,
          name: asString(row.banks.name) || asString(adminData.bank),
        }
      : undefined,
  };
}

function buildLegacyCardRow(input: Record<string, any>, adminId: string) {
  const cardName = asString(input.card_name);
  const slug = asString(input.slug) || (cardName ? toSlug(cardName) : '');
  const cardImageUrl = asString(input.card_image_url);
  const annualFee = asString(input.annual_fee);
  const description = asString(input.product_description);
  const categories = asStringArray(input.categories);
  const benefits = asStringArray(input.benefits);
  const status = asString(input.status) || 'enabled';
  const cardOrientation = asString(input.card_orientation) === 'vertical' ? 'vertical' : 'horizontal';
  const productFeatures = asStringArray(input.product_features);
  const specialPerks = asStringArray(input.special_perks);
  const pros = asStringArray(input.pros);
  const cons = asStringArray(input.cons);
  const rewardsDetails = asObject(input.rewards_details);
  const eligibilityCriteria = asObject(input.eligibility_criteria);
  const customFees = asObject(input.custom_fees);

  const adminData = {
    bank: asString(input.bank) || '',
    cardName,
    network: asString(input.network) || '',
    cardImageUrl,
    description,
    joiningFee: asString(input.joining_fee),
    annualFee,
    financeCharges: asString(input.interest_rate),
    welcomeBonus: asString(input.welcome_bonus),
    cardType: categories[0] || '',
    categories,
    status,
    networkId: asString(input.network_id),
    cardOrientation,
    keyBenefits: benefits,
    pros: pros.join('\n'),
    cons: cons.join('\n'),
    isEnabled: status !== 'disabled',
  };

  const row: Record<string, any> = {
    updated_by: adminId,
  };

  if (cardName) row.title = cardName;
  if (slug) row.slug = slug;
  if (asString(input.bank_id)) row.bank_id = asString(input.bank_id);
  if (cardImageUrl || input.card_image_url === null) row.image_url = cardImageUrl || null;
  row.card_name = cardName;
  if (cardImageUrl || input.card_image_url === null) row.card_image_url = cardImageUrl || null;
  row.joining_fee = asString(input.joining_fee) || null;
  if (annualFee || input.annual_fee === null) row.annual_fee = annualFee || null;
  row.interest_rate = asString(input.interest_rate) || null;
  row.reward_program_name = asString(input.reward_program_name) || null;
  row.welcome_bonus = asString(input.welcome_bonus) || null;
  row.card_type_id = asString(input.card_type_id) || null;
  row.card_orientation = cardOrientation;
  row.network_id = asString(input.network_id) || null;
  row.status = status;
  row.benefits = benefits;
  row.categories = categories;
  row.rewards_details = rewardsDetails;
  row.product_features = productFeatures;
  row.special_perks = specialPerks;
  row.eligibility_criteria = eligibilityCriteria;
  row.pros = pros;
  row.cons = cons;
  row.custom_fees = customFees;

  if (description || input.product_description === null) row.description = description || null;
  row.product_description = description || null;

  row.key_benefits = {
    __adminData: adminData,
    items: benefits,
  };

  return row;
}

function getMissingColumnName(error: any): string {
  const message =
    (error && typeof error.message === 'string' ? error.message : '') ||
    (error && typeof error.details === 'string' ? error.details : '');
  const schemaCacheMatch = message.match(/Could not find the '([^']+)' column/i);
  if (schemaCacheMatch?.[1]) return schemaCacheMatch[1];
  const postgresMatch = message.match(/column\s+"([^"]+)"\s+does not exist/i);
  if (postgresMatch?.[1]) return postgresMatch[1];
  return '';
}

async function updateCardRowWithFallback(
  supabase: ReturnType<typeof getSupabaseServerClient>,
  idOrSlug: string,
  row: Record<string, any>
) {
  const workingRow: Record<string, any> = { ...row };

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const { data, error } = await supabase
      .from('cards')
      .update(workingRow)
      .eq('id', idOrSlug)
      .select('*, banks(*)')
      .single();

    if (!error) return { data, error: null };

    const missingColumn = getMissingColumnName(error);
    if (!missingColumn || !(missingColumn in workingRow)) {
      return { data: null, error };
    }

    delete workingRow[missingColumn];
  }

  return { data: null, error: new Error('Failed to update card after resolving schema fallback.') };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const idOrSlug = getIdOrSlug(req.query.idOrSlug);
  if (!idOrSlug) {
    return res.status(400).json({ success: false, message: 'Card id or slug is required' });
  }

  if (!hasSupabaseConfig()) {
    return res.status(500).json({ success: false, message: 'Supabase is not configured.' });
  }

  const supabase = getSupabaseServerClient();

  try {
    if (req.method === 'GET') {
      const isUuid = /^[0-9a-fA-F-]{36}$/.test(idOrSlug);
      const query = supabase
        .from('cards')
        .select('*, banks(*)')
        .limit(1);

      const { data, error } = isUuid ? await query.eq('id', idOrSlug) : await query.eq('slug', idOrSlug);

      if (error) {
        return res.status(500).json({ success: false, message: error.message });
      }
      if (!data || !data.length) {
        return res.status(404).json({ success: false, message: 'Card not found' });
      }

      return res.status(200).json({ success: true, data: normalizeCardRow(data[0]) });
    }

    if (req.method === 'PUT') {
      const adminId = getAdminIdFromRequest(req);
      const payload = req.body && typeof req.body === 'object' ? { ...req.body } : {};
      const row = buildLegacyCardRow(payload, adminId);

      const { data, error } = await updateCardRowWithFallback(supabase, idOrSlug, row);

      if (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

      return res.status(200).json({ success: true, data: normalizeCardRow(data), message: 'Card updated successfully' });
    }

    if (req.method === 'DELETE') {
      getAdminIdFromRequest(req);

      const { error } = await supabase.from('cards').delete().eq('id', idOrSlug);
      if (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

      return res.status(200).json({ success: true, message: 'Card deleted successfully' });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected server error.';
    const status = message === 'Unauthorized' ? 401 : 500;
    return res.status(status).json({ success: false, message });
  }
}
