import { beforeAll, afterAll } from '@jest/globals';
import prisma from '../utils/prisma'; // Adjust the path to your Prisma client

// Run before all tests
beforeAll(async () => {
  // Initialize any test setup (e.g., database connections)
  await prisma.$connect();
});

// Run after all tests
afterAll(async () => {
  // Clean up test setup (e.g., close database connections)
  await prisma.$disconnect();
});


