import logRepository, { CommunicationLog } from '../repositories/logRepository';

const sendEmail = (to: string, subject: string, body: string, tenantId: number, type: CommunicationLog['message_type']) => {
    console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject} | Body: ${body}`);

    // Log success
    logRepository.createLog({
        tenant_id: tenantId,
        timestamp: new Date().toISOString(),
        channel: 'EMAIL',
        message_type: type,
        status: 'SENT',
        content: `Subject: ${subject}\nBody: ${body}`
    });
};

const sendSMS = (to: string, message: string, tenantId: number, type: CommunicationLog['message_type']) => {
    console.log(`[MOCK SMS] To: ${to} | Message: ${message}`);

    // Log success
    logRepository.createLog({
        tenant_id: tenantId,
        timestamp: new Date().toISOString(),
        channel: 'SMS',
        message_type: type,
        status: 'SENT',
        content: message
    });
};

export default {
    sendEmail,
    sendSMS
};