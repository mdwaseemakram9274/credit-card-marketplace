import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { getSupabaseServerClient, hasSupabaseConfig } from '../../../lib/supabase-server';

type ApiResponse = {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
};

type AdminPayload = {
  adminId: string;
  email: string;
  role: string;
};

const verifyAdminToken = (token: string): AdminPayload | null => {
  if (!process.env.JWT_SECRET) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as AdminPayload;
    return decoded;
  } catch {
    return null;
  }
};

const isAdmin = (req: NextApiRequest): AdminPayload | null => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return null;

  return verifyAdminToken(token);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (!hasSupabaseConfig()) {
    return res.status(500).json({
      success: false,
      error: 'Supabase is not configured',
    });
  }

  const supabase = getSupabaseServerClient();
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Missing or invalid FAQ ID',
    });
  }

  try {
    // GET /api/faqs/[id] - Fetch single FAQ by ID (public if active)
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        return res.status(404).json({
          success: false,
          error: `FAQ with ID "${id}" not found`,
        });
      }

      return res.status(200).json({
        success: true,
        data,
      });
    }

    // For PUT/PATCH, require admin authentication
    const adminAuth = isAdmin(req);
    if (!adminAuth) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Admin access required',
      });
    }

    // PUT/PATCH /api/faqs/[id] - Update FAQ by ID (admin only)
    if (req.method === 'PUT' || req.method === 'PATCH') {
      const { question, answer, category, is_active, is_featured, tags, display_order } = req.body;

      // Check if FAQ exists
      const { data: existing } = await supabase
        .from('faqs')
        .select('id')
        .eq('id', id)
        .single();

      if (!existing) {
        return res.status(404).json({
          success: false,
          error: `FAQ with ID "${id}" not found`,
        });
      }

      const { data, error } = await supabase
        .from('faqs')
        .update({
          ...(question && { question }),
          ...(answer && { answer }),
          ...(category && { category }),
          ...(is_active !== undefined && { is_active }),
          ...(is_featured !== undefined && { is_featured }),
          ...(tags && { tags }),
          ...(display_order !== undefined && { display_order }),
          updated_by: adminAuth.adminId,
          published_at: is_active ? new Date().toISOString() : null,
        })
        .eq('id', id)
        .select();

      if (error) {
        return res.status(500).json({
          success: false,
          error: error.message,
        });
      }

      return res.status(200).json({
        success: true,
        data: data?.[0],
        message: 'FAQ updated successfully',
      });
    }

    // Method not allowed
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} not allowed`,
    });
  } catch (error) {
    console.error(`FAQ [${id}] API error:`, error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
}
