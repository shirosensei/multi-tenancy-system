// src/tests/authenticate.test.ts
import request from 'supertest';
import express from 'express';
import { authenticate } from '../src/middleware/authenticate';
import { verifyToken } from '../src/utils/jwt';

// Mock the verifyToken function
jest.mock('../utils/jwt');

const app = express();
app.use(express.json());
app.use(authenticate);
app.get('/protected', (req, res) => {
  res.json({ userId: req.user.id, tenantId: req.tenantId });
});

describe('authenticate Middleware', () => {
  it('should allow access with a valid token', async () => {
    // Mock the verifyToken function to return a valid payload
    (verifyToken as jest.Mock).mockReturnValue({ userId: '123', tenantId: '456' });

    const response = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer valid-token');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ userId: '123', tenantId: '456' });
  });

  it('should deny access with an invalid token', async () => {
    // Mock the verifyToken function to throw an error
    (verifyToken as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const response = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer invalid-token');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Invalid or expired token' });
  });

  it('should deny access without a token', async () => {
    const response = await request(app).get('/protected');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Unauthorized' });
  });
});