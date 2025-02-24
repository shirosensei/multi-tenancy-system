import prisma from '../utils/prisma';
import { Request, Response } from "express";
import { z } from 'zod';
import { hashPassword } from '../utils/bcrypt';
import logger from '../utils/logger';


const createTenantSchema = z.object({
    name: z.string().min(10, 'Name must be at least 10 characters'),
    subdomain: z.string().min(7, 'Subdomain must be at least 7 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});


export const createTenant = async (req: Request, res: Response<{ id: string; name: string } | { error: string }>): Promise<void> => {

    const { name, subdomain, email, password } = createTenantSchema.parse(req.body);


    try {

        const existingTenant = await prisma.tenant.findFirst({
            where: {
                OR: [{ domain: subdomain }, { email }],
            },
        });

        if (existingTenant) {
            res.status(400).json({ error: "Subdomain already exists" });
            return;
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);


        // Store tenant metadata in a separate "tenants" collection
        const tenant = await prisma.tenant.create({
            data: {
                name,
                domain: subdomain,
                email,
                password: hashedPassword,
                createdAt: new Date(),
            },
        });

        res.json({ id: tenant.id, name: tenant.name });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: JSON.stringify(error.errors) });
            return;
          }
      
          logger.error('Failed to create tenant', { error });
          res.status(500).json({ error: 'Failed to create tenant' });
    }

};