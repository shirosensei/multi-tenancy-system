import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { comparePassword } from '../utils/bcrypt';
import { generateToken } from '../utils/jwt';
import logger from '../utils/logger';
import { CustomJwtPayload, SanitizedTenant } from '../types/express';
import { setAuthCookie } from '../middleware/setAuthCookie';

export const tenantLogin = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {

        const tenant = await prisma.tenant.findUnique({ where: { email } });

        if (!tenant) {
            logger.warn("Invalid email or password")
             res.status(401).json({ success: false, rror: 'Invalid email or password' });
             return;
        }

        const isPasswordValid = await comparePassword(password, tenant.password);

        if (!isPasswordValid) {
             res.status(401).json({ error: 'Invalid email or password' });
             return;
        }

        // Sanitize the tenant data
    const sanitizedTenant: CustomJwtPayload = {
        tenantId: tenant.id,
        name: tenant.name,
        domain: tenant.domain,
        email: tenant.email,
        createdAt: tenant.createdAt,
        updatedAt: tenant.updatedAt,
      };

        // Generate JWT token
    const token = generateToken(sanitizedTenant); 

      // Set the cookie
      setAuthCookie(res, token);

        res.json({
            success: true,
            data: {
              tenant: sanitizedTenant,
              token,
            },
         });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

