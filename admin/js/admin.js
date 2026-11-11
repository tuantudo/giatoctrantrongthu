import * as API from './api.js';
import { UnauthorizedError } from './api.js';

const mainView = document.getElementById('main-view');
const badgeInbox = document.getElementById('badge-inbox');
let currentUser = null;

// Modal Elements
const typeaheadOverlay = document.getElementById('typeahead-overlay');
const typeaheadInput = document.getElementById('typeahead-input');
const typeaheadResults = document.getElementById('typeahead-results');
const typeaheadTitle = document.getElementById('typeahead-title');
const previewModal = document.getElementById('preview-modal');
const previewContent = document.getElementById('preview-content');

let currentTypeaheadCallback = null;
let allPeopleCache = []; // used for typeahead

// Routing
window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', init);

function goToLogin() {
    window.location.href = '/admin/login.html';
}

async function init() {
    try {
        currentUser = await API.getCurrentUser();
    } catch (e) {
        currentUser = null;
    }
    if (!currentUser) {
        goToLogin();
        return;
    }

    document.getElementById('user-info').textContent = `${currentUser.username} · ${currentUser.role === 'owner' ? 'Owner' : 'Editor'}`;
    if (currentUser.role === 'owner') {
        document.getElementById('nav-section-admin').classList.remove('hidden');
    }
    document.getElementById('btn-logout').addEventListener('click', async () => {
        await API.logout();
        goToLogin();
    });

    try {
        allPeopleCache = await API.getPeople();
    } catch (e) {
        if (e instanceof UnauthorizedError) return goToLogin();
        throw e;
    }
    updateBadge();
    router();

    document.getElementById('typeahead-backdrop').addEventListener('click', closeTypeahead);
    document.getElementById('btn-close-modal').addEventListener('click', closePreview);

    typeaheadInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const results = allPeopleCache.filter(p => (p.name || '').toLowerCase().includes(term) || (p.id || '').toLowerCase().includes(term));
        renderTypeaheadResults(results, Boolean(typeaheadOverlay.dataset.allowUnlink === '1'));
    });
}

async function updateBadge() {
    try {
        const data = await API.getProposals();
        const pendingCount = Number(data && data.pendingCount ? data.pendingCount : 0);
        badgeInbox.textContent = String(pendingCount);
        badgeInbox.style.display = pendingCount > 0 ? 'inline-block' : 'none';
    } catch (e) {
        badgeInbox.style.display = 'none';
    }
}

async function router() {
    const hash = window.location.hash.slice(1) || '/';
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

    const baseRoute = '/' + (hash.split('/')[1] || '');
    const activeNav = document.querySelector(`.nav-item[href="#${baseRoute}"]`) || document.querySelector('.nav-item[href="#/"]');
    if (activeNav) activeNav.classList.add('active');

    try {
        if (hash === '/') await renderDashboard();
        else if (hash === '/inbox') await renderInbox();
        else if (hash === '/members') await renderMembersList();
        else if (hash === '/people') await renderPeopleList();
        else if (hash.startsWith('/people/')) await renderPersonEditor(hash.split('/')[2]);
        else if (hash === '/stories') await renderStoriesList();
        else if (hash.startsWith('/stories/')) await renderStoryEditor(hash.split('/')[2]);
        else if (hash === '/events' || hash === '/eventsgiat') await renderEventsList();
        else if (hash.startsWith('/events/')) await renderEventEditor(hash.split('/')[2]);
        else if (hash.startsWith('/eventsgiat/')) await renderEventEditor(hash.split('/')[2]);
        else if (hash === '/users') await renderUsersList();
        else if (hash === '/database') await renderDatabaseOverview();
        else mainView.innerHTML = `<div class="view-header"><h1>Chưa có sẵn</h1></div><div class="view-content"><p>Tính năng chưa tích hợp DB thật.</p></div>`;
    } catch (e) {
        if (e instanceof UnauthorizedError) return goToLogin();
        throw e;
    }
}

// ---------------- DASHBOARD ----------------
async function renderDashboard() {
    const [stories, people, proposalsData, membersData] = await Promise.all([
        API.getStories(),
        API.getPeople(),
        API.getProposals().catch(() => ({ proposals: [], pendingCount: 0 })),
        currentUser && currentUser.role === 'owner'
            ? API.getMemberAccounts().catch(() => ({ accounts: [] }))
            : Promise.resolve({ accounts: [] })
    ]);
    const draftStories = stories.filter(s => s.status === 'DRAFT').length;
    const pendingProposals = Number(proposalsData.pendingCount || 0);
    const memberAccountsCount = Array.isArray(membersData.accounts) ? membersData.accounts.length : 0;

    mainView.innerHTML = `
        <div class="view-header"><h1>Dashboard</h1></div>
        <div class="view-content">
            <div class="grid">
                <a href="#/inbox" class="card">
                    <h3>Hộp thư Đề xuất</h3>
                    <div class="metric">${pendingProposals}</div>
                    <div class="desc">Đề xuất dữ kiện đang chờ duyệt</div>
                </a>
                <a href="#/people" class="card">
                    <h3>Hồ sơ</h3>
                    <div class="metric">${people.length}</div>
                    <div class="desc">Nhân sự trong phả hệ</div>
                </a>
                <a href="#/stories" class="card">
                    <h3>Bản nháp</h3>
                    <div class="metric">${draftStories}</div>
                    <div class="desc">Mạch đang soạn thảo</div>
                </a>
                ${currentUser && currentUser.role === 'owner' ? `
                <a href="#/members" class="card">
                    <h3>Thành viên</h3>
                    <div class="metric">${memberAccountsCount}</div>
                    <div class="desc">Tài khoản Không gian Gia tộc</div>
                </a>` : ''}
            </div>
        </div>
    `;
}

