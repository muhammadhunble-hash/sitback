const { WebClient } = require('@slack/web-api');
require('dotenv').config();

const token = process.env.SLACK_USER_TOKEN;

if (!token) {
    console.error('Error: SLACK_USER_TOKEN is not defined in .env file');
}

const slackClient = new WebClient(token);

module.exports = {
    slackClient,
    defaultChannel: process.env.DEFAULT_CHANNEL_ID
};
