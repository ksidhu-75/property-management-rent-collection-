/**
 * Date helper utilities for workflow calculations
 * Fixes month boundary issues and provides consistent date logic
 */

/**
 * Check if two dates are the same calendar day
 */
export function isSameDay(d1: Date, d2: Date): boolean {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
}

/**
 * Get the number of days until the next occurrence of a specific day of the month
 * Handles month boundaries correctly (e.g., due day 31 in February)
 * 
 * @param dueDay - Day of month (1-31) when rent is due
 * @param today - Reference date (defaults to now)
 * @returns Number of days until next due date (0 if today is due day)
 */
export function getDaysUntilDue(dueDay: number, today: Date = new Date()): number {
    // Normalize today to start of day for consistent calculations
    const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // Try current month first
    let nextDueDate = new Date(todayNormalized.getFullYear(), todayNormalized.getMonth(), dueDay);

    // If the due date doesn't exist in this month (e.g., Feb 31), Date rolls forward
    // We need to check if the resulting date is actually in the desired month
    if (nextDueDate.getDate() !== dueDay || nextDueDate.getMonth() !== todayNormalized.getMonth()) {
        // Due day doesn't exist in current month, use last day of month
        nextDueDate = new Date(todayNormalized.getFullYear(), todayNormalized.getMonth() + 1, 0);
    }

    // If due date already passed this month, get next month's due date
    if (nextDueDate < todayNormalized) {
        nextDueDate = new Date(todayNormalized.getFullYear(), todayNormalized.getMonth() + 1, dueDay);

        // Check if due day exists in next month
        if (nextDueDate.getDate() !== dueDay) {
            // Use last day of next month
            nextDueDate = new Date(todayNormalized.getFullYear(), todayNormalized.getMonth() + 2, 0);
        }
    }

    // Calculate difference in days
    const diffTime = nextDueDate.getTime() - todayNormalized.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Get the number of days since the last occurrence of a specific day of the month
 * Used for calculating late payment days
 * 
 * @param dueDay - Day of month (1-31) when rent was due
 * @param today - Reference date (defaults to now)
 * @returns Number of days since last due date (0 if today is due day)
 */
export function getDaysPastDue(dueDay: number, today: Date = new Date()): number {
    // Normalize today to start of day
    const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // Try current month first
    let lastDueDate = new Date(todayNormalized.getFullYear(), todayNormalized.getMonth(), dueDay);

    // Handle invalid dates (e.g., Feb 31)
    if (lastDueDate.getDate() !== dueDay || lastDueDate.getMonth() !== todayNormalized.getMonth()) {
        // Due day doesn't exist in current month, use last day of month
        lastDueDate = new Date(todayNormalized.getFullYear(), todayNormalized.getMonth() + 1, 0);
    }

    // If due date is in the future this month, get previous month's due date
    if (lastDueDate > todayNormalized) {
        lastDueDate = new Date(todayNormalized.getFullYear(), todayNormalized.getMonth() - 1, dueDay);

        // Check if due day exists in previous month
        if (lastDueDate.getDate() !== dueDay) {
            // Use last day of previous month
            lastDueDate = new Date(todayNormalized.getFullYear(), todayNormalized.getMonth(), 0);
        }
    }

    // Calculate difference in days
    const diffTime = todayNormalized.getTime() - lastDueDate.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check if a number is within a range (inclusive)
 */
export function isWithinRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
}

/**
 * Get a date string in ISO format (YYYY-MM-DD)
 */
export function toISODateString(date: Date = new Date()): string {
    return date.toISOString().split('T')[0];
}

/**
 * Get current timestamp in ISO format
 */
export function getCurrentTimestamp(): string {
    return new Date().toISOString();
}