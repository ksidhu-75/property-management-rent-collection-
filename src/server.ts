import express from 'express';
import { initDb } from './database/schema';
import tenantRoutes from './routes/tenant.routes';
import workflowEngine from './services/workflowEngine';
import logRepository from './repositories/logRepository';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// CORS Middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Initialize Database on startup
try {
    initDb();
} catch (e) {
    console.error('Failed to init DB:', e);
}

// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Mount tenant routes
app.use('/api/tenants', tenantRoutes);

// Manual Trigger Route
app.post('/api/trigger-daily', (req, res) => {
    try {
        workflowEngine.runDailyCheck();
        res.json({ message: 'Daily check triggered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to run daily check' });
    }
});

// Logs Route
app.get('/api/logs/:tenantId', (req, res) => {
    try {
        const logs = logRepository.getLogsByTenantId(Number(req.params.tenantId));
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
});

// Global error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});