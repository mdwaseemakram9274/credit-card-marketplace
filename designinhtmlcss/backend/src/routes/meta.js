import express from 'express';
import { supabase } from '../lib/supabase.js';

export const metaRouter = express.Router();

metaRouter.get('/banks', async (_req, res) => {
  const { data, error } = await supabase.from('banks').select('*').order('bank_name');
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.json({ success: true, data });
});

metaRouter.get('/card-types', async (_req, res) => {
  const { data, error } = await supabase.from('card_types').select('*').order('display_order');
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.json({ success: true, data });
});

metaRouter.get('/card-networks', async (_req, res) => {
  const { data, error } = await supabase.from('card_networks').select('*').order('network_name');
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.json({ success: true, data });
});
