import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getSupabaseServerClient, hasSupabaseConfig } from '../../../lib/supabase-server';

type LoginResponse = {
  success: boolean;
  message?: string;
  data?: {
    token: string;
    admin: {
      id: string;
      email: string;
      full_name: string | null;
      role: string | null;
    };
  };
};

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'];

export default async function handler(req: NextApiRequest, res: NextApiResponse<LoginResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  if (!hasSupabaseConfig()) {
    return res.status(500).json({ success: false, message: 'Supabase is not configured.' });
  }

  if (!JWT_SECRET) {
    return res.status(500).json({ success: false, message: 'JWT_SECRET is not configured.' });
  }

  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';

  if (!email || !password || password.length < 6) {
    return res.status(400).json({ success: false, message: 'Invalid login payload' });
  }

  const supabase = getSupabaseServerClient();

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
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  await supabase.from('admins').update({ last_login: new Date().toISOString() }).eq('id', admin.id);

  return res.status(200).json({
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
}
