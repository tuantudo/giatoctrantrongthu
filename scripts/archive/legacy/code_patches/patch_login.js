const fs = require('fs');
let code = fs.readFileSync('server/member.js', 'utf8');

const newLoginBlock = `
    // Serve HTML login page
    router.get('/login', async (req, res) => {
        // --- LOCAL DEV AUTO LOGIN ---
        const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
        const autoLoginEnabled = process.env.DEV_AUTO_LOGIN === 'true';
        let devBannerHtml = '';

        if (isDev && autoLoginEnabled) {
            const cookies = req.headers.cookie || '';
            const explicitLogout = cookies.includes('explicit_logout=1');
            const forceAuto = req.query.force_auto === '1';
            const accountName = process.env.DEV_AUTO_LOGIN_ACCOUNT || 'tuantq';

            if (forceAuto || (!explicitLogout && !req.session.accountId)) {
                try {
                    const acc = await dbAccessor.getQuery("SELECT id, status FROM accounts WHERE username = ?", [accountName]);
                    if (acc) {
                        req.session.accountId = acc.id;
                        req.session.status = acc.status;
                        res.clearCookie('explicit_logout', { path: '/' });
                        return res.redirect('/me');
                    }
                } catch (e) {
                    console.error("Auto-login error:", e);
                }
            }

            if (explicitLogout) {
                devBannerHtml = \`
                <div style="margin-bottom: 20px; padding: 10px; background: #EBF8FF; border: 1px solid #BEE3F8; border-radius: 4px; text-align: center;">
                    <span style="color: #2B6CB0; font-size: 13px; font-weight: bold; display: block; margin-bottom: 8px;">🛠 Local Dev — Auto Login</span>
                    <a href="/login?force_auto=1" style="display: inline-block; padding: 6px 12px; background: #2B6CB0; color: white; text-decoration: none; border-radius: 4px; font-size: 13px;">Auto-login as \${accountName}</a>
                </div>\`;
            }
        }
        // --- END LOCAL DEV AUTO LOGIN ---

        res.send(\`
        <!DOCTYPE html>
        <html lang="vi">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Đăng nhập Thành viên</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #fdfdfc; color: #333; margin: 0; padding: 0; }
                .container { max-width: 400px; margin: 60px auto; padding: 30px; background: white; border: 1px solid #e0e0e0; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
                h2 { margin-top: 0; font-weight: 500; text-align: center; color: #111; }
                label { display: block; font-size: 14px; margin-bottom: 5px; color: #555; }
                input { width: 100%; padding: 10px; margin-bottom: 20px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; font-size: 16px; }
                button { width: 100%; padding: 12px; background: #1a1a1a; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer; }
                button:hover { background: #333; }
                .error { color: #d93025; margin-bottom: 15px; font-size: 14px; text-align: center; }
                .back-link { display: block; text-align: center; margin-top: 20px; color: #666; text-decoration: none; font-size: 14px; }
                .back-link:hover { color: #111; text-decoration: underline; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Giatộc · Đăng nhập</h2>
                \${devBannerHtml}
                <div id="error" class="error"></div>
                <form id="loginForm">
                    <label>Tài khoản</label>
                    <input type="text" id="username" required autofocus>
                    <label>Mật khẩu</label>
                    <input type="password" id="password" required>
                    <button type="submit">Đăng nhập</button>
                </form>
                <a href="/" class="back-link">← Trở về trang chủ</a>
            </div>
            <script>
                document.getElementById('loginForm').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const username = document.getElementById('username').value;
                    const password = document.getElementById('password').value;
                    const res = await fetch('/api/member/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username, password })
                    });
                    const data = await res.json();
                    if (res.ok) {
                        // Clear explicit logout cookie upon manual login
                        document.cookie = "explicit_logout=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                        if (data.status === 'PROVISIONED') {
                            window.location.href = '/me/change-password';
                        } else {
                            window.location.href = '/me';
                        }
                    } else {
                        document.getElementById('error').innerText = data.error || 'Đăng nhập thất bại';
                    }
                });
            </script>
        </body>
        </html>
        \`);
    });`;

const regex = /\/\/ Serve HTML login page[\s\S]*?res\.send\([\s\S]*?<\/html>\n        `\);\n    }\);/m;
code = code.replace(regex, newLoginBlock);

// Replace logout route to set the explicit_logout cookie
const newLogoutBlock = `    // GET /logout (Member explicit logout route)
    router.get('/logout', (req, res) => {
        req.session.destroy(() => {
            res.clearCookie('sid', { path: '/' });
            // Set explicit logout cookie for dev auto-login handling
            res.cookie('explicit_logout', '1', { path: '/' });
            res.redirect('/');
        });
    });`;

code = code.replace(/    \/\/ GET \/logout \(Member explicit logout route\)[\s\S]*?    \}\);/m, newLogoutBlock);

fs.writeFileSync('server/member.js', code);
console.log("Patched server/member.js");
