import { PrismaClient } from '@prisma/client';

export interface Context {
  tenantId: string;
}

const prisma = new PrismaClient().$extends({
  name: 'MultiTenancy',
  query: {
    $allModels: {
      async $allOperations({ args, query, model, operation }) {
        // Ensure context exists
        const context = (this as any).context as Context

        // const ctx  = (this as unknown as { context: Context });

        if (!context?.tenantId) {
          throw new Error('Tenant ID is missing in context');
        }

        // Add tenantId to where clause for read/update/delete operations
        if (['findUnique', 'findMany', 'update', 'delete'].includes(operation)) {
          args.where = { ...args.where, tenantId: context.tenantId };
        }

        // Add tenantId to data for create operations
        if (['create', 'createMany'].includes(operation)) {
          if (args.data && typeof args.data === 'object') {
            args.data = { ...args.data, tenantId: context.tenantId };
          }
        }

        return query(args);
      },
    },
  },
});

export default prisma;