import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import logger from '../utils/logger'; // Import the logger

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response | undefined => {
  // Log the error
  logger.error(`Error: ${err.message}`, { stack: err.stack });

  if (err instanceof ZodError) {
    return res.status(400).json({
      type: 'Validation Error',
      errors: err.errors,
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return res.status(400).json({
      type: 'Database Error',
      code: err.code,
      meta: err.meta,
    });
  }

  res.status(500).json({
    type: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production'
      ? 'Something went wrong'
      : err.message,
  });
};