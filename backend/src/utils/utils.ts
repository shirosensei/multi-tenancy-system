import { z } from 'zod';

export const tenantSchema = z.object({
  name: z.string().min(3).max(50),
  domain: z.string().regex(/^[a-z0-9-]+$/).max(20)
});

export const postSchema = z.object({
  title: z.string().min(5).max(100),
  content: z.string().min(10).max(2000)
});