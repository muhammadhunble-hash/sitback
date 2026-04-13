# Sitback: Slack Workflow Automation 🚀

A collection of lightweight, standalone scripts designed to automate your Slack workflows with ease.

## 🛠 Features

- **Direct Flows**: Run automation directly from your terminal.
- **User Proxy**: Send messages and interact on your behalf using a User Token.
- **Premium CLI**: Beautifully formatted terminal output with ANSI colors.
- **Lightweight**: Zero-server overhead; execute scripts only when needed.

## 🚀 Getting Started

### 1. Installation
Install the necessary dependencies:
```bash
npm install
```

### 2. Configuration
The project uses a `.env` file for configuration. (Pre-configured for you).
```env
SLACK_USER_TOKEN=xoxp-...
DEFAULT_CHANNEL_ID=C07KKCSHGPJ
```

## 🏗 Available Workflows

### 📬 Send Message
Sends a stylized message to a channel on your behalf. Supports IDs or human-readable names via `channels.json`.
```bash
# Using positional arguments
npm run send -- "Hello from Sitback! 🚀" "general"

# Using explicit flags
npm run send -- --text "Hello" --channel "general"
```

### 🏢 Office Availability Workflow
Designed to be triggered by macOS Shortcuts (e.g., when connecting to office Wi-Fi or shutting down).

#### ☀️ Morning Check-in (WFO)
Sends "WFO" to the `availability` channel. It automatically prevents duplicate messages if run multiple times in one day.
```bash
npm run wfo
```

#### 🌙 Evening Sign-off (SO)
Replies "SO" to the thread of your morning "WFO" message.
```bash
npm run so
```

### 📜 Get History
Fetches recent activity from a specific channel.
```bash
# Get last 5 messages from default channel
npm run history

# Get last 10 messages from a specific channel
npm run history -- "CHANNEL_ID" 10
```

## 🗺 Channel Mapping
Since the project currently lacks `conversations.list` scope, you can manage your own channel nicknames in `channels.json`:
```json
{
    "general": "C07KKCSHGPJ",
    "availability": "CAP8WL9EZ",
    "abdullah-farewell": "C07KKCSHGPJ"
}
```

## 📂 Project Structure

- `scripts/`: Standalone workflow scripts.
- `slack.js`: Centralized Slack client initialization.
- `.env`: (Ignored by Git) Your sensitive credentials.
- `package.json`: Script definitions and dependencies.
- `state.json`: (Local only) Tracks daily workflow state for threading.

---
*Created with ❤️ by Sitback Automation*
