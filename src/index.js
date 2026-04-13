import { Hono } from 'hono';
import { findTodayMessage, postMessage } from './slack';
import { exchangeCodeForToken, saveUserToken, isUserAuthorized, authorizeUser } from './oauth';
import { landingPage, setupPage } from './landing';


const app = new Hono();

/**
 * Middleware: Admin Only (using existing API_KEY)
 */
const adminOnly = async (c, next) => {
    const key = c.req.header('X-API-Key');
    if (!key || key !== c.env.API_KEY) {
        return c.json({ error: 'Unauthorized: Admin key required' }, 401);
    }
    await next();
};

/**
 * Middleware: Invite-only Check
 * All workflow requests must provide X-User-ID and be authorized
 */
const inviteOnly = async (c, next) => {
    // Skip health, auth, setup, and admin routes
    if (['/health', '/auth', '/', '/auth/callback', '/admin/invite', '/setup'].includes(c.req.path)) return await next();


    const userId = c.req.header('X-User-ID');

    if (!userId) return c.json({ error: 'Missing X-User-ID header' }, 400);

    // 1. Check if authorized (Invite list)
    const authorized = await isUserAuthorized(userId, c.env.SITBACK_STORAGE);
    if (!authorized) {
        return c.json({ error: 'Forbidden: You have not been invited to Sitback.' }, 403);
    }

    // 2. check if token exists
    const token = await c.env.SITBACK_STORAGE.get(`token:${userId}`);
    if (!token) {
        return c.json({ error: 'Token missing: Please visit the landing page to authorize your account.' }, 401);
    }

    c.set('userToken', token);
    c.set('userId', userId);
    await next();
};

app.use('*', inviteOnly);

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
        const { userId, userToken } = await exchangeCodeForToken(code, c.env);
        
        // Save the token to KV
        await saveUserToken(userId, userToken, c.env.SITBACK_STORAGE);

        return c.html(`
            <div style="font-family: sans-serif; text-align: center; padding: 50px; background: #0a0a0f; color: #f8fafc; height: 100vh;">
                <h1 style="color: #6366f1;">Success! 🎉</h1>
                <p>Sitback is now connected to your Slack account.</p>
                <p>Your User ID is: <code>${userId}</code></p>
                <div style="margin-top: 30px;">
                    <a href="/setup?userId=${userId}" style="background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">View Setup Instructions</a>
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
app.get('/setup', (c) => {
    const userId = c.req.query('userId');
    if (!userId) return c.redirect('/');
    return c.html(setupPage(userId));
});


/**
 * Admin: Invite a Friend
 * POST /admin/invite
 * Header: X-API-Key (Admin)
 */
app.post('/admin/invite', adminOnly, async (c) => {
    const { userId } = await c.req.json();
    if (!userId) return c.json({ error: 'Missing userId in body' }, 400);

    await authorizeUser(userId, c.env.SITBACK_STORAGE);
    return c.json({ success: true, message: `User ${userId} invited successfully.` });
});

/**
 * Workflow: WFO
 * POST /wfo
 */
app.post('/wfo', async (c) => {
    try {
        const token = c.get('userToken');
        const channel = c.env.AVAILABILITY_CHANNEL;

        const existing = await findTodayMessage(channel, 'WFO', token);
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
        const channel = c.env.AVAILABILITY_CHANNEL;

        const wfoMessage = await findTodayMessage(channel, 'WFO', token);
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
