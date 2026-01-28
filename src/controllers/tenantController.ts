/**
 * GET /api/tenants
 * Get all tenants
 */
export const getAllTenants = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const tenants = await tenantService.getAllTenants();

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
export const createTenant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const tenant = await tenantService.createTenant(req.body); // Updated from onboardingTenant to createTenant

        // Convert to response DTO
        const tenantDto = toTenantResponseDto(tenant);

        res.status(201).json(tenantDto);
    } catch (error: any) {
        // Preserve existing error response format
        next(error);
    }
};