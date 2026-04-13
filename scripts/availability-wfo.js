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

async function startWork() {
    console.log(`\n${colors.bright}${colors.magenta}Sitback: Check-in Flow (WFO)${colors.reset}`);

    const today = getTodayStr();
    let state = {};

    // 1. Load state
    if (fs.existsSync(STATE_FILE)) {
        try {
            state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
        } catch (e) {
            console.error(`${colors.yellow}⚠️ Warning: Corrupt state file. Resetting.${colors.reset}`);
        }
    }

    // 2. Check if already sent today
    if (state.last_wfo && state.last_wfo.date === today) {
        console.log(`${colors.yellow}⏩ Skipping: WFO message already sent today (${today}).${colors.reset}\n`);
        return;
    }

    // 3. Send message
    console.log(`${colors.blue}🚀 Sending WFO to ${CHANNEL_NAME}...${colors.reset}`);

    try {
        const result = await slackClient.chat.postMessage({
            channel: CHANNEL_ID,
            text: "WFO"
        });

        // 4. Update state
        state.last_wfo = {
            date: today,
            ts: result.ts
        };
        fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));

        console.log(`${colors.green}✔ Check-in complete!${colors.reset}`);
        console.log(`${colors.cyan}TS:${colors.reset} ${result.ts}\n`);
    } catch (error) {
        console.error(`${colors.red}✖ Error during check-in:${colors.reset} ${error.message || error}\n`);
        process.exit(1);
    }
}

startWork();
