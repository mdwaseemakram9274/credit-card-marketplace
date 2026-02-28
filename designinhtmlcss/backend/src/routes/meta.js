import express from 'express';
import { z } from 'zod';
import { supabase } from '../lib/supabase.js';
import { requireAuth } from '../middleware/auth.js';

export const metaRouter = express.Router();

const createSchema = z.object({ name: z.string().min(2).max(120) });

function normalizeMetaRows(rows) {
  return (rows || []).map((row) => ({
    ...row,
    name: row.name || row.bank_name || row.network_name || row.type_name || '',
  }));
}

metaRouter.get('/banks', async (_req, res) => {
  const { data, error } = await supabase.from('banks').select('*');
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.json({ success: true, data: normalizeMetaRows(data) });
});

metaRouter.get('/card-types', async (_req, res) => {
  const { data, error } = await supabase.from('card_types').select('*');
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.json({ success: true, data: normalizeMetaRows(data) });
});

metaRouter.get('/card-networks', async (_req, res) => {
  const { data, error } = await supabase.from('card_networks').select('*');
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.json({ success: true, data: normalizeMetaRows(data) });
});

metaRouter.post('/banks', requireAuth, async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Invalid payload', errors: parsed.error.issues });

  const { data, error } = await supabase.from('banks').insert({ name: parsed.data.name }).select('*').single();
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.status(201).json({ success: true, data: { ...data, name: data.name || data.bank_name || '' } });
});

metaRouter.put('/banks/:id', requireAuth, async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Invalid payload', errors: parsed.error.issues });

  const { data, error } = await supabase.from('banks').update({ name: parsed.data.name }).eq('id', req.params.id).select('*').single();
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.json({ success: true, data: { ...data, name: data.name || data.bank_name || '' } });
});

metaRouter.delete('/banks/:id', requireAuth, async (req, res) => {
  const { error } = await supabase.from('banks').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.json({ success: true, message: 'Bank deleted successfully' });
});

metaRouter.post('/card-types', requireAuth, async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Invalid payload', errors: parsed.error.issues });

  const { data, error } = await supabase.from('card_types').insert({ name: parsed.data.name }).select('*').single();
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.status(201).json({ success: true, data: { ...data, name: data.name || data.type_name || '' } });
});

metaRouter.put('/card-types/:id', requireAuth, async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Invalid payload', errors: parsed.error.issues });

  const { data, error } = await supabase.from('card_types').update({ name: parsed.data.name }).eq('id', req.params.id).select('*').single();
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.json({ success: true, data: { ...data, name: data.name || data.type_name || '' } });
});

metaRouter.delete('/card-types/:id', requireAuth, async (req, res) => {
  const { error } = await supabase.from('card_types').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.json({ success: true, message: 'Card type deleted successfully' });
});

metaRouter.post('/card-networks', requireAuth, async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Invalid payload', errors: parsed.error.issues });

  const { data, error } = await supabase.from('card_networks').insert({ name: parsed.data.name }).select('*').single();
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.status(201).json({ success: true, data: { ...data, name: data.name || data.network_name || '' } });
});

metaRouter.put('/card-networks/:id', requireAuth, async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Invalid payload', errors: parsed.error.issues });

  const { data, error } = await supabase.from('card_networks').update({ name: parsed.data.name }).eq('id', req.params.id).select('*').single();
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.json({ success: true, data: { ...data, name: data.name || data.network_name || '' } });
});

metaRouter.delete('/card-networks/:id', requireAuth, async (req, res) => {
  const { error } = await supabase.from('card_networks').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.json({ success: true, message: 'Card network deleted successfully' });
});
