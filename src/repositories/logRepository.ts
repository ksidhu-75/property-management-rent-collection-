import { supabase } from '../utils/supabaseClient';

export interface CommunicationLog {
    id?: number;
    tenant_id: number;
    timestamp: string;
    channel: 'EMAIL' | 'SMS';
    message_type: 'PRE_DUE' | 'DUE' | 'LATE_1' | 'LATE_2' | 'FINAL';
    status: 'SENT' | 'FAILED';
    content: string;
}

const createLog = async (log: CommunicationLog) => {
    const { error } = await supabase
        .from('communication_logs')
        .insert([log]);
        
    if (error) console.error('Error logging communication:', error.message);
};

const getLogsByTenantId = async (tenantId: number): Promise<CommunicationLog[]> => {
    const { data, error } = await supabase
        .from('communication_logs')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('timestamp', { ascending: false });

    if (error) throw new Error(error.message);
    return data as CommunicationLog[];
};

export default {
    createLog,
    getLogsByTenantId
};