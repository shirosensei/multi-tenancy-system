import { Tenant } from './tenant'; // Import the Tenant interface
import 'express'; 


declare global {
  namespace Express {
    interface Request {
      user?: Record<string, any>; // Add user property
      tenant?: Tenant; // Add tenant property
    }
  }
}
export { }