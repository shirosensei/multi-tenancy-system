import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
   res.status(401).json({ error: 'Unauthorized' });
   return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token) as { userId: string; tenantId?: string };
    (req as any).userId = decoded.userId;
    (req as any).tenantId = decoded.tenantId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};