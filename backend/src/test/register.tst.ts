import { Request, Response } from 'express';
import { createTenant } from '../controllers/tenantController'; // Update the path
import prisma from '../utils/prisma'; // Update the path
import { hashPassword } from '../utils/bcrypt'; // Update the path

// Mock Prisma client
jest.mock('../utils/prisma', () => ({
  tenant: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

// Mock bcrypt
jest.mock('../utils/bcrypt', () => ({
  hashPassword: jest.fn().mockResolvedValue('hashedPassword'),
}));

describe('createTenant', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: {
        name: 'Test Tenant',
        subdomain: 'test-tenant',
        email: 'test@example.com',
        password: 'password123',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new tenant and return a token', async () => {
    // Mock Prisma responses
    (prisma.tenant.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.tenant.create as jest.Mock).mockResolvedValue({
      id: '12345',
      name: 'Test Tenant',
      domain: 'test-tenant',
      email: 'test@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await createTenant(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: expect.objectContaining({
        id: '12345',
        name: 'Test Tenant',
        domain: 'test-tenant',
        email: 'test@example.com',
      }),
    });
  });

  it('should return an error if the tenant already exists', async () => {
    // Mock Prisma response (tenant already exists)
    (prisma.tenant.findUnique as jest.Mock).mockResolvedValue({
      id: '12345',
      name: 'Test Tenant',
      domain: 'test-tenant',
      email: 'test@example.com',
    });

    await createTenant(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Tenant already exists',
    });
  });
});