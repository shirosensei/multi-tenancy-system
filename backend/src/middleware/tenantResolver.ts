import { Request, Response, NextFunction } from 'express';
import prisma, { Context } from '../utils/prisma';
import { TypedRequestBody, TypedRequestParams, TypedRequestQuery } from '../types/express'
import logger from '../utils/logger';

declare module 'express' {
  interface  Request {
    context?: Context
  }
}


const tenantResolver = async  <T>(req: TypedRequestBody<T> | TypedRequestQuery<T> | TypedRequestParams<T>, res: Response, next: NextFunction) => {
  try {
    let tenantId: string | undefined = req.tenant?.id;



    if (!tenantId) {
      const host = req.headers.host;

      if (!host) {
        logger.warn('Host header is missing');
        throw new Error('Host header is required');
      }


      const subdomain = host.split('.')[0];
      if (!subdomain) {
        logger.warn("Invalid subdomain format");
        throw new Error('Invalid subdomain format');
      }

      const tenant = await prisma.tenant.findFirst({
        where: { domain: subdomain },
        select: { id: true, name: true, domain: true, email: true, createdAt: true, updatedAt: true, password: true },
      });

      if (!tenant) {
        logger.warn("Tenant not found");
        throw new Error('Tenant not found');
      }

      req.tenant = {
        ...tenant,
        id: tenant.id,
        name: tenant.name,
        email: tenant.email, 
        domain: tenant.domain,
      };


      tenantId = tenant.id;
    }

    // Attach tenantId to context
    req.context = { tenantId };

    // on to the next middleware
    next();
  } catch (error) {
    next(error);
  }
};


export default tenantResolver; 