import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { z } from 'zod';

const createUserSchema = z.object({
    email: z.string().email(),
    name: z.string().optional(),
    roleId: z.string().regex(/^[0-9a-fA-F]{24}$/),
    gender: z.enum(['male', 'female', 'other'])
    
});

export const createUser = async (req: Request, res: Response) => {
    try {
        const validated = createUserSchema.parse(req.body);

        const user = await prisma.user.create({
            data: {
                ...validated,
                tenantId: req.tenant!.id,
                user: req.body.user || undefined
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true
            }
        });

        res.status(201).json(user);
    } catch (error) {
        if (error instanceof z.ZodError) {
             res.status(400).json({ errors: error.errors });
             return
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            where: { tenantId: req.tenant!.id },
            select: {
                id: true,
                email: true,
                name: true,
                role: { select: { name: true } },
                createdAt: true
            }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};