# Sitback | Multi-User Slack Automation 🚀

A high-performance, stateless **Cloudflare Worker** designed for you and your friends to automate Slack availability flows.

## 🛠 Features

- **Multi-User Support**: Every user gets their own secure token via Slack OAuth.
- **Invite Only**: Only users added by the administrator can access the workflows.
- **Premium Landing Page**: A sleek interface for your friends to connect their Slack accounts.
- **Stateless Reliability**: Powered by Slack history lookup for accurate threading.

## 🚀 Administrator Setup

### 1. Slack App Configuration
1.  Go to your **Slack App Dashboard**.
2.  Enable **OAuth & Permissions**.
3.  Add the **Redirect URL**: `https://sitback-worker.your-subdomain.workers.dev/auth/callback`.
4.  Add the following **User Token Scopes**:
    - `chat:write`
    - `channels:history`
    - `groups:history`
    - `users:read`

### 2. Set API Secrets
Run these commands to authorize the worker:
```bash
npx wrangler secret put SLACK_CLIENT_ID
npx wrangler secret put SLACK_CLIENT_SECRET
npx wrangler secret put API_KEY # Your admin/security key
```

### 3. Deploy
```bash
npx wrangler deploy
```

## 👥 Inviting Friends

To allow a friend to use the system:
1.  **Get their Slack User ID** (available in their Slack profile).
2.  **Authorize them** using the Admin API:
    ```bash
    curl -X POST https://sitback-worker.<subdomain>.workers.dev/admin/invite \
      -H "X-API-Key: <your_admin_key>" \
      -d '{"userId": "U12345"}'
    ```
3.  **Send them the link**: `https://sitback-worker.<subdomain>.workers.dev/` to connect their account.

## 🏗 API Specification

All workflow requests must include the header: `X-User-ID: <their_slack_id>`.

### ☀️ Morning Check-in (WFO)
`POST /wfo`
### 🌙 Evening Sign-off (SO)
`POST /so`

---
*Created with ❤️ by Sitback Automation*
