import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import logger from '../utils/logger';
import { ApiResponse, TypedRequestBody, TypedRequestParams, TypedRequestQuery } from '../types/express';

export const identifyTenantBySubdomain = async <T>(
  req: TypedRequestBody<T> | TypedRequestQuery<T> | TypedRequestParams<T>,
  res: Response<ApiResponse<any>>,
  next: NextFunction
) => {
  const host = req.headers.host;
  console.log('host', host);

  if (!host) {
    logger.warn('Host header is missing');
     res.status(400).json({ success: false, error: 'Host header is required' });
     return;
  }

  // Extract the subdomain 
  const subdomain = host.split('.')[0];

  if (!subdomain) {
    logger.warn('Invalid subdomain format');
     res.status(400).json({ success: false, error: 'Invalid subdomain format' });
     return;
  }

  try {
    // Find the tenant by subdomain (domain)
    const tenant = await prisma.tenant.findUnique({
      where: { domain: subdomain },
      select: {
        id: true,
        name: true,
        domain: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        tenantUsage: {
          select: {
            id: true,
            createdAt: true,
            updatedAt: true
          }
        },
        tenantConfig: {
          select: {
            id: true,
            configName: true,
            createdAt: true
          }
        },
        tenantSubscription: {
          select: {
            id: true,
            subscriptionStartDate: true,
            subscriptionEndDate: true,
            createdAt: true
          }
        }
      }
    });

    if (!tenant) {
      logger.warn(`Tenant not found for subdomain: ${subdomain}`);
       res.status(404).json({ success: false, error: 'Tenant not found' });
       return;
    }

    // Attach the tenant ID and domain to the request object
    req.tenant = { 
      id: tenant.id,
      name: tenant.name,
      domain: tenant.domain,
      email: tenant.email,
      createdAt: tenant.createdAt,
      updatedAt: tenant.updatedAt,
      usage: tenant.tenantUsage || undefined,
      config: tenant.tenantConfig || undefined,
      subscription: tenant.tenantSubscription || undefined
    }

    logger.info(`Tenant identified by subdomain: ${tenant.id} (${tenant.domain})`);

    next();
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error identifying tenant by subdomain: ${error.message}`);
    } else {
      logger.error('Error identifying tenant by subdomain');
    }
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};