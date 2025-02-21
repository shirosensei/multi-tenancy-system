import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { Tenant } from '@prisma/client';



 const tenantResolver = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const host = req.headers.host;
      if (!host) {
         res.status(400).json({ error: 'Host header required' });
         return
      }
  
      const subdomain = host.split('.')[0];
      if (!subdomain) {
         res.status(400).json({ error: 'Invalid subdomain format' });
         return
      }
  
      const tenant = await prisma.tenant.findUnique({
        where: { domain: subdomain, id: '' },
        select: { id: true, name: true, domain: true, createdAt: true, updatedAt: true }
      });
  
      if (!tenant) {
         res.status(404).json({ error: 'Tenant not found' });
         return
      }
      
      // Attach tenant to request and Prisma context
      req.tenant = tenant;
  
    //   on to the next middleware
      next();
    } catch (error) {
      next(error);
    }
  };


  export default tenantResolver; 