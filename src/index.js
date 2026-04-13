import { Hono } from 'hono';
import { findTodayMessage, postMessage } from './slack';

const app = new Hono();

// Middleware: API Key Authorization
app.use('*', async (c, next) => {
    // Skip health check
    if (c.req.path === '/health') return await next();

    const apiKey = c.req.header('X-API-Key');
    if (!apiKey || apiKey !== c.env.API_KEY) {
        return c.json({ error: 'Unauthorized: Invalid or missing API key' }, 401);
    }
    await next();
});

/**
 * Endpoint to trigger WFO (Start Work)
 * POST /wfo
 */
app.post('/wfo', async (c) => {
    try {
        const token = c.env.SLACK_USER_TOKEN;
        const channel = c.env.AVAILABILITY_CHANNEL;

        // 1. Check if already sent today
        const existing = await findTodayMessage(channel, 'WFO', token);
        if (existing) {
            return c.json({ 
                success: true, 
                message: 'WFO already sent today', 
                ts: existing.ts,
                already_sent: true 
            });
        }

        // 2. Send WFO
        const result = await postMessage(channel, 'WFO', token);

        return c.json({
            success: true,
            message: 'WFO sent',
            ts: result.ts
        });
    } catch (error) {
        console.error('Error in /wfo:', error);
        return c.json({ error: error.message }, 500);
    }
});

/**
 * Endpoint to trigger SO (Sign Off)
 * POST /so
 */
app.post('/so', async (c) => {
    try {
        const token = c.env.SLACK_USER_TOKEN;
        const channel = c.env.AVAILABILITY_CHANNEL;

        // 1. Find today's WFO message to thread
        const wfoMessage = await findTodayMessage(channel, 'WFO', token);
        if (!wfoMessage) {
            return c.json({ error: 'No WFO message found for today. Cannot reply with SO.' }, 404);
        }

        // 2. Send SO as reply
        const result = await postMessage(channel, 'SO', token, wfoMessage.ts);

        return c.json({
            success: true,
            message: 'SO sent as reply',
            ts: result.ts
        });
    } catch (error) {
        console.error('Error in /so:', error);
        return c.json({ error: error.message }, 500);
    }
});

/**
 * Health Check
 */
app.get('/health', (c) => {
    return c.json({ status: 'ok', worker: 'sitback-worker' });
});

export default app;