function escAdmin(v){return String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
// ---------------- PEOPLE ----------------
async function renderPeopleList() {
    const people = await API.getPeople();
    const rows = people.map(p => `
        <tr onclick="window.location.hash = '/people/${p.id}'">
            <td>${escAdmin(p.name)}</td>
            <td>${escAdmin(p.birthYear || '?')} - ${escAdmin(p.deathYear || (p.gender === 'Nam' ? 'Hiện tại' : 'Hiện tại'))}</td>
            <td>${escAdmin(p.gender)}</td>
            <td><span class="status ${escAdmin(p.status.toLowerCase())}">${escAdmin(p.status)}</span></td>
        </tr>
    `).join('');

    mainView.innerHTML = `
        <div class="view-header">
            <h1>Nhân sự (Hồ sơ)</h1>
            <button class="btn btn-primary" onclick="window.location.hash = '/people/new'">+ Thêm Người Mới</button>
        </div>
        <div class="view-content">
            <table class="data-table">
                <thead><tr><th>Họ tên</th><th>Năm sinh - mất</th><th>Giới tính</th><th>Trạng thái</th></tr></thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    `;
}

async function renderPersonEditor(id) {
    let p;
    let isNew = false;
    if (id === 'new') {
        isNew = true;
        p = { id: 'p' + Date.now(), name: '', birthYear: '', deathYear: '', gender: 'Nam', status: 'DRAFT', notes: '' };
    } else {
        const people = await API.getPeople();
        p = people.find(x => x.id === id);
    }
    
    const edges = await API.getEdges();
    const parents = edges.filter(e => e.target_id === p.id && e.edge_type === 'PARENT').map(e => e.source_id);
    const children = edges.filter(e => e.source_id === p.id && e.edge_type === 'PARENT').map(e => e.target_id);
    const spouses = edges.filter(e => (e.source_id === p.id || e.target_id === p.id) && e.edge_type === 'SPOUSE')
                        .map(e => e.source_id === p.id ? e.target_id : e.source_id);

    window.savePerson = async () => {
        p.name = document.getElementById('p-name').value;
        p.birthYear = document.getElementById('p-birth').value;
        p.deathYear = document.getElementById('p-death').value;
        p.gender = document.getElementById('p-gender').value;
        p.notes = document.getElementById('p-notes').value;
        await API.savePerson(p);
        allPeopleCache = await API.getPeople(); // update cache
        renderPersonEditor(p.id); 
    };

    window.publishPerson = async () => {
        p.status = 'PUBLISHED';
        await window.savePerson();
    };

    window.removeEdge = async (type, targetId) => {
        if (type === 'parents') await API.removeEdge(targetId, p.id, 'PARENT');
        if (type === 'children') await API.removeEdge(p.id, targetId, 'PARENT');
        if (type === 'spouses') {
            await API.removeEdge(p.id, targetId, 'SPOUSE');
            await API.removeEdge(targetId, p.id, 'SPOUSE');
        }
        renderPersonEditor(p.id);
    };

    window.openTypeahead = (type, title) => {
        typeaheadTitle.textContent = title;
        typeaheadInput.value = '';
        currentTypeaheadCallback = async (selectedId) => {
            if (type === 'parents') await API.addEdge(selectedId, p.id, 'PARENT');
            if (type === 'children') await API.addEdge(p.id, selectedId, 'PARENT');
            if (type === 'spouses') await API.addEdge(p.id, selectedId, 'SPOUSE'); // Only 1 way needed if query checks both, but we can do it
            renderPersonEditor(p.id);
        };
        renderTypeaheadResults(allPeopleCache);
        typeaheadOverlay.classList.remove('hidden');
        typeaheadInput.focus();
    };

    const renderEdgeChips = (arr, type) => {
        if (!arr || arr.length === 0) return `<span class="empty-text">Chưa có liên kết</span>`;
        return arr.map(targetId => {
            const target = allPeopleCache.find(x => x.id === targetId);
            return `<div class="edge-chip">${target ? target.name : 'Unknown'} <span class="unlink" onclick="removeEdge('${type}', '${targetId}')">×</span></div>`;
        }).join('');
    };

    mainView.innerHTML = `
        <div class="view-header">
            <h1>${isNew ? 'Thêm Người Mới' : 'Sửa Hồ Sơ'} <span class="status ${p.status.toLowerCase()}">${p.status}</span></h1>
            <div>
                <button class="btn" onclick="savePerson()">Lưu Nháp</button>
                ${p.status !== 'PUBLISHED' ? `<button class="btn btn-primary" onclick="publishPerson()">Xuất Bản</button>` : ''}
            </div>
        </div>
        <div class="view-content">
            <div class="inbox-split">
                <!-- Left: Info -->
                <div style="flex: 1;">
                    <div class="form-group">
                        <label class="form-label">Họ và tên</label>
                        <input type="text" class="form-control" id="p-name" value="${p.name}">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Năm sinh</label>
                            <input type="text" class="form-control" id="p-birth" value="${p.birthYear || ''}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Năm mất</label>
                            <input type="text" class="form-control" id="p-death" value="${p.deathYear || ''}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Giới tính</label>
                            <select class="form-control" id="p-gender">
                                <option ${p.gender === 'Nam' ? 'selected' : ''}>Nam</option>
                                <option ${p.gender === 'Nữ' ? 'selected' : ''}>Nữ</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Ghi chú / Tiểu sử ngắn</label>
                        <textarea class="form-control" id="p-notes" style="min-height: 100px;">${p.notes || ''}</textarea>
                    </div>
                </div>
                
                <!-- Right: Relational Graph Edges -->
                <div style="flex: 1;">
                    ${isNew ? '<p>Hãy lưu bản nháp trước khi thêm quan hệ gia đình.</p>' : `
                    <div class="edge-panel">
                        <div class="edge-header">Cha Mẹ <button class="btn-add-edge" onclick="openTypeahead('parents', 'Chọn Cha/Mẹ')">+ Nối</button></div>
                        <div class="edge-content">${renderEdgeChips(parents, 'parents')}</div>
                    </div>
                    <div class="edge-panel">
                        <div class="edge-header">Vợ / Chồng <button class="btn-add-edge" onclick="openTypeahead('spouses', 'Chọn Vợ/Chồng')">+ Nối</button></div>
                        <div class="edge-content">${renderEdgeChips(spouses, 'spouses')}</div>
                    </div>
                    <div class="edge-panel">
                        <div class="edge-header">Con cái <button class="btn-add-edge" onclick="openTypeahead('children', 'Chọn Con cái')">+ Nối</button></div>
                        <div class="edge-content">${renderEdgeChips(children, 'children')}</div>
                    </div>
                    `}
                </div>
            </div>
        </div>
    `;
}

// ---------------- STORIES ----------------
async function renderStoriesList() {
    const stories = await API.getStories();
    const rows = stories.map(s => `
        <tr onclick="window.location.hash = '/stories/${s.id}'">
            <td><strong>${s.title}</strong></td>
            <td>${s.author}</td>
            <td>${s.updatedAt}</td>
            <td><span class="status ${s.status.toLowerCase()}">${s.status}</span></td>
        </tr>
    `).join('');

    mainView.innerHTML = `
        <div class="view-header">
            <h1>Mạch (Bài viết)</h1>
            <button class="btn btn-primary" onclick="window.location.hash = '/stories/new'">+ Viết Bài Mới</button>
        </div>
        <div class="view-content">
            <table class="data-table">
                <thead><tr><th>Tiêu đề</th><th>Tác giả</th><th>Cập nhật</th><th>Trạng thái</th></tr></thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    `;
}

async function renderStoryEditor(id) {
    let s;
    let isNew = false;
    if (id === 'new') {
        isNew = true;
        s = { id: 's' + Date.now(), title: '', author: 'Ban Biên Tập', status: 'DRAFT', updatedAt: new Date().toISOString().split('T')[0], content: '' };
    } else {
        const stories = await API.getStories();
        s = stories.find(x => x.id === id);
    }
    
    const edges = await API.getEdges();
    const linkedPeople = edges.filter(e => e.source_id === s.id && e.edge_type === 'MENTION').map(e => e.target_id);

    window.saveStory = async () => {
        s.title = document.getElementById('s-title').value;
        s.author = document.getElementById('s-author').value;
        s.content = document.getElementById('s-content').value;
        s.updatedAt = new Date().toISOString().split('T')[0];
        await API.saveStory(s);
        renderStoryEditor(s.id); 
    };

    window.publishStory = async () => {
        s.status = 'PUBLISHED';
        await window.saveStory();
    };

    window.previewStory = () => {
        const tempTitle = document.getElementById('s-title').value;
        const tempContent = document.getElementById('s-content').value;
        const tempAuthor = document.getElementById('s-author').value;
        
        previewContent.innerHTML = `
            <div class="preview-title">${tempTitle}</div>
            <div class="preview-meta">Viết bởi ${tempAuthor} • ${s.updatedAt}</div>
            <div class="preview-text">${tempContent}</div>
        `;
        previewModal.classList.remove('hidden');
    };

    window.removeStoryEdge = async (targetId) => {
        await API.removeEdge(s.id, targetId, 'MENTION');
        renderStoryEditor(s.id);
    };

    window.openStoryTypeahead = () => {
        typeaheadTitle.textContent = 'Gắn nhân vật vào bài viết';
        typeaheadInput.value = '';
        currentTypeaheadCallback = async (selectedId) => {
            if (!linkedPeople.includes(selectedId)) {
                await API.addEdge(s.id, selectedId, 'MENTION');
                renderStoryEditor(s.id);
            }
        };
        renderTypeaheadResults(allPeopleCache);
        typeaheadOverlay.classList.remove('hidden');
        typeaheadInput.focus();
    };

    const renderEdgeChips = () => {
        if (!linkedPeople || linkedPeople.length === 0) return `<span class="empty-text">Chưa có liên kết</span>`;
        return linkedPeople.map(targetId => {
            const target = allPeopleCache.find(x => x.id === targetId);
            return `<div class="edge-chip">${target ? target.name : 'Unknown'} <span class="unlink" onclick="removeStoryEdge('${targetId}')">×</span></div>`;
        }).join('');
    };

    mainView.innerHTML = `
        <div class="view-header">
            <h1>Sửa Bài Viết <span class="status ${s.status.toLowerCase()}">${s.status}</span></h1>
            <div>
                <button class="btn" onclick="previewStory()">Preview Public Web</button>
                <button class="btn" onclick="saveStory()">Lưu Nháp</button>
                ${s.status !== 'PUBLISHED' ? `<button class="btn btn-primary" onclick="publishStory()">Xuất Bản</button>` : ''}
            </div>
        </div>
        <div class="view-content">
            <div class="inbox-split">
                <!-- Left: Content -->
                <div style="flex: 2;">
                    <input type="text" class="title-input" id="s-title" value="${s.title}" placeholder="Nhập tiêu đề mạch...">
                    <div class="form-group" style="max-width: 300px;">
                        <label class="form-label">Tác giả (Nguồn)</label>
                        <input type="text" class="form-control" id="s-author" value="${s.author}">
                    </div>
                    <div class="form-group">
                        <textarea class="form-control" id="s-content" placeholder="Nội dung câu chuyện...">${s.content}</textarea>
                    </div>
                </div>
                
                <!-- Right: Metadata & Links -->
                <div style="flex: 1;">
                    ${isNew ? '<p>Lưu nháp trước khi tag nhân vật.</p>' : `
                    <div class="edge-panel">
                        <div class="edge-header">Nhân vật trong bài <button class="btn-add-edge" onclick="openStoryTypeahead()">+ Tag</button></div>
                        <div class="edge-content">${renderEdgeChips()}</div>
                    </div>
                    `}
                </div>
            </div>
        </div>
    `;
}

// ---------------- SHARED: TYPEAHEAD & MODAL ----------------
function renderTypeaheadResults(results, allowUnlink = false) {
    const unlinkOption = allowUnlink ? `
        <li data-typeahead-id="">
            <strong style="color: var(--seal-red);">— Gỡ liên kết nhân vật —</strong>
            <span class="desc">Bỏ gắn hồ sơ phả hệ</span>
        </li>
    ` : '';
    typeaheadResults.innerHTML = unlinkOption + results.map(p => `
        <li data-typeahead-id="${escAdmin(p.id)}">
            <strong>${escAdmin(p.name)}</strong>
            <span class="desc">${escAdmin(p.birthYear || '?')} - ${escAdmin(p.deathYear || '?')} · ${escAdmin(p.id)}</span>
        </li>
    `).join('');

    typeaheadResults.querySelectorAll('li[data-typeahead-id]').forEach(li => {
        li.addEventListener('click', () => {
            window.selectTypeahead(li.getAttribute('data-typeahead-id') || '');
        });
    });
}

window.selectTypeahead = (id) => {
    if (currentTypeaheadCallback) currentTypeaheadCallback(id);
    closeTypeahead();
};

function closeTypeahead() {
    typeaheadOverlay.classList.add('hidden');
    typeaheadOverlay.dataset.allowUnlink = '0';
    currentTypeaheadCallback = null;
}

function closePreview() {
    previewModal.classList.add('hidden');
}

// ---------------- EVENTS ----------------
async function renderEventsList() {
    const events = await API.getEvents();
    
    window.createNewEvent = async () => {
        const uid = 'evt_' + Date.now();
        await API.saveEvent({
            uid,
            summary: 'Sự kiện mới',
            dtstart: '',
            dtend: '',
            description: '',
            location: '',
            calendar_type: 'CAL_04_FAMILY_MILESTONES',
            event_type: 'milestone',
            status: 'DRAFT'
        });
        window.location.hash = '#/events/' + uid;
    };

    mainView.innerHTML = `
        <div class="view-header">
            <h1>Quản Lý Sự Kiện</h1>
            <button class="btn btn-primary" onclick="createNewEvent()">+ Sự Kiện Mới</button>
        </div>
        <div class="view-content">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Tên sự kiện</th>
                        <th>Ngày bắt đầu</th>
                        <th>Loại lịch</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    ${events.map(e => `
                        <tr onclick="window.location.hash='#/events/${e.uid}'">
                            <td><strong>${e.summary || 'Không tên'}</strong></td>
                            <td>${e.dtstart || 'N/A'}</td>
                            <td><span class="badge ${e.calendar_type}">${e.calendar_type}</span></td>
                            <td><span class="status ${e.status ? e.status.toLowerCase() : 'draft'}">${e.status || 'DRAFT'}</span></td>
                        </tr>
                    `).join('')}
                    ${events.length === 0 ? '<tr><td colspan="4" class="empty-text">Chưa có sự kiện nào.</td></tr>' : ''}
                </tbody>
            </table>
        </div>
    `;
}

async function renderEventEditor(uid) {
    const events = await API.getEvents();
    const e = events.find(x => x.uid === uid);
    if (!e) {
        mainView.innerHTML = `<div class="view-content">Không tìm thấy sự kiện.</div>`;
        return;
    }

    const isNew = e.status === 'DRAFT' && e.summary === 'Sự kiện mới';
    
    // Graph links for INVOLVES edge
    const edges = await API.getEdges();
    const linkedPeople = edges.filter(ed => ed.source_id === e.uid && ed.edge_type === 'INVOLVES').map(ed => ed.target_id);

    window.saveEventItem = async () => {
        const payload = {
            uid: e.uid,
            summary: document.getElementById('e-summary').value,
            dtstart: document.getElementById('e-dtstart').value,
            dtend: document.getElementById('e-dtend').value,
            description: document.getElementById('e-desc').value,
            location: document.getElementById('e-location').value,
            calendar_type: document.getElementById('e-caltype').value,
            event_type: document.getElementById('e-evtype').value,
            status: e.status
        };
        await API.saveEvent(payload);
        renderEventsList();
    };

    window.publishEventItem = async () => {
        const payload = {
            uid: e.uid,
            summary: document.getElementById('e-summary').value,
            dtstart: document.getElementById('e-dtstart').value,
            dtend: document.getElementById('e-dtend').value,
            description: document.getElementById('e-desc').value,
            location: document.getElementById('e-location').value,
            calendar_type: document.getElementById('e-caltype').value,
            event_type: document.getElementById('e-evtype').value,
            status: 'PUBLISHED'
        };
        await API.saveEvent(payload);
        renderEventsList();
    };

    window.hideEventItem = async () => {
        const payload = {
            uid: e.uid,
            summary: document.getElementById('e-summary').value,
            dtstart: document.getElementById('e-dtstart').value,
            dtend: document.getElementById('e-dtend').value,
            description: document.getElementById('e-desc').value,
            location: document.getElementById('e-location').value,
            calendar_type: document.getElementById('e-caltype').value,
            event_type: document.getElementById('e-evtype').value,
            status: 'HIDDEN'
        };
        await API.saveEvent(payload);
        renderEventsList();
    };

    window.removeEventEdge = async (targetId) => {
        await API.removeEdge(e.uid, targetId, 'INVOLVES');
        renderEventEditor(e.uid);
    };

    window.openEventTypeahead = () => {
        typeaheadTitle.textContent = 'Gắn nhân vật vào sự kiện';
        typeaheadInput.value = '';
        currentTypeaheadCallback = async (selectedId) => {
            if (!linkedPeople.includes(selectedId)) {
                await API.addEdge(e.uid, selectedId, 'INVOLVES');
                renderEventEditor(e.uid);
            }
        };
        renderTypeaheadResults(allPeopleCache);
        typeaheadOverlay.classList.remove('hidden');
        typeaheadInput.focus();
    };

    const renderEdgeChips = () => {
        if (!linkedPeople || linkedPeople.length === 0) return `<span class="empty-text">Chưa có liên kết</span>`;
        return linkedPeople.map(targetId => {
            const target = allPeopleCache.find(x => x.id === targetId);
            return `<div class="edge-chip">${target ? target.name : 'Unknown'} <span class="unlink" onclick="removeEventEdge('${targetId}')">×</span></div>`;
        }).join('');
    };

    mainView.innerHTML = `
        <div class="view-header">
            <h1>Sửa Sự Kiện <span class="status ${e.status ? e.status.toLowerCase() : 'draft'}">${e.status || 'DRAFT'}</span></h1>
            <div>
                <button class="btn" onclick="saveEventItem()">Lưu Nháp / Save</button>
                ${e.status !== 'PUBLISHED' ? `<button class="btn btn-primary" onclick="publishEventItem()">Xuất Bản (Publish)</button>` : `<button class="btn" onclick="hideEventItem()">Ẩn (Hidden)</button>`}
            </div>
        </div>
        <div class="view-content">
            <div class="inbox-split">
                <div style="flex: 2;">
                    <div class="form-group">
                        <label class="form-label">Tên sự kiện</label>
                        <input type="text" class="form-control title-input" id="e-summary" value="${e.summary || ''}">
                    </div>
                    <div class="form-group" style="display: flex; gap: 1rem;">
                        <div style="flex: 1;">
                            <label class="form-label">Ngày bắt đầu (YYYYMMDD)</label>
                            <input type="text" class="form-control" id="e-dtstart" value="${e.dtstart || ''}">
                        </div>
                        <div style="flex: 1;">
                            <label class="form-label">Ngày kết thúc</label>
                            <input type="text" class="form-control" id="e-dtend" value="${e.dtend || ''}">
                        </div>
                    </div>
                    <div class="form-group" style="display: flex; gap: 1rem;">
                        <div style="flex: 1;">
                            <label class="form-label">Loại lịch (Calendar)</label>
                            <select class="form-control" id="e-caltype">
                                <option value="CAL_01_BIRTHDAYS" ${e.calendar_type==='CAL_01_BIRTHDAYS'?'selected':''}>Sinh nhật</option>
                                <option value="CAL_03_MEMORIALS" ${e.calendar_type==='CAL_03_MEMORIALS'?'selected':''}>Giỗ chạp</option>
                                <option value="CAL_04_FAMILY_MILESTONES" ${e.calendar_type==='CAL_04_FAMILY_MILESTONES'?'selected':''}>Sự kiện dòng họ</option>
                            </select>
                        </div>
                        <div style="flex: 1;">
                            <label class="form-label">Phân loại (Type)</label>
                            <input type="text" class="form-control" id="e-evtype" value="${e.event_type || ''}">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Địa điểm</label>
                        <input type="text" class="form-control" id="e-location" value="${e.location || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Mô tả chi tiết</label>
                        <textarea class="form-control" id="e-desc" style="height: 150px;">${e.description || ''}</textarea>
                    </div>
                </div>
                
                <div style="flex: 1;">
                    ${isNew ? '<p>Lưu nháp trước khi tag nhân vật.</p>' : `
                    <div class="edge-panel">
                        <div class="edge-header">Nhân vật liên quan <button class="btn-add-edge" onclick="openEventTypeahead()">+ Tag</button></div>
                        <div class="edge-content">${renderEdgeChips()}</div>
                    </div>
                    `}
                </div>
            </div>
        </div>
    `;
}

// ---------------- USERS (Owner only) ----------------
async function renderUsersList() {
    if (currentUser.role !== 'owner') {
        mainView.innerHTML = `<div class="view-header"><h1>Không đủ quyền</h1></div><div class="view-content"><p>Chỉ Owner mới quản lý được tài khoản.</p></div>`;
        return;
    }

    const users = await API.listAdminUsers();

    window.createNewUser = async () => {
        const username = document.getElementById('new-user-username').value.trim();
        const password = document.getElementById('new-user-password').value;
        const role = document.getElementById('new-user-role').value;
        const errBox = document.getElementById('new-user-error');
        errBox.classList.add('hidden');
        try {
            await API.createAdminUser(username, password, role);
            renderUsersList();
        } catch (e) {
            errBox.textContent = e.message;
            errBox.classList.remove('hidden');
        }
    };

    window.toggleUserActive = async (id, nextActive) => {
        try {
            await API.updateAdminUser(id, { is_active: nextActive });
            renderUsersList();
        } catch (e) {
            alert(e.message);
        }
    };

    window.changeUserRole = async (id, role) => {
        try {
            await API.updateAdminUser(id, { role });
            renderUsersList();
        } catch (e) {
            alert(e.message);
            renderUsersList();
        }
    };

    window.deleteUserAccount = async (id, username) => {
        if (!confirm(`Xóa vĩnh viễn tài khoản "${username}"?`)) return;
        try {
            await API.deleteAdminUser(id);
            renderUsersList();
        } catch (e) {
            alert(e.message);
        }
    };

    const rows = users.map(u => `
        <tr>
            <td><strong>${u.username}</strong>${u.id === currentUser.id ? ' <span class="empty-text">(bạn)</span>' : ''}</td>
            <td>
                <select class="form-control" style="width:auto;" onchange="changeUserRole('${u.id}', this.value)" ${u.id === currentUser.id ? 'disabled' : ''}>
                    <option value="owner" ${u.role === 'owner' ? 'selected' : ''}>Owner</option>
                    <option value="editor" ${u.role === 'editor' ? 'selected' : ''}>Editor</option>
                </select>
            </td>
            <td><span class="status ${u.is_active ? 'published' : 'draft'}">${u.is_active ? 'Active' : 'Disabled'}</span></td>
            <td>${u.last_login_at || 'Chưa đăng nhập'}</td>
            <td>
                <button class="btn" onclick="toggleUserActive('${u.id}', ${u.is_active ? 'false' : 'true'})" ${u.id === currentUser.id ? 'disabled' : ''}>${u.is_active ? 'Vô hiệu hóa' : 'Kích hoạt'}</button>
                <button class="btn" onclick="deleteUserAccount('${u.id}', '${u.username}')" ${u.id === currentUser.id ? 'disabled' : ''}>Xóa</button>
            </td>
        </tr>
    `).join('');

    mainView.innerHTML = `
        <div class="view-header"><h1>Quản lý Người dùng</h1></div>
        <div class="view-content">
            <div class="edge-panel">
                <div class="edge-header">Thêm tài khoản mới</div>
                <div class="edge-content">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Tên đăng nhập</label>
                            <input type="text" class="form-control" id="new-user-username">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Mật khẩu (tối thiểu 8 ký tự)</label>
                            <input type="password" class="form-control" id="new-user-password">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Vai trò</label>
                            <select class="form-control" id="new-user-role">
                                <option value="editor">Editor</option>
                                <option value="owner">Owner</option>
                            </select>
                        </div>
                    </div>
                    <div id="new-user-error" class="login-error hidden"></div>
                    <button class="btn btn-primary" onclick="createNewUser()">+ Tạo tài khoản</button>
                </div>
            </div>

            <table class="data-table">
                <thead><tr><th>Tên đăng nhập</th><th>Vai trò</th><th>Trạng thái</th><th>Đăng nhập gần nhất</th><th>Hành động</th></tr></thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    `;
}


async function renderDatabaseOverview() {
    mainView.innerHTML = '<div class="view-header"><h1>Database (CSDL)</h1></div><div class="view-content"><p>Đang tải sơ đồ cơ sở dữ liệu...</p></div>';
    
    try {
        const data = await API.getDatabaseSchema();
        // res.json() replaced
        
        let html = '<div class="view-header"><h1>Database (CSDL)</h1></div><div class="view-content">';
        
        html += '<div class="card" style="margin-bottom: 24px;">';
        html += '<h3>Overview</h3>';
        html += '<p><strong>Trạng thái:</strong> <span style="color: green;">CONNECTED</span></p>';
        html += '<p><strong>Role:</strong> Runtime Working Copy</p>';
        html += '<p><strong>Tên CSDL:</strong> ' + data.info.database + '</p>';
        html += '<p><strong>Driver:</strong> ' + data.info.client + '</p>';
        html += '<p><strong>Host:</strong> ' + data.info.host + '</p>';
        html += '<p><strong>Source of Truth:</strong> Canonical Genealogy = NAS, Canonical Images = NAS</p>';
        html += '</div>';

        html += '<h3>Table Inventory</h3>';
        html += '<div class="table-container"><table class="data-table"><thead><tr><th>TABLE NAME</th><th>ROWS</th><th>PRIMARY KEY</th><th>ENGINE</th></tr></thead><tbody>';
        data.tables.forEach(t => {
            html += '<tr><td>' + t.name + '</td><td>' + t.rows + '</td><td>' + t.primary_key + '</td><td>' + t.engine + '</td></tr>';
        });
        html += '</tbody></table></div>';
        
        html += '<h3 style="margin-top: 24px;">Data Integrity Issues</h3>';
        html += '<ul style="color: red; line-height: 1.6;">';
        html += '<li><strong>[CRITICAL]</strong> Mất liên kết ảnh (person_media.media_id = NULL) cho 173 records.</li>';
        html += '<li><strong>[CRITICAL]</strong> Không có khai báo Foreign Key ở DB Level (SQLite). Mọi liên kết là ảo trên Application level.</li>';
        html += '<li><strong>[HIGH]</strong> Bảng edges đang rỗng. Quan hệ con cái bị nén cứng trong JSON payload của bảng families.</li>';
        html += '<li><strong>[MEDIUM]</strong> Có 2 bảng tài khoản: admin_users (legacy) và accounts (member).</li>';
        html += '</ul>';

        html += '</div>';
        mainView.innerHTML = html;
    } catch (e) {
        mainView.innerHTML = '<div class="view-header"><h1>Lỗi</h1></div><div class="view-content"><p style="color:red">' + escAdmin(e.message) + '</p></div>';
    }
}

// ---------------- PROPOSALS INBOX (#/inbox) ----------------
const PROPOSAL_FIELD_LABELS = {
    birth_date: 'Ngày / năm sinh',
    birthYear: 'Năm sinh',
    birth_year: 'Năm sinh',
    birth_place: 'Nơi sinh',
    death_date: 'Ngày / năm mất',
    deathYear: 'Năm mất',
    death_year: 'Năm mất',
    death_place: 'Nơi mất',
    name: 'Họ và tên / Tên húy',
    baptism: 'Tên thánh / Rửa tội',
    relations: 'Quan hệ thân tộc',
    notes: 'Ghi chú / Tiểu sử',
    other: 'Dữ kiện khác'
};

function renderProposalStatusTag(status) {
    const clean = String(status || 'PENDING').toUpperCase();
    if (clean === 'APPROVED') return `<span class="status published">ĐÃ GHI NHẬN / DUYỆT</span>`;
    if (clean === 'REJECTED') return `<span class="status draft">TỪ CHỐI</span>`;
    return `<span class="status new">CHỜ DUYỆT</span>`;
}

async function renderInbox() {
    const data = await API.getProposals();
    const proposals = Array.isArray(data.proposals) ? data.proposals : [];
    const pendingCount = Number(data.pendingCount || 0);
    badgeInbox.textContent = String(pendingCount);
    badgeInbox.style.display = pendingCount > 0 ? 'inline-block' : 'none';

    const cardsHtml = proposals.length === 0
        ? `<div class="edge-panel"><div class="edge-content"><p class="empty-text">Hiện chưa có đề xuất bổ sung dữ kiện nào từ thành viên.</p></div></div>`
        : proposals.map((pr, idx) => {
            const fieldLabel = PROPOSAL_FIELD_LABELS[pr.field]
                ? `${PROPOSAL_FIELD_LABELS[pr.field]} (${pr.field})`
                : (pr.field || '');
            const personDisplay = pr.person_name
                ? `${escAdmin(pr.person_name)} (${escAdmin(pr.person_id)})`
                : escAdmin(pr.person_id);
            const submitter = pr.account_username || pr.account_id || 'Không rõ';

            return `
                <div class="edge-panel" data-proposal-card="${escAdmin(pr.id)}" style="margin-bottom: 20px;">
                    <div class="edge-header" style="flex-wrap: wrap; gap: 8px;">
                        <span>
                            <strong>#${idx + 1} · ${personDisplay}</strong>
                            — Trường: <strong>${escAdmin(fieldLabel)}</strong>
                        </span>
                        <span>${renderProposalStatusTag(pr.status)}</span>
                    </div>
                    <div class="edge-content">
                        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px; display: flex; flex-wrap: wrap; gap: 16px;">
                            <span>Người gửi: <strong>${escAdmin(submitter)}</strong></span>
                            <span>Thời gian gửi: ${escAdmin(pr.created_at || '—')}</span>
                            ${pr.reviewed_at ? `<span>Cập nhật duyệt: ${escAdmin(pr.reviewed_at)}</span>` : ''}
                            <a href="#/people/${encodeURIComponent(pr.person_id || '')}" style="color: var(--seal-red); text-decoration: underline;">Mở hồ sơ Nhân sự ↗</a>
                        </div>
                        <div style="padding: 12px 14px; background: var(--bg-page); border: 1px solid var(--border-color); margin-bottom: 12px;">
                            <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px;">Giá trị đề xuất mới</div>
                            <div style="font-size: 1.05rem; font-weight: 600;">${escAdmin(pr.suggested_value)}</div>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; margin-bottom: 14px;">
                            <div>
                                <div class="form-label" style="margin-bottom: 4px;">Nguồn chứng cứ</div>
                                <div>${pr.source_evidence ? escAdmin(pr.source_evidence) : '<span class="empty-text">Chưa đính kèm nguồn</span>'}</div>
                            </div>
                            <div>
                                <div class="form-label" style="margin-bottom: 4px;">Lý do / Lập luận đối chiếu</div>
                                <div>${pr.reason ? escAdmin(pr.reason) : '<span class="empty-text">Không có ghi chú thêm</span>'}</div>
                            </div>
                        </div>
                        <div style="border-top: 1px solid var(--border-color); padding-top: 12px; display: flex; flex-wrap: wrap; gap: 10px; align-items: center;">
                            <input
                                type="text"
                                class="form-control proposal-note-input"
                                style="flex: 1; min-width: 240px;"
                                placeholder="Ghi chú thẩm định của Ban Quản Trị..."
                                value="${escAdmin(pr.reviewer_note || '')}"
                            >
                            <button type="button" class="btn btn-primary" data-proposal-decision="APPROVED" data-proposal-id="${escAdmin(pr.id)}">
                                Ghi nhận / Duyệt
                            </button>
                            <button type="button" class="btn" data-proposal-decision="REJECTED" data-proposal-id="${escAdmin(pr.id)}">
                                Từ chối
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

    mainView.innerHTML = `
        <div class="view-header">
            <h1>Hộp thư Đề xuất Thành viên</h1>
            <span class="status ${pendingCount > 0 ? 'new' : 'published'}">${pendingCount} chờ duyệt / ${proposals.length} tổng</span>
        </div>
        <div class="view-content">
            <div class="edge-panel" style="margin-bottom: 24px; border-left: 3px solid var(--seal-red);">
                <div class="edge-content" style="font-size: 0.9rem;">
                    <strong>Nguyên tắc bảo toàn phả hệ gốc:</strong> Thao tác <em>«Ghi nhận / Duyệt»</em> sẽ lưu quyết định thẩm định và ghi chú tại Hộp thư Đề xuất mà không tự động ghi đè mù quáng bảng Nhân sự gốc. Sau khi đối chiếu tư liệu, Quản trị viên bấm <em>«Mở hồ sơ Nhân sự ↗»</em> để biên tập chính thức tại mục <a href="#/people" style="color: var(--seal-red);">#/people</a>.
                </div>
            </div>
            <div id="inbox-feedback" class="login-error hidden"></div>
            ${cardsHtml}
        </div>
    `;

    mainView.querySelectorAll('button[data-proposal-decision]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const propId = btn.getAttribute('data-proposal-id');
            const decision = btn.getAttribute('data-proposal-decision');
            const card = btn.closest('[data-proposal-card]');
            const noteInput = card ? card.querySelector('.proposal-note-input') : null;
            const reviewer_note = noteInput ? noteInput.value.trim() : '';
            const feedback = document.getElementById('inbox-feedback');
            if (feedback) feedback.classList.add('hidden');

            btn.disabled = true;
            try {
                await API.updateProposal(propId, { status: decision, reviewer_note });
                await renderInbox();
            } catch (err) {
                btn.disabled = false;
                if (feedback) {
                    feedback.textContent = err.message || 'Không thể lưu quyết định duyệt.';
                    feedback.classList.remove('hidden');
                }
            }
        });
    });
}

// ---------------- MEMBER ACCOUNTS (#/members — Owner only) ----------------
function renderMemberStatusBadge(status) {
    const clean = String(status || 'PROVISIONED').toUpperCase();
    if (clean === 'ACTIVE') return `<span class="status published">ACTIVE · Đang hoạt động</span>`;
    if (clean === 'DISABLED') return `<span class="status draft">DISABLED · Đã tạm khóa</span>`;
    return `<span class="status new">PROVISIONED · Đổi MK lần đầu</span>`;
}

async function renderMembersList() {
    if (!currentUser || currentUser.role !== 'owner') {
        mainView.innerHTML = `<div class="view-header"><h1>Không đủ quyền</h1></div><div class="view-content"><p>Chỉ Owner mới có quyền cấp và quản lý tài khoản Thành viên.</p></div>`;
        return;
    }

    const data = await API.getMemberAccounts();
    const accounts = Array.isArray(data.accounts) ? data.accounts : [];

    const personOptionsHtml = [
        `<option value="">— Chưa gắn hồ sơ nhân vật (có thể gắn sau) —</option>`,
        ...allPeopleCache.map(p =>
            `<option value="${escAdmin(p.id)}">${escAdmin(p.name)} (${escAdmin(p.birthYear || '?')}) — ${escAdmin(p.id)}</option>`
        )
    ].join('');

    const rowsHtml = accounts.length === 0
        ? `<tr><td colspan="5" class="empty-text">Chưa có tài khoản thành viên nào.</td></tr>`
        : accounts.map((acc, idx) => {
            const linkedPersonHtml = acc.person_id
                ? `<a href="#/people/${encodeURIComponent(acc.person_id)}" style="color: var(--text-main); text-decoration: underline;">
                     <strong>${escAdmin(acc.person_name || acc.person_id)}</strong>
                   </a>
                   <div style="font-size: 0.8rem; color: var(--text-muted);">${escAdmin(acc.person_id)}${acc.birth_year ? ' · Sinh ' + escAdmin(acc.birth_year) : ''}</div>`
                : `<span class="empty-text">Chưa gắn nhân vật</span>`;

            const isDisabled = acc.status === 'DISABLED';
            const nextLockStatus = isDisabled ? 'ACTIVE' : 'DISABLED';
            const lockLabel = isDisabled ? 'Mở khóa' : 'Khóa';

            return `
                <tr style="cursor: default;">
                    <td>
                        <strong>${escAdmin(acc.username)}</strong>
                        <div style="font-size: 0.78rem; color: var(--text-muted);">Vai trò: ${escAdmin(acc.role || 'member')}</div>
                    </td>
                    <td>${linkedPersonHtml}</td>
                    <td>${renderMemberStatusBadge(acc.status)}</td>
                    <td style="font-size: 0.85rem; color: var(--text-muted);">${escAdmin(acc.created_at || '—')}</td>
                    <td>
                        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                            <button type="button" class="btn" data-member-link="${escAdmin(acc.id)}" data-member-username="${escAdmin(acc.username)}">
                                Gắn nhân vật
                            </button>
                            <button type="button" class="btn" data-member-reset-toggle="${idx}">
                                Đặt lại mật khẩu tạm
                            </button>
                            <button type="button" class="btn" data-member-lock="${escAdmin(acc.id)}" data-next-status="${nextLockStatus}">
                                ${lockLabel}
                            </button>
                        </div>
                        <div id="member-reset-box-${idx}" class="hidden" style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed var(--border-color); display: flex; gap: 6px; flex-wrap: wrap;">
                            <input
                                type="text"
                                class="form-control member-temp-pw-input"
                                style="width: 200px; padding: 4px 8px; font-size: 0.85rem;"
                                placeholder="Mật khẩu tạm mới (>=8 ký tự)"
                            >
                            <button type="button" class="btn btn-primary" data-member-reset-save="${escAdmin(acc.id)}" data-reset-idx="${idx}">
                                Lưu MK tạm
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

    mainView.innerHTML = `
        <div class="view-header">
            <h1>Quản lý Tài khoản Thành viên</h1>
            <span class="status published">${accounts.length} tài khoản</span>
        </div>
        <div class="view-content">
            <div class="edge-panel" style="margin-bottom: 24px;">
                <div class="edge-header">Cấp tài khoản Thành viên mới (Trạng thái khởi tạo: PROVISIONED — bắt buộc đổi mật khẩu lần đầu)</div>
                <div class="edge-content">
                    <div class="form-row" style="flex-wrap: wrap;">
                        <div class="form-group" style="min-width: 200px;">
                            <label class="form-label" for="new-member-username">Tên đăng nhập (username)</label>
                            <input type="text" class="form-control" id="new-member-username" placeholder="vd: tran.minh.anh" autocomplete="off">
                        </div>
                        <div class="form-group" style="min-width: 200px;">
                            <label class="form-label" for="new-member-password">Mật khẩu khởi tạo (tối thiểu 8 ký tự)</label>
                            <input type="text" class="form-control" id="new-member-password" placeholder="Nhập mật khẩu tạm >= 8 ký tự" autocomplete="off">
                        </div>
                    </div>
                    <div class="form-group" style="margin-bottom: 16px;">
                        <label class="form-label" for="new-member-person-select">Gắn với Nhân vật trong phả hệ (Me-Centric Anchor)</label>
                        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                            <select class="form-control" id="new-member-person-select" style="flex: 1; min-width: 260px;">
                                ${personOptionsHtml}
                            </select>
                            <button type="button" class="btn" id="btn-new-member-typeahead">🔍 Tìm nhanh tên nhân vật</button>
                        </div>
                    </div>
                    <div id="new-member-feedback" class="login-error hidden"></div>
                    <button type="button" class="btn btn-primary" id="btn-create-member">+ Cấp tài khoản Thành viên</button>
                </div>
            </div>

            <div id="members-table-feedback" class="login-error hidden"></div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Tài khoản</th>
                        <th>Nhân vật gắn kết</th>
                        <th>Trạng thái</th>
                        <th>Ngày tạo</th>
                        <th>Thao tác nhanh</th>
                    </tr>
                </thead>
                <tbody>${rowsHtml}</tbody>
            </table>
        </div>
    `;

    const personSelect = document.getElementById('new-member-person-select');
    const feedbackBox = document.getElementById('new-member-feedback');
    const tableFeedback = document.getElementById('members-table-feedback');

    document.getElementById('btn-new-member-typeahead').addEventListener('click', () => {
        typeaheadTitle.textContent = 'Chọn nhân vật phả hệ cho tài khoản mới';
        typeaheadInput.value = '';
        typeaheadOverlay.dataset.allowUnlink = '1';
        currentTypeaheadCallback = (selectedId) => {
            personSelect.value = selectedId || '';
        };
        renderTypeaheadResults(allPeopleCache, true);
        typeaheadOverlay.classList.remove('hidden');
        typeaheadInput.focus();
    });

    document.getElementById('btn-create-member').addEventListener('click', async (ev) => {
        const btn = ev.currentTarget;
        const username = document.getElementById('new-member-username').value.trim().toLowerCase();
        const password = document.getElementById('new-member-password').value;
        const personId = personSelect.value;

        feedbackBox.classList.add('hidden');
        if (!username || password.length < 8) {
            feedbackBox.textContent = 'Vui lòng nhập username hợp lệ và mật khẩu khởi tạo từ 8 ký tự trở lên.';
            feedbackBox.classList.remove('hidden');
            return;
        }

        btn.disabled = true;
        try {
            await API.createMemberAccount({ username, password, personId: personId || null });
            await renderMembersList();
        } catch (err) {
            btn.disabled = false;
            feedbackBox.textContent = err.message || 'Không thể tạo tài khoản thành viên.';
            feedbackBox.classList.remove('hidden');
        }
    });

    mainView.querySelectorAll('button[data-member-reset-toggle]').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = btn.getAttribute('data-member-reset-toggle');
            const box = document.getElementById(`member-reset-box-${idx}`);
            if (box) box.classList.toggle('hidden');
        });
    });

    mainView.querySelectorAll('button[data-member-reset-save]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const accountId = btn.getAttribute('data-member-reset-save');
            const idx = btn.getAttribute('data-reset-idx');
            const box = document.getElementById(`member-reset-box-${idx}`);
            const input = box ? box.querySelector('.member-temp-pw-input') : null;
            const newPassword = input ? input.value : '';

            tableFeedback.classList.add('hidden');
            if (!newPassword || newPassword.length < 8) {
                tableFeedback.textContent = 'Mật khẩu tạm phải có ít nhất 8 ký tự.';
                tableFeedback.classList.remove('hidden');
                return;
            }

            btn.disabled = true;
            try {
                await API.updateMemberAccount(accountId, { newPassword });
                await renderMembersList();
            } catch (err) {
                btn.disabled = false;
                tableFeedback.textContent = err.message || 'Không thể đặt lại mật khẩu tạm.';
                tableFeedback.classList.remove('hidden');
            }
        });
    });

    mainView.querySelectorAll('button[data-member-link]').forEach(btn => {
        btn.addEventListener('click', () => {
            const accountId = btn.getAttribute('data-member-link');
            const uname = btn.getAttribute('data-member-username') || '';
            typeaheadTitle.textContent = `Gắn nhân vật cho tài khoản "${uname}"`;
            typeaheadInput.value = '';
            typeaheadOverlay.dataset.allowUnlink = '1';
            currentTypeaheadCallback = async (selectedId) => {
                tableFeedback.classList.add('hidden');
                try {
                    await API.updateMemberAccount(accountId, { personId: selectedId || '' });
                    await renderMembersList();
                } catch (err) {
                    tableFeedback.textContent = err.message || 'Không thể cập nhật liên kết nhân vật.';
                    tableFeedback.classList.remove('hidden');
                }
            };
            renderTypeaheadResults(allPeopleCache, true);
            typeaheadOverlay.classList.remove('hidden');
            typeaheadInput.focus();
        });
    });

    mainView.querySelectorAll('button[data-member-lock]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const accountId = btn.getAttribute('data-member-lock');
            const nextStatus = btn.getAttribute('data-next-status');
            tableFeedback.classList.add('hidden');
            btn.disabled = true;
            try {
                await API.updateMemberAccount(accountId, { status: nextStatus });
                await renderMembersList();
            } catch (err) {
                btn.disabled = false;
                tableFeedback.textContent = err.message || 'Không thể cập nhật trạng thái khóa.';
                tableFeedback.classList.remove('hidden');
            }
        });
    });
}
