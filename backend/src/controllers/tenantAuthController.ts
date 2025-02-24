import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { comparePassword } from '../utils/bcrypt';
import { generateToken } from '../utils/jwt';
import logger from '../utils/logger';

export const tenantLogin = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {

        const tenant = await prisma.tenant.findUnique({ where: { email } });

        if (!tenant) {
            logger.warn("Invalid email or password")
             res.status(401).json({ error: 'Invalid email or password' });
             return;
        }

        const isPasswordValid = await comparePassword(password, tenant.password);

        if (!isPasswordValid) {
             res.status(401).json({ error: 'Invalid email or password' });
             return;
        }

        const token = generateToken({
            tenantId: tenant.id,
            domain: tenant.domain,
        });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};