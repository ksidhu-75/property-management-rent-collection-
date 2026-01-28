import tenantRepository from '../repositories/tenantRepository';
import { Tenant, CreateTenantDto } from '../types/tenant.types';
import { ValidationError, NotFoundError } from '../utils/errors';
import { getCurrentTimestamp } from '../utils/dateHelpers';

/**
 * Get all tenants
 * @returns Array of all tenants
 */
const getAllTenants = (): Tenant[] => {
    return tenantRepository.getAllTenants();
};

/**
 * Get a single tenant by ID
 * @param id - Tenant ID
 * @returns Tenant or undefined if not found
 */
const getTenantById = (id: number): Tenant | undefined => {
    return tenantRepository.getTenantById(id);
};

/**
 * Create a new tenant (renamed from onboardingTenant for clarity)
 * @param tenantData - Tenant creation data
 * @returns Created tenant with ID
 */
const createTenant = (tenantData: CreateTenantDto | Tenant): Tenant => {
    // Validate required fields
    if (!tenantData.full_name || !tenantData.email || !tenantData.monthly_rent) {
        throw new ValidationError('Missing required tenant fields');
    }

    // Additional validation
    if (!tenantData.property_name || !tenantData.unit_number) {
        throw new ValidationError('Property name and unit number are required');
    }

    if (tenantData.monthly_rent <= 0) {
        throw new ValidationError('Monthly rent must be greater than 0');
    }

    if (tenantData.rent_due_day < 1 || tenantData.rent_due_day > 31) {
        throw new ValidationError('Rent due day must be between 1 and 31');
    }

    // Set defaults for system-managed fields
    const newTenant: Tenant = {
        ...tenantData,
        status: (tenantData as any).status || 'PAID',
        reminder_stage: (tenantData as any).reminder_stage || 'PRE_DUE',
        opted_out: (tenantData as any).opted_out || 0,
        balance_owing: (tenantData as any).balance_owing || 0
    };

    const id = tenantRepository.createTenant(newTenant);
    newTenant.id = Number(id);
    return newTenant;
};

/**
 * Alias for createTenant to maintain backward compatibility
 * @deprecated Use createTenant instead
 */
const onboardingTenant = createTenant;

/**
 * Update tenant status and balance
 * @param id - Tenant ID
 * @param status - New status
 * @param balance - New balance
 */
const updateTenantStatus = (id: number, status: Tenant['status'], balance: number): void => {
    const tenant = tenantRepository.getTenantById(id);
    if (!tenant) {
        throw new NotFoundError('Tenant not found');
    }

    tenantRepository.updateTenant(id, { status, balance_owing: balance });
};

/**
 * Record a payment for a tenant
 * @param id - Tenant ID
 * @param amount - Payment amount
 */
const recordPayment = (id: number, amount: number): void => {
    const tenant = tenantRepository.getTenantById(id);
    if (!tenant) {
        throw new NotFoundError('Tenant not found');
    }

    if (amount <= 0) {
        throw new ValidationError('Payment amount must be greater than 0');
    }

    const newBalance = Math.max(0, tenant.balance_owing - amount);
    const newStatus = newBalance === 0 ? 'PAID' : 'PARTIAL';

    tenantRepository.updateTenant(id, {
        last_payment_date: getCurrentTimestamp(),
        last_payment_amount: amount,
        balance_owing: newBalance,
        status: newStatus,
        reminder_stage: newStatus === 'PAID' ? 'PRE_DUE' : tenant.reminder_stage // Reset stage if fully paid
    });
};

/**
 * Opt out a tenant from automated communications
 * @param id - Tenant ID
 */
const optOutTenant = (id: number): void => {
    const tenant = tenantRepository.getTenantById(id);
    if (!tenant) {
        throw new NotFoundError('Tenant not found');
    }

    tenantRepository.updateTenant(id, { opted_out: 1 });
};

export default {
    getAllTenants,
    getTenantById,
    createTenant,
    onboardingTenant, // Keep for backward compatibility
    updateTenantStatus,
    recordPayment,
    optOutTenant
};