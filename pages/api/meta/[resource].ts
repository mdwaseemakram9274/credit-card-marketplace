import type { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseServerClient, hasSupabaseConfig } from '../../../lib/supabase-server';

type MetaResource = 'banks' | 'card-types' | 'card-networks';

const RESOURCE_TO_TABLE: Record<MetaResource, string> = {
  banks: 'banks',
  'card-types': 'card_types',
  'card-networks': 'card_networks',
};

function getResource(value: string | string[] | undefined): MetaResource | null {
  const resource = Array.isArray(value) ? value[0] : value;
  if (!resource) return null;
  if (resource === 'banks' || resource === 'card-types' || resource === 'card-networks') {
    return resource;
  }
  return null;
}

function normalizeMetaRow(row: any) {
  return {
    ...row,
    name: row?.name || row?.bank_name || row?.network_name || row?.type_name || '',
    description: typeof row?.description === 'string' ? row.description : '',
    logo_url:
      typeof row?.logo_url === 'string'
        ? row.logo_url
        : typeof row?.logo === 'string'
          ? row.logo
          : typeof row?.image_url === 'string'
            ? row.image_url
            : '',
  };
}

function sanitizeOptionalText(value: unknown) {
  if (typeof value !== 'string') return '';
  return value.trim();
}

function dedupePayloads(payloads: Array<Record<string, string>>) {
  return payloads.filter(
    (payload, index, arr) => index === arr.findIndex((item) => JSON.stringify(item) === JSON.stringify(payload))
  );
}

function isMissingColumnError(message: string) {
  return /column/i.test(message) && /(does not exist|unknown|could not find|schema cache)/i.test(message);
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

async function getAvailableBankSlug(
  supabase: ReturnType<typeof getSupabaseServerClient>,
  name: string,
  excludeId?: string
) {
  const baseSlug = toSlug(name) || 'bank';

  for (let index = 0; index < 200; index += 1) {
    const candidate = index === 0 ? baseSlug : `${baseSlug}-${index + 1}`;
    let query = supabase.from('banks').select('id').eq('slug', candidate).limit(1);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query;
    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      return candidate;
    }
  }

  throw new Error('Unable to generate unique bank slug');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const resource = getResource(req.query.resource);
  if (!resource) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }

  if (!hasSupabaseConfig()) {
    return res.status(500).json({ success: false, message: 'Supabase is not configured.' });
  }

  const table = RESOURCE_TO_TABLE[resource];
  const supabase = getSupabaseServerClient();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from(table).select('*').order('name', { ascending: true });
      if (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

      return res.status(200).json({ success: true, data: (data || []).map(normalizeMetaRow) });
    }

    if (req.method === 'POST') {
      const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
      if (!name || name.length < 2 || name.length > 120) {
        return res.status(400).json({ success: false, message: 'Invalid payload' });
      }

      const description = sanitizeOptionalText(req.body?.description);
      const logoUrl = sanitizeOptionalText(req.body?.logo_url || req.body?.logoUrl);

      const basePayload =
        resource === 'banks'
          ? { name, slug: await getAvailableBankSlug(supabase, name) }
          : { name };

      const payloadAttempts = dedupePayloads([
        { ...basePayload, description, logo_url: logoUrl },
        { ...basePayload, description, logo: logoUrl },
        { ...basePayload, description, image_url: logoUrl },
        { ...basePayload, description },
        { ...basePayload, logo_url: logoUrl },
        { ...basePayload, logo: logoUrl },
        { ...basePayload, image_url: logoUrl },
        { ...basePayload },
      ].map((payload) => Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== ''))));

      let lastError: { message: string } | null = null;
      for (const payload of payloadAttempts) {
        const { data, error } = await supabase.from(table).insert(payload).select('*').single();
        if (!error && data) {
          return res.status(201).json({ success: true, data: normalizeMetaRow(data) });
        }

        const message = error?.message || '';
        if (!isMissingColumnError(message)) {
          return res.status(500).json({ success: false, message: message || 'Unable to create record' });
        }

        lastError = error;
      }

      return res.status(500).json({
        success: false,
        message: lastError?.message || 'Unable to create record',
      });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Unexpected server error.',
    });
  }
}
