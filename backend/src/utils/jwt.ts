import jwt, { SignOptions } from 'jsonwebtoken';

import logger from './logger';

const JWT_SECRET: string = process.env.JWT_SECRET || 'default-secret';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

interface JwtPayload {
  tenantId: string;
  domain: string;
  role?: string;
  [key: string]: any; // Allow additional properties
}

type ExpiresIn = '1h' | '2h' | '1d' | '7d' | number;


// Generate a JWT token
export const generateToken = (payload: JwtPayload, expiresIn: ExpiresIn = '1h') => {
  const options: SignOptions = { expiresIn };

  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid payload. Expected an object.');
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as SignOptions);

};



// Verify a JWT token
export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Runtime validation
    if (!decoded.tenantId || !decoded.domain) {
      throw new Error('Invalid token payload');
    }

    return decoded;
  } catch (error) {
    logger.warn(error);

    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token has expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    } else {
      throw new Error('Failed to verify token');
    }
  }
};