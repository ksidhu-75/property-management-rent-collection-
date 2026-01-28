import { supabase } from '../utils/supabaseClient';

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
    preferred_contact_method: 'EMAIL' | 'SMS' | 'BOTH';
    opted_out: number; // 0 or 1
    last_payment_date?: string;
    last_payment_amount?: number;
    balance_owing: number;
    status: 'PAID' | 'LATE' | 'PARTIAL' | 'DELINQUENT';
    last_message_sent?: string;
    reminder_stage: 'PRE_DUE' | 'DUE' | 'LATE_1' | 'LATE_2' | 'FINAL';
    notes?: string;
}

const getAllTenants = async (): Promise<Tenant[]> => {
    const { data, error } = await supabase
        .from('tenants')
        .select('*');
    
    if (error) throw new Error(error.message);
    return data as Tenant[];
};

const getTenantById = async (id: number): Promise<Tenant | undefined> => {
    const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', id)
        .single();
    
    if (error) return undefined;
    return data as Tenant;
};

const createTenant = async (tenant: Tenant): Promise<number> => {
    const { data, error } = await supabase
        .from('tenants')
        .insert([tenant])
        .select('id')
        .single();

    if (error) throw new Error(error.message);
    return data.id;
};

const updateTenant = async (id: number, updates: Partial<Tenant>) => {
    const { error } = await supabase
        .from('tenants')
        .update(updates)
        .eq('id', id);

    if (error) throw new Error(error.message);
};

export default {
    getAllTenants,
    getTenantById,
    createTenant,
    updateTenant
};