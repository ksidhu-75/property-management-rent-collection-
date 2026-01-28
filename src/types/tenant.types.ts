/**
 * Tenant domain types and DTOs
 * Separates database model from API request/response shapes
 */

import { ContactMethod, TenantStatus, ReminderStage } from './common.types';

// Re-export common types for convenience
export { ContactMethod, TenantStatus, ReminderStage };

/**
 * Tenant domain model (matches database schema)
 */
export interface Tenant {
    id?: number;
    full_name: string;
    email: string;
    phone_number: string;
    property_name: string;
    unit_number: string;
    monthly_rent: number;
    rent_due_day: number;
    lease_start_date: string;
    lease_end_date: string;
    preferred_contact_method: ContactMethod;
    opted_out: number; // 0 or 1 (SQLite boolean)
    last_payment_date?: string;
    last_payment_amount?: number;
    balance_owing: number;
    status: TenantStatus;
    last_message_sent?: string;
    reminder_stage: ReminderStage;
    notes?: string;
}

/**
 * DTO for creating a new tenant (API request)
 * Excludes auto-generated and system-managed fields
 */
export interface CreateTenantDto {
    full_name: string;
    email: string;
    phone_number: string;
    property_name: string;
    unit_number: string;
    monthly_rent: number;
    rent_due_day: number;
    lease_start_date: string;
    lease_end_date: string;
    preferred_contact_method: ContactMethod;
    notes?: string;
}

/**
 * DTO for updating tenant information (API request)
 * All fields optional for partial updates
 */
export interface UpdateTenantDto {
    full_name?: string;
    email?: string;
    phone_number?: string;
    monthly_rent?: number;
    rent_due_day?: number;
    lease_end_date?: string;
    preferred_contact_method?: ContactMethod;
    notes?: string;
}

/**
 * DTO for tenant response (API response)
 * Converts opted_out from number to boolean for frontend
 */
export interface TenantResponseDto {
    id: number;
    full_name: string;
    email: string;
    phone_number: string;
    property_name: string;
    unit_number: string;
    monthly_rent: number;
    rent_due_day: number;
    lease_start_date: string;
    lease_end_date: string;
    preferred_contact_method: ContactMethod;
    opted_out: boolean; // Converted from 0/1 to boolean
    last_payment_date?: string;
    last_payment_amount?: number;
    balance_owing: number;
    status: TenantStatus;
    last_message_sent?: string;
    reminder_stage: ReminderStage;
    notes?: string;
}

/**
 * DTO for recording a payment
 */
export interface RecordPaymentDto {
    tenant_id: number;
    amount: number;
}

/**
 * Helper to convert Tenant domain model to API response DTO
 */
export function toTenantResponseDto(tenant: Tenant): TenantResponseDto {
    return {
        id: tenant.id!,
        full_name: tenant.full_name,
        email: tenant.email,
        phone_number: tenant.phone_number,
        property_name: tenant.property_name,
        unit_number: tenant.unit_number,
        monthly_rent: tenant.monthly_rent,
        rent_due_day: tenant.rent_due_day,
        lease_start_date: tenant.lease_start_date,
        lease_end_date: tenant.lease_end_date,
        preferred_contact_method: tenant.preferred_contact_method,
        opted_out: tenant.opted_out === 1, // Convert 0/1 to boolean
        last_payment_date: tenant.last_payment_date,
        last_payment_amount: tenant.last_payment_amount,
        balance_owing: tenant.balance_owing,
        status: tenant.status,
        last_message_sent: tenant.last_message_sent,
        reminder_stage: tenant.reminder_stage,
        notes: tenant.notes,
    };
}