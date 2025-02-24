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

  // Default error response
  res.status(500).json({ error: 'Internal server error' });
};

export default errorHandler;