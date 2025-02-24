import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { z } from 'zod';
import logger from '../utils/logger';
import { hashPassword } from '../utils/bcrypt';
import { log } from 'console';

const createUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(5, "Password must be at least 5 characters"),
    name: z.string().optional(),
    role: z.string().regex(/^[0-9a-fA-F]{24}$/),
    username: z.string().min(5, "Username must be 5 characters long"),
    gender: z.enum(['male', 'female', 'other'])
});


const getUsersSchema = z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10),
});


export const createUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password, name, username, role, gender } = createUserSchema.parse(req.body);

    try {

        // check if user exist
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }]
            }
        });

        if (existingUser) {
            logger.warn("user already exists")
             res.status(400).json({ error: "username already exists" });
             return;
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role,
                username,
                gender,
                tenantId: req.tenant!.id
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
        logger.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const { page, limit } = getUsersSchema.parse(req.query);


        const users = await prisma.user.findMany({
            where: { tenantId: req.tenant!.id },
            skip: (page - 1) * limit,
            take: limit,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true
            }
        });
        res.json(users);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};