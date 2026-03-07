import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { getSupabaseServerClient, hasSupabaseConfig } from '../../../../lib/supabase-server';

type HomepageSection = {
  id: string;
  section_key: string;
  section_name: string;
  section_type: string;
  content: Record<string, any>;
  description?: string;
  is_active: boolean;
  version: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
};

type ApiResponse = {
  success: boolean;
  data?: HomepageSection | HomepageSection[];
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

  try {
    // GET /api/homepage/sections - Fetch all active sections (public)
    if (req.method === 'GET') {
      const { key } = req.query;

      if (key && typeof key === 'string') {
        // GET /api/homepage/sections?key=hero_banner
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

      // GET /api/homepage/sections - All active sections
      const { data, error } = await supabase
        .from('homepage_sections')
        .select('*')
        .eq('is_active', true)
        .order('section_key', { ascending: true });

      if (error) {
        return res.status(500).json({
          success: false,
          error: error.message,
        });
      }

      return res.status(200).json({
        success: true,
        data: data || [],
      });
    }

    // For POST/PUT/DELETE, require admin authentication
    const adminAuth = isAdmin(req);
    if (!adminAuth) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Admin access required',
      });
    }

    // POST /api/homepage/sections - Create new section (admin only)
    if (req.method === 'POST') {
      const { section_key, section_name, section_type, content, description, is_active } = req.body;

      if (!section_key || !section_name || !section_type || !content) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: section_key, section_name, section_type, content',
        });
      }

      const { data, error } = await supabase
        .from('homepage_sections')
        .insert({
          section_key,
          section_name,
          section_type,
          content,
          description,
          is_active: is_active ?? true,
          created_by: adminAuth.adminId,
          updated_by: adminAuth.adminId,
        })
        .select();

      if (error) {
        return res.status(500).json({
          success: false,
          error: error.message,
        });
      }

      return res.status(201).json({
        success: true,
        data: data?.[0],
        message: 'Section created successfully',
      });
    }

    // PUT /api/homepage/sections/:id - Update section (admin only)
    if (req.method === 'PUT') {
      const { id } = req.query;
      const { section_name, content, description, is_active } = req.body;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Missing or invalid section ID',
        });
      }

      // Check if section exists
      const { data: existing } = await supabase
        .from('homepage_sections')
        .select('id, version')
        .eq('id', id)
        .single();

      if (!existing) {
        return res.status(404).json({
          success: false,
          error: 'Section not found',
        });
      }

      const { data, error } = await supabase
        .from('homepage_sections')
        .update({
          ...(section_name && { section_name }),
          ...(content && { content }),
          ...(description !== undefined && { description }),
          ...(is_active !== undefined && { is_active }),
          updated_by: adminAuth.adminId,
          version: (existing.version || 0) + 1,
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
        message: 'Section updated successfully',
      });
    }

    // DELETE /api/homepage/sections/:id - Soft delete (admin only)
    if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Missing or invalid section ID',
        });
      }

      const { error } = await supabase
        .from('homepage_sections')
        .update({
          is_active: false,
          updated_by: adminAuth.adminId,
        })
        .eq('id', id);

      if (error) {
        return res.status(500).json({
          success: false,
          error: error.message,
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Section deactivated successfully',
      });
    }

    // Method not allowed
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} not allowed`,
    });
  } catch (error) {
    console.error('Homepage sections API error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
}
