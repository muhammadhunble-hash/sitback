# Sitback: Slack Workflow Worker ☁️

A high-performance, stateless **Cloudflare Worker** designed to automate your Slack workflows with the **Hono** framework.

## 🛠 Features

- **Stateless Reliability**: Automatically searches Slack history for "today's" messages to manage threading and prevent duplicates.
- **Lightning Fast**: Powered by Cloudflare's edge network and the Fetch API.
- **Secure Access**: All endpoints are protected by an `X-API-Key`.
- **WFO/SO Automation**: Trigger your availability flows remotely via HTTP.

## 🚀 Deployment (Cloudflare Workers)

1. **Install Wrangler CLI** and login:
   ```bash
   npx wrangler login
   ```

2. **Configure Secrets**:
   Set your Slack token and API key as encrypted secrets:
   ```bash
   npx wrangler secret put SLACK_USER_TOKEN
   npx wrangler secret put API_KEY
   ```

3. **Deploy**:
   ```bash
   npx wrangler deploy
   ```

## 🏗 API Specification

All requests must include the header: `X-API-Key: <your_key>`

### ☀️ Morning Check-in (WFO)
`POST /wfo`
- Checks if "WFO" was already sent today.
- If not, sends "WFO" to the `availability` channel.

### 🌙 Evening Sign-off (SO)
`POST /so`
- Finds today's "WFO" message ID.
- Replies "SO" to that specific thread.

### 💓 Health Check
`GET /health`
- Verifies worker status.

## 🗺 Local Development

1. **Install dependencies**: `npm install`
2. **Start Dev Server**:
   ```bash
   npx wrangler dev
   ```
3. **Trigger via curl**:
   ```bash
   curl -X POST http://localhost:8787/wfo \
     -H "X-API-Key: sitback_secure_key_3139f7d0"
   ```

---
*Created with ❤️ by Sitback Automation*
