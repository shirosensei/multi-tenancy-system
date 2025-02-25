import prisma from '../utils/prisma';
import { Request, Response } from "express";
import { string, z } from 'zod';
import { hashPassword } from '../utils/bcrypt';
import logger from '../utils/logger';
import { CustomJwtPayload, SanitizedTenant } from '../types/express'; // Update the path
import { generateToken } from '../utils/jwt';


const createTenantSchema = z.object({
  name: z.string().min(10, 'Name must be at least 10 characters'),
  subdomain: z.string().min(7, 'Subdomain must be at least 7 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});


export const createTenant = async (
  req: Request,
  res: Response<{ success: boolean; data?: SanitizedTenant; error?: string }>
): Promise<void> => {
  const { name, subdomain, email, password } = createTenantSchema.parse(req.body);

  try {
    const existingTenant = await prisma.tenant.findUnique({
      where: { domain: subdomain },
    });

    if (existingTenant) {
      res.status(400).json({ success: false, error: "Tenant already exists" });
      return;
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the tenant
    const newTenant = await prisma.tenant.create({
      data: {
        name,
        // tenantId,
        domain: subdomain,
        email,
        password: hashedPassword,
        createdAt: new Date(),
      },
    });

    const token = generateToken({
      tenantId: newTenant.id,
      ...newTenant
    } as CustomJwtPayload); 

   

    // Return the tenant details and token
    res.status(201).json({
      success: true,
      data: {   
        id: newTenant.id,
        name: newTenant.name,
        domain: newTenant.domain,
        email: newTenant.email,
        createdAt: newTenant.createdAt,
        updatedAt: newTenant.updatedAt, 
    },

    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: JSON.stringify(error.errors) });
      return;
    }

    logger.error('Failed to create tenant', { error });
    res.status(500).json({ success: false, error: 'Failed to create tenant' });
  }
};