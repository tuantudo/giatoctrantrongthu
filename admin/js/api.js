// Local dev (start-all.cmd) serves the admin UI from localhost/127.0.0.1 and runs
// the API on the same host, port 3000; everywhere else (Vercel) talks to the real API domain.
// IMPORTANT: must match window.location.hostname exactly (not just "both loopback").
// browsers treat "localhost" and "127.0.0.1" as different sites, which blocks the
// SameSite=Lax session cookie on every request after login if they don't match.
const API_BASE = window.location.hostname === 'admin.giatoctrantrongthu.com'
    ? 'https://api.giatoctrantrongthu.com/api'
    : '/api';

export class UnauthorizedError extends Error {}

async function apiFetch(url, opts = {}) {
    const res = await fetch(url, { ...opts, credentials: 'include' });
    if (res.status === 401) {
        throw new UnauthorizedError('Chưa đăng nhập hoặc phiên đã hết hạn');
    }
    return res;
}

function jsonBody(obj) {
    return { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(obj) };
}

// ---------------- AUTH ----------------
export async function login(username, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        ...jsonBody({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Đăng nhập thất bại');
    return data.user;
}

export async function logout() {
    await fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include' });
}

export async function getCurrentUser() {
    const res = await apiFetch(`${API_BASE}/auth/me`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.user;
}

// ---------------- ADMIN USERS ----------------
export async function listAdminUsers() {
    return apiFetch(`${API_BASE}/admin/users`).then(r => r.json());
}
export async function createAdminUser(username, password, role) {
    const res = await apiFetch(`${API_BASE}/admin/users`, { method: 'POST', ...jsonBody({ username, password, role }) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không tạo được user');
    return data;
}
export async function updateAdminUser(id, patch) {
    const res = await apiFetch(`${API_BASE}/admin/users/${id}`, { method: 'PATCH', ...jsonBody(patch) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không cập nhật được user');
    return data;
}
export async function deleteAdminUser(id) {
    const res = await apiFetch(`${API_BASE}/admin/users/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không xóa được user');
    return data;
}

// ---------------- PEOPLE ----------------
export async function getPeople() {
    return apiFetch(`${API_BASE}/admin/content/people`).then(r => r.json());
}
export async function getPerson(id) {
    return apiFetch(`${API_BASE}/admin/content/people`).then(r => r.json()).then(people => {
        const person = people.find(item => item.id === id);
        if (!person) throw new Error('Không tìm thấy hồ sơ');
        return person;
    });
}
export async function savePerson(person) {
    return apiFetch(`${API_BASE}/people`, { method: 'POST', ...jsonBody(person) }).then(r => r.json());
}

export async function getStories() {
    return apiFetch(`${API_BASE}/admin/content/stories`).then(r => r.json());
}
export async function saveStory(story) {
    return apiFetch(`${API_BASE}/stories`, { method: 'POST', ...jsonBody(story) }).then(r => r.json());
}

export async function getEdges() {
    return apiFetch(`${API_BASE}/admin/content/edges`).then(r => r.json());
}
export async function addEdge(source_id, target_id, edge_type) {
    return apiFetch(`${API_BASE}/edges`, { method: 'POST', ...jsonBody({ source_id, target_id, edge_type }) }).then(r => r.json());
}
export async function removeEdge(source_id, target_id, edge_type) {
    return apiFetch(`${API_BASE}/edges`, { method: 'DELETE', ...jsonBody({ source_id, target_id, edge_type }) }).then(r => r.json());
}

export async function getEvents() {
    return apiFetch(`${API_BASE}/admin/content/events`).then(r => r.json());
}
export async function saveEvent(event) {
    return apiFetch(`${API_BASE}/events`, { method: 'POST', ...jsonBody(event) }).then(r => r.json());
}

export async function getDatabaseSchema() {
    const res = await apiFetch(`${API_BASE}/admin/database/schema`);
    return await res.json();
}

// ---------------- PROPOSALS INBOX ----------------
export async function getProposals() {
    const res = await apiFetch(`${API_BASE}/admin/proposals`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không tải được danh sách đề xuất');
    return data;
}

export async function updateProposal(id, payload) {
    const res = await apiFetch(`${API_BASE}/admin/proposals/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        ...jsonBody(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không cập nhật được đề xuất');
    return data;
}

// ---------------- MEMBER ACCOUNTS ----------------
export async function getMemberAccounts() {
    const res = await apiFetch(`${API_BASE}/admin/member-accounts`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không tải được danh sách tài khoản thành viên');
    return data;
}

export async function createMemberAccount(payload) {
    const res = await apiFetch(`${API_BASE}/admin/member-accounts`, {
        method: 'POST',
        ...jsonBody(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không tạo được tài khoản thành viên');
    return data;
}

export async function updateMemberAccount(id, payload) {
    const res = await apiFetch(`${API_BASE}/admin/member-accounts/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        ...jsonBody(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không cập nhật được tài khoản thành viên');
    return data;
}
