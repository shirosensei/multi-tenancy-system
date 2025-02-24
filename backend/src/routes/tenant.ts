import { Router } from 'express';
import { createTenant } from '../controllers/tenantController';
import { tenantLogin } from '../controllers/tenantAuthController';
import { identifyTenant } from "../middleware/identifyTenant"
import { identifyTenantBySubdomain } from '../middleware/identifyTenantBySubdomain';
import { ApiResponse, TypedRequestBody, TypedRequestParams, TypedRequestQuery } from '../types/express';

const router = Router();


// POST /tenants
router.post('/tenant/register', createTenant);


router.get('/tenant/data', identifyTenant);


// Tenant login route
router.post('/tenant/login', tenantLogin);


// Protected route using JWT claims
router.get('/tenant/data', identifyTenant);


// Protected route using subdomain
router.get('/tenant/data/subdomain', identifyTenantBySubdomain);



export default router;