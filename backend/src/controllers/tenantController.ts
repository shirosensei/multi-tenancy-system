import prisma from '../utils/prisma';
import { Request, Response } from "express";

interface TenantRequestBody {
    name: string;
    subdomain: string;
}


export const createTenant = async (req: Request<TenantRequestBody>, res: Response<{ id: string; name: string } | { error: string }>): Promise<void> => {
    const { name, subdomain } = req.body;

    try {

        const existingTenant = await prisma.tenant.findUnique({
            where: { id : subdomain },
        });

        if (existingTenant) {
            res.status(400).json({ error: "Subdomain already exists" });
            return;
        }


        // Store tenant metadata in a separate "tenants" collection
        const tenant = await prisma.tenant.create({
            data: {
                name,
                domain: subdomain,
                createdAt: new Date(),
            },
        });

        res.json({ id: tenant.id, name: tenant.name });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create tenant' })
    }

};