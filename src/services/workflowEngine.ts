import tenantService from './tenantService';
import communicationService from './communicationService';
import tenantRepository from '../repositories/tenantRepository';
import { Tenant, ReminderStage } from '../types/tenant.types';
import { getDaysUntilDue, getDaysPastDue, isSameDay, getCurrentTimestamp } from '../utils/dateHelpers';

/**
 * Workflow Engine - Automated rent reminder system
 * 
 * Workflow Logic:
 * 1. Fetch all active tenants
 * 2. Calculate Days_Until_Due and Days_Past_Due using date helpers
 * 3. Evaluate reminder conditions based on balance and days
 * 4. Send appropriate messages and update tenant state
 * 
 * Reminder Stages:
 * - PRE_DUE: 3-5 days before due date
 * - DUE: On the due date
 * - LATE_1: 3-5 days after due date
 * - LATE_2: 7-10 days after due date
 * - FINAL: 14+ days after due date
 */

/**
 * Main entry point - runs daily check for all tenants
 * Called by server.ts via POST /api/trigger-daily
 */
const runDailyCheck = (): void => {
    console.log('[Workflow] Starting Daily Check...');
    const tenants = tenantService.getAllTenants();
    const today = new Date();

    tenants.forEach((tenant) => {
        try {
            evaluateTenant(tenant, today);
        } catch (error) {
            console.error(`[Workflow] Error processing tenant ${tenant.id}:`, error);
        }
    });
    console.log('[Workflow] Daily Check Completed.');
};

/**
 * Evaluate a single tenant and send appropriate reminder
 * Uses date helpers to fix month boundary bugs
 */
const evaluateTenant = (tenant: Tenant, today: Date): void => {
    // 1. Check Ignore Conditions
    if (tenant.opted_out) {
        console.log(`[Workflow] Skipped Tenant ${tenant.id}: Opted Out`);
        return;
    }

    if (tenant.lease_end_date) {
        const leaseEnd = new Date(tenant.lease_end_date);
        if (leaseEnd < today) {
            console.log(`[Workflow] Skipped Tenant ${tenant.id}: Lease Ended`);
            return;
        }
    }

    // 2. Check "One message per day" rule
    if (tenant.last_message_sent) {
        const lastSent = new Date(tenant.last_message_sent);
        if (isSameDay(lastSent, today)) {
            console.log(`[Workflow] Skipped Tenant ${tenant.id}: Already messaged today`);
            return;
        }
    }

    // 3. Calculate days using date helpers (fixes month boundary bugs)
    const daysUntilDue = getDaysUntilDue(tenant.rent_due_day, today);
    const daysPastDue = getDaysPastDue(tenant.rent_due_day, today);

    // 4. Evaluate Pre-Due Reminders
    // Condition: Balance >= Monthly Rent AND (3 or 5 days before due)
    if ((daysUntilDue === 3 || daysUntilDue === 5) && tenant.balance_owing >= tenant.monthly_rent) {
        sendMessage(tenant, 'PRE_DUE', `Reminder: Your rent is due in ${daysUntilDue} days.`);
        return;
    }

    // 5. Evaluate Due Date Reminder
    // Condition: Due date is today AND Balance >= Monthly Rent
    if (daysUntilDue === 0 && tenant.balance_owing >= tenant.monthly_rent) {
        sendMessage(tenant, 'DUE', `Heads up! Your rent is due today.`);
        return;
    }

    // 6. Evaluate Late Reminders (only if balance > 0)
    if (tenant.balance_owing > 0) {
        // Late Stage 1: 3 or 5 days past due
        if (daysPastDue === 3 || daysPastDue === 5) {
            sendMessage(tenant, 'LATE_1', `We noticed we haven't received your rent payment yet.`);
            return;
        }

        // Late Stage 2: 7 or 10 days past due
        if (daysPastDue === 7 || daysPastDue === 10) {
            sendMessage(tenant, 'LATE_2', `URGENT: Your rent is now ${daysPastDue} days overdue.`);
            return;
        }

        // Final Notice: 14+ days past due (only send once)
        if (daysPastDue >= 14 && tenant.reminder_stage !== 'FINAL') {
            sendMessage(tenant, 'FINAL', `FINAL NOTICE: Your rent is significantly overdue.`);
            return;
        }
    }
};

/**
 * Send message via preferred communication method and update tenant state
 */
const sendMessage = (tenant: Tenant, stage: ReminderStage, content: string): void => {
    console.log(`[Workflow] Sending ${stage} to Tenant ${tenant.id}...`);

    // Send via email if preferred
    if (tenant.preferred_contact_method === 'EMAIL' || tenant.preferred_contact_method === 'BOTH') {
        communicationService.sendEmail(
            tenant.email,
            `Rent Notification: ${stage}`,
            content,
            tenant.id!,
            stage
        );
    }

    // Send via SMS if preferred
    if (tenant.preferred_contact_method === 'SMS' || tenant.preferred_contact_method === 'BOTH') {
        communicationService.sendSMS(
            tenant.phone_number,
            content,
            tenant.id!,
            stage
        );
    }

    // Update tenant state with timestamp and stage
    tenantRepository.updateTenant(tenant.id!, {
        last_message_sent: getCurrentTimestamp(),
        reminder_stage: stage
    });
};

export default {
    runDailyCheck
};