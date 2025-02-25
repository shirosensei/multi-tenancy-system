import { PrismaClient, Prisma  } from '@prisma/client';

const prisma = new PrismaClient();

export interface Context {
  tenantId: string;
}


prisma.$use(async (params: Prisma.MiddlewareParams, next: (params: Prisma.MiddlewareParams) => Promise<any>) => {
  const { args, model, action } = params;
  const operation = params.action;
  const context: Context | undefined = params.args?.context;

  if (context?.tenantId) {
    // Add tenantId to where clause for read/update/delete operations
    if (['findUnique', 'findMany', 'update', 'delete'].includes(action)) {
      if (args && typeof args === 'object' && 'where' in args) {
        args.where = { ...args.where, tenantId: context.tenantId };
      }
    }

    // Add tenantId to data for create operations
    if (['create', 'createMany'].includes(action)) {
      if (args && typeof args === 'object' && 'data' in args) {
        args.data = { ...args.data, tenantId: context.tenantId };
      }
    }
  }
  return next(params);
})


export default prisma;