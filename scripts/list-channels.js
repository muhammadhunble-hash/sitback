const { slackClient } = require('../slack');

const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    red: "\x1b[31m"
};

async function listChannels() {
    console.log(`\n${colors.bright}${colors.magenta}Sitback: Fetching Channels & Groups${colors.reset}`);

    try {
        const result = await slackClient.conversations.list({
            types: 'public_channel,private_channel',
            limit: 100
        });

        console.log(`${colors.blue}Available Channels:${colors.reset}\n`);
        
        result.channels.forEach(channel => {
            const prefix = channel.is_private ? '🔒' : '🌐';
            console.log(`${prefix} ${colors.bright}${channel.name.padEnd(20)}${colors.reset} ID: ${colors.cyan}${channel.id}${colors.reset}`);
        });
        console.log('');
    } catch (error) {
        console.error(`${colors.red}✖ Error fetching channels:${colors.reset} ${error.message || error}\n`);
    }
}

listChannels();
