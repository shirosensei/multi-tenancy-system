import { Request, Response, NextFunction } from 'express';
import prisma, { Context } from '../utils/prisma';
import { TypedRequestBody, TypedRequestParams, TypedRequestQuery } from '../types/express'
import logger from '../utils/logger';
import { ParsedQs } from 'qs';

declare module 'express' {
  interface Request {
    context?: Context
  }
}
const tenantResolver = async <T>(
  req: TypedRequestBody<T> | TypedRequestQuery<T> | TypedRequestParams<T>,
  res: Response,
  next: NextFunction
) => {
  try {
    let tenantId: string | undefined = req.tenant?.id;

    if (!tenantId) {
      const host = req.headers.host;
      logger.info(`Host: ${host}`);

      if (!host) {
        logger.warn('Host header is missing');
        res.status(400).json({ message: 'Host header is required' });
        return;
      }

      const isLocalhost = host.includes('localhost');
      let subdomain: string;

      if (isLocalhost) {
        // For localhost, use a query parameter or header to specify the tenant
        subdomain = (req.query as ParsedQs).tenant as string || req.headers['x-tenant-id'] as string;
        logger.info(`Resolving tenant for localhost using subdomain: ${subdomain}`);
      } else {
        subdomain = host.split('.')[0];
        logger.info(`Resolving tenant for subdomain: ${subdomain}`);
      }

      if (subdomain) {
        const tenant = await prisma.tenant.findFirst({
          where: { domain: subdomain },
          select: {
            id: true,
            name: true,
            domain: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            tenantUsage: true,
            tenantConfig: true,
            tenantSubscription: true,
          },
        });

        if (!tenant) {
          logger.warn(`Tenant not found for subdomain: ${subdomain}`);
          res.status(404).json({ message: 'Tenant not found' });
          return;
        }

        req.tenant = {
          ...tenant,
          id: tenant.id,
          name: tenant.name,
          domain: tenant.domain,
          email: tenant.email,
          createdAt: tenant.createdAt,
          updatedAt: tenant.updatedAt,
        };

        tenantId = tenant.id;
        logger.info(`Tenant found: ${tenant.id}, ${tenant.name}`);
      }
    }

    logger.info(`Tenant ID: ${tenantId}`);

    // Attach tenantId to context
    if (!req.context) {
      req.context = {} as Context;
    }
    req.context.tenantId = tenantId as string;

    if (!tenantId) {
      logger.warn('tenantId is still missing');
      res.status(400).json({ message: 'Tenant ID is required' });
      return;
    }

    logger.info('tenantId set correctly:', tenantId);
    next();
  } catch (error) {
    logger.error('Error in tenantResolver:', error);
    next(error);
  }
};

export default tenantResolver;