import { Router } from 'express';
import { createTenant } from '../controllers/tenantController';
import { tenantLogin } from '../controllers/tenantAuthController';
import { identifyTenant } from "../middleware/identifyTenant"
import { identifyTenantBySubdomain } from '../middleware/identifyTenantBySubdomain';
import { authenticate } from '../middleware/authenticate';


const router = Router();


// POST /tenants
router.post('/tenant/register', createTenant);


// Tenant login route
router.post('/tenant/login', tenantLogin);

// Protected route using JWT claims
router.get('/tenant/data', authenticate, identifyTenant);

// Fetch tenant details
// router.get('/tenants/:tenantId', authenticate,)


// Protected route using subdomain
router.get('/tenant/data/subdomain', authenticate, identifyTenantBySubdomain);



export default router;