import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from './tokens';

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization?.split(' ')[1];
  if (!header) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const payload = verifyAccessToken(header);
    (req as any).user = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
}