import { Request, Response, NextFunction } from 'express';


type Role = 'admin' | 'editor' | 'viewer' | 'guest';

const requireRole = (requiredRole: Role) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.role?.name) {
       res.status(401).json({ error: 'Unauthorized' });
       return
    }

    const userRole = req.user.role.name.toLowerCase();
    const roleHierarchy: Record<Role, number> = {
      admin: 3,
      editor: 2,
      viewer: 1,
      guest: 0,
    };

    if (roleHierarchy[userRole as Role] <roleHierarchy[requiredRole]) {
       res.status(403).json({ error: 'Insufficient permissions' });
       return
    }

    next();
  };
};


export { requireRole };