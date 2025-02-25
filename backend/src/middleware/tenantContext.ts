import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { CustomJwtPayload } from '../types/express';


 const tenantContext = async (req: Request, res: Response, next: NextFunction) => {
  // const tenantId = (req as any).tenantId;  // Assuming tenant is attached to request

  let tenantId = req.headers['x-tenant-id'] as string;

   // Or extract from JWT if applicable
   if (!tenantId && req.user) {
    tenantId = (req.user as unknown as CustomJwtPayload).tenantId;
  }
  
  if (!tenantId) {
   res.status(400).json({ error: 'Tenant ID is missing' });
     return;
  }

  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  if (!tenant) {
     res.status(404).json({ error: 'Tenant not found' });
     return;
  }

  // Attach tenantId to Prisma context
  (prisma as any).$tenantId = tenantId;

  next();
};

export default tenantContext;