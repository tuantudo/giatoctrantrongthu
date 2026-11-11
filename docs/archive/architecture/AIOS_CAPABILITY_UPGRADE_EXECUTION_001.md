# AIOS CAPABILITY UPGRADE EXECUTION 001

**Mission:** AIOS-CAPABILITY-UPGRADE-EXECUTION-001
**Coordinator:** AGY (Capability Architect)
**Status:** Báo cáo thực thi Baseline (COMPLETED / BLOCKED / DEFERRED)

---

## 1. TRACK A — OPENCODE (Technical Runtime)
- **Filesystem & Code Intelligence:** [VERIFIED] OpenCode sử dụng `serena` và local filesystem (Tier 1/2).
- **Trùng lặp Browser:** [COMPLETED] Đã `disabled: true` cho `puppeteer` trong `mcp_config.json`. Giữ lại `playwright` làm chuẩn duy nhất.
- **Trùng lặp Memory:** [COMPLETED] Đã `disabled: true` cho `context7` trong `mcp_config.json`. Giữ `knowledge-graph` cho cấu trúc dự án.
- **Database (MariaDB) MCP:** [DEFERRED / BLOCKED] Đã cài đặt cấu hình (stub) `mariadb-giatoc` trong `mcp_config.json` với mode READ-ONLY. Nhưng do nguyên tắc "Không cấp production credential", trạng thái hiện tại là `disabled: true` chờ Human Gate cung cấp URL/Token hợp lệ để Verify kết nối.
- **Git / GitHub:** [VERIFIED] Giữ `github` MCP cho thao tác remote, OpenCode dùng bash cục bộ cho git local (để giảm context load của `git` MCP).

## 2. TRACK B — DSH (Orchestration Runtime)
- **Model:** [VERIFIED] Giữ nguyên `nvidia/nemotron-3-ultra-550b-a55b` theo chỉ thị. Không thay đổi.
- **Filesystem MCP:** [VERIFIED] Đã kiểm chứng từ nhiệm vụ trước.
- **Unverified Capabilities Audit:**
  - `web search`: [VERIFIED] Native plugin `@deepseek-ai/dsh-web-search-deepseek` hoạt động.
  - `workflow` & `subagent`: [VERIFIED] Native `@deepseek-ai/dsh-tool-workflow` & `spawn-in-process` hoạt động.
  - `jobs`: [VERIFIED] Có sẵn `@deepseek-ai/dsh-jobs-local`.
  - `code runtime`: [VERIFIED] `@deepseek-ai/dsh-code-runtime-worker-thread` sẵn sàng.
- **MCP Client (dsh-mcp-client):** [RESTRICTED] Đã cài nhưng tiếp tục giữ disabled (không mở production authority).

## 3. TRACK C — CLINE (Experience Capability)
- **Browser Automation:** [VERIFIED] Kế thừa `playwright` (sau khi gỡ `puppeteer`).
- **Figma / UI:** [VERIFIED] Các MCP `figma`, `react-spectrum`, `adobe-express-developer` được giữ nguyên cho role Design/Visual QA.

## 4. TRACK D — AGY (Capability Architect & Ontology)
- **Project Knowledge:** [VERIFIED] Hợp nhất sử dụng `knowledge-graph`. Đã gỡ bỏ context nhiễu từ `context7` để tránh conflicting source-of-truth.
- **Architecture / Research:** [VERIFIED] Được trang bị `exa` search và quyền gọi MCP `github` (Read-Only) để theo dõi kiến trúc dự án.

---

## 5. BẢNG TỔNG HỢP FINAL BASELINE

| AGENT | ROLE | ENABLED CAPABILITIES | VERIFIED CAPABILITIES | RESTRICTED/DISABLED | KNOWN GAPS |
|---|---|---|---|---|---|
| **AGY** | Architecture / Capability | `knowledge-graph`, `exa`, `github` (Read) | Tất cả Enabled | `context7`, `puppeteer` | Không |
| **OpenCode** | Technical / Systems | `serena`, `github` (Write), `playwright`, local git/bash | `serena`, `github`, bash | `bitwarden` (Restricted) | `mariadb` (Đã config nhưng blocked thiếu DB credentials) |
| **Cline** | Web UI / Visual QA | `playwright`, `figma`, `react-spectrum`, `adobe-express` | Tất cả Enabled | Mọi Backend/DB tools | Không |
| **DSH** | Orchestration Runtime | `workflow`, `subagent`, `fs-sandbox`, `web-search` | Tất cả Enabled | `dsh-mcp-client` (Bị khóa) | Không |

## 6. SECURITY & PERMISSION TIERS
- Mọi hoạt động Database đang được quy hoạch TIER 0 (Read Only) và đang chờ Human Gate.
- Không có bất kỳ thay đổi nào lên AIOS Constitution, Project Contract, hay Giatoc Production.
- Không cấp phát credential trái phép.

## 7. UPDATE (MISSION P1-DB-001)
- **Database (MariaDB) MCP:** Đã xử lý xong phần cài đặt logic (`mcp-server-mysql`), bảo đảm Security Boundary (Read-only). Tình trạng kết nối: BLOCKED do chưa có chuỗi kết nối thực tế. Chờ Human Gate. 
