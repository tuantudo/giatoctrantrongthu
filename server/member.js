const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const { recordAuditLog } = require('./governance');

function createMemberRouter(dbAccessor, options = {}) {
    const { loginLimiter, proposalIpLimiter } = options;
    const router = express.Router();
    let proposalSeq = 0;

    // Sliding window account-level rate limiter
    const accountProposalTimestamps = new Map();
    function checkAccountProposalRateLimit(accountId, max = 20, windowMs = 3600000) {
        const now = Date.now();
        const timestamps = (accountProposalTimestamps.get(accountId) || []).filter(t => (now - t) < windowMs);
        if (timestamps.length >= max) {
            return false;
        }
        timestamps.push(now);
        accountProposalTimestamps.set(accountId, timestamps);
        return true;
    }

    async function hydrateMemberSession(req, account, dbAccessorRef) {
        req.session.accountId = account.id;
        req.session.username = account.username;
        req.session.role = account.role || 'member';
        req.session.status = account.status || 'ACTIVE';
        const mapping = await dbAccessorRef.getQuery(
            "SELECT person_id FROM identity_mappings WHERE account_id = ?",
            [account.id]
        );
        req.session.personId = mapping ? mapping.person_id : null;
    }

    function isClaraEligible(req) {
        if (!req.session || !req.session.accountId) return false;
        const username = (req.session.username || '').toLowerCase();
        const role = req.session.role;
        // Eligible: Tuấn (admin / owner / tuantq / tuan) or explicit personId in Hạnh Đào branch
        if (role === 'admin' || role === 'owner' || username === 'tuantq' || username === 'tuan') return true;
        if (req.session.personId === '@I18@' || req.session.personId === '@I170@') return true;
        return false;
    }

    // Middleware to check if user is logged in as an account
    async function requireAccount(req, res, next) {
        if (!req.session || !req.session.accountId) {
            return res.redirect('/login');
        }
        try {
            const acc = await dbAccessor.getQuery(
                "SELECT id, username, role, status FROM accounts WHERE id = ?",
                [req.session.accountId]
            );
            if (!acc || acc.status === 'DISABLED') {
                if (typeof req.session.destroy === 'function') {
                    return req.session.destroy(() => res.redirect('/login'));
                }
                req.session = null;
                return res.redirect('/login');
            }
            const mapping = await dbAccessor.getQuery(
                "SELECT person_id FROM identity_mappings WHERE account_id = ?",
                [acc.id]
            );
            if (typeof req.session.destroy === 'function') {
                req.session.username = acc.username;
                req.session.role = req.session.userId ? (req.session.role || acc.role || 'member') : (acc.role || 'member');
                req.session.status = req.session.userId ? 'ACTIVE' : (acc.status || 'ACTIVE');
                req.session.personId = mapping ? mapping.person_id : null;
            } else {
                if (!req.session.username) req.session.username = acc.username;
                if (!req.session.role) req.session.role = acc.role || 'member';
                if (!req.session.status) req.session.status = acc.status || 'ACTIVE';
                if (mapping && mapping.person_id) {
                    req.session.personId = mapping.person_id;
                } else if (req.session.personId === undefined) {
                    req.session.personId = null;
                }
            }
            next();
        } catch (e) {
            return res.status(500).send("Database error");
        }
    }

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
                    const acc = await dbAccessor.getQuery(
                        "SELECT id, username, role, status FROM accounts WHERE username = ?",
                        [accountName]
                    );
                    if (acc && acc.status !== 'DISABLED') {
                        await hydrateMemberSession(req, acc, dbAccessor);
                        res.clearCookie('explicit_logout', { path: '/' });
                        const rawNext = String(req.query.next || '');
                        const safeNext = (rawNext.startsWith('/me') && !rawNext.startsWith('//')) ? rawNext : '/me';
                        return res.redirect(safeNext);
                    }
                } catch (e) {
                    console.error("Auto-login error:", e);
                }
            }

            if (explicitLogout) {
                devBannerHtml = `
                <div style="margin-bottom: 20px; padding: 10px; background: #EBF8FF; border: 1px solid #BEE3F8; border-radius: 4px; text-align: center;">
                    <span style="color: #2B6CB0; font-size: 13px; font-weight: bold; display: block; margin-bottom: 8px;">🛠 Local Dev — Auto Login</span>
                    <a href="/login?force_auto=1" style="display: inline-block; padding: 6px 12px; background: #2B6CB0; color: white; text-decoration: none; border-radius: 4px; font-size: 13px;">Auto-login as ${accountName}</a>
                </div>`;
            }
        }
        // --- END LOCAL DEV AUTO LOGIN ---

        res.send(`
        <!DOCTYPE html>
        <html lang="vi">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="robots" content="noindex, noarchive, nofollow, nosnippet">
            <title>Đăng nhập · Gia Tộc Trần Trọng Thu</title>
            <!-- [GOVERNANCE] /login no longer ships its own inline design system.
                 It loads the SAME shared foundation as every GIATỘC surface, so the
                 Gate into Member Space speaks the same grammar as the institution
                 it leads into. Serif, radius 0, no shadow, no card. -->
            <link rel="stylesheet" href="/src/css/foundation/foundation.css">
            <link rel="icon" type="image/svg+xml" href="/assets/images/logoGiaToc_favicon.svg">
        </head>
        <body class="gi-body gi-login-body">
            <main class="gi-region-main">
              <div class="gi-container gi-login">
                <header class="gi-gate-masthead">
                  <p class="gi-login-eyebrow">Gia Tộc Trần Trọng Thu</p>
                  <h1 class="gi-login-title">Đăng nhập Không gian Gia Tộc</h1>
                  <p class="gi-login-line">Khu vực dành riêng cho những người trong gia tộc.</p>
                </header>
                ${devBannerHtml}
                <div id="error" class="gi-login-error" role="alert"></div>
                <form id="loginForm" class="gi-login-form">
                    <label class="gi-login-label" for="username">Tài khoản</label>
                    <input class="gi-login-input" type="text" id="username" name="username" required autocomplete="username" autofocus>
                    <label class="gi-login-label" for="password">Mật khẩu</label>
                    <input class="gi-login-input" type="password" id="password" name="password" required autocomplete="current-password">
                    <button class="gi-btn gi-btn--primary gi-login-submit" type="submit">Đăng nhập</button>
                </form>
                <a href="/" class="gi-login-back">← Trở về trang công khai</a>
              </div>
            </main>
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
                        document.getElementById('error').innerText = data.error || 'Đăng nhập thất bại.';
                    }
                });
            </script>
        </body>
        </html>
        `);
    });

    // API to login member
    const memberLoginMiddlewares = loginLimiter ? [loginLimiter] : [];
    router.post('/api/member/login', ...memberLoginMiddlewares, async (req, res) => {
        const { username, password } = req.body || {};
        if (!username || !password) return res.status(400).json({ error: 'Thiếu thông tin' });
        const cleanUsername = String(username).trim();

        try {
            // First try accounts
            let account = await dbAccessor.getQuery(
                "SELECT * FROM accounts WHERE LOWER(username) = LOWER(?)",
                [cleanUsername]
            );
            if (account && account.password_hash) {
                const ok = await bcrypt.compare(password, account.password_hash);
                if (!ok) { return res.status(401).json({ error: "Sai mật khẩu" }); }
                if (account.status === 'DISABLED') {
                    return res.status(403).json({ error: 'Tài khoản đã bị tạm khóa.' });
                }

                await hydrateMemberSession(req, account, dbAccessor);

                return res.json({ id: account.id, username: account.username, status: account.status });
            }
            if (account && account.status === 'DISABLED') {
                return res.status(403).json({ error: 'Tài khoản đã bị tạm khóa.' });
            }

            // Fallback to admin_users for compatibility
            let adminUser = await dbAccessor.getQuery(
                "SELECT * FROM admin_users WHERE LOWER(username) = LOWER(?)",
                [cleanUsername]
            );
            if (adminUser) {
                const ok = await bcrypt.compare(password, adminUser.password_hash);
                if (!ok) { return res.status(401).json({ error: "Sai mật khẩu" }); }
                if (!adminUser.is_active) {
                    return res.status(403).json({ error: 'Tài khoản đã bị tạm khóa.' });
                }

                const { syncAdminUserToAccount } = require('./foundation');
                const accountId = await syncAdminUserToAccount(adminUser, dbAccessor);

                req.session.userId = adminUser.id; // legacy admin
                await hydrateMemberSession(req, {
                    id: accountId,
                    username: adminUser.username,
                    role: adminUser.role,
                    status: 'ACTIVE'
                }, dbAccessor);

                return res.json({ id: accountId, username: adminUser.username, status: 'ACTIVE' });
            }

            res.status(401).json({ error: 'Không tìm thấy tài khoản' });
        } catch (e) {
            res.status(500).json({ error: 'Lỗi hệ thống khi đăng nhập.' });
        }
    });

    // Profile Data API for Dashboard
    router.get('/api/member/profile', requireAccount, async (req, res) => {
        try {
            const account = await dbAccessor.getQuery(
                "SELECT username, status, role FROM accounts WHERE id = ?",
                [req.session.accountId]
            );
            if (req.session.status === 'PROVISIONED') {
                return res.json({ account, person: null, claraEligible: false });
            }
            const mapping = await dbAccessor.getQuery(
                "SELECT person_id FROM identity_mappings WHERE account_id = ?",
                [req.session.accountId]
            );
            let person = null;
            if (mapping && mapping.person_id) {
                person = await dbAccessor.getQuery("SELECT * FROM people WHERE id = ?", [mapping.person_id]);
                if (person && person.payload) {
                    person.details = typeof person.payload === 'string' ? JSON.parse(person.payload) : person.payload;
                }
            }
            res.json({ account, person, claraEligible: isClaraEligible(req) });
        } catch (e) {
            res.status(500).json({ error: 'Không thể tải hồ sơ thành viên.' });
        }
    });

    // Password change page (supports both first-time PROVISIONED activation and voluntary ACTIVE change)
    router.get('/me/change-password', requireAccount, async (req, res) => {
        const isProvisioned = req.session.status === 'PROVISIONED';
        const pageTitle = isProvisioned ? 'Đặt mật khẩu của bạn' : 'Đổi mật khẩu tài khoản';
        const pageSubtitle = isProvisioned
            ? 'Đây là lần đăng nhập đầu tiên. Hãy đặt một mật khẩu mới để bảo vệ không gian của bạn.'
            : 'Cập nhật mật khẩu bảo vệ không gian thành viên của bạn.';
        const submitLabel = isProvisioned ? 'Đổi mật khẩu và kích hoạt' : 'Cập nhật mật khẩu';
        const backLinkHtml = isProvisioned
            ? ''
            : '<a href="/me" class="gi-login-back">← Quay lại Không gian của tôi</a>';

        res.send(`
        <!DOCTYPE html>
        <html lang="vi">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="robots" content="noindex, noarchive, nofollow, nosnippet">
            <title>${pageTitle} · Gia Tộc Trần Trọng Thu</title>
            <!-- [GOVERNANCE] Same shared foundation as /login and every member
                 surface. Replaces a second inline design system that carried
                 sans-serif, 4px radius, a drop shadow and a #0066cc button. -->
            <link rel="stylesheet" href="/src/css/foundation/foundation.css">
            <link rel="icon" type="image/svg+xml" href="/assets/images/logoGiaToc_favicon.svg">
        </head>
        <body class="gi-body gi-login-body">
            <main class="gi-region-main">
              <div class="gi-container gi-login">
                <header class="gi-login-masthead">
                  <p class="gi-login-eyebrow">Gia Tộc Trần Trọng Thu</p>
                  <h1 class="gi-login-title">${pageTitle}</h1>
                  <p class="gi-login-line">${pageSubtitle}</p>
                </header>
                <div id="error" class="gi-login-error" role="alert"></div>
                <form id="changeForm" class="gi-login-form">
                    <label class="gi-login-label" for="oldPassword">Mật khẩu hiện tại</label>
                    <input class="gi-login-input" type="password" id="oldPassword" name="oldPassword" required autocomplete="current-password" autofocus>
                    <label class="gi-login-label" for="newPassword">Mật khẩu mới (ít nhất 8 ký tự)</label>
                    <input class="gi-login-input" type="password" id="newPassword" name="newPassword" minlength="8" required autocomplete="new-password">
                    <label class="gi-login-label" for="confirmPassword">Xác nhận mật khẩu mới</label>
                    <input class="gi-login-input" type="password" id="confirmPassword" name="confirmPassword" minlength="8" required autocomplete="new-password">
                    <button class="gi-btn gi-btn--primary gi-login-submit" type="submit">${submitLabel}</button>
                </form>
                ${backLinkHtml}
              </div>
            </main>
            <script>
                document.getElementById('changeForm').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const oldPassword = document.getElementById('oldPassword').value;
                    const newPassword = document.getElementById('newPassword').value;
                    const confirmPassword = document.getElementById('confirmPassword').value;

                    if (newPassword.length < 8) {
                        return document.getElementById('error').innerText = 'Mật khẩu mới phải có ít nhất 8 ký tự.';
                    }
                    if (newPassword !== confirmPassword) {
                        return document.getElementById('error').innerText = 'Mật khẩu xác nhận không khớp';
                    }

                    const res = await fetch('/api/member/change-password', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ oldPassword, newPassword })
                    });
                    const data = await res.json();
                    if (res.ok) {
                        window.location.href = '/me';
                    } else {
                        document.getElementById('error').innerText = data.error || 'Lỗi xảy ra';
                    }
                });
            </script>
        </body>
        </html>
        `);
    });

    // API to change password
    router.post('/api/member/change-password', requireAccount, async (req, res) => {
        const { oldPassword, newPassword } = req.body || {};
        if (!oldPassword || !newPassword || String(newPassword).length < 8) {
            return res.status(400).json({ error: 'Mật khẩu mới phải có ít nhất 8 ký tự.' });
        }
        try {
            const accountId = req.session.accountId;
            const account = await dbAccessor.getQuery("SELECT * FROM accounts WHERE id = ?", [accountId]);
            if (!account || !account.password_hash) return res.status(404).json({ error: 'Not found' });

            const ok = await bcrypt.compare(oldPassword, account.password_hash);
            if (!ok) return res.status(401).json({ error: 'Mật khẩu hiện tại không đúng' });

            const newHash = await bcrypt.hash(String(newPassword), 10);
            await dbAccessor.runQuery("UPDATE accounts SET password_hash = ?, status = 'ACTIVE' WHERE id = ?", [newHash, accountId]);

            req.session.status = 'ACTIVE';
            res.json({ success: true });
        } catch (e) {
            res.status(500).json({ error: 'Không thể cập nhật mật khẩu lúc này.' });
        }
    });

    // Member Proposal Submission API (SC-05 Scoped — persisted to proposals table)
    const proposalMiddlewares = proposalIpLimiter ? [proposalIpLimiter] : [];
    router.post('/api/member/proposals', ...proposalMiddlewares, async (req, res) => {
        // Check session authentication or local dev auto-login persona
        const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
        const autoLoginEnabled = process.env.DEV_AUTO_LOGIN === 'true';
        const hasSession = Boolean(req.session && req.session.accountId);

        if (!hasSession && !(isDev && autoLoginEnabled)) {
            return res.status(401).json({ ok: false, error: 'Chưa đăng nhập' });
        }

        const accountId = hasSession ? req.session.accountId : null;
        let account = null;

        if (accountId) {
            // 1. Real-time Database Verification: check account state directly from DB
            account = await dbAccessor.getQuery(
                "SELECT id, username, status, role FROM accounts WHERE id = ?",
                [accountId]
            );
            if (!account) {
                return res.status(401).json({ ok: false, error: 'ACCOUNT_NOT_FOUND', message: 'Tài khoản không tồn tại.' });
            }
            if (account.status === 'DISABLED') {
                if (typeof req.session.destroy === 'function') {
                    req.session.destroy(() => {});
                }
                return res.status(403).json({ ok: false, error: 'ACCOUNT_DISABLED', message: 'Tài khoản đã bị tạm khóa.' });
            }
            if (account.status === 'PROVISIONED') {
                return res.status(403).json({
                    ok: false,
                    error: 'PASSWORD_CHANGE_REQUIRED',
                    message: 'Vui lòng đổi mật khẩu kích hoạt lần đầu trước khi gửi đề xuất.'
                });
            }
            if (account.status !== 'ACTIVE') {
                return res.status(403).json({ ok: false, error: 'ACCOUNT_NOT_ACTIVE', message: 'Tài khoản chưa được kích hoạt.' });
            }

            // 2. Member Verification: account must be linked to an existing, valid person in people
            const mapping = await dbAccessor.getQuery(
                `SELECT im.person_id, p.id AS verified_person_id, p.name AS person_name 
                 FROM identity_mappings im 
                 JOIN people p ON p.id = im.person_id 
                 WHERE im.account_id = ?`,
                [account.id]
            );

            const isOwner = account.role === 'owner' || (req.session && req.session.role === 'owner');
            if (!mapping || !mapping.verified_person_id) {
                if (!isOwner) {
                    return res.status(403).json({
                        ok: false,
                        error: 'MEMBER_NOT_VERIFIED',
                        message: 'Tài khoản chưa được xác minh tư cách thành viên gia tộc (chưa gắn liên kết nhân vật hợp lệ trong phả hệ).'
                    });
                }
            }

            // 3. Account-level Rate Limiting (Default: 20 proposals / account / hour)
            const maxAccountProposals = Number(process.env.PROPOSAL_RATE_LIMIT_ACCOUNT_MAX) || 20;
            const accountWindowMs = Number(process.env.PROPOSAL_RATE_LIMIT_ACCOUNT_WINDOW_MS) || (60 * 60 * 1000);
            if (!checkAccountProposalRateLimit(account.id, maxAccountProposals, accountWindowMs)) {
                return res.status(429).json({
                    ok: false,
                    error: 'RATE_LIMIT_EXCEEDED_ACCOUNT',
                    message: `Tài khoản đã vượt quá giới hạn tối đa ${maxAccountProposals} đề xuất trong 1 giờ. Vui lòng thử lại sau.`
                });
            }
        }

        const body = req.body || {};
        const personId = body.personId || body.person_id;
        const field = body.field;
        const suggestedValue = body.suggestedValue !== undefined ? body.suggestedValue : body.suggested_value;
        const sourceEvidence = body.sourceEvidence || body.source_evidence;
        const reason = body.reason;

        if (!personId || !field || suggestedValue === undefined || suggestedValue === null || String(suggestedValue).trim() === '') {
            return res.status(400).json({
                ok: false,
                error: 'Thiếu thông tin bắt buộc: personId, field hoặc suggestedValue'
            });
        }

        try {
            // Verify person exists in canonical people table
            const cleanPersonId = String(personId).trim();
            const cleanField = String(field).trim();
            const cleanSuggested = String(suggestedValue).trim();

            const targetPerson = await dbAccessor.getQuery(
                "SELECT id, name, birthYear, deathYear, gender, notes, payload FROM people WHERE id = ?",
                [cleanPersonId]
            );
            if (!targetPerson) {
                return res.status(404).json({
                    ok: false,
                    error: 'PERSON_NOT_FOUND',
                    message: `Nhân vật ${cleanPersonId} không tồn tại trong hệ thống gia phả.`
                });
            }

            const baseValue = targetPerson[cleanField] !== undefined ? String(targetPerson[cleanField]) : null;

            // Canonical database protection:
            // NEVER overwrite people or families table directly; persist into proposals queue with base_value.
            proposalSeq = (proposalSeq + 1) % 1000;
            const proposalId = 'PROP_' + Date.now() + String(proposalSeq).padStart(3, '0');
            const accountId = hasSession ? req.session.accountId : 'dev_auto';

            await dbAccessor.runQuery(
                "INSERT INTO proposals (id, account_id, person_id, field, suggested_value, base_value, source_evidence, reason, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')",
                [
                    proposalId,
                    String(accountId),
                    targetPerson.id,
                    cleanField,
                    cleanSuggested,
                    baseValue,
                    sourceEvidence ? String(sourceEvidence).trim() : null,
                    reason ? String(reason).trim() : null
                ]
            );

            // Record audit log entry
            try {
                await recordAuditLog(dbAccessor, {
                    actorId: accountId,
                    actorRole: 'member',
                    action: 'PROPOSAL_SUBMITTED',
                    entityType: 'people',
                    entityId: targetPerson.id,
                    beforeValue: { field: cleanField, value: baseValue },
                    afterValue: { field: cleanField, value: cleanSuggested },
                    reason: reason ? String(reason).trim() : null,
                    correlationId: proposalId
                });
            } catch (auditErr) {
                console.warn('Failed to record submission audit log:', auditErr.message);
            }

            return res.json({
                ok: true,
                proposalId,
                status: 'PENDING_REVIEW',
                baseValue,
                message: 'Đề xuất đã được tiếp nhận.'
            });
        } catch (e) {
            return res.status(500).json({ ok: false, error: 'Không thể lưu đề xuất lúc này.' });
        }
    });

    // Member Home (Dashboard)
    router.get('/me', requireAccount, async (req, res) => {
        if (req.session.status === 'PROVISIONED') {
            return res.redirect('/me/change-password');
        }
        res.sendFile(path.join(__dirname, 'member_dashboard.html'));
    });

    // Member Full Tree (Legacy Baseline)
    router.get('/me/tree', requireAccount, async (req, res) => {
        if (req.session.status === 'PROVISIONED') {
            return res.redirect('/me/change-password');
        }
        res.sendFile(path.join(__dirname, 'member_tree.html'));
    });

    // Member Photo & Archive Gallery (Increment 02)
    router.get('/me/gallery', requireAccount, async (req, res) => {
        if (req.session.status === 'PROVISIONED') {
            return res.redirect('/me/change-password');
        }
        res.sendFile(path.join(__dirname, 'member_gallery.html'));
    });

    // Member Event & Memorial System (Increment 03A)
    router.get('/me/events', requireAccount, async (req, res) => {
        if (req.session.status === 'PROVISIONED') {
            return res.redirect('/me/change-password');
        }
        res.sendFile(path.join(__dirname, 'member_events.html'));
    });

    /* UI System v0.2 — Person detail surface (Phase 5).
       [PROPOSAL] New-UI companion of the legacy hash route /me/tree#/person/:id
       recorded in docs/architecture/SITEMAP_v0.1.md. It reads the same public
       genealogy bundle; it does not change the schema, the sitemap or the
       legacy SPA. Hierarchy parent = /me/tree (see src/js/ui/navigation.js). */
    router.get('/me/tree/person/:id', requireAccount, async (req, res) => {
        if (req.session.status === 'PROVISIONED') {
            return res.redirect('/me/change-password');
        }
        res.sendFile(path.join(__dirname, 'member_person.html'));
    });

    
    /* UI System vNEXT — discourse reading surfaces.
       Two SEPARATE routes, one per discourse scope. They are not one
       "publications" route: MẠCH is internal discourse, Thư gửi Clara is
       intimate/personal discourse (ARCHITECTURE_CONSOLIDATION §6.2).
       Both are member-only (requireAccount) and both render honest
       NotAvailable state until the backend serves scope-separated content.
       No schema, no data and no auth model is changed here. */
    router.get('/me/mach', requireAccount, async (req, res) => {
        if (req.session.status === 'PROVISIONED') {
            return res.redirect('/me/change-password');
        }
        res.sendFile(path.join(__dirname, 'member_mach.html'));
    });

    // Secure API for Clara letters (Private Discourse Scope)
    router.get('/api/member/clara.json', requireAccount, (req, res) => {
        if (req.session.status === 'PROVISIONED') {
            return res.status(403).json({
                error: 'PASSWORD_CHANGE_REQUIRED',
                message: 'Vui lòng đổi mật khẩu kích hoạt lần đầu trước khi truy cập dữ liệu.'
            });
        }
        if (!isClaraEligible(req)) {
            return res.status(403).json({
                error: 'FORBIDDEN_RESTRICTED_BRANCH',
                message: 'Không gian Thư gửi Clara là di sản riêng tư của gia đình nhỏ, chỉ các thành viên được ủy quyền mới có thể tiếp cận.'
            });
        }
        const claraFile = path.join(__dirname, 'data', 'private', 'clara.json');
        if (fs.existsSync(claraFile)) {
            try {
                const data = JSON.parse(fs.readFileSync(claraFile, 'utf8'));
                return res.json(data);
            } catch (err) {
                return res.status(500).json({ error: 'FAILED_TO_LOAD_CLARA_DATA' });
            }
        }
        return res.status(404).json({ error: 'CLARA_DATA_NOT_FOUND' });
    });

    // Guarded static image serving for Clara private assets
    router.get('/assets/private/images/clara/:filename', requireAccount, (req, res) => {
        if (req.session.status === 'PROVISIONED' || !isClaraEligible(req)) {
            return res.status(403).end();
        }
        const safeFilename = path.basename(req.params.filename);
        const imgPath = path.join(__dirname, '..', 'assets', 'private', 'images', 'clara', safeFilename);
        if (fs.existsSync(imgPath)) {
            res.sendFile(imgPath);
        } else {
            res.status(404).end();
        }
    });

    // Zero-Hint containment on Clara HTML route
    router.get('/me/clara', requireAccount, async (req, res) => {
        if (req.session.status === 'PROVISIONED') {
            return res.redirect('/me/change-password');
        }
        if (!isClaraEligible(req)) {
            return res.status(404).send('Not Found');
        }
        res.sendFile(path.join(__dirname, 'member_clara.html'));
    });

    /* UI System vNEXT — Family Space deferred to V1.1 per Decision A1 (zero placeholder surfaces in V1.0). */
    router.get('/me/family-spaces', requireAccount, async (req, res) => {
        if (req.session.status === 'PROVISIONED') {
            return res.redirect('/me/change-password');
        }
        return res.redirect('/me');
    });

    // GET /logout (Member explicit logout route)
    router.get('/logout', (req, res) => {
        req.session.destroy(() => {
            res.clearCookie('sid', { path: '/' });
            // Set explicit logout cookie for dev auto-login handling
            res.cookie('explicit_logout', '1', { path: '/' });
            res.redirect('/');
        });
    });

    return router;
}

module.exports = { createMemberRouter };
