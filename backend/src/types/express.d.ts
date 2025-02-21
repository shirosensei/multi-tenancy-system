import { Request } from "express";

export interface Tenant {
  id: string;
  name: string;
  domain?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

declare global {
  namespace Express {
    interface Request {
      user?: Record<string, any>;
      tenant?: Tenant;
    }
    
    interface Response {
      json(data: any): Response;
    }      
  }
}

export {}; 
