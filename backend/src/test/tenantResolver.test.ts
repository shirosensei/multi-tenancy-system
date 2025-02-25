import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import tenantResolver from '../middleware/tenantResolver'; // Update the path
import prisma from '../utils/prisma'; // Update the path
import logger from '../utils/logger'; // Update the path

// Mock Prisma client
jest.mock('../utils/prisma', () => ({
  tenant: {
    findFirst: jest.fn(),
  },
}));

// Mock logger
jest.mock('../utils/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

describe('tenantResolver Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {},
      query: {},
      tenant: undefined,
      context: undefined,
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });


  

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should resolve tenantId from x-tenant-id header', async () => {
    // Mock Prisma response
    (prisma.tenant.findFirst as jest.Mock).mockResolvedValue({
      id: '12345',
      name: 'Test Tenant',
      domain: 'test-tenant',
      email: 'test@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Set x-tenant-id header and host
    req.headers = { 'x-tenant-id': 'test-tenant', host: 'localhost:3000' };

    await tenantResolver(req as Request, res as Response, next);

    expect(prisma.tenant.findFirst).toHaveBeenCalledWith({
      where: { domain: 'test-tenant' },
      select: expect.any(Object),
    });
    expect(req.context?.tenantId).toBe('12345');
    expect(next).toHaveBeenCalled();
  });

  it('should resolve tenantId from tenant query parameter', async () => {
    // Mock Prisma response
    (prisma.tenant.findFirst as jest.Mock).mockResolvedValue({
      id: '12345',
      name: 'Test Tenant',
      domain: 'test-tenant',
      email: 'test@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Set tenant query parameter and host
    req.query = { tenant: 'test-tenant' };
    req.headers = { host: 'localhost:3000' };

    await tenantResolver(req as Request, res as Response, next);

    expect(prisma.tenant.findFirst).toHaveBeenCalledWith({
      where: { domain: 'test-tenant' },
      select: expect.any(Object),
    });
    expect(req.context?.tenantId).toBe('12345');
    expect(next).toHaveBeenCalled();
  });

  it('should resolve tenantId from JWT token', async () => {
    // Mock JWT payload
    const token = jwt.sign({ tenantId: '12345', name: 'Test Tenant', email: 'test@example.com', domain: 'test-tenant' }, 'secret', { expiresIn: '1h' });

    // Set Authorization header and host
    req.headers = { authorization: `Bearer ${token}` };

    (prisma.tenant.findFirst as jest.Mock).mockResolvedValue(null);


    // Mock Prisma response
    req.tenant = {
      id: '12345',
      name: 'Test Tenant',
      domain: 'test-tenant',
      email: 'test@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    await tenantResolver(req as Request, res as Response, next);

    expect(req.context?.tenantId).toBe('12345');
    expect(next).toHaveBeenCalled();
  });

  it('should return 400 if tenantId is missing', async () => {
    // Set host header
    req.headers = { host: 'localhost:3000' };

    await tenantResolver(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Tenant ID is required' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 404 if tenant is not found', async () => {
    // Mock Prisma response (tenant not found)
    (prisma.tenant.findFirst as jest.Mock).mockResolvedValue(null);

    // Set x-tenant-id header and host
    req.headers = { 'x-tenant-id': 'non-existent-tenant', host: 'localhost:3000' };

    await tenantResolver(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Tenant not found' });
    expect(next).not.toHaveBeenCalled();
  });
});

