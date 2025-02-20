import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient().$extends({
  query: {
    post: {
      async findMany({ args, query, context }: { args: any, query: any, context: any }) {
        args.where = { ...args.where, tenantId: context.tenantId };
        return query(args);
      },
      
      // Add similar logic for create/update/delete

      


    },
  },
});

export default prisma;