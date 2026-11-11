const fs = require('fs');
const content = fs.readFileSync('admin/js/admin.js', 'utf8');

const routePatch = `else if (hash === '/users') await renderUsersList();
        else if (hash === '/database') await renderDatabaseOverview();`;

const newContent = content.replace("else if (hash === '/users') await renderUsersList();", routePatch);

const renderDbFunc = `
async function renderDatabaseOverview() {
    mainView.innerHTML = '<div class="view-header"><h1>Database (CSDL)</h1></div><div class="view-content"><p>Đang tải sơ đồ cơ sở dữ liệu...</p></div>';
    
    try {
        const res = await apiFetch('/api/admin/database/schema');
        const data = await res.json();
        
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
        mainView.innerHTML = '<div class="view-header"><h1>Lỗi</h1></div><div class="view-content"><p style="color:red">' + e.message + '</p></div>';
    }
}
`;

fs.writeFileSync('admin/js/admin.js', newContent + '\n' + renderDbFunc);
