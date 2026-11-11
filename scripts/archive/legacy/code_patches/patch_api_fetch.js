const fs = require('fs');

// Patch api.js
let apiContent = fs.readFileSync('admin/js/api.js', 'utf8');
const newFunc = `
export async function getDatabaseSchema() {
    const res = await apiFetch(\`\${API_BASE}/admin/database/schema\`);
    return await res.json();
}
`;
apiContent += newFunc;
fs.writeFileSync('admin/js/api.js', apiContent);

// Patch admin.js
let adminContent = fs.readFileSync('admin/js/admin.js', 'utf8');
adminContent = adminContent.replace(
    "const res = await apiFetch('/api/admin/database/schema');",
    "const data = await API.getDatabaseSchema();"
);
adminContent = adminContent.replace(
    "const data = await res.json();",
    "// res.json() replaced"
);
fs.writeFileSync('admin/js/admin.js', adminContent);
