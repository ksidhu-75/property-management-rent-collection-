// Initialize Check (No local DB needed)
console.log('Server starting...');

// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', database: 'supabase' });
});

// Mount tenant routes
app.use('/api/tenants', tenantRoutes);

// Manual Trigger Route
app.post('/api/trigger-daily', async (req, res) => {
    try {
        await workflowEngine.runDailyCheck();
        res.json({ message: 'Daily check triggered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to run daily check' });
    }
});

// Logs Route
app.get('/api/logs/:tenantId', async (req, res) => {
    try {
        const logs = await logRepository.getLogsByTenantId(Number(req.params.tenantId));
        res.json(logs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
});