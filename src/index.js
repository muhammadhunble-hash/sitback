import { Hono } from 'hono';
import { findTodayMessage, postMessage } from './slack';
import { exchangeCodeForToken, saveUserSession } from './oauth';
import { landingPage, setupPage } from './landing';

const app = new Hono();

/**
 * Middleware: Identity & Auth
 * Resolves the user's session from a single 'Sitback Secret'
 */
const resolveIdentity = async (c, next) => {
    // Skip health, auth, setup, and root routes
    if (['/health', '/auth', '/', '/auth/callback', '/setup'].includes(c.req.path)) return await next();

    // 1. Get the Sitback Secret from query param (?t=) or header
    const secret = c.req.query('t') || c.req.header('X-Sitback-Token') || c.req.header('X-API-Key'); 
    
    if (!secret) {
        return c.json({ error: 'Missing token. Please use ?t=YOUR_SECRET in the URL.' }, 401);
    }

    // 2. Resolve UserId from Secret
    // Note: We also check the old API_KEY system as a fallback for the admin
    let userId;
    if (secret === c.env.API_KEY) {
        // Legacy/Admin fallback: Requires X-User-ID header
        userId = c.req.header('X-User-ID');
        if (!userId) return c.json({ error: 'Admin key used but X-User-ID is missing.' }, 400);
    } else {
        userId = await c.env.SITBACK_STORAGE.get(`secret:${secret}`);
    }

    if (!userId) {
        return c.json({ error: 'Invalid token. Please re-authorize on the landing page.' }, 403);
    }

    // 3. Resolve Slack Token from UserId
    const token = await c.env.SITBACK_STORAGE.get(`token:${userId}`);
    if (!token) {
        return c.json({ error: 'Session expired. Please re-authorize on the landing page.' }, 401);
    }

    c.set('userToken', token);
    c.set('userId', userId);
    await next();
};

app.use('*', resolveIdentity);

/**
 * Landing Page
 */
app.get('/', (c) => {
    return c.html(landingPage(c.env.SLACK_CLIENT_ID, c.env.SLACK_REDIRECT_URI));
});

/**
 * OAuth Callback
 */
app.get('/auth/callback', async (c) => {
    const code = c.req.query('code');
    if (!code) return c.text('Error: No code provided from Slack', 400);

    try {
        const { userId, slackToken, sitbackSecret } = await exchangeCodeForToken(code, c.env);
        
        // Save the session
        await saveUserSession(userId, slackToken, sitbackSecret, c.env.SITBACK_STORAGE);

        return c.html(`
            <div style="font-family: sans-serif; text-align: center; padding: 50px; background: #0a0a0f; color: #f8fafc; height: 100vh;">
                <h1 style="color: #6366f1;">Success! 🎉</h1>
                <p>Sitback is now connected to your Slack account.</p>
                <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid rgba(255,255,255,0.1);">
                    <p style="margin: 0 0 10px; font-size: 0.9rem; color: #94a3b8;">Your Secret Token:</p>
                    <code style="font-size: 1.2rem; color: #818cf8; word-break: break-all;">${sitbackSecret}</code>
                </div>
                <div style="margin-top: 30px;">
                    <a href="/setup?t=${sitbackSecret}" style="background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">View Setup Guide</a>
                </div>
            </div>
        `);
    } catch (error) {
        return c.text(`Auth Error: ${error.message}`, 500);
    }
});

/**
 * Setup Instructions Page
 */
app.get('/setup', async (c) => {
    let secret = c.req.query('t');
    let userId = c.req.query('userId');

    // If we have a secret but no userId, resolve it for the UI
    if (secret && !userId) {
        userId = await c.env.SITBACK_STORAGE.get(`secret:${secret}`);
    }

    return c.html(setupPage(userId, secret));
});

/**
 * Workflow: WFO
 * POST /wfo
 */
app.post('/wfo', async (c) => {
    try {
        const token = c.get('userToken');
        const userId = c.get('userId');
        const channel = c.env.AVAILABILITY_CHANNEL;

        const existing = await findTodayMessage(channel, 'WFO', token, userId);
        if (existing) {

            return c.json({ success: true, message: 'WFO already sent', already_sent: true });
        }

        const result = await postMessage(channel, 'WFO', token);
        return c.json({ success: true, ts: result.ts });
    } catch (error) {
        return c.json({ error: error.message }, 500);
    }
});

/**
 * Workflow: SO
 * POST /so
 */
app.post('/so', async (c) => {
    try {
        const token = c.get('userToken');
        const userId = c.get('userId');
        const channel = c.env.AVAILABILITY_CHANNEL;

        const wfoMessage = await findTodayMessage(channel, 'WFO', token, userId);
        if (!wfoMessage) {

            return c.json({ error: 'No WFO found today' }, 404);
        }

        const result = await postMessage(channel, 'SO', token, wfoMessage.ts);
        return c.json({ success: true, ts: result.ts });
    } catch (error) {
        return c.json({ error: error.message }, 500);
    }
});

app.get('/health', (c) => c.json({ status: 'ok' }));

export default app;
