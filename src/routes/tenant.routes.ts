/**
 * Tenant routes
 * Defines HTTP endpoints and delegates to tenant controller
 */

import { Router } from 'express';
import * as tenantController from '../controllers/tenantController';

const router = Router();

/**
 * GET /api/tenants
 * Get all tenants
 */
router.get('/', tenantController.getAllTenants);

/**
 * POST /api/tenants
 * Create a new tenant
 */
router.post('/', tenantController.createTenant);

export default router;