/**
 * Exchanges the temporary Slack OAuth code for a permanent User Token
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

    // Return the user ID and their specific user token
    return {
        userId: data.authed_user.id,
        userToken: data.authed_user.access_token
    };
}

/**
 * Saves a user token to KV storage
 */
export async function saveUserToken(userId, token, kv) {
    await kv.put(`token:${userId}`, token);
}

/**
 * Checks if a user is in the authorized (invite-only) list
 */
export async function isUserAuthorized(userId, kv) {
    const auth = await kv.get(`auth:${userId}`);
    return auth === 'true';
}

/**
 * Authorizes a user (Admin only)
 */
export async function authorizeUser(userId, kv) {
    await kv.put(`auth:${userId}`, 'true');
}
