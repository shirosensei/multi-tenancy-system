import { PrismaClient } from '@prisma/client';

export interface Context {
  tenantId?: string;
}


const prisma = new PrismaClient().$extends({
  name: 'MultiTenancy',
  query: {
    $allModels: {
      async $allOperations({ args, query, model, operation })  {

        // Type assertion to access context
        const ctx  = (this as unknown as { context: Context });

        // Ensure context exists
        if (!ctx.context?.tenantId) {
          throw new Error('Tenant ID is missing in context!');
        }

        // Add tenantId to where clause for read/update/delete operations
        if (['findUnique', 'findMany', 'update', 'delete'].includes(operation)) {
            // Only modify `args.where` if it exists

          if (args?.where && typeof args.where === 'object') {
            args.where = { ...args.where, tenantId: ctx.context.tenantId };
        
          } else {
            args.where = { tenantId: ctx.context.tenantId };
          }
         
        }

        // Add tenantId to data for create operations
        if (['create', 'createMany'].includes(operation)) {
          if (args?.data && typeof args.data === 'object') {
            args.data = { ...args.data, tenantId: ctx.context.tenantId };
          }
        }

        return query(args);
      },
    },
  },
});

export default prisma;