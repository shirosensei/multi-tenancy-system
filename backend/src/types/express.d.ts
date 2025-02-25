// src/types/express.d.ts
import { Request, Response } from 'express';
import { Tenant, User, Post, TenantUsage, TenantConfig, TenantSubscription } from '@prisma/client';



export type SanitizedTenant = Omit<Tenant, 'password'>;
export type SanitizedUser = Omit<User, 'password'>;
export type SanitizedConfig = Omit<TenantConfig, 'configValue'>;

declare global {
  namespace Express {
    interface Request {
      tenant?: SanitizedTenant & {
        usage?: Omit<TenantUsage, 'dataUsage'>;
        config?: SanitizedConfig;
        subscription?: Omit<TenantSubscription, 'subscriptionType' | 'subscriptionStatus'>;
      };
      user?: SanitizedUser;
      post?: Post;
      roleResponse?: RoleResponse;
    }

    interface Response {
      json: <T>(body?: ApiResponse<T>) => this;
    }
  }
}


export interface TypedRequestBody<T> extends Request {
  body: T;
}



export interface TypedRequestQuery<T> extends Request {
  query: T;
}

export interface TypedRequestQuery<T = qs.ParsedQs> extends Request {
  query: T;
}

export interface TypedRequestParams<T> extends Request {
  params: T;
}

// Prisma model extensions
interface TenantUsage {
  id: string;
  dataUsage: number;
  createdAt: Date;
}

interface TenantConfig {
  id: string;
  configName: string;
  configValue: string;
  createdAt: Date;
}

interface TenantSubscription {
  id: string;
  subscriptionType: string;
  subscriptionStatus: string;
  subscriptionStartDate: Date;
  subscriptionEndDate: Date;
  createdAt: Date;
}

export interface GetPostsQuery {
  page?: string;
  limit?: string;
  search?: string;
}

export interface PostResponse {
  id: string;
  title: string;
  createdAt: Date;
  author: {
    username: string;
  };
}

export interface RoleResponse {
  role: string;
  permissions: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  status?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface CustomJwtPayload {
  tenantId: string;
  name: string;
  domain: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export { }