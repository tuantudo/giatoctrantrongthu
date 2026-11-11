/**
 * admin_operations.js
 * V1.0 Admin Operations Router:
 * - Member Account Provisioning, Password Reset, Person Mapping & Lock/Unlock
 * - Member Fact Proposal Review Inbox (Read + Decision Recording without mutating canonical people)
 */
const express = require('express');
const bcrypt = require('bcrypt');
const { randomUUID } = require('crypto');
const { commitProposal, rejectProposal } = require('./governance');

const VALID_ACCOUNT_STATUSES = ['ACTIVE', 'DISABLED', 'PROVISIONED'];
const VALID_PROPOSAL_STATUSES = ['APPROVED', 'REJECTED', 'PENDING'];

function createAdminOperationsRouter(dbAccessor, { requireAuth, requireOwner }) {
    const router = express.Router();

    /* 1. GET /api/admin/member-accounts */
    router.get('/member-accounts', requireAuth, async (req, res) => {
        try {
            const rows = await dbAccessor.allQuery(`
                SELECT
                    a.id,
                    a.username,
                    a.email,
                    a.role,
                    a.status,
                    a.created_at,
                    im.person_id,
                    p.name AS person_name,
                    p.birthYear AS birth_year
                FROM accounts a
                LEFT JOIN identity_mappings im ON im.account_id = a.id
                LEFT JOIN people p ON p.id = im.person_id
                ORDER BY a.created_at DESC, a.username ASC
            `);

            const seen = new Set();
            const accounts = [];
            for (const r of rows) {
                if (seen.has(r.id)) continue;
                seen.add(r.id);
                accounts.push({
                    id: r.id,
                    username: r.username,
                    email: r.email || null,
                    role: r.role || 'member',
                    status: r.status || 'PROVISIONED',
                    created_at: r.created_at || null,
                    person_id: r.person_id || null,
                    person_name: r.person_name || null,
                    birth_year: r.birth_year || null
                });
            }

            res.json({ accounts });
        } catch (e) {
            res.status(500).json({ error: 'Không thể tải danh sách tài khoản thành viên.' });
        }
    });

    /* 2. POST /api/admin/member-accounts */
    router.post('/member-accounts', requireAuth, requireOwner, async (req, res) => {
        const { username, password, email, personId } = req.body || {};
        const cleanUsername = String(username || '').trim().toLowerCase();
        const cleanEmail = email ? String(email).trim().toLowerCase() : null;
        const cleanPersonId = personId ? String(personId).trim() : null;

        if (!cleanUsername || !/^[a-z0-9._-]{3,64}$/.test(cleanUsername)) {
            return res.status(400).json({
                error: 'Tên đăng nhập không hợp lệ (3–64 ký tự chữ thường, số, dấu chấm, gạch dưới hoặc gạch ngang).'
            });
        }
        if (!password || String(password).length < 8) {
            return res.status(400).json({ error: 'Mật khẩu khởi tạo phải có ít nhất 8 ký tự.' });
        }

        try {
            const existing = await dbAccessor.getQuery(
                "SELECT id FROM accounts WHERE LOWER(username) = LOWER(?)",
                [cleanUsername]
            );
            if (existing) {
                return res.status(409).json({ error: 'Tên đăng nhập đã tồn tại.' });
            }

            if (cleanEmail) {
                const existingEmail = await dbAccessor.getQuery(
                    "SELECT id FROM accounts WHERE LOWER(email) = LOWER(?)",
                    [cleanEmail]
                );
                if (existingEmail) {
                    return res.status(409).json({ error: 'Email này đã được gắn cho tài khoản khác.' });
                }
            }

            let personRow = null;
            if (cleanPersonId) {
                personRow = await dbAccessor.getQuery(
                    "SELECT id, name, birthYear FROM people WHERE id = ?",
                    [cleanPersonId]
                );
                if (!personRow) {
                    return res.status(400).json({ error: 'Không tìm thấy hồ sơ nhân vật được chọn trong phả hệ.' });
                }
            }

            const newId = randomUUID();
            const passwordHash = await bcrypt.hash(String(password), 10);

            await dbAccessor.runQuery(
                "INSERT INTO accounts (id, username, email, password_hash, role, status) VALUES (?, ?, ?, ?, 'member', 'PROVISIONED')",
                [newId, cleanUsername, cleanEmail, passwordHash]
            );

            if (cleanPersonId) {
                await dbAccessor.runQuery(
                    "INSERT INTO identity_mappings (account_id, person_id) VALUES (?, ?)",
                    [newId, cleanPersonId]
                );
            }

            res.status(201).json({
                ok: true,
                account: {
                    id: newId,
                    username: cleanUsername,
                    email: cleanEmail,
                    role: 'member',
                    status: 'PROVISIONED',
                    person_id: cleanPersonId,
                    person_name: personRow ? personRow.name : null,
                    birth_year: personRow ? personRow.birthYear : null
                }
            });
        } catch (e) {
            if (e && e.message && e.message.toUpperCase().includes('UNIQUE')) {
                return res.status(409).json({ error: 'Tên đăng nhập hoặc email đã tồn tại.' });
            }
            res.status(500).json({ error: 'Không thể tạo tài khoản thành viên.' });
        }
    });

    /* 3. PATCH /api/admin/member-accounts/:id */
    router.patch('/member-accounts/:id', requireAuth, requireOwner, async (req, res) => {
        const { id } = req.params;
        const { newPassword, status, personId } = req.body || {};

        if (newPassword === undefined && status === undefined && personId === undefined) {
            return res.status(400).json({ error: 'Không có thông tin cần cập nhật.' });
        }

        try {
            const acc = await dbAccessor.getQuery(
                "SELECT id, username, role, status FROM accounts WHERE id = ?",
                [id]
            );
            if (!acc) {
                return res.status(404).json({ error: 'Không tìm thấy tài khoản thành viên.' });
            }

            const setClauses = [];
            const params = [];

            if (newPassword !== undefined && newPassword !== '') {
                if (String(newPassword).length < 8) {
                    return res.status(400).json({ error: 'Mật khẩu tạm phải có ít nhất 8 ký tự.' });
                }
                const hash = await bcrypt.hash(String(newPassword), 10);
                setClauses.push("password_hash = ?");
                params.push(hash);
                setClauses.push("status = 'PROVISIONED'");
            } else if (status !== undefined) {
                if (!VALID_ACCOUNT_STATUSES.includes(status)) {
                    return res.status(400).json({ error: 'Trạng thái tài khoản không hợp lệ.' });
                }
                if (req.session && req.session.accountId === id && status === 'DISABLED') {
                    return res.status(400).json({ error: 'Không thể tự khóa tài khoản của chính bạn.' });
                }
                setClauses.push("status = ?");
                params.push(status);
            }

            if (personId !== undefined) {
                const cleanPersonId = personId ? String(personId).trim() : '';
                if (cleanPersonId) {
                    const personRow = await dbAccessor.getQuery(
                        "SELECT id FROM people WHERE id = ?",
                        [cleanPersonId]
                    );
                    if (!personRow) {
                        return res.status(400).json({ error: 'Không tìm thấy hồ sơ nhân vật được chọn.' });
                    }
                }
                await dbAccessor.runQuery("DELETE FROM identity_mappings WHERE account_id = ?", [id]);
                if (cleanPersonId) {
                    await dbAccessor.runQuery(
                        "INSERT INTO identity_mappings (account_id, person_id) VALUES (?, ?)",
                        [id, cleanPersonId]
                    );
                }
            }

            if (setClauses.length > 0) {
                params.push(id);
                await dbAccessor.runQuery(
                    `UPDATE accounts SET ${setClauses.join(', ')} WHERE id = ?`,
                    params
                );
            }

            res.json({ ok: true, id });
        } catch (e) {
            res.status(500).json({ error: 'Không thể cập nhật tài khoản thành viên.' });
        }
    });

    /* 4. GET /api/admin/proposals */
    router.get('/proposals', requireAuth, async (req, res) => {
        try {
            const rows = await dbAccessor.allQuery(`
                SELECT
                    pr.id,
                    pr.account_id,
                    a.username AS account_username,
                    pr.person_id,
                    p.name AS person_name,
                    pr.field,
                    pr.suggested_value,
                    pr.base_value,
                    pr.source_evidence,
                    pr.reason,
                    pr.status,
                    pr.reviewer_note,
                    pr.reviewer_id,
                    pr.committed_at,
                    pr.commit_error,
                    pr.created_at,
                    pr.reviewed_at
                FROM proposals pr
                LEFT JOIN people p ON p.id = pr.person_id
                LEFT JOIN accounts a ON a.id = pr.account_id
                ORDER BY pr.created_at DESC, pr.id DESC
            `);

            const pendingCount = rows.filter(r => r.status === 'PENDING').length;
            res.json({ proposals: rows, pendingCount });
        } catch (e) {
            res.status(500).json({ error: 'Không thể tải danh sách đề xuất.' });
        }
    });

    /* 5. PATCH /api/admin/proposals/:id */
    router.patch('/proposals/:id', requireAuth, requireOwner, async (req, res) => {
        const { id } = req.params;
        const { reviewer_note, reviewerNote } = req.body || {};
        const status = req.body ? (req.body.status || req.body.action) : null;

        if (!status || !VALID_PROPOSAL_STATUSES.includes(status)) {
            return res.status(400).json({ error: 'Trạng thái duyệt không hợp lệ (APPROVED, REJECTED, PENDING).' });
        }

        const rawNote = reviewer_note !== undefined ? reviewer_note : reviewerNote;
        const cleanNote = rawNote !== undefined && rawNote !== null ? String(rawNote).trim() : null;

        try {
            if (status === 'APPROVED') {
                const commitResult = await commitProposal(
                    dbAccessor,
                    id,
                    req.session.userId,
                    cleanNote,
                    req.session.accountId
                );
                return res.json(commitResult);
            } else if (status === 'REJECTED') {
                const rejectResult = await rejectProposal(
                    dbAccessor,
                    id,
                    req.session.userId,
                    cleanNote,
                    req.session.accountId
                );
                return res.json(rejectResult);
            } else {
                // Reset to PENDING
                const reviewedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
                await dbAccessor.runQuery(
                    "UPDATE proposals SET status = 'PENDING', reviewer_note = ?, reviewed_at = ? WHERE id = ?",
                    [cleanNote, reviewedAt, id]
                );
                return res.json({ ok: true, id, status: 'PENDING', reviewer_note: cleanNote });
            }
        } catch (e) {
            const statusCode = e.statusCode || (e.code === 'SELF_APPROVAL_PROHIBITED' ? 403 : (e.code === 'CONCURRENCY_CONFLICT' ? 409 : 500));
            res.status(statusCode).json({
                error: e.code || 'PROPOSAL_ACTION_FAILED',
                message: e.message || 'Không thể cập nhật trạng thái đề xuất.'
            });
        }
    });

    /* 6. GET /api/admin/audit-logs */
    router.get('/audit-logs', requireAuth, requireOwner, async (req, res) => {
        try {
            const limit = Math.min(parseInt(req.query.limit || '100', 10), 500);
            const logs = await dbAccessor.allQuery(
                `SELECT * FROM audit_logs ORDER BY created_at DESC, id DESC LIMIT ?`,
                [limit]
            );
            res.json({ logs });
        } catch (e) {
            res.status(500).json({ error: 'Không thể tải nhật ký kiểm toán.' });
        }
    });

    return router;
}

module.exports = { createAdminOperationsRouter };

