import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { getSupabaseServerClient, hasSupabaseConfig } from '../../../lib/supabase-server';

type JwtPayload = {
  adminId?: string;
  email?: string;
  role?: string | null;
};

const JWT_SECRET = process.env.JWT_SECRET;
const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'card-images';

const allowedMimeTypes = new Set(['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif']);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

function getBearerToken(req: NextApiRequest): string {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return '';
  return authHeader.slice('Bearer '.length).trim();
}

function ensureAuthenticated(req: NextApiRequest) {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured.');
  }

  const token = getBearerToken(req);
  if (!token) {
    throw new Error('Unauthorized');
  }

  const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
  if (!decoded?.adminId) {
    throw new Error('Unauthorized');
  }
}

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: (req: NextApiRequest, res: NextApiResponse, next: (result?: unknown) => void) => void
) {
  return new Promise<void>((resolve, reject) => {
    fn(req, res, (result?: unknown) => {
      if (result instanceof Error) return reject(result);
      return resolve();
    });
  });
}

function fileExtensionFromMime(mimeType: string) {
  if (mimeType === 'image/png') return 'png';
  if (mimeType === 'image/webp') return 'webp';
  if (mimeType === 'image/gif') return 'gif';
  return 'jpg';
}

function canDeletePath(path: unknown) {
  return typeof path === 'string' && path.startsWith('cards/') && !path.includes('..');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  if (!hasSupabaseConfig()) {
    return res.status(500).json({ success: false, message: 'Supabase is not configured.' });
  }

  try {
    ensureAuthenticated(req);

    await runMiddleware(req, res, upload.single('file') as any);

    const file = (req as unknown as { file?: Express.Multer.File }).file;
    const oldPath = (req as unknown as { body?: Record<string, unknown> }).body?.oldPath;

    if (!file) {
      return res.status(400).json({ success: false, message: 'Image file is required' });
    }

    if (!allowedMimeTypes.has(file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Only image files are allowed (png, jpg, jpeg, webp, gif)',
      });
    }

    const extension = fileExtensionFromMime(file.mimetype);
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
    const filePath = `cards/${fileName}`;

    const supabase = getSupabaseServerClient();

    const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);

    if (canDeletePath(oldPath) && oldPath !== filePath) {
      await supabase.storage.from(STORAGE_BUCKET).remove([String(oldPath)]);
    }

    return res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        path: filePath,
        publicUrl: data.publicUrl,
        bucket: STORAGE_BUCKET,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected server error.';
    const status = message === 'Unauthorized' ? 401 : 500;
    return res.status(status).json({ success: false, message });
  }
}
