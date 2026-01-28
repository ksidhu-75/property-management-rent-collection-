import db from './db';

const initDb = () => {
    try {
        // Create Tenants Table
        db.prepare(`
            CREATE TABLE IF NOT EXISTS tenants (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                full_name TEXT NOT NULL,
                email TEXT,
                phone_number TEXT,
                property_name TEXT NOT NULL,
                unit_number TEXT NOT NULL,
                monthly_rent REAL NOT NULL,
                rent_due_day INTEGER NOT NULL,
                lease_start_date TEXT,
                lease_end_date TEXT,
                preferred_contact_method TEXT DEFAULT 'EMAIL',
                opted_out INTEGER DEFAULT 0,
                last_payment_date TEXT,
                last_payment_amount REAL,
                balance_owing REAL DEFAULT 0,
                status TEXT DEFAULT 'PAID',
                last_message_sent TEXT,
                reminder_stage TEXT DEFAULT 'PRE_DUE',
                notes TEXT
            )
        `).run();

        // Create Communication Logs Table
        db.prepare(`
            CREATE TABLE IF NOT EXISTS communication_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tenant_id INTEGER NOT NULL,
                timestamp TEXT NOT NULL,
                channel TEXT NOT NULL,
                message_type TEXT NOT NULL,
                status TEXT NOT NULL,
                content TEXT,
                FOREIGN KEY (tenant_id) REFERENCES tenants (id)
            )
        `).run();

        console.log('Database initialized successfully.');
    } catch (error) {
        console.error('Database initialization failed:', error);
        throw error;
    }
};

export { initDb };