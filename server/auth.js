const bcrypt = require('bcrypt');
const { syncAdminUserToAccount } = require('./foundation');

let dbAccessorRef = null;

function setAuthDbAccessor(dbAccessor) {
    dbAccessorRef = dbAccessor;
}

/** requireAuth — middleware that gates protected routes.
 *  Expects req.session.userId or req.session.accountId to be set (by login flow).
 *  Returns 401 if the user is not authenticated.
 *  Re-validates active status in real-time against database.
 */
async function requireAuth(req, res, next) {
    if (!req.session || (!req.session.userId && !req.session.accountId)) {
        return res.status(401).json({ error: 'Chưa đăng nhập' });
    }
    if (dbAccessorRef) {
        try {
            if (req.session.userId) {
                const user = await dbAccessorRef.getQuery(
                    "SELECT id, username, role, is_active FROM admin_users WHERE id = ?",
                    [req.session.userId]
                );
                if (!user || !user.is_active) {
                    if (req.session && typeof req.session.destroy === 'function') {
                        req.session.destroy(() => {});
                    }
                    return res.status(403).json({ error: 'Tài khoản không tồn tại hoặc đã bị vô hiệu hóa' });
                }
                req.session.role = user.role;
                req.session.username = user.username;
            } else if (req.session.accountId) {
                const acc = await dbAccessorRef.getQuery(
                    "SELECT id, username, role, status FROM accounts WHERE id = ?",
                    [req.session.accountId]
                );
                if (!acc || acc.status === 'DISABLED') {
                    if (req.session && typeof req.session.destroy === 'function') {
                        req.session.destroy(() => {});
                    }
                    return res.status(403).json({ error: 'Tài khoản không tồn tại hoặc đã bị vô hiệu hóa' });
                }
                req.session.role = acc.role || 'member';
                req.session.username = acc.username;
                req.session.status = acc.status;
            }
        } catch (e) {
            return res.status(500).json({ error: 'Lỗi xác thực người dùng' });
        }
    }
    next();
}

/** requireOwner — guards owner-only actions. */
async function requireOwner(req, res, next) {
    if (!req.session || (!req.session.userId && !req.session.accountId)) {
        return res.status(401).json({ error: 'Chưa đăng nhập' });
    }
    if (dbAccessorRef) {
        try {
            let role = req.session.role;

            if (req.session.userId) {
                const user = await dbAccessorRef.getQuery(
                    "SELECT id, username, role, is_active FROM admin_users WHERE id = ?",
                    [req.session.userId]
                );
                if (!user || !user.is_active) {
                    if (req.session && typeof req.session.destroy === 'function') {
                        req.session.destroy(() => {});
                    }
                    return res.status(403).json({ error: 'Tài khoản không tồn tại hoặc đã bị vô hiệu hóa' });
                }
                req.session.role = user.role;
                req.session.username = user.username;
                role = user.role;
            } else if (req.session.accountId) {
                const acc = await dbAccessorRef.getQuery(
                    "SELECT id, username, role, status FROM accounts WHERE id = ?",
                    [req.session.accountId]
                );
                if (!acc || acc.status === 'DISABLED') {
                    if (req.session && typeof req.session.destroy === 'function') {
                        req.session.destroy(() => {});
                    }
                    return res.status(403).json({ error: 'Tài khoản không tồn tại hoặc đã bị vô hiệu hóa' });
                }
                req.session.role = acc.role || 'member';
                req.session.username = acc.username;
                req.session.status = acc.status;
                role = acc.role;
            }

            if (role !== 'owner') {
                return res.status(403).json({
                    error: 'FORBIDDEN_OWNER_REQUIRED',
                    message: 'Chỉ Owner mới có quyền thực hiện thao tác này. Thành viên hoặc biên tập viên vui lòng gửi đề xuất (Proposal).'
                });
            }
        } catch (e) {
            return res.status(500).json({ error: 'Lỗi xác thực quyền Owner' });
        }
    } else if (req.session.role !== 'owner') {
        return res.status(403).json({
            error: 'FORBIDDEN_OWNER_REQUIRED',
            message: 'Chỉ Owner mới có quyền thực hiện thao tác này'
        });
    }
    next();
}

/** createAuthRouter — returns an Express router mounted at /api/auth
 *  Handles: POST /login, POST /logout, GET /me
 *
 *  @param {object} dbAccessor  { getQuery, allQuery, runQuery }
 */
function createAuthRouter(dbAccessor) {
    const router = require('express').Router();

    /* POST /api/auth/login */
    router.post('/login', async (req, res) => {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Thiếu tên đăng nhập hoặc mật khẩu' });
        }

        try {
            const user = await dbAccessor.getQuery(
                "SELECT * FROM admin_users WHERE username = ?",
                [username]
            );

            if (!user) {
                return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu sai' });
            }

            const ok = await bcrypt.compare(password, user.password_hash);
            if (!ok) {
                return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu sai' });
            }

            if (!user.is_active) {
                return res.status(403).json({ error: 'Tài khoản đã bị vô hiệu hóa' });
            }

            // Update last login
            const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
            await dbAccessor.runQuery(
                "UPDATE admin_users SET last_login_at = ? WHERE id = ?",
                [now, user.id]
            );

            // P0 Foundation: Sync admin_users -> accounts
            const accountId = await syncAdminUserToAccount(user, dbAccessor);

            // Set session
            req.session.userId = user.id;
            req.session.username = user.username;
            req.session.role = user.role;
            req.session.accountId = accountId;

            res.json({
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                    is_active: !!user.is_active,
                    last_login_at: user.last_login_at,
                    account_id: accountId
                }
            });
        } catch (e) {
            console.error('Login error:', e.message);
            res.status(500).json({ error: e.message });
        }
    });

    /* POST /api/auth/logout */
    router.post('/logout', (req, res) => {
        req.session.destroy(() => {
            res.clearCookie('sid', { path: '/' });
            res.json({ success: true });
        });
    });

    /* GET /api/auth/me */
    router.get('/me', async (req, res) => {
        if (!req.session || !req.session.userId) {
            return res.status(401).json({ error: 'Chưa đăng nhập' });
        }

        try {
            const user = await dbAccessor.getQuery(
                "SELECT id, username, role, is_active, last_login_at FROM admin_users WHERE id = ?",
                [req.session.userId]
            );

            if (!user) {
                req.session.destroy();
                return res.status(401).json({ error: 'Tài khoản không tồn tại' });
            }

            res.json({
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                    is_active: !!user.is_active,
                    last_login_at: user.last_login_at
                }
            });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    /* GET /api/auth/me/identity - P0 Identity Verification */
    router.get('/me/identity', async (req, res) => {
        if (!req.session || !req.session.accountId) {
            return res.status(401).json({ error: 'Chưa đăng nhập (Account không tồn tại)' });
        }
        
        try {
            const accountId = req.session.accountId;
            // Get Account
            const account = await dbAccessor.getQuery("SELECT * FROM accounts WHERE id = ?", [accountId]);
            if (!account) {
                req.session.destroy();
                return res.status(401).json({ error: 'Tài khoản không tồn tại' });
            }
            // Get Identity Mapping
            const mappings = await dbAccessor.allQuery("SELECT * FROM identity_mappings WHERE account_id = ?", [accountId]);
            // Get Authorities
            const authorities = await dbAccessor.allQuery("SELECT * FROM authorities WHERE actor_id = ? AND actor_type = 'ACCOUNT'", [accountId]);

            res.json({
                account,
                identity_mappings: mappings,
                authorities: authorities
            });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    return router;
}

/** createUsersRouter — returns an Express router mounted at /api/admin/users
 *  Handles: GET /, POST /, PATCH /:id, DELETE /:id
 *
 *  @param {object} dbAccessor  { getQuery, allQuery, runQuery }
 */
function createUsersRouter(dbAccessor) {
    const router = require('express').Router();

    /* GET /api/admin/users — list all */
    router.get('/', async (req, res) => {
        try {
            const users = await dbAccessor.allQuery(
                "SELECT id, username, role, is_active, last_login_at, created_at FROM admin_users ORDER BY id"
            );
            res.json(users);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    /* POST /api/admin/users — create new */
    router.post('/', async (req, res) => {
        const { username, password, role = 'editor' } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Thiếu tên đăng nhập hoặc mật khẩu' });
        }
        if (password.length < 8) {
            return res.status(400).json({ error: 'Mật khẩu phải ít nhất 8 ký tự' });
        }

        try {
            const hash = await bcrypt.hash(password, 10);
            const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

            const insertQuery = process.env.DB_CLIENT === 'mysql'
                ? "INSERT INTO admin_users (username, password_hash, role, is_active, created_at) VALUES (?, ?, ?, 1, ?)"
                : "INSERT INTO admin_users (id, username, password_hash, role, is_active, created_at) VALUES (?, ?, ?, ?, 1, ?)";

            const newId = process.env.DB_CLIENT === 'mysql' ? null : require('crypto').randomUUID();
            const params = process.env.DB_CLIENT === 'mysql'
                ? [username, hash, role, now]
                : [newId, username, hash, role, now];

            await dbAccessor.runQuery(insertQuery, params);
            res.json({ success: true });
        } catch (e) {
            if (e.message.includes('UNIQUE')) {
                res.status(409).json({ error: 'Tên đăng nhập đã tồn tại' });
            } else {
                res.status(500).json({ error: e.message });
            }
        }
    });

    /* PATCH /api/admin/users/:id — update role / is_active */
    router.patch('/:id', async (req, res) => {
        const { id } = req.params;
        const { role, is_active } = req.body;

        try {
            const params = [];
            const setClauses = [];

            if (role !== undefined) {
                setClauses.push("role = ?");
                params.push(role);
            }
            if (is_active !== undefined) {
                setClauses.push("is_active = ?");
                params.push(is_active ? 1 : 0);
            }

            if (setClauses.length === 0) {
                return res.status(400).json({ error: 'Không có trường nào để cập nhật' });
            }

            params.push(id);
            await dbAccessor.runQuery(
                `UPDATE admin_users SET ${setClauses.join(', ')} WHERE id = ?`,
                params
            );
            res.json({ success: true });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    /* DELETE /api/admin/users/:id — delete user */
    router.delete('/:id', async (req, res) => {
        const { id } = req.params;
        try {
            await dbAccessor.runQuery("DELETE FROM admin_users WHERE id = ?", [id]);
            res.json({ success: true });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    return router;
}

module.exports = { createAuthRouter, createUsersRouter, requireAuth, requireOwner, setAuthDbAccessor };
