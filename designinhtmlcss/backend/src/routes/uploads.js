import express from 'express';
import multer from 'multer';
import { requireAuth } from '../middleware/auth.js';
import { supabase } from '../lib/supabase.js';
import { env } from '../lib/env.js';

const allowedMimeTypes = new Set(['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif']);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

function fileExtensionFromMime(mimeType) {
  if (mimeType === 'image/png') return 'png';
  if (mimeType === 'image/webp') return 'webp';
  if (mimeType === 'image/gif') return 'gif';
  return 'jpg';
}

export const uploadsRouter = express.Router();

function canDeletePath(path) {
  return typeof path === 'string' && path.startsWith('cards/') && !path.includes('..');
}

uploadsRouter.post('/card-image', requireAuth, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Image file is required' });
  }

  if (!allowedMimeTypes.has(req.file.mimetype)) {
    return res.status(400).json({ success: false, message: 'Only image files are allowed (png, jpg, jpeg, webp, gif)' });
  }

  const extension = fileExtensionFromMime(req.file.mimetype);
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
  const filePath = `cards/${fileName}`;
  const oldPath = req.body?.oldPath;

  const { error } = await supabase.storage
    .from(env.storageBucket)
    .upload(filePath, req.file.buffer, {
      contentType: req.file.mimetype,
      upsert: false,
    });

  if (error) {
    return res.status(500).json({ success: false, message: error.message });
  }

  const { data } = supabase.storage.from(env.storageBucket).getPublicUrl(filePath);

  if (canDeletePath(oldPath) && oldPath !== filePath) {
    await supabase.storage.from(env.storageBucket).remove([oldPath]);
  }

  return res.status(201).json({
    success: true,
    message: 'Image uploaded successfully',
    data: {
      path: filePath,
      publicUrl: data.publicUrl,
      bucket: env.storageBucket,
    },
  });
});
