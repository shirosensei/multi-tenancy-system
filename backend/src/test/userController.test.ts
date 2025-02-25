// src/tests/userController.test.ts
import request from 'supertest';
import express from 'express';
import { createUser } from '../controllers/userController';
import { PrismaClient } from '@prisma/client';

// Mock Prisma client
jest.mock('@prisma/client');
const prisma = new PrismaClient() as jest.Mocked<PrismaClient>;

const app = express();
app.use(express.json());
app.post('/users', createUser);

describe('createUser', () => {
  it('should create a user', async () => {
    // Mock Prisma's create method
    prisma.user.create.mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      createdAt: new Date(),
    });

    const response = await request(app)
      .post('/users')
      .send({
        email: 'test@example.com',
        name: 'Test User',
        roleId: '123',
        gender: 'male',
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      createdAt: expect.any(String), // Date is serialized to string
    });
  });

  it('should return 400 for invalid input', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        email: 'invalid-email', // Invalid email
        name: 'Test User',
        roleId: '123',
        gender: 'male',
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
  });
});