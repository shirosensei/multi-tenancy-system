import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';


 const tenantContext = (req: Request, res: Response, next: NextFunction) => {
  const tenantId = req.tenant?.id; // Assuming tenant is attached to request

  if (!tenantId) {
     res.status(400).json({ error: 'Tenant not resolved' });
     return;
  }

  // Attach tenantId to Prisma context
  (prisma as any).$tenantId = tenantId;

  next();
};

export default tenantContext;