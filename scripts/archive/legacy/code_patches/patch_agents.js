const fs = require('fs');
const filePath = 'AGENTS.md';

let content = fs.readFileSync(filePath, 'utf8');

const newSection = `
## 5. CLINE CLI (Execution Runtime)
- **Role:** Giao diện thực thi cục bộ (Local Execution Harness) của Cline Persona.
- **State:** AIOS REGISTERED / ACTIVE
- **Authority:** Kế thừa thẩm quyền Frontend từ Cline Persona.
- **Execution Surface:** CLI / Local Terminal.
- **Responsibilities:**
  - Nhận Task từ Human (Tuấn) thông qua cầu nối Orchestrator.
  - Phân tích và lập kế hoạch (Plan Mode) cho các tác vụ UI/Frontend.
  - Dừng lại tại Human Gate (Auto-approve disabled) trước khi thực thi file/terminal.
- **Forbidden:**
  - Tự động thực thi (bypass human approval).
  - Vượt biên giới ghi (write) vào thư mục thuộc OpenCode hoặc AGY.
`;

if (!content.includes('## 5. CLINE CLI')) {
  content += '\n' + newSection.trim() + '\n';
  fs.writeFileSync(filePath, content);
  console.log('Successfully added Cline CLI to AGENTS.md');
} else {
  console.log('Section already exists, skipping append to avoid duplicates.');
}
