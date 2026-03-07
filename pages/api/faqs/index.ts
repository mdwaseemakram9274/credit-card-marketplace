import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { getSupabaseServerClient, hasSupabaseConfig } from '../../../../lib/supabase-server';

type FAQ = {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
  is_active: boolean;
  is_featured: boolean;
  tags: string[];
  helpful_count: number;
  unhelpful_count: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
};

type ApiResponse = {
  success: boolean;
  data?: FAQ | FAQ[];
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
    // GET /api/faqs - Fetch all active FAQs (public)
    if (req.method === 'GET') {
      const { category, limit = '50', offset = '0', featured_only } = req.query;

      let query = supabase
        .from('faqs')
        .select('*')
        .eq('is_active', true);

      if (category && typeof category === 'string') {
        query = query.eq('category', category);
      }

      if (featured_only === 'true') {
        query = query.eq('is_featured', true);
      }

      query = query
        .order('is_featured', { ascending: false })
        .order('display_order', { ascending: true })
        .range(parseInt(offset as string), parseInt(offset as string) + parseInt(limit as string) - 1);

      const { data, error, count } = await query;

      if (error) {
        return res.status(500).json({
          success: false,
          error: error.message,
        });
      }

      return res.status(200).json({
        success: true,
        data: data || [],
        message: `Found ${data?.length || 0} FAQs`,
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

    // POST /api/faqs - Create new FAQ (admin only)
    if (req.method === 'POST') {
      const { question, answer, category, is_featured, tags, display_order } = req.body;

      if (!question || !answer || !category) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: question, answer, category',
        });
      }

      const { data, error } = await supabase
        .from('faqs')
        .insert({
          question,
          answer,
          category,
          is_featured: is_featured ?? false,
          tags: tags ?? [],
          display_order: display_order ?? 999,
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
        message: 'FAQ created successfully',
      });
    }

    // PUT /api/faqs/:id - Update FAQ (admin only)
    if (req.method === 'PUT') {
      const { id } = req.query;
      const { question, answer, category, is_active, is_featured, tags, display_order } = req.body;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Missing or invalid FAQ ID',
        });
      }

      // Check if FAQ exists
      const { data: existing } = await supabase
        .from('faqs')
        .select('id')
        .eq('id', id)
        .single();

      if (!existing) {
        return res.status(404).json({
          success: false,
          error: 'FAQ not found',
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

    // DELETE /api/faqs/:id - Soft delete FAQ (admin only)
    if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Missing or invalid FAQ ID',
        });
      }

      const { error } = await supabase
        .from('faqs')
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
        message: 'FAQ deactivated successfully',
      });
    }

    // Method not allowed
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} not allowed`,
    });
  } catch (error) {
    console.error('FAQs API error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
}
