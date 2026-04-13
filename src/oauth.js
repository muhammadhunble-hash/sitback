/**
 * Exchanges the temporary Slack OAuth code for a permanent User Token
 * and generates a unique Sitback Secret for simplified setup.
 */
export async function exchangeCodeForToken(code, env) {
    const url = 'https://slack.com/api/oauth.v2.access';
    const body = new URLSearchParams();
    body.append('client_id', env.SLACK_CLIENT_ID);
    body.append('client_secret', env.SLACK_CLIENT_SECRET);
    body.append('code', code);
    body.append('redirect_uri', env.SLACK_REDIRECT_URI);

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body.toString()
    });

    const data = await response.json();
    if (!data.ok) {
        console.error('Slack OAuth Error:', data.error);
        throw new Error(data.error);
    }

    const userId = data.authed_user.id;
    const slackToken = data.authed_user.access_token;

    // Generate a unique Sitback Secret for this user
    // We use a prefix 'sb_' to make it recognizable
    const sitbackSecret = `sb_${crypto.randomUUID().replace(/-/g, '')}`;

    return {
        userId,
        slackToken,
        sitbackSecret
    };
}

/**
 * Saves tokens and secrets to KV storage
 */
export async function saveUserSession(userId, slackToken, sitbackSecret, kv) {
    // 1. Map Secret -> UserID
    await kv.put(`secret:${sitbackSecret}`, userId);
    
    // 2. Map UserID -> SlackToken
    await kv.put(`token:${userId}`, slackToken);

    // 3. Store the Secret for the user so we can show it on the setup page if they return
    await kv.put(`user_secret:${userId}`, sitbackSecret);
}
