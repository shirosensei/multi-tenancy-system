import { Request, Response, NextFunction } from 'express';
import { TypedRequestBody, TypedRequestQuery, TypedRequestParams, ApiResponse, RoleResponse } from '../types/express';


type Role = 'admin' | 'editor' | 'viewer' | 'guest';

const roleHierarchy = new Map<Role, number>([
  ['admin', 3],
  ['editor', 2],
  ['viewer', 1],
  ['guest', 0],
]);

const requireRole = (requiredRole: Role) => {
  return <T>(req: TypedRequestBody<T> | TypedRequestQuery<T> | TypedRequestParams<T>, res: Response, next: NextFunction): void => {



    if (!req?.user?.role) {
      res.status(401).json({ sucess: false, error: 'Unauthorized' });
      return;
    }


    const userRole = req.user.role.toLowerCase() as Role;

    if (!roleHierarchy.has(userRole) || !roleHierarchy.has(requiredRole)) {
      res.status(400).json({ success: false, error: 'Invalid role' });
      return;
    }


    if (roleHierarchy.get(userRole as Role)! < roleHierarchy.get(requiredRole)!) {
      res.status(403).json({ success: false, error: 'Insufficient permissions' });
      return;
    }

    const roleResponse: RoleResponse = {
      role: userRole,
      permissions: ['create', 'read', 'update', 'delete'],
    };

    req.roleResponse = roleResponse;

    next();
  };
};


export { requireRole };