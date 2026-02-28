import jwt from 'jsonwebtoken';
import { env } from '../lib/env.js';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Missing auth token' });
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.admin = payload;
    return next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}
