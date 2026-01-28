import db from '../database/db';

export interface CommunicationLog {
    id?: number;
    tenant_id: number;
    timestamp: string;
    channel: 'EMAIL' | 'SMS';
    message_type: 'PRE_DUE' | 'DUE' | 'LATE_1' | 'LATE_2' | 'FINAL';
    status: 'SENT' | 'FAILED';
    content: string;
}

const createLog = (log: CommunicationLog) => {
    const stmt = db.prepare(`
        INSERT INTO communication_logs (
            tenant_id, timestamp, channel, message_type, status, content
        ) VALUES (
            @tenant_id, @timestamp, @channel, @message_type, @status, @content
        )
    `);
    stmt.run(log);
};

const getLogsByTenantId = (tenantId: number): CommunicationLog[] => {
    return db.prepare('SELECT * FROM communication_logs WHERE tenant_id = ? ORDER BY timestamp DESC').all(tenantId) as CommunicationLog[];
};

export default {
    createLog,
    getLogsByTenantId
};