/**
 * server/governance.js
 * V2.0.0 Minimum Viable Governance (MVG) Engine.
 *
 * Core Capabilities:
 * 1. Centralized Audit Logging (audit_logs table).
 * 2. Atomic Database Transactions (SQLite & MariaDB support).
 * 3. Proposal Lifecycle:
 *    SUBMIT -> REVIEW -> APPROVE / REJECT -> VALIDATE -> ATOMIC COMMIT -> AUDIT
 * 4. Owner Direct Edit with Mandatory Audit Trail.
 * 5. Optimistic Concurrency & Anti-Self-Approval Enforcement.
 */

const { randomUUID } = require('crypto');

/**
 * Executes a MariaDB transaction using a dedicated connection acquired from the pool.
 * Guarantees all queries inside the callback run on that exact connection,
 * commits on success, rolls back on error, and always releases the connection in finally.
 *
 * @param {object} pool - mysql2/promise Pool instance
 * @param {function} callback - async (txAccessor) => Promise<any>
 * @returns {Promise<any>}
 */
async function runMariaDBTransaction(pool, callback) {
    let conn = null;
    try {
        conn = await pool.getConnection();
    } catch (acquireErr) {
        throw new Error(`Failed to acquire MariaDB connection from pool: ${acquireErr.message}`);
    }

    try {
        try {
            await conn.beginTransaction();
        } catch (beginErr) {
            throw new Error(`Failed to begin MariaDB transaction: ${beginErr.message}`);
        }

        // Scoped accessor strictly bound to this dedicated connection
        const txAccessor = {
            runQuery: async (q, params = []) => {
                const [result] = await conn.execute(q, params);
                return result;
            },
            allQuery: async (q, params = []) => {
                const [rows] = await conn.execute(q, params);
                return rows;
            },
            getQuery: async (q, params = []) => {
                const [rows] = await conn.execute(q, params);
                return rows && rows.length > 0 ? rows[0] : null;
            },
            isMySQL: true,
            connection: conn
        };

        let result;
        try {
            result = await callback(txAccessor);
        } catch (bizErr) {
            try {
                await conn.rollback();
            } catch (rollbackErr) {
                console.error('Failed to rollback MariaDB transaction:', rollbackErr.message);
            }
            throw bizErr;
        }

        try {
            await conn.commit();
        } catch (commitErr) {
            try {
                await conn.rollback();
            } catch (rollbackErr) {
                console.error('Failed to rollback MariaDB transaction after failed commit:', rollbackErr.message);
            }
            throw new Error(`Failed to commit MariaDB transaction: ${commitErr.message}`);
        }

        return result;
    } finally {
        if (conn && typeof conn.release === 'function') {
            try {
                conn.release();
            } catch (releaseErr) {
                console.error('Failed to release MariaDB connection back to pool:', releaseErr.message);
            }
        }
    }
}

/**
 * Executes a SQLite transaction using BEGIN IMMEDIATE.
 *
 * @param {object} dbAccessor - SQLite dbAccessor
 * @param {function} callback - async (accessor) => Promise<any>
 * @returns {Promise<any>}
 */
async function runSQLiteTransaction(dbAccessor, callback) {
    await dbAccessor.runQuery('BEGIN IMMEDIATE');
    let result;
    try {
        result = await callback(dbAccessor);
    } catch (bizErr) {
        try {
            await dbAccessor.runQuery('ROLLBACK');
        } catch (rollbackErr) {
            console.error('Failed to rollback SQLite transaction:', rollbackErr.message);
        }
        throw bizErr;
    }

    try {
        await dbAccessor.runQuery('COMMIT');
    } catch (commitErr) {
        try {
            await dbAccessor.runQuery('ROLLBACK');
        } catch (rollbackErr) {
            console.error('Failed to rollback SQLite transaction after failed commit:', rollbackErr.message);
        }
        throw new Error(`Failed to commit SQLite transaction: ${commitErr.message}`);
    }

    return result;
}

/**
 * Executes a callback within an atomic database transaction.
 * Automatically delegates to MariaDB pool connection or SQLite transaction runner.
 *
 * @param {object} dbAccessor - { runQuery, getQuery, allQuery, isMySQL, pool }
 * @param {function} callback - async (accessor) => Promise<any>
 * @returns {Promise<any>}
 */
async function withTransaction(dbAccessor, callback) {
    if (!dbAccessor) {
        throw new Error('dbAccessor is required for transaction');
    }

    // 1. Custom transaction delegate
    if (typeof dbAccessor.withTransaction === 'function') {
        return await dbAccessor.withTransaction(callback);
    }

    // 2. MariaDB / MySQL pool
    if (dbAccessor.isMySQL || dbAccessor.pool) {
        const pool = dbAccessor.pool;
        if (!pool || typeof pool.getConnection !== 'function') {
            throw new Error('MariaDB transaction requires a valid mysql2 pool with getConnection()');
        }
        return await runMariaDBTransaction(pool, callback);
    }

    // 3. SQLite transaction
    if (typeof dbAccessor.runQuery !== 'function') {
        throw new Error('dbAccessor with runQuery is required for SQLite transaction');
    }
    return await runSQLiteTransaction(dbAccessor, callback);
}

/**
 * Records an immutable entry into audit_logs.
 *
 * @param {object} dbAccessor
 * @param {object} params
 */
async function recordAuditLog(dbAccessor, {
    actorId,
    actorRole = 'system',
    action,
    entityType,
    entityId,
    beforeValue = null,
    afterValue = null,
    reason = null,
    correlationId = null
}) {
    const id = 'AUDIT_' + Date.now() + '_' + randomUUID().slice(0, 8);
    const beforeStr = beforeValue !== null && typeof beforeValue === 'object' ? JSON.stringify(beforeValue) : (beforeValue !== null ? String(beforeValue) : null);
    const afterStr = afterValue !== null && typeof afterValue === 'object' ? JSON.stringify(afterValue) : (afterValue !== null ? String(afterValue) : null);
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    await dbAccessor.runQuery(
        `INSERT INTO audit_logs (id, actor_id, actor_role, action, entity_type, entity_id, before_value, after_value, reason, correlation_id, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            id,
            String(actorId || 'unknown'),
            String(actorRole || 'member'),
            String(action),
            String(entityType),
            String(entityId),
            beforeStr,
            afterStr,
            reason ? String(reason) : null,
            correlationId ? String(correlationId) : null,
            now
        ]
    );
    return id;
}

/**
 * Commits an approved proposal to official canonical data atomically.
 *
 * @param {object} dbAccessor
 * @param {string} proposalId
 * @param {string} reviewerId (Owner)
 * @param {string} reviewerNote
 * @param {string} reviewerAccountId
 */
async function commitProposal(dbAccessor, proposalId, reviewerId, reviewerNote = null, reviewerAccountId = null) {
    return withTransaction(dbAccessor, async (tx) => {
        // 1. Fetch proposal
        const proposal = await tx.getQuery(
            "SELECT * FROM proposals WHERE id = ?",
            [proposalId]
        );
        if (!proposal) {
            const err = new Error('Không tìm thấy đề xuất: ' + proposalId);
            err.statusCode = 404;
            throw err;
        }

        // 2. State & Idempotency Check
        if (proposal.status === 'APPROVED' && proposal.committed_at) {
            const err = new Error('Đề xuất này đã được phê duyệt và commit trước đó (Idempotent).');
            err.statusCode = 409;
            throw err;
        }

        // 3. Anti-Self-Approval
        if (reviewerAccountId && proposal.account_id && String(reviewerAccountId) === String(proposal.account_id)) {
            const err = new Error('Người tạo đề xuất không được tự phê duyệt đề xuất của chính mình.');
            err.statusCode = 403;
            err.code = 'SELF_APPROVAL_PROHIBITED';
            throw err;
        }

        // 4. Validate Target Entity (people)
        const person = await tx.getQuery(
            "SELECT * FROM people WHERE id = ?",
            [proposal.person_id]
        );
        if (!person) {
            const err = new Error(`Nhân vật ${proposal.person_id} không tồn tại trong hệ thống.`);
            err.statusCode = 400;
            throw err;
        }

        const field = proposal.field;
        const suggestedValue = proposal.suggested_value;
        const beforeValue = person[field] !== undefined ? person[field] : null;

        // 5. Optimistic Concurrency Check
        if (proposal.base_value !== null && proposal.base_value !== undefined) {
            if (String(beforeValue || '') !== String(proposal.base_value || '')) {
                const err = new Error(`Dữ liệu đã bị thay đổi kể từ khi tạo đề xuất (Hiện tại: "${beforeValue}", Gốc: "${proposal.base_value}"). Vui lòng kiểm tra lại.`);
                err.statusCode = 409;
                err.code = 'CONCURRENCY_CONFLICT';
                throw err;
            }
        }

        // 6. Update Canonical Data (people table & payload JSON)
        let payload = {};
        if (person.payload) {
            try {
                payload = typeof person.payload === 'string' ? JSON.parse(person.payload) : person.payload;
            } catch (e) {
                payload = {};
            }
        }

        // Synchronize top-level fields & payload JSON
        if (field === 'name') {
            person.name = suggestedValue;
            payload.name = suggestedValue;
        } else if (field === 'birthYear' || field === 'birth') {
            person.birthYear = suggestedValue;
            if (!payload.birth) payload.birth = {};
            payload.birth.date = suggestedValue;
        } else if (field === 'deathYear' || field === 'death') {
            person.deathYear = suggestedValue;
            if (!payload.death) payload.death = {};
            payload.death.date = suggestedValue;
        } else if (field === 'gender' || field === 'sex') {
            person.gender = suggestedValue;
            payload.sex = suggestedValue === 'Nam' ? 'M' : (suggestedValue === 'Nữ' ? 'F' : 'U');
        } else if (field === 'notes') {
            person.notes = suggestedValue;
            payload.notes = suggestedValue;
        } else if (field === 'status') {
            person.status = suggestedValue;
        } else {
            // Generic attribute update into payload
            payload[field] = suggestedValue;
        }

        const payloadStr = JSON.stringify(payload);
        await tx.runQuery(
            "UPDATE people SET name = ?, birthYear = ?, deathYear = ?, gender = ?, notes = ?, status = ?, payload = ? WHERE id = ?",
            [person.name, person.birthYear, person.deathYear, person.gender, person.notes, person.status || 'PUBLISHED', payloadStr, person.id]
        );

        // 7. Update Proposal State to APPROVED & COMMITTED
        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
        await tx.runQuery(
            `UPDATE proposals
             SET status = 'APPROVED',
                 reviewer_id = ?,
                 reviewer_note = ?,
                 reviewed_at = ?,
                 committed_at = ?,
                 commit_error = NULL
             WHERE id = ?`,
            [reviewerId, reviewerNote, now, now, proposalId]
        );

        // 8. Record Audit Log
        const afterValue = suggestedValue;
        await recordAuditLog(tx, {
            actorId: reviewerId,
            actorRole: 'owner',
            action: 'PROPOSAL_COMMIT',
            entityType: 'people',
            entityId: person.id,
            beforeValue: { field, value: beforeValue },
            afterValue: { field, value: afterValue },
            reason: reviewerNote || proposal.reason,
            correlationId: proposalId
        });

        return {
            ok: true,
            proposalId,
            status: 'APPROVED',
            committedAt: now,
            personId: person.id,
            field,
            beforeValue,
            afterValue
        };
    });
}

/**
 * Rejects a proposal. Does NOT touch canonical data.
 */
async function rejectProposal(dbAccessor, proposalId, reviewerId, reviewerNote = null, reviewerAccountId = null) {
    return withTransaction(dbAccessor, async (tx) => {
        const proposal = await tx.getQuery("SELECT * FROM proposals WHERE id = ?", [proposalId]);
        if (!proposal) {
            const err = new Error('Không tìm thấy đề xuất: ' + proposalId);
            err.statusCode = 404;
            throw err;
        }

        if (reviewerAccountId && proposal.account_id && String(reviewerAccountId) === String(proposal.account_id)) {
            const err = new Error('Người tạo đề xuất không được tự từ chối/phê duyệt đề xuất của chính mình.');
            err.statusCode = 403;
            err.code = 'SELF_APPROVAL_PROHIBITED';
            throw err;
        }

        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
        await tx.runQuery(
            `UPDATE proposals
             SET status = 'REJECTED',
                 reviewer_id = ?,
                 reviewer_note = ?,
                 reviewed_at = ?,
                 commit_error = NULL
             WHERE id = ?`,
            [reviewerId, reviewerNote, now, proposalId]
        );

        await recordAuditLog(tx, {
            actorId: reviewerId,
            actorRole: 'owner',
            action: 'PROPOSAL_REJECTED',
            entityType: 'proposals',
            entityId: proposalId,
            beforeValue: { status: proposal.status },
            afterValue: { status: 'REJECTED' },
            reason: reviewerNote,
            correlationId: proposalId
        });

        return {
            ok: true,
            proposalId,
            status: 'REJECTED',
            reviewedAt: now
        };
    });
}

/**
 * Wrapper for Owner Direct Edit that guarantees atomic mutation + mandatory audit log.
 */
async function executeDirectEditWithAudit(dbAccessor, {
    actorId,
    entityType,
    entityId,
    reason = null,
    fetchBeforeState,
    performMutation,
    fetchAfterState
}) {
    return withTransaction(dbAccessor, async (tx) => {
        const beforeState = fetchBeforeState ? await fetchBeforeState(tx) : null;
        const mutationResult = await performMutation(tx);
        const afterState = fetchAfterState ? await fetchAfterState(tx) : mutationResult;

        const correlationId = 'DIRECT_' + Date.now();
        await recordAuditLog(tx, {
            actorId,
            actorRole: 'owner',
            action: 'DIRECT_EDIT',
            entityType,
            entityId,
            beforeValue: beforeState,
            afterValue: afterState,
            reason,
            correlationId
        });

        return {
            success: true,
            mutationResult,
            correlationId
        };
    });
}

module.exports = {
    withTransaction,
    runMariaDBTransaction,
    runSQLiteTransaction,
    recordAuditLog,
    commitProposal,
    rejectProposal,
    executeDirectEditWithAudit
};
