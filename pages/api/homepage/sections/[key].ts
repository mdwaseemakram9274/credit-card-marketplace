import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { getSupabaseServerClient, hasSupabaseConfig } from '../../../../lib/supabase-server';

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
  const { key } = req.query;

  if (!key || typeof key !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Missing or invalid section key',
    });
  }

  try {
    // GET /api/homepage/sections/[key] - Fetch specific section by key (public)
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('homepage_sections')
        .select('*')
        .eq('section_key', key)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        return res.status(404).json({
          success: false,
          error: `Section "${key}" not found`,
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

    // PUT/PATCH /api/homepage/sections/[key] - Update section by key (admin only)
    if (req.method === 'PUT' || req.method === 'PATCH') {
      const { content, is_active, description } = req.body;

      if (!content) {
        return res.status(400).json({
          success: false,
          error: 'Missing required field: content',
        });
      }

      // Get section to check it exists and get its ID
      const { data: existing } = await supabase
        .from('homepage_sections')
        .select('id, version')
        .eq('section_key', key)
        .single();

      if (!existing) {
        return res.status(404).json({
          success: false,
          error: `Section "${key}" not found`,
        });
      }

      const { data, error } = await supabase
        .from('homepage_sections')
        .update({
          content,
          ...(is_active !== undefined && { is_active }),
          ...(description !== undefined && { description }),
          updated_by: adminAuth.adminId,
          version: (existing.version || 0) + 1,
          published_at: is_active ? new Date().toISOString() : null,
        })
        .eq('id', existing.id)
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
        message: `Section "${key}" updated successfully`,
      });
    }

    // Method not allowed
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} not allowed`,
    });
  } catch (error) {
    console.error(`Homepage section [${key}] API error:`, error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
}
