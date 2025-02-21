import jwt from 'jsonwebtoken';

const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

interface JwtPayload {
    userId: string;
    tenantId: string;
  }

// Generate a JWT token
export const generateToken = (payload: JwtPayload, expiresIn: string = '1h'): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
  };

// Verify a JWT token
export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};