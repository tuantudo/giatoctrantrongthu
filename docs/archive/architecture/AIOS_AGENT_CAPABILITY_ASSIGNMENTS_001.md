# AIOS AGENT CAPABILITY ASSIGNMENTS 001

Dựa trên nguyên tắc thiết kế Role-Based Capability, đây là danh sách phân bổ các MCP và quyền hạn cho 4 Agents trong team [PROPOSED]. Không agent nào được truy cập full list.

## 1. AGY (Semantic / Architecture / Capability Architect)
**Role:** Định nghĩa kiến trúc, ontology, dự án, governance.
**Context Budget:** Tối thiểu hóa execution tools, tối đa hóa knowledge tools.
- `knowledge-graph` [ENABLE]: Quản lý Source of Truth và kiến trúc dự án.
- `github` (Read-only) [ENABLE]: Theo dõi tiến độ PR/Issue.
- `exa` [ENABLE]: Research công nghệ, context.
- `filesystem` (Read-only) [ENABLE]: Đọc cấu trúc file.
- `sequential-thinking` [ENABLE]: Xử lý chuỗi reasoning phức tạp.
**Disable:** `bash`, `playwright`, `serena`, `bitwarden`.

## 2. OpenCode (Technical Lead / Systems Engineer)
**Role:** Kỹ sư hệ thống, sửa code, quản lý DB và hạ tầng.
**Context Budget:** Các công cụ mạnh nhất về code và data.
- `serena` [ENABLE]: Chịu trách nhiệm refactor, search & replace symbol, code intelligence.
- `filesystem` & `bash` [ENABLE]: Thực thi lệnh git, npm, quản lý file local (Tier 1/2).
- `github` (Read/Write) [ENABLE]: Tạo PR, push code.
- `mysql`/`mariadb` MCP [ADD]: Query Database Giatoc (Chỉ cấp Tier 0: Read-only schema & select).
- `sentry` MCP [ADD]: Đọc lỗi production.
- `bitwarden` [ENABLE]: Truy xuất credential khi cần kết nối backend.
**Disable:** `playwright`, `figma`, `react-spectrum`, `puppeteer`.

## 3. Cline (Experience Architect / Web UI Engineer / Visual QA)
**Role:** UI/UX, Design Systems, Frontend Testing.
**Context Budget:** Chỉ tập trung vào browser automation và design files.
- `playwright` [ENABLE]: Mở browser, tương tác, chụp màn hình, Visual QA.
- `figma` / `react-spectrum` / `spectrum-design-data` [ENABLE]: Trích xuất token, mockups, design system.
- `adobe-express-developer` [ENABLE]: Hỗ trợ asset generation.
- `filesystem` [ENABLE]: Đọc và sửa UI/CSS files giới hạn.
**Disable:** `git`, `mysql`, `sentry`, `bitwarden`, `knowledge-graph`.

## 4. DSH (Orchestration Runtime / Execution Coordination)
**Role:** Điều phối worker, thu thập evidence. Trạng thái TRAINEE.
**Context Budget:** Công cụ thực thi nhẹ, dispatch, reporting.
- Native `tool-workflow`, `tool-subagent` [ENABLE]: Quản lý worker.
- Native `tool-fs` [ENABLE]: Sandbox đọc file/ghi log evidence.
- Native `tool-goal` [ENABLE]: Kiểm soát vòng lặp nhiệm vụ.
- `@deepseek-ai/dsh-mcp-client` [KEEP DISABLED]: Giữ vô hiệu hóa cho đến khi Orchestrator hoặc Human Gate yêu cầu kết nối với AIOS MCP.
**Disable:** Toàn bộ AIOS global MCP.
