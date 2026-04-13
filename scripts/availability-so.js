const { slackClient } = require('../slack');
const fs = require('fs');
const path = require('path');

const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    green: "\x1b[32m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    red: "\x1b[31m",
    yellow: "\x1b[33m"
};

const STATE_FILE = path.join(__dirname, '../state.json');
const CHANNEL_NAME = 'availability';
const CHANNEL_ID = 'CAP8WL9EZ';

function getTodayStr() {
    return new Date().toISOString().split('T')[0];
}

async function signOff() {
    console.log(`\n${colors.bright}${colors.magenta}Sitback: Sign-off Flow (SO)${colors.reset}`);

    const today = getTodayStr();
    let state = {};

    // 1. Load state
    if (fs.existsSync(STATE_FILE)) {
        try {
            state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
        } catch (e) {
            console.error(`${colors.red}✖ Error: State file is corrupt.${colors.reset}\n`);
            process.exit(1);
        }
    } else {
        console.error(`${colors.red}✖ Error: No check-in (WFO) record found.${colors.reset}\n`);
        process.exit(1);
    }

    // 2. Check if WFO exists for today
    if (!state.last_wfo || state.last_wfo.date !== today) {
        console.error(`${colors.red}✖ Error: No WFO message sent today (${today}). Cannot reply to thread.${colors.reset}\n`);
        process.exit(1);
    }

    const threadTs = state.last_wfo.ts;

    // 3. Send message as reply
    console.log(`${colors.blue}🚀 Sending SO as reply to thread: ${colors.reset}${colors.bright}${threadTs}${colors.reset}`);

    try {
        const result = await slackClient.chat.postMessage({
            channel: CHANNEL_ID,
            text: "SO",
            thread_ts: threadTs
        });

        console.log(`${colors.green}✔ Sign-off complete! Sent as thread reply.${colors.reset}\n`);
    } catch (error) {
        console.error(`${colors.red}✖ Error during sign-off:${colors.reset} ${error.message || error}\n`);
        process.exit(1);
    }
}

signOff();
