import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { env } from '../lib/env.js';
import { supabase } from '../lib/supabase.js';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const authRouter = express.Router();

authRouter.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: 'Invalid login payload' });
  }

  const { email, password } = parsed.data;

  const { data: admin, error } = await supabase
    .from('admins')
    .select('id,email,full_name,role,is_active,password_hash')
    .eq('email', email)
    .single();

  if (error || !admin || !admin.is_active) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const isValid = await bcrypt.compare(password, admin.password_hash);
  if (!isValid) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    {
      adminId: admin.id,
      email: admin.email,
      role: admin.role,
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );

  await supabase
    .from('admins')
    .update({ last_login: new Date().toISOString() })
    .eq('id', admin.id);

  return res.json({
    success: true,
    data: {
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        full_name: admin.full_name,
        role: admin.role,
      },
    },
  });
});
