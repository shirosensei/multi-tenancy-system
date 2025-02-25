import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import logger from '../utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log the error
  logger.error(`Error: ${err.message}`, {
    stack: err.stack, // Include stack trace for debugging
    message: err.message,
  path: req.originalUrl,
  method: req.method,
  ip: req.ip,
  userAgent: req.get('User-Agent'),
  requestBody: req.body, // Log request body if necessary (ensure to sanitize in production)
  queryParams: req.query,
    request: {
      method: req.method,
      url: req.url,
      headers: req.headers,
    },
  });

  // Handle Zod validation errors
  if (err instanceof z.ZodError) {
     res.status(400).json({ errors: err.errors });
     return;
  }



  // Handle specific known errors, like Database or Unauthorized errors
  if (err.name === 'MongoError') {
    logger.error('MongoDB Error', { error: err.message });
     res.status(500).json({ error: 'Database error occurred' });
     return;
  }

  if (err.name === 'UnauthorizedError') {
    logger.warn('Unauthorized Access', { path: req.originalUrl, user: req.user });
     res.status(401).json({ error: 'Unauthorized access' });
     return;
  }


  logger.error('Internal Server Error', { error: err.message });
  // Default error response
  res.status(500).json({ error: 'Internal server error' });
};

export default errorHandler;