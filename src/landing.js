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
        h1 { margin: 0 0 0.5rem; font-weight: 600; font-size: 2.5rem; background: linear-gradient(to right, #818cf8, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: flex; align-items: center; justify-content: center; gap: 1rem; }
        .app-icon { width: 48px; height: 48px; border-radius: 12px; }
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
        .setup-card { text-align: left; background: var(--card); padding: 2rem; border-radius: 20px; max-width: 600px; margin: 2rem auto; border: 1px solid rgba(255, 255, 255, 0.05); }
        .step { margin-bottom: 1.5rem; }
        .step h3 { color: var(--primary); margin: 0 0 0.5rem; }
        code { background: rgba(255,255,255,0.1); padding: 0.2rem 0.4rem; border-radius: 4px; font-size: 0.9rem; color: #818cf8; }
    </style>
</head>
<body>
    <div class="container">
        <h1><img class="app-icon" src="https://avatars.slack-edge.com/2024-11-16/8026632865095_e660869731e137db6b56_192.png" alt="Icon"> Sitback</h1>

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

export const setupPage = (userId) => html`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Setup | Sitback</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&display=swap" rel="stylesheet">
    <style>
        :root { --bg: #0a0a0f; --card: #161621; --primary: #6366f1; --text: #f8fafc; --text-dim: #94a3b8; }
        body { margin: 0; background: var(--bg); color: var(--text); font-family: 'Outfit', sans-serif; padding: 2rem; }
        .container { max-width: 600px; margin: 0 auto; }
        h1 { margin-bottom: 2rem; font-weight: 600; background: linear-gradient(to right, #818cf8, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: flex; align-items: center; gap: 1rem; }
        .app-icon { width: 40px; height: 40px; border-radius: 10px; }
        h2 { border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-top: 2rem; }

        .card { background: var(--card); padding: 1.5rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 1.5rem; }
        .step { margin-bottom: 1.5rem; }
        .step h3 { color: var(--primary); margin: 0 0 0.5rem; font-size: 1.1rem; }
        code { background: rgba(0,0,0,0.3); padding: 0.2rem 0.4rem; border-radius: 6px; font-size: 0.95rem; color: #818cf8; font-family: monospace; }
        .badge { background: #1e1e2e; color: #818cf8; padding: 0.2rem 0.6rem; border-radius: 100px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; margin-bottom: 0.5rem; display: inline-block; }
        
        /* Tabs */
        .tabs { display: flex; gap: 0.5rem; margin-bottom: 2rem; background: rgba(255,255,255,0.03); padding: 0.4rem; border-radius: 12px; }
        .tab-btn { flex: 1; padding: 0.8rem; border: none; background: transparent; color: var(--text-dim); border-radius: 8px; cursor: pointer; font-weight: 600; font-family: inherit; transition: 0.2s; }
        .tab-btn.active { background: var(--primary); color: white; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3); }
        .tab-content { display: none; animation: fadeIn 0.3s ease-out; }
        .tab-content.active { display: block; }
        ul { padding-left: 1.2rem; }
        li { margin-bottom: 0.5rem; color: var(--text-dim); }
        b { color: var(--text); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    </style>
</head>
<body>
    <div class="container">
        <h1><img class="app-icon" src="https://avatars.slack-edge.com/2024-11-16/8026632865095_e660869731e137db6b56_192.png" alt="Icon"> Automation Setup</h1>
        <p style="color: var(--text-dim)">Use the details below to configure Sitback on your phone.</p>
        
        <div class="card">
            <div class="badge">Your Identity</div>
            <p>Your Slack User ID: <code>${userId}</code></p>
        </div>

        <div class="tabs">
            <button class="tab-btn active" onclick="showTab('ios', event)">📱 iOS (Shortcuts)</button>
            <button class="tab-btn" onclick="showTab('android', event)">🤖 Android (Apps)</button>
        </div>

        <!-- iOS Tab -->
        <div id="ios" class="tab-content active">
            <div class="card">
                <div class="step">
                    <h3>1. Create Shortcut</h3>
                    <p>Open <b>Shortcuts</b> app → New Shortcut → Add Action: <b>"Get Contents of URL"</b>.</p>
                </div>
                <div class="step">
                    <h3>2. Configure URL</h3>
                    <p>Set URL to: <code>https://sitback-worker.muhammad-hunble.workers.dev/wfo</code> (or <code>/so</code> for sign-off).</p>
                </div>
                <div class="step">
                    <h3>3. Add Headers</h3>
                    <p>Tap "Method" → Change to <b>POST</b>. Add these headers:</p>
                    <ul>
                        <li><code>X-API-Key</code>: <code>sitback_secure_key_3139f7d0</code></li>
                        <li><code>X-User-ID</code>: <code>${userId}</code></li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Android Tab -->
        <div id="android" class="tab-content">
            <div class="card">
                <div class="step">
                    <h3>1. Install Automation App</h3>
                    <p>Download <b>MacroDroid</b> or <b>Tasker</b> from the Play Store.</p>
                </div>
                <div class="step">
                    <h3>2. HTTP Request</h3>
                    <p>Add Action → <b>HTTP Request</b> (Method: <b>POST</b>).</p>
                    <p>URL: <code>https://sitback-worker.muhammad-hunble.workers.dev/wfo</code></p>
                </div>
                <div class="step">
                    <h3>3. Headers</h3>
                    <p>Add custom headers:</p>
                    <ul>
                        <li><code>X-API-Key</code>: <code>sitback_secure_key_3139f7d0</code></li>
                        <li><code>X-User-ID</code>: <code>${userId}</code></li>
                    </ul>
                </div>
            </div>
        </div>

        <script>
            function showTab(id, event) {
                // Hide all contents
                document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
                document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
                
                // Show selected
                document.getElementById(id).classList.add('active');
                event.currentTarget.classList.add('active');
            }
        </script>
    </div>
</body>
</html>
`;
