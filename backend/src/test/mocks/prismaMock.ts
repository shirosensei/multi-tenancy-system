import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({
    tenant: {
      findFirst: jest.fn(),
    },
  })),
}));

const prisma = new PrismaClient();

export default prisma;