/**
 * Common type definitions shared across the application
 */

/**
 * Standardized API response wrapper
 */
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: ApiError;
    message?: string;
}

/**
 * Standardized error response structure
 */
export interface ApiError {
    message: string;
    code?: string;
    statusCode?: number;
    fields?: Record<string, string>; // Field-level validation errors
    stack?: string; // Only in development
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
    limit: number;
    offset: number;
}

/**
 * Pagination metadata in responses
 */
export interface PaginationMeta {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
}

/**
 * Contact method options
 */
export type ContactMethod = 'EMAIL' | 'SMS' | 'BOTH';

/**
 * Tenant status options
 */
export type TenantStatus = 'PAID' | 'LATE' | 'PARTIAL' | 'DELINQUENT';

/**
 * Reminder stage in workflow
 */
export type ReminderStage = 'PRE_DUE' | 'DUE' | 'LATE_1' | 'LATE_2' | 'FINAL';

/**
 * Communication channel
 */
export type CommunicationChannel = 'EMAIL' | 'SMS';

/**
 * Communication status
 */
export type CommunicationStatus = 'SENT' | 'FAILED';