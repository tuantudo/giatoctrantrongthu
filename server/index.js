require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const { createAuthRouter, createUsersRouter, requireAuth, requireOwner, setAuthDbAccessor } = require('./auth');
const { initFoundationTables } = require('./foundation');
const { executeDirectEditWithAudit } = require('./governance');

const app = express();
app.set('trust proxy', 1);

app.use(express.json());

// CORS is configured below with strict origin whitelist (giatocCors)

// TASK-01 & TASK-02 & P0 PRIVACY CONTAINMENT: Safe URI decoding & strict path containment
const SENSITIVE_PATH = /(^|\/)(server|generator|scripts|tests|\.git|\.aios|\.vercel|\.env|node_modules|\.github|content|assets\/private|data\/private)(\/|$)|^\/?archive(\/|$)|thu-gui-clara|.*\.(db|sqlite|sqlite3|log|ged|pem|key|env|bak|orig)(\?|#|$)|cookie\.txt/i;

app.use((req, res, next) => {
    let decodedPath = '';
    try {
        decodedPath = decodeURIComponent(req.path);
    } catch (err) {
        return res.status(400).json({ error: 'INVALID_URI_ENCODING' });
    }
    // DEF-01 & DEF-02 Fix: Allow authorized admin content APIs and authorized member Clara assets to bypass static path containment
    if (req.path.startsWith('/api/admin/content') || req.path.startsWith('/assets/private/images/clara') || decodedPath.startsWith('/api/admin/content') || decodedPath.startsWith('/assets/private/images/clara')) {
        return next();
    }
    if (SENSITIVE_PATH.test(decodedPath)) {
        return res.status(404).end();
    }
    next();
});

// TASK-01: Static Serving Lockdown with strict whitelist
const repoRoot = path.join(__dirname, '..');
// Explicitly prevent express.static from serving any private assets
app.use('/assets', (req, res, next) => {
    if (req.path.startsWith('/private')) {
        return next(); // Pass down to authenticated memberRouter; never serve statically
    }
    express.static(path.join(repoRoot, 'assets'), { dotfiles: 'deny' })(req, res, next);
});
app.use('/src', express.static(path.join(repoRoot, 'src'), { dotfiles: 'deny' }));
app.use('/data', express.static(path.join(repoRoot, 'data'), { dotfiles: 'deny' }));
app.use('/fixtures', express.static(path.join(repoRoot, 'fixtures'), { dotfiles: 'deny' }));
app.use('/admin', express.static(path.join(repoRoot, 'admin'), { dotfiles: 'deny' }));

// Single root entry points
app.get('/', (req, res) => res.sendFile(path.join(repoRoot, 'index.html')));
app.get('/index.html', (req, res) => res.sendFile(path.join(repoRoot, 'index.html')));
app.get('/lab.html', (req, res) => res.sendFile(path.join(repoRoot, 'lab.html')));
app.get('/favicon.ico', (req, res) => {
    const p = path.join(repoRoot, 'favicon.ico');
    if (fs.existsSync(p)) res.sendFile(p);
    else res.status(204).end();
});
app.get('/robots.txt', (req, res) => {
    const p = path.join(repoRoot, 'robots.txt');
    if (fs.existsSync(p)) res.sendFile(p);
    else res.type('text/plain').send('User-agent: *\nDisallow: /admin/\nDisallow: /me/\nDisallow: /private/\n');
});

if (!process.env.SESSION_SECRET) {
    console.warn('WARNING: SESSION_SECRET chưa được đặt trong .env — dùng giá trị tạm cho dev, KHÔNG dùng cho production.');
}

app.set('trust proxy', 1);

app.use(session({
    name: 'sid',
    secret: process.env.SESSION_SECRET || 'dev-only-insecure-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: 'auto',
        sameSite: 'lax',
        domain: process.env.COOKIE_DOMAIN || undefined,
        maxAge: 24 * 60 * 60 * 1000 // 24h
    }
}));

const MEDIA_BASE_URL = process.env.MEDIA_BASE_URL
    ? process.env.MEDIA_BASE_URL.replace(/\/+$/, '') + '/'
    : '/';

function resolveMediaUrl(val) {
    if (!val || typeof val !== 'string') return val;
    if (val.startsWith('http://') || val.startsWith('https://')) return val;
    return MEDIA_BASE_URL + val.replace(/^\/+/, '');
}

// Strict Allowed Origins Policy (Zero Wildcard, No Expansion)
const ALLOWED_ORIGINS_SET = new Set([
    'https://admin.giatoctrantrongthu.com',
    'https://giatoctrantrongthu.com'
]);

function isTrustedOriginUrl(rawUrl, req) {
    if (!rawUrl || typeof rawUrl !== 'string') return false;
    let parsed;
    try {
        parsed = new URL(rawUrl);
    } catch (e) {
        return false;
    }
    const origin = parsed.origin;
    if (process.env.NODE_ENV !== 'production') {
        if (origin === 'http://localhost:3000' || origin === 'http://127.0.0.1:3000') {
            return true;
        }
    }
    return ALLOWED_ORIGINS_SET.has(origin);
}

// Unified strict CORS middleware across all surfaces
const giatocCors = cors((req, callback) => {
    const origin = req.header('Origin');
    if (!origin) {
        // Non-CORS request (same-origin, curl, server-to-server)
        return callback(null, { origin: false });
    }
    if (isTrustedOriginUrl(origin, req)) {
        return callback(null, {
            origin: origin,
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token'],
            exposedHeaders: ['Set-Cookie']
        });
    }
    // Untrusted origin: strictly do NOT reflect origin, do NOT emit wildcard *, do NOT allow credentials
    return callback(null, { origin: false, credentials: false });
});

const publicCors = giatocCors;
const adminCors = giatocCors;

app.use(giatocCors);

// CSRF Token attachment for active sessions
app.use((req, res, next) => {
    if (req.session) {
        if (!req.session.csrfToken) {
            req.session.csrfToken = require('crypto').randomBytes(24).toString('hex');
        }
        res.locals.csrfToken = req.session.csrfToken;
    }
    next();
});

// Endpoint to fetch CSRF token for authenticated sessions
app.get('/api/csrf-token', (req, res) => {
    if (!req.session || (!req.session.userId && !req.session.accountId)) {
        return res.status(401).json({ error: 'Chưa đăng nhập' });
    }
    return res.json({ csrfToken: req.session.csrfToken });
});

// P0 CSRF Protection: Guard mutating state actions (POST, PUT, PATCH, DELETE)
app.use((req, res, next) => {
    const mutatingMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
    if (!mutatingMethods.includes(req.method)) {
        return next();
    }
    // Allow login endpoints to establish initial session without prior CSRF check
    if (req.path === '/api/auth/login' || req.path === '/api/member/login') {
        return next();
    }

    const origin = req.headers['origin'];
    const referer = req.headers['referer'];
    const csrfTokenHeader = req.headers['x-csrf-token'];
    const hasSession = Boolean(req.session && (req.session.userId || req.session.accountId));

    // 1. Origin header is present
    if (origin) {
        try {
            if (!isTrustedOriginUrl(origin, req)) {
                return res.status(403).json({
                    error: 'CSRF_ORIGIN_MISMATCH',
                    message: 'Yêu cầu bị từ chối do vi phạm an ninh nguồn gốc (Origin không hợp lệ).'
                });
            }
        } catch (e) {
            return res.status(403).json({ error: 'CSRF_MALFORMED_ORIGIN' });
        }
    }
    // 2. Origin is absent, but Referer is present
    else if (referer) {
        try {
            if (!isTrustedOriginUrl(referer, req)) {
                return res.status(403).json({
                    error: 'CSRF_REFERER_MISMATCH',
                    message: 'Yêu cầu bị từ chối do vi phạm an ninh nguồn gốc (Referer không hợp lệ).'
                });
            }
        } catch (e) {
            return res.status(403).json({ error: 'CSRF_MALFORMED_REFERER' });
        }
    }
    // 3. Both Origin and Referer are absent
    else {
        // Credentialed request without Origin/Referer indicates stripped headers (potential CSRF)
        if (hasSession) {
            if (!csrfTokenHeader) {
                return res.status(403).json({
                    error: 'CSRF_ORIGIN_REQUIRED',
                    message: 'Yêu cầu bị từ chối: Thiếu Origin/Referer và không có mã CSRF Token hợp lệ.'
                });
            }
        }
    }

    // 4. If x-csrf-token header is explicitly supplied, it MUST match the session token
    if (csrfTokenHeader && req.session && req.session.csrfToken) {
        if (csrfTokenHeader !== req.session.csrfToken) {
            return res.status(403).json({
                error: 'CSRF_INVALID_TOKEN',
                message: 'Mã CSRF Token không hợp lệ.'
            });
        }
    }

    next();
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Quá nhiều lần đăng nhập thất bại, vui lòng thử lại sau ít phút.' }
});

const proposalIpLimiter = rateLimit({
    windowMs: Number(process.env.PROPOSAL_RATE_LIMIT_IP_WINDOW_MS) || (60 * 60 * 1000), // 1 hour
    max: Number(process.env.PROPOSAL_RATE_LIMIT_IP_MAX) || 30, // max 30 proposals per IP per hour
    standardHeaders: true,
    legacyHeaders: false,
    statusCode: 429,
    message: { ok: false, error: 'RATE_LIMIT_EXCEEDED_IP', message: 'Địa chỉ IP của bạn đã gửi quá nhiều đề xuất trong 1 giờ. Vui lòng thử lại sau.' }
});

const useMariaDB = process.env.DB_CLIENT === 'mysql';
let db, runQuery, allQuery, getQuery;

async function initDB() {
    if (useMariaDB) {
        console.log("Using MariaDB connection...");
        const mysql = require('mysql2/promise');
        db = await mysql.createPool({
            host: process.env.DB_HOST || '127.0.0.1',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'family_archive',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        runQuery = async (q, params) => {
            const [result] = await db.execute(q, params);
            return result;
        };
        allQuery = async (q, params) => {
            const [rows] = await db.execute(q, params);
            return rows;
        };
        getQuery = async (q, params) => {
            const [rows] = await db.execute(q, params);
            return rows[0];
        };

        // Create tables for MariaDB
        await runQuery(`CREATE TABLE IF NOT EXISTS people (
            id VARCHAR(255) PRIMARY KEY,
            name VARCHAR(255),
            birthYear VARCHAR(50),
            deathYear VARCHAR(50),
            gender VARCHAR(50),
            notes TEXT,
            status VARCHAR(50),
            payload TEXT
        )`);

        await runQuery(`CREATE TABLE IF NOT EXISTS stories (
            id VARCHAR(255) PRIMARY KEY,
            title VARCHAR(255),
            author VARCHAR(255),
            content LONGTEXT,
            status VARCHAR(50),
            updatedAt VARCHAR(50)
        )`);

        await runQuery(`CREATE TABLE IF NOT EXISTS edges (
            source_id VARCHAR(255),
            target_id VARCHAR(255),
            edge_type VARCHAR(50),
            PRIMARY KEY (source_id, target_id, edge_type)
        )`);

        await runQuery(`CREATE TABLE IF NOT EXISTS admin_users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role VARCHAR(50) NOT NULL DEFAULT 'editor',
            is_active TINYINT NOT NULL DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login_at TIMESTAMP NULL
        )`);

        await runQuery(`CREATE TABLE IF NOT EXISTS calendar_events (
            uid VARCHAR(255) PRIMARY KEY,
            summary VARCHAR(255) NOT NULL,
            dtstart VARCHAR(50) NOT NULL,
            dtend VARCHAR(50),
            description TEXT,
            location VARCHAR(255),
            calendar_type VARCHAR(100) NOT NULL,
            event_type VARCHAR(100),
            status VARCHAR(50) NOT NULL DEFAULT 'DRAFT'
        )`);

        // Add payload column if it doesn't exist (for existing tables)
        try { await runQuery(`ALTER TABLE people ADD COLUMN payload TEXT`); } catch(e) {}

        await initFoundationTables(runQuery, true);
    } else {
        console.log("Using local SQLite fallback...");
        const sqlite3 = require('sqlite3').verbose();
        const dbPath = process.env.DB_PATH || path.join(__dirname, 'family_archive.db');
        db = new sqlite3.Database(dbPath);

        runQuery = (q, params = []) => new Promise((res, rej) => db.run(q, params, (err) => err ? rej(err) : res()));
        allQuery = (q, params = []) => new Promise((res, rej) => db.all(q, params, (err, rows) => err ? rej(err) : res(rows)));
        getQuery = (q, params = []) => new Promise((res, rej) => db.get(q, params, (err, row) => err ? rej(err) : res(row)));
        
        await runQuery(`CREATE TABLE IF NOT EXISTS people (
            id TEXT PRIMARY KEY, name TEXT, birthYear TEXT, deathYear TEXT, gender TEXT, notes TEXT, status TEXT, payload TEXT
        )`);
        await runQuery(`CREATE TABLE IF NOT EXISTS stories (
            id TEXT PRIMARY KEY, title TEXT, author TEXT, content TEXT, status TEXT, updatedAt TEXT
        )`);
        await runQuery(`CREATE TABLE IF NOT EXISTS edges (
            source_id TEXT, target_id TEXT, edge_type TEXT, PRIMARY KEY (source_id, target_id, edge_type)
        )`);
        await runQuery(`CREATE TABLE IF NOT EXISTS admin_users (
            id TEXT PRIMARY KEY, username TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'editor', is_active INTEGER NOT NULL DEFAULT 1,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP, last_login_at TEXT
        )`);
        await runQuery(`CREATE TABLE IF NOT EXISTS calendar_events (
            uid TEXT PRIMARY KEY, summary TEXT NOT NULL, dtstart TEXT NOT NULL, dtend TEXT,
            description TEXT, location TEXT, calendar_type TEXT NOT NULL,
            event_type TEXT, status TEXT NOT NULL DEFAULT 'DRAFT'
        )`);

        // Add payload column if it doesn't exist (for existing DBs)
        await runQuery(`ALTER TABLE people ADD COLUMN payload TEXT`).catch(() => {});

        await initFoundationTables(runQuery, false);
    }
}

// Lazy accessor so routers always see the live db helpers
const dbAccessor = {
    get allQuery() { return allQuery; },
    get getQuery() { return getQuery; },
    get runQuery() { return runQuery; },
    get isMySQL() { return useMariaDB; },
    get pool() { return useMariaDB ? db : null; },
    get db() { return db; },
};
setAuthDbAccessor(dbAccessor);

// ------------------- AUTH ROUTES (admin only) -------------------
app.use('/api/auth/login', adminCors, loginLimiter);
app.use('/api/auth', adminCors, createAuthRouter(dbAccessor));
app.use('/api/admin/users', adminCors, requireAuth, requireOwner, createUsersRouter(dbAccessor));
if (fs.existsSync(path.join(__dirname, 'admin_operations.js'))) {
    const { createAdminOperationsRouter } = require('./admin_operations');
    app.use('/api/admin', adminCors, createAdminOperationsRouter(dbAccessor, { requireAuth, requireOwner }));
}

// ------------------- DATABASE ADMIN ROUTES -------------------
app.get('/api/admin/database/schema', adminCors, requireAuth, requireOwner, async (req, res) => {
    try {
        const client = process.env.DB_CLIENT || 'sqlite3';
        let tables = [];
        let info = { client, database: process.env.DB_NAME || 'family_archive', host: process.env.DB_HOST || 'local' };
        
        if (client === 'sqlite3') {
            const tableObjs = await dbAccessor.allQuery("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
            for (let t of tableObjs) {
                const countObj = await dbAccessor.getQuery("SELECT COUNT(*) as c FROM " + t.name);
                tables.push({ name: t.name, rows: countObj.c, engine: 'SQLite', primary_key: 'id' });
            }
        }
        res.json({ info, tables });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ------------------- MEMBER ROUTES (P0.1) -------------------
const { createMemberRouter } = require('./member');
app.use('/', createMemberRouter(dbAccessor, { loginLimiter, proposalIpLimiter }));

// ------------------- P0 SECURITY: GATEWAY HARDENING -------------------
async function requireMemberOrAdmin(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    }
    if (req.session && req.session.accountId) {
        if (req.session.status === 'PROVISIONED') {
            return res.status(403).json({
                error: 'PASSWORD_CHANGE_REQUIRED',
                message: 'Vui lòng đổi mật khẩu kích hoạt lần đầu trước khi truy cập dữ liệu.'
            });
        }
        if (getQuery) {
            try {
                const acc = await getQuery("SELECT status FROM accounts WHERE id = ?", [req.session.accountId]);
                if (!acc || acc.status === 'DISABLED') {
                    if (typeof req.session.destroy === 'function') {
                        req.session.destroy(() => {});
                    }
                    return res.status(401).json({
                        error: 'UNAUTHORIZED_MEMBER_GATEWAY',
                        message: 'Tài khoản không hợp lệ hoặc đã bị tạm khóa.'
                    });
                }
                if (acc.status === 'PROVISIONED') {
                    req.session.status = 'PROVISIONED';
                    return res.status(403).json({
                        error: 'PASSWORD_CHANGE_REQUIRED',
                        message: 'Vui lòng đổi mật khẩu kích hoạt lần đầu trước khi truy cập dữ liệu.'
                    });
                }
            } catch (e) {
                return res.status(500).json({ error: 'INTERNAL_AUTH_ERROR' });
            }
        }
        return next();
    }
    return res.status(401).json({
        error: 'UNAUTHORIZED_MEMBER_GATEWAY',
        message: 'Dữ liệu phả hệ chỉ mở cho thành viên gia tộc đã xác minh danh tính.'
    });
}

// ------------------- PUBLIC CRUD -------------------
app.get('/api/people', publicCors, requireMemberOrAdmin, async (req, res) => {
    try {
        const rows = await allQuery("SELECT * FROM people WHERE status = 'PUBLISHED'");
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
app.get('/api/admin/content/people', adminCors, requireAuth, async (req, res) => {
    try {
        res.json(await allQuery('SELECT * FROM people ORDER BY name'));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
app.post('/api/people', adminCors, requireAuth, requireOwner, async (req, res) => {
    try {
        const { id, name, birthYear, deathYear, gender, notes, status, reason } = req.body;
        const result = await executeDirectEditWithAudit(dbAccessor, {
            actorId: req.session.userId,
            entityType: 'people',
            entityId: id,
            reason: reason || 'Owner Direct Edit',
            fetchBeforeState: async (tx) => {
                return await tx.getQuery("SELECT * FROM people WHERE id = ?", [id]);
            },
            performMutation: async (tx) => {
                let existing = await tx.getQuery("SELECT payload FROM people WHERE id = ?", [id]);
                let payload = {};
                if (existing && existing.payload) {
                    payload = typeof existing.payload === 'string' ? JSON.parse(existing.payload) : existing.payload;
                }

                payload.id = id;
                payload.name = name;
                if (!payload.birth) payload.birth = {};
                payload.birth.date = birthYear;
                if (!payload.death) payload.death = {};
                payload.death.date = deathYear;
                payload.sex = gender === 'Nam' ? 'M' : (gender === 'Nữ' ? 'F' : 'U');

                const payloadStr = JSON.stringify(payload);

                if (useMariaDB) {
                    const query = "INSERT INTO people (id, name, birthYear, deathYear, gender, notes, status, payload) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name), birthYear=VALUES(birthYear), deathYear=VALUES(deathYear), gender=VALUES(gender), notes=VALUES(notes), status=VALUES(status), payload=VALUES(payload)";
                    await tx.runQuery(query, [id, name, birthYear, deathYear, gender, notes, status, payloadStr]);
                } else {
                    const query = "INSERT OR REPLACE INTO people (id, name, birthYear, deathYear, gender, notes, status, payload) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                    await tx.runQuery(query, [id, name, birthYear, deathYear, gender, notes, status, payloadStr]);
                }
                return { id, name, birthYear, deathYear, gender, notes, status };
            },
            fetchAfterState: async (tx) => {
                return await tx.getQuery("SELECT * FROM people WHERE id = ?", [id]);
            }
        });
        res.json({ success: true, correlationId: result.correlationId });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
app.get('/api/stories', publicCors, requireMemberOrAdmin, async (req, res) => {
    try {
        res.json(await allQuery("SELECT * FROM stories WHERE status = 'PUBLISHED'"));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
app.get('/api/admin/content/stories', adminCors, requireAuth, async (req, res) => {
    try {
        res.json(await allQuery('SELECT * FROM stories ORDER BY updatedAt DESC'));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
app.post('/api/stories', adminCors, requireAuth, requireOwner, async (req, res) => {
    try {
        const { id, title, author, content, status, updatedAt, reason } = req.body;
        const result = await executeDirectEditWithAudit(dbAccessor, {
            actorId: req.session.userId,
            entityType: 'stories',
            entityId: id,
            reason: reason || 'Owner Direct Edit Story',
            fetchBeforeState: async (tx) => {
                return await tx.getQuery("SELECT * FROM stories WHERE id = ?", [id]);
            },
            performMutation: async (tx) => {
                const query = useMariaDB ? 
                    "REPLACE INTO stories (id, title, author, content, status, updatedAt) VALUES (?, ?, ?, ?, ?, ?)" :
                    "INSERT OR REPLACE INTO stories VALUES (?, ?, ?, ?, ?, ?)";
                await tx.runQuery(query, [id, title, author, content, status, updatedAt]);
                return { id, title, author, content, status, updatedAt };
            },
            fetchAfterState: async (tx) => {
                return await tx.getQuery("SELECT * FROM stories WHERE id = ?", [id]);
            }
        });
        res.json({ success: true, correlationId: result.correlationId });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/edges', async (req, res) => {
    res.status(403).json({ error: 'Cần đăng nhập để xem quan hệ quản trị' });
});
app.get('/api/admin/content/edges', adminCors, requireAuth, async (req, res) => {
    try {
        res.json(await allQuery('SELECT * FROM edges'));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
app.post('/api/edges', adminCors, requireAuth, requireOwner, async (req, res) => {
    try {
        const { source_id, target_id, edge_type, reason } = req.body;
        const result = await executeDirectEditWithAudit(dbAccessor, {
            actorId: req.session.userId,
            entityType: 'edges',
            entityId: `${source_id}:${target_id}:${edge_type}`,
            reason: reason || 'Owner Direct Add Edge',
            fetchBeforeState: async (tx) => {
                return await tx.getQuery("SELECT * FROM edges WHERE source_id = ? AND target_id = ? AND edge_type = ?", [source_id, target_id, edge_type]);
            },
            performMutation: async (tx) => {
                const query = useMariaDB ? 
                    "INSERT IGNORE INTO edges (source_id, target_id, edge_type) VALUES (?, ?, ?)" :
                    "INSERT OR IGNORE INTO edges VALUES (?, ?, ?)";
                await tx.runQuery(query, [source_id, target_id, edge_type]);
                return { source_id, target_id, edge_type };
            },
            fetchAfterState: async (tx) => {
                return await tx.getQuery("SELECT * FROM edges WHERE source_id = ? AND target_id = ? AND edge_type = ?", [source_id, target_id, edge_type]);
            }
        });
        res.json({ success: true, correlationId: result.correlationId });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
app.delete('/api/edges', adminCors, requireAuth, requireOwner, async (req, res) => {
    try {
        const { source_id, target_id, edge_type, reason } = req.body;
        const result = await executeDirectEditWithAudit(dbAccessor, {
            actorId: req.session.userId,
            entityType: 'edges',
            entityId: `${source_id}:${target_id}:${edge_type}`,
            reason: reason || 'Owner Direct Delete Edge',
            fetchBeforeState: async (tx) => {
                return await tx.getQuery("SELECT * FROM edges WHERE source_id = ? AND target_id = ? AND edge_type = ?", [source_id, target_id, edge_type]);
            },
            performMutation: async (tx) => {
                await tx.runQuery("DELETE FROM edges WHERE source_id = ? AND target_id = ? AND edge_type = ?", [source_id, target_id, edge_type]);
                return { deleted: true, source_id, target_id, edge_type };
            },
            fetchAfterState: async () => null
        });
        res.json({ success: true, correlationId: result.correlationId });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/events', async (req, res) => {
    res.status(403).json({ error: 'Cần đăng nhập để xem sự kiện quản trị' });
});
app.get('/api/admin/content/events', adminCors, requireAuth, async (req, res) => {
    try {
        res.json(await allQuery("SELECT * FROM calendar_events ORDER BY dtstart DESC"));
    } catch(e) {
        res.status(500).json({error: e.message});
    }
});
app.post('/api/events', adminCors, requireAuth, requireOwner, async (req, res) => {
    try {
        const { uid, summary, dtstart, dtend, description, location, calendar_type, event_type, status, reason } = req.body;
        const result = await executeDirectEditWithAudit(dbAccessor, {
            actorId: req.session.userId,
            entityType: 'calendar_events',
            entityId: uid,
            reason: reason || 'Owner Direct Edit Event',
            fetchBeforeState: async (tx) => {
                return await tx.getQuery("SELECT * FROM calendar_events WHERE uid = ?", [uid]);
            },
            performMutation: async (tx) => {
                const query = useMariaDB ? 
                    "REPLACE INTO calendar_events (uid, summary, dtstart, dtend, description, location, calendar_type, event_type, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)" :
                    "INSERT OR REPLACE INTO calendar_events (uid, summary, dtstart, dtend, description, location, calendar_type, event_type, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
                await tx.runQuery(query, [uid, summary, dtstart, dtend, description, location, calendar_type || 'CAL_04_FAMILY_MILESTONES', event_type || 'milestone', status || 'PUBLISHED']);
                return { uid, summary, dtstart, dtend, description, location, calendar_type, event_type, status };
            },
            fetchAfterState: async (tx) => {
                return await tx.getQuery("SELECT * FROM calendar_events WHERE uid = ?", [uid]);
            }
        });
        res.json({ success: true, correlationId: result.correlationId });
    } catch(e) {
        res.status(500).json({error: e.message});
    }
});

// ------------------- PUBLIC WEB ADAPTERS -------------------
app.get('/api/genealogy.json', requireMemberOrAdmin, async (req, res) => {
    try {
        const peopleRows = await allQuery("SELECT * FROM people WHERE status = 'PUBLISHED'");
        const familyRows = await allQuery("SELECT * FROM families");
        const memoryRows = await allQuery("SELECT * FROM memories");
        const timelineRows = await allQuery("SELECT * FROM timeline");

        let publicPeople = {};
        for (let r of peopleRows) {
            let p = r.payload ? (typeof r.payload === 'string' ? JSON.parse(r.payload) : r.payload) : {};
            p.id = r.id;
            p.name = r.name;
            p.birthDate = (p.birth && p.birth.date) ? p.birth.date : (r.birthYear || null);
            p.deathDate = (p.death && p.death.date) ? p.death.date : (r.deathYear || null);
            p.isLiving = (p.isLiving !== undefined) ? p.isLiving : (!p.death && !r.deathYear);
            publicPeople[r.id] = p;
        }

        let publicFamilies = {};
        for (let r of familyRows) {
            let f = r.payload ? (typeof r.payload === 'string' ? JSON.parse(r.payload) : r.payload) : {};
            f.id = r.id;
            publicFamilies[r.id] = f;
        }

        let publicMemories = memoryRows.map(r => {
            let m = r.payload ? (typeof r.payload === 'string' ? JSON.parse(r.payload) : r.payload) : {};
            if (m.file) m.file = resolveMediaUrl(m.file);
            if (m.path) m.path = resolveMediaUrl(m.path);
            m.id = r.id;
            return m;
        });

        let publicTimeline = timelineRows.map(r => {
            let p = r.payload ? (typeof r.payload === 'string' ? JSON.parse(r.payload) : r.payload) : {};
            const personId = r.person_id || p.personId || null;
            const person = personId ? publicPeople[personId] : null;
            const personName = p.personName || (person ? person.name : null);
            const eventType = r.event || p.type || 'EVENT';
            return {
                id: r.id,
                personId,
                personName,
                type: eventType,
                event: eventType,
                date: r.date || p.date || null,
                year: p.year || (r.date ? parseInt(String(r.date).replace(/[^0-9]/g, '').slice(-4), 10) : null),
                title: p.title || `${eventType}: ${personName || ''}`
            };
        });

        // Enrich with family milestones from CAL_04_FAMILY_MILESTONES.ics
        try {
            const milestoneIcsPath = path.join(__dirname, 'calendars', 'CAL_04_FAMILY_MILESTONES.ics');
            if (fs.existsSync(milestoneIcsPath)) {
                const icsContent = fs.readFileSync(milestoneIcsPath, 'utf8').replace(/\r?\n[ \t]/g, '');
                const rawEvents = icsContent.split('BEGIN:VEVENT').slice(1);
                for (let raw of rawEvents) {
                    let uid = (raw.match(/UID:([^\r\n]+)/) || [])[1] || '';
                    let summary = (raw.match(/SUMMARY:([^\r\n]+)/) || [])[1] || '';
                    let dtstart = (raw.match(/DTSTART[^:]*:([0-9]{8})/) || [])[1] || '';
                    let cleanSummary = summary.replace(/^[^\w\s—]+/, '').trim();
                    let dateStr = dtstart.length === 8 ? `${dtstart.slice(6,8)}/${dtstart.slice(4,6)}/${dtstart.slice(0,4)}` : dtstart;
                    let yearVal = dtstart.length === 8 ? parseInt(dtstart.slice(0,4), 10) : null;
                    let fsids = [...new Set(raw.match(/([A-Z0-9]{4}-[A-Z0-9]{3,4})/g) || [])];
                    
                    let matchedPersonIds = [];
                    for (let f of fsids) {
                        for (let [pid, pobj] of Object.entries(publicPeople)) {
                            if (pobj.fsid === f && !matchedPersonIds.includes(pid)) {
                                matchedPersonIds.push(pid);
                            }
                        }
                    }
                    
                    const mType = uid.includes('marr') ? 'MARRIAGE' : (uid.includes('chr') ? 'BAPTISM' : 'MILESTONE');
                    publicTimeline.push({
                        id: uid.split('@')[0],
                        personId: matchedPersonIds[0] || null,
                        personIds: matchedPersonIds,
                        personName: cleanSummary.split('—')[1]?.trim() || cleanSummary,
                        type: mType,
                        event: mType,
                        date: dateStr,
                        year: yearVal,
                        title: cleanSummary
                    });
                }
            }
        } catch (e) {
            console.error('Milestone ICS parse error:', e);
        }

        res.json({
            publication: "GIA TỘC TRẦN TRỌNG THU",
            subtitle: "CÂY GIA PHẢ",
            provenance: "Trích lục Gia phả nhà ông Trần Trọng Thu",
            generatedAt: new Date().toISOString(),
            rootAnchor: peopleRows.length > 0 ? (publicPeople['@I1@'] ? '@I1@' : peopleRows[0].id) : '',
            people: publicPeople,
            families: publicFamilies,
            memories: publicMemories,
            timeline: publicTimeline,
            stats: { individuals: peopleRows.length, families: familyRows.length, memories: memoryRows.length }
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/mach.json', publicCors, async (req, res) => {
    try {
        const machDataFile = path.join(__dirname, 'data', 'mach.json');
        if (fs.existsSync(machDataFile)) {
            const staticPayload = JSON.parse(fs.readFileSync(machDataFile, 'utf8'));
            // Safety sanitization: strict exclusion of Clara
            staticPayload.stories = (staticPayload.stories || []).filter(s => 
                !s.id?.startsWith('art_clara') && 
                !s.id?.startsWith('clara') && 
                s.seriesSlug !== 'thu-gui-clara' &&
                (!s.seriesIds || !s.seriesIds.includes('thu-gui-clara'))
            );
            if (staticPayload.articles) {
                staticPayload.articles = staticPayload.stories;
            }
            if (staticPayload.series && staticPayload.series['thu-gui-clara']) {
                delete staticPayload.series['thu-gui-clara'];
            }
            return res.json(staticPayload);
        }

        const storyRows = await allQuery("SELECT * FROM stories WHERE status = 'PUBLISHED' AND id NOT LIKE 'clara%'");
        const authorRows = await allQuery("SELECT * FROM authors WHERE id != 'tuan'");
        const seriesRows = await allQuery("SELECT * FROM series WHERE id != 'thu-gui-clara'");

        let publicAuthors = {};
        for (let r of authorRows) {
            let a = r.payload ? (typeof r.payload === 'string' ? JSON.parse(r.payload) : r.payload) : {};
            a.id = r.id;
            publicAuthors[r.id] = a;
        }

        let publicSeries = {};
        for (let r of seriesRows) {
            let s = r.payload ? (typeof r.payload === 'string' ? JSON.parse(r.payload) : r.payload) : {};
            if (s.coverImage) s.coverImage = resolveMediaUrl(s.coverImage);
            if (s.src) s.src = resolveMediaUrl(s.src);
            if (s.thumb) s.thumb = resolveMediaUrl(s.thumb);
            if (s.medium) s.medium = resolveMediaUrl(s.medium);
            if (s.large) s.large = resolveMediaUrl(s.large);
            if (s.content) s.content = s.content.replace(/(^|["'(\s])\/?assets\/images\//g, '$1' + MEDIA_BASE_URL + 'assets/images/');
            s.id = r.id;
            publicSeries[r.id] = s;
        }

        let publicStories = storyRows.map(r => {
            let s = r.payload ? (typeof r.payload === 'string' ? JSON.parse(r.payload) : r.payload) : {};
            if (s.coverImage) s.coverImage = resolveMediaUrl(s.coverImage);
            if (s.src) s.src = resolveMediaUrl(s.src);
            if (s.thumb) s.thumb = resolveMediaUrl(s.thumb);
            if (s.medium) s.medium = resolveMediaUrl(s.medium);
            if (s.large) s.large = resolveMediaUrl(s.large);
            if (s.content) s.content = s.content.replace(/(^|["'(\s])\/?assets\/images\//g, '$1' + MEDIA_BASE_URL + 'assets/images/');
            s.id = r.id;
            s.slug = r.id;
            if (s.linkedPeople && typeof s.linkedPeople === 'string') s.linkedPeople = JSON.parse(s.linkedPeople);
            return s;
        });

        res.json({
            authors: publicAuthors,
            series: publicSeries,
            stories: publicStories
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/media.json', requireMemberOrAdmin, async (req, res) => {
    try {
        const mediaRows = await allQuery("SELECT * FROM media");
        let publicMedia = {};
        for (let r of mediaRows) {
            let m = r.payload ? (typeof r.payload === 'string' ? JSON.parse(r.payload) : r.payload) : {};
            if (m.file) m.file = resolveMediaUrl(m.file);
            if (m.path) m.path = resolveMediaUrl(m.path);
            m.id = r.id;
            publicMedia[r.id] = m;
        }
        res.json(publicMedia);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/person_media.json', requireMemberOrAdmin, async (req, res) => {
    try {
        const pmRows = await allQuery("SELECT * FROM person_media");
        let publicPM = pmRows.map(r => ({
            relationId: r.relation_id,
            personId: r.person_id,
            assetId: r.asset_id || r.media_id,
            role: r.role || 'PORTRAIT',
            isPrimary: r.is_primary === 1,
            status: "MATCHED"
        }));
        res.json(publicPM);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/calendars/:filename', requireMemberOrAdmin, async (req, res) => {
    try {
        const safeFilename = path.basename(req.params.filename || '');
        const calType = safeFilename.replace('.ics', '');
        const evRows = await allQuery("SELECT * FROM calendar_events WHERE calendar_type = ? AND status = 'PUBLISHED'", [calType]);
        if (evRows.length === 0) {
            const staticIcsPath = path.join(__dirname, 'calendars', safeFilename);
            if (fs.existsSync(staticIcsPath)) {
                res.set('Content-Type', 'text/calendar; charset=utf-8');
                return res.sendFile(staticIcsPath);
            }
            return res.status(404).send('Not found');
        }
        
        let ics = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Gia Toc//Calendar//VI\n';
        for (let r of evRows) {
            ics += 'BEGIN:VEVENT\n';
            ics += 'UID:' + r.uid + '\n';
            ics += 'SUMMARY:' + r.summary + '\n';
            ics += 'DTSTART:' + r.dtstart + '\n';
            if (r.description) ics += 'DESCRIPTION:' + r.description.replace(/\n/g, '\\n') + '\n';
            ics += 'END:VEVENT\n';
        }
        ics += 'END:VCALENDAR';
        res.set('Content-Type', 'text/calendar; charset=utf-8');
        res.send(ics);
    } catch (e) {
        res.status(500).send('Calendar load error');
    }
});

if (require.main === module) {
    const argPort = (process.argv.find(a => a.startsWith('--port=')) || '').split('=')[1];
    const port = Number(argPort || process.env.PORT || 3000);
    initDB()
        .then(() => app.listen(port, '127.0.0.1', (err) => {
            if (err) {
                console.error(`Server failed to bind port ${port}:`, err.message || err);
                process.exit(1);
            }
            console.log(`API Server running on port ${port}`);
        }))
        .catch((error) => {
            console.error('Database initialization failed:', error);
            process.exit(1);
        });
}

module.exports = { app, initDB };
