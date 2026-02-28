import express from 'express';
import { z } from 'zod';
import { supabase } from '../lib/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const cardSchema = z.object({
  card_name: z.string().min(2),
  bank_id: z.string().uuid(),
  card_image_url: z.string().url().optional().nullable(),
  joining_fee: z.string().optional().nullable(),
  annual_fee: z.string().optional().nullable(),
  interest_rate: z.string().optional().nullable(),
  reward_program_name: z.string().optional().nullable(),
  welcome_bonus: z.string().optional().nullable(),
  card_type_id: z.string().uuid().optional().nullable(),
  network_id: z.string().uuid().optional().nullable(),
  status: z.enum(['draft', 'enabled', 'disabled']).default('draft'),
  benefits: z.array(z.string()).optional().nullable(),
  categories: z.array(z.string()).optional().nullable(),
  rewards_details: z.any().optional().nullable(),
  product_description: z.string().optional().nullable(),
  product_features: z.array(z.string()).optional().nullable(),
  special_perks: z.array(z.string()).optional().nullable(),
  eligibility_criteria: z.any().optional().nullable(),
  pros: z.array(z.string()).optional().nullable(),
  cons: z.array(z.string()).optional().nullable(),
  custom_fees: z.array(z.any()).optional().nullable(),
  slug: z.string().optional().nullable(),
});

function toSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

export const cardsRouter = express.Router();

cardsRouter.get('/cards', async (req, res) => {
  const status = req.query.status || 'enabled';
  const bank = req.query.bank;
  const search = req.query.search;

  let query = supabase
    .from('cards')
    .select('*, banks(*), card_types(*), card_networks(*)')
    .order('created_at', { ascending: false });

  if (status && status !== 'all') query = query.eq('status', status);
  if (bank) query = query.eq('bank_id', bank);
  if (search) query = query.ilike('card_name', `%${search}%`);

  const { data, error } = await query;
  if (error) return res.status(500).json({ success: false, message: error.message });

  return res.json({ success: true, data: { cards: data || [] } });
});

cardsRouter.get('/cards/:idOrSlug', async (req, res) => {
  const idOrSlug = req.params.idOrSlug;

  const isUuid = /^[0-9a-fA-F-]{36}$/.test(idOrSlug);
  const query = supabase
    .from('cards')
    .select('*, banks(*), card_types(*), card_networks(*)')
    .limit(1);

  const { data, error } = isUuid
    ? await query.eq('id', idOrSlug)
    : await query.eq('slug', idOrSlug);

  if (error) return res.status(500).json({ success: false, message: error.message });
  if (!data || !data.length) {
    return res.status(404).json({ success: false, message: 'Card not found' });
  }

  return res.json({ success: true, data: data[0] });
});

cardsRouter.post('/cards', requireAuth, async (req, res) => {
  const parsed = cardSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: 'Invalid payload', errors: parsed.error.issues });
  }

  const payload = parsed.data;
  if (!payload.slug) payload.slug = toSlug(payload.card_name);
  payload.created_by = req.admin.adminId;
  payload.updated_by = req.admin.adminId;

  const { data, error } = await supabase.from('cards').insert(payload).select('*').single();
  if (error) return res.status(500).json({ success: false, message: error.message });

  return res.status(201).json({ success: true, data, message: 'Card created successfully' });
});

cardsRouter.put('/cards/:id', requireAuth, async (req, res) => {
  const parsed = cardSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: 'Invalid payload', errors: parsed.error.issues });
  }

  const payload = { ...parsed.data, updated_by: req.admin.adminId };
  if (payload.card_name && !payload.slug) payload.slug = toSlug(payload.card_name);

  const { data, error } = await supabase
    .from('cards')
    .update(payload)
    .eq('id', req.params.id)
    .select('*')
    .single();

  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.json({ success: true, data, message: 'Card updated successfully' });
});

cardsRouter.delete('/cards/:id', requireAuth, async (req, res) => {
  const { error } = await supabase.from('cards').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.json({ success: true, message: 'Card deleted successfully' });
});
