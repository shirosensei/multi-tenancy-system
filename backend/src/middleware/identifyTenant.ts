import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import logger from '../utils/logger';
import { TypedRequestBody, TypedRequestParams, TypedRequestQuery } from 'src/types/express';
import prisma from '../utils/prisma';
import { setAuthCookie } from '../middleware/setAuthCookie';

export const identifyTenant = async <T>(req: TypedRequestBody<T> | TypedRequestQuery<T> | TypedRequestParams<T>, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('Unauthorized: Missing or invalid authorization header');
     res.status(401).json({ error: 'Unauthorized' });
     return;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    logger.warn('Unauthorized: Missing token');
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {

        // Set the cookie
        setAuthCookie(res, token);
        
    const decoded = verifyToken(token) as { tenantId: string; domain: string };

     
    const tenant = await prisma.tenant.findUnique({
      where: { id: decoded.tenantId },
      include: {
        tenantUsage: true,
        tenantConfig: true,
        tenantSubscription: true
      }
    });

    if (!tenant || tenant.domain !== decoded.domain) {
       res.status(401).json({ error: 'Invalid tenant credentials' });
       return;
    }

    // Sanitize tenant data
    req.tenant = {
      ...tenant,
      usage: tenant.tenantUsage ? {
        ...tenant.tenantUsage,
      } : undefined,
      config: tenant.tenantConfig ? {
        ...tenant.tenantConfig,
        // tenantId: undefined,
        // tenant: undefined
      } : undefined,
      subscription: tenant.tenantSubscription ? {
        ...tenant.tenantSubscription,
        // tenantId: undefined,
        // tenant: undefined
      } : undefined
    };


    logger.info(`Tenant identified: ${decoded.tenantId} (${decoded.domain})`);

    next();
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Token verification failed: ${error.message}`);
    } else {
      logger.error('Token verification failed: Unknown error');
    }
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};