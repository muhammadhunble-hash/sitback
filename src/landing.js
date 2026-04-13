import { html } from 'hono/html';

export const landingPage = (clientId, redirectUri) => html`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sitback | Slack Automation</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg: #0a0a0f;
            --card: #161621;
            --primary: #6366f1;
            --text: #f8fafc;
            --text-dim: #94a3b8;
        }
        body {
            margin: 0;
            padding: 0;
            background: var(--bg);
            color: var(--text);
            font-family: 'Outfit', sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            overflow: hidden;
        }
        .container {
            text-align: center;
            padding: 2.5rem;
            background: var(--card);
            border-radius: 24px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.05);
            max-width: 400px;
            animation: fadeIn 0.8s ease-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        h1 { margin: 0 0 0.5rem; font-weight: 600; font-size: 2.5rem; background: linear-gradient(to right, #818cf8, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        p { color: var(--text-dim); margin-bottom: 2rem; line-height: 1.6; }
        .slack-btn {
            display: inline-flex;
            align-items: center;
            background: #fff;
            color: #000;
            padding: 0.75rem 1.5rem;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.2s;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .slack-btn:hover {
            transform: scale(1.02);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
        }
        .slack-logo { width: 20px; margin-right: 12px; }
        .footer { margin-top: 2rem; font-size: 0.8rem; color: #475569; letter-spacing: 0.05em; text-transform: uppercase; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Sitback</h1>
        <p>Automate your office presence flows with a single tap. Connect your Slack account to get started.</p>
        <a href="https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=chat:write,channels:history,groups:history,users:read&user_scope=chat:write,channels:history,groups:history,users:read&redirect_uri=${redirectUri}" class="slack-btn">
            <img class="slack-logo" src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg" alt="Slack">
            Add to Slack
        </a>
        <div class="footer">Invite Only System</div>
    </div>
</body>
</html>
`;
