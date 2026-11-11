# CAPABILITY MODEL

Tài liệu này định nghĩa Ontology của các Năng lực (Capabilities) mà hệ thống AIOS cần để thực thi các Missions. Không một Capability nào bị trói buộc cứng vào một Runtime cụ thể.

## 1. Filesystem & NAS Capabilities

### `filesystem.read`
- **What it enables:** Đọc nội dung file, thư mục, metadata (size, mtime).
- **Risk:** Low (Read-only).
- **Destructive:** No.
- **Human Gate Required:** No.
- **Possible Providers:** SSH native tools (`ls`, `cat`), MCP (filesystem), OpenCode native tools.

### `filesystem.write`
- **What it enables:** Tạo, sửa đổi nội dung file.
- **Risk:** Medium.
- **Destructive:** Yes (nếu overwrite).
- **Human Gate Required:** Yes (với file Production/System).
- **Possible Providers:** SSH native tools, MCP, OpenCode native tools.

### `filesystem.move` / `filesystem.delete`
- **What it enables:** Di dời (Migration), xóa rác (Cleanup).
- **Risk:** High.
- **Destructive:** Yes.
- **Human Gate Required:** ALWAYS REQUIRED.
- **Possible Providers:** SSH `mv`/`rm`, MCP.

### `nas.search`
- **What it enables:** Gọi API truy hồi dữ liệu từ Synology Universal Search hoặc Photos.
- **Risk:** Low.
- **Destructive:** No.
- **Human Gate Required:** No.
- **Possible Providers:** Synology REST API (nếu mở), Custom Python Scripts (nếu API đóng).
- **Native Exists:** Yes (Universal Search).

## 2. Infrastructure & Code Capabilities

### `git.inspect` / `git.mutate`
- **What it enables:** Đọc history, xem diff, commit, push, branch.
- **Risk:** Low (Inspect) / Medium (Mutate).
- **Destructive:** Yes (Force push/Reset).
- **Human Gate Required:** Yes (Trước khi Push/Merge vào main).
- **Possible Providers:** Git CLI, Git MCP, GitHub MCP.

### `database.read` / `database.write`
- **What it enables:** Query SQL, Schema inspection, Entity mutation.
- **Risk:** High.
- **Destructive:** Yes (Drop/Update).
- **Human Gate Required:** Yes (Write operations).
- **Possible Providers:** Database CLI, SQL MCP.

## 3. Communication & Intelligence Capabilities

### `web.research` / `browser.automation`
- **What it enables:** Khai thác thông tin trên web, tương tác GUI (Playwright).
- **Risk:** Low (Public Web) / Medium (Auth Web).
- **Destructive:** No.
- **Human Gate Required:** No (trừ khi dùng tiền/tài khoản).
- **Possible Providers:** Playwright MCP, Webfetch Tools, Exa MCP.

### `validation.architectural`
- **What it enables:** Phân tích, tổng hợp, đối chiếu Kiến trúc hệ thống với Code/Filesystem.
- **Risk:** Low.
- **Destructive:** No.
- **Human Gate Required:** No.
- **Possible Providers:** LLM Reasoning (Gemini, Claude, GPT-4), Semantic Indexing.

---
*Lưu ý: MCP chỉ là một Implementation Substrate. Một Capability có thể được cấp bởi Native CLI, MCP Server, hoặc LLM Function Call.*
