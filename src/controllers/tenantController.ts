/**
 * Tenant controller - handles HTTP requests/responses for tenant operations
 * Thin wrapper that delegates business logic to tenantService
 */

import { Request, Response, NextFunction } from 'express';
import tenantService from '../services/tenantService';
import { toTenantResponseDto } from '../types/tenant.types';

/**
 * GET /api/tenants
 * Get all tenants
 */
export const getAllTenants = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const tenants = tenantService.getAllTenants();

        // Convert to response DTOs (converts opted_out 0/1 to boolean)
        const tenantDtos = tenants.map(toTenantResponseDto);

        res.json(tenantDtos);
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/tenants
 * Create a new tenant
 */
export const createTenant = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const tenant = tenantService.onboardingTenant(req.body);

        // Convert to response DTO
        const tenantDto = toTenantResponseDto(tenant);

        res.status(201).json(tenantDto);
    } catch (error: any) {
        // Preserve existing error response format
        next(error);
    }
};