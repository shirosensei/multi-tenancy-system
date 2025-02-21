import { Request } from "express";

export interface Tenant {
  id: string;
  name: string;
  domain?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// Extend Express Request Type
declare global {
  namespace Express {
    interface Request {
      user?: Record<string, any>;
      tenant?: Tenant;
    }
  }
}

export {}; 