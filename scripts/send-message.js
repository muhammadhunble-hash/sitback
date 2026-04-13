const { slackClient, defaultChannel } = require('../slack');
const fs = require('fs');
const path = require('path');

// ANSI Colors for premium feel
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

function getChannelId(input) {
    const mappingPath = path.join(__dirname, '../channels.json');
    let channelId = input;

    // 1. Try to load from mapping file
    try {
        if (fs.existsSync(mappingPath)) {
            const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
            if (mapping[input]) {
                console.log(`${colors.cyan}ℹ Resolved name "${input}" to ID: ${mapping[input]}${colors.reset}`);
                channelId = mapping[input];
            }
        }
    } catch (e) {
        console.error(`${colors.yellow}⚠️ Warning: Could not read channels.json mapping${colors.reset}`);
    }

    return channelId;
}

async function sendMessage() {
    const args = process.argv.slice(2);
    let text = '';
    let target = defaultChannel;

    // Simple arg parsing
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--text' || args[i] === '-t') text = args[++i];
        else if (args[i] === '--channel' || args[i] === '-c') target = args[++i];
        else if (!text) text = args[i]; // Fallback to positional
        else if (target === defaultChannel) target = args[i];
    }

    if (!text) {
        console.log(`\n${colors.bright}${colors.magenta}Sitback Automation${colors.reset}`);
        console.error(`${colors.red}Usage:${colors.reset}`);
        console.log(`  node scripts/send-message.js "message" [channel_or_name]`);
        console.log(`  node scripts/send-message.js --text "message" --channel "name"\n`);
        process.exit(1);
    }

    const channelId = getChannelId(target);

    console.log(`\n${colors.blue}🚀 Dispatching message to:${colors.reset} ${colors.bright}${target}${colors.reset} (${channelId})`);

    try {
        const result = await slackClient.chat.postMessage({
            channel: channelId,
            text: text
        });

        console.log(`${colors.green}✔ Message sent successfully!${colors.reset}`);
        console.log(`${colors.cyan}ID:${colors.reset} ${result.ts}\n`);
    } catch (error) {
        console.error(`\n${colors.red}✖ Error sending message:${colors.reset} ${error.message || error}\n`);
        process.exit(1);
    }
}

sendMessage();


