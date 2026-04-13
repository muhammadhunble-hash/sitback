const { slackClient, defaultChannel } = require('../slack');

const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    blue: "\x1b[34m",
    green: "\x1b[32m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    red: "\x1b[31m"
};

async function getHistory() {
    const args = process.argv.slice(2);
    const channelId = args[0] || defaultChannel;
    const limit = parseInt(args[1]) || 5;

    console.log(`\n${colors.bright}${colors.magenta}Sitback: Recent Activity${colors.reset}`);
    console.log(`${colors.blue}Fetching last ${limit} messages from:${colors.reset} ${colors.bright}${channelId}${colors.reset}\n`);

    try {
        const result = await slackClient.conversations.history({
            channel: channelId,
            limit: limit
        });

        result.messages.reverse().forEach(msg => {
            const time = new Date(parseFloat(msg.ts) * 1000).toLocaleTimeString();
            console.log(`[${colors.cyan}${time}${colors.reset}] ${colors.bright}${msg.user || 'System'}:${colors.reset} ${msg.text}`);
        });
        console.log('');
    } catch (error) {
        console.error(`${colors.red}✖ Error fetching history:${colors.reset} ${error.message || error}\n`);
    }
}

getHistory();
