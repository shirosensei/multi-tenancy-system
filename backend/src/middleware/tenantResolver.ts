import { Request, Response, NextFunction } from 'express';

interface Tenant {
    subdomain: string;
}

export interface TenantRequest extends Request {
    tenant?: Tenant;
}



const resolveTenant = (req: TenantRequest): Tenant | null => {
    const host = req.headers.host;
    
    if (!host) return null;
    

    const subdomain = host.split('.')[0];

    // Check if host does not contain subdomain OR alphanumeric
    if (!subdomain || !/^[a-zA-Z0-9-]+$/.test(subdomain)) return null;

    req.tenant = { subdomain };

    return req.tenant;
}




export const tenantResolver = async (req: TenantRequest, res: Response, next: NextFunction): Promise<void>  => {
    const tenant = resolveTenant(req);

    if (!tenant) {
        res.status(400).json({ error: 'Invalid or missing tenant subdomain' });
        return;
    }
    
    req.tenant = tenant;
    next();
}