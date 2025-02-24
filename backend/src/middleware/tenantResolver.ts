import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';


const tenantResolver = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let tenantId: string | undefined = (req as any).tenantId;
    let decoded: any = (req as any).userId;



    if (!tenantId) {
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
        where: { domain: subdomain },
        select: { id: true }
      });

      if (!tenant) {
        res.status(404).json({ error: 'Tenant not found' });
        return
      }

      tenantId = tenant.id;

      (req as any).userId = decoded.userId;
      (req as any).tenantId = decoded.tenantId;
    }

    //   on to the next middleware
    next();
  } catch (error) {
    next(error);
  }
};


export default tenantResolver; 