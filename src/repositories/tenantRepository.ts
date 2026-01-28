import db from '../database/db';

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

const getAllTenants = (): Tenant[] => {
    return db.prepare('SELECT * FROM tenants').all() as Tenant[];
};

const getTenantById = (id: number): Tenant | undefined => {
    return db.prepare('SELECT * FROM tenants WHERE id = ?').get(id) as Tenant | undefined;
};

const createTenant = (tenant: Tenant): number | bigint => {
    const stmt = db.prepare(`
        INSERT INTO tenants (
            full_name, email, phone_number, property_name, unit_number,
            monthly_rent, rent_due_day, lease_start_date, lease_end_date,
            preferred_contact_method, opted_out, balance_owing, status
        ) VALUES (
            @full_name, @email, @phone_number, @property_name, @unit_number,
            @monthly_rent, @rent_due_day, @lease_start_date, @lease_end_date,
            @preferred_contact_method, @opted_out, @balance_owing, @status
        )
    `);
    const info = stmt.run(tenant);
    return info.lastInsertRowid;
};

const updateTenant = (id: number, updates: Partial<Tenant>) => {
    const fields = Object.keys(updates).map((key) => `${key} = @${key}`).join(', ');
    if (fields.length === 0) return;

    const stmt = db.prepare(`UPDATE tenants SET ${fields} WHERE id = @id`);
    stmt.run({ ...updates, id });
};

export default {
    getAllTenants,
    getTenantById,
    createTenant,
    updateTenant
};