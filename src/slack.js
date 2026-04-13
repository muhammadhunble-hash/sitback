/**
 * Gets the start of today as a Unix timestamp
 */
function getStartOfToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.floor(today.getTime() / 1000).toString();
}

/**
 * Base function for Slack API calls using Fetch
 */
async function slackApi(method, body, token) {
    const response = await fetch(`https://slack.com/api/${method}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
    });

    const data = await response.json();
    if (!data.ok) throw new Error(data.error);
    return data;
}

/**
 * Searches channel history for today's messages
 */
async function findTodayMessage(channelId, searchText, token) {
    const oldest = getStartOfToday();
    
    // Note: conversations.history is a GET request usually, 
    // but Slack supports POST with JSON for consistency in some methods.
    // However, history is best as GET or URLSearchParams for reliability.
    const url = new URL('https://slack.com/api/conversations.history');
    url.searchParams.append('channel', channelId);
    url.searchParams.append('oldest', oldest);
    url.searchParams.append('limit', '100');

    const response = await fetch(url.toString(), {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();
    if (!data.ok) throw new Error(data.error);

    const match = data.messages.find(m => m.text && m.text.includes(searchText));
    return match ? { ts: match.ts, text: match.text } : null;
}

/**
 * Sends a message
 */
async function postMessage(channelId, text, token, threadTs = null) {
    const body = {
        channel: channelId,
        text: text
    };
    if (threadTs) body.thread_ts = threadTs;

    return await slackApi('chat.postMessage', body, token);
}

export {
    findTodayMessage,
    postMessage,
    getStartOfToday
};
