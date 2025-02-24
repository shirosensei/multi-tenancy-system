import request from 'supertest';
import app from '../src/app'; // Import your Express app
import prisma from '../src/utils/prisma'; // Import Prisma client

describe('Multi-Tenancy Registration and Login', () => {
  // Clean up the database before each test
  beforeEach(async () => {
    await prisma.tenant.deleteMany();
  });

  // Test tenant registration
  it('should register a new tenant', async () => {
    const response = await request(app)
      .post('/api/tenant/register')
      .send({
        name: 'Test Tenant',
        domain: 'test-tenant',
        email: 'test@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.domain).toBe('test-tenant');
  });

  // Test tenant login
  it('should login a tenant and return a token', async () => {
    // Register a tenant first
    await request(app)
      .post('/api/tenant/register')
      .send({
        name: 'Test Tenant',
        domain: 'test-tenant',
        email: 'test@example.com',
        password: 'password123',
      });

    // Login the tenant
    const response = await request(app)
      .post('/api/tenant/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('token');
  });

  // Test login with invalid credentials
  it('should reject login with invalid credentials', async () => {
    const response = await request(app)
      .post('/api/tenant/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('Invalid email or password');
  });
});