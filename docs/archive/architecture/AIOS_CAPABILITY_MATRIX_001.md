# AIOS CAPABILITY MATRIX 001

**Mission:** AIOS-CAPABILITY-UPGRADE-001
**Role:** AGY (Capability Architect)

## 1. TỔNG QUAN (EXECUTIVE SUMMARY)
Bảng ma trận (Capability Matrix) đánh giá toàn bộ các công cụ, plugin và MCP servers hiện có trong hệ thống, nhận diện các điểm chồng chéo (overlap), các khoảng trống (gaps) và đề xuất phương án xử lý theo nguyên tắc tối ưu hóa Context Budget.

## 2. CAPABILITY MATRIX

| CAPABILITY | REQUIRED BY | CURRENT PROVIDER | CURRENT STATUS | GAP | RECOMMENDED PROVIDER | PERMISSION LEVEL | SECURITY RISK | CONTEXT COST | VERIFICATION METHOD | ACTION |
|---|---|---|---|---|---|---|---|---|---|---|
| **Filesystem (Basic)** | DSH, AGY | `filesystem` MCP / DSH `tool-fs` | [OBSERVED] Active | - | Giữ nguyên native / MCP cơ bản | TIER 0 / 1 | Thấp (nếu Read) | Thấp | Test read/write local | **KEEP** (DSH, AGY) |
| **Code Intelligence / Edit** | OpenCode | `serena` MCP | [OBSERVED] Active | - | `serena` | TIER 2 | Trung bình (Sửa code) | Cao | Inspect Edit/Replace | **KEEP** (OpenCode) |
| **Git Local** | OpenCode | `git` MCP | [OBSERVED] Lỗi/Active | Duplicate với Bash | Không cần thiết nếu Bash an toàn | TIER 2 | Trung bình | Vừa | Test commit/diff | **DISABLE** (Dùng Bash) |
| **GitHub Remote** | OpenCode, AGY | `github` MCP | [OBSERVED] Active | - | `github` MCP | TIER 0 (AGY), TIER 2 (OpenCode) | Cao (Push) | Vừa | Inspect PR/Issue | **RESTRICT** |
| **Browser Automation** | Cline, OpenCode | `playwright`, `puppeteer` | [OBSERVED] Cả 2 Active | Trùng lặp | `playwright` MCP | TIER 1 | Trung bình | Rất cao | Run UI test | **REPLACE** (Tắt puppeteer) |
| **Knowledge / Memory** | AGY | `memory`, `knowledge-graph`, `context7`, `aios-working-memory` | [OBSERVED] Chồng chéo | Quá nhiều Source of Truth | Giữ `knowledge-graph` | TIER 1 | Thấp | Rất cao | Truy vấn Semantic | **DISABLE** các MCP phụ |
| **Design / UI** | Cline | `figma`, `react-spectrum`, `adobe-express` | [OBSERVED] Active | - | Giữ nguyên cho Cline | TIER 0 | Thấp | Vừa | Truy xuất token | **KEEP** (Cline only) |
| **Database Access** | OpenCode | Chưa có | [OBSERVED] Gap | Thiếu SQL Client | Cần `mysql/mariadb` MCP | TIER 0 (Read-only) | Rất cao (Data leak) | Vừa | Test SELECT schema | **ADD** (Read-only) |
| **Observability** | OpenCode | Chưa có | [OBSERVED] Gap | Thiếu Error Tracking | Cần `sentry` MCP | TIER 0 | Thấp | Vừa | Test fetch error | **ADD** |
| **Cloud/Infra** | OpenCode | Chưa có | [OBSERVED] Gap | Thiếu Edge control | Cần `vercel`/`cloudflare` | TIER 1 | Cao (Prod Config)| Vừa | Test fetch config | **DEFER** |
| **Communication** | Orchestrator | `slack`, `aios-gmail` | [OBSERVED] Active | Dư thừa cho Coding | Tắt nếu không report | TIER 1 | Vừa (Spam) | Vừa | - | **DISABLE** (Trừ khi cần) |
| **Secrets Management** | OpenCode | `bitwarden` MCP | [OBSERVED] Active | - | Giới hạn Agent | TIER 1 | Rất cao (Leak) | Vừa | Test fetch secret | **RESTRICT** (OpenCode only)|
| **Web Research** | AGY, DSH | `exa` MCP | [OBSERVED] Active | - | `exa` | TIER 0 | Thấp | Vừa | Test search | **KEEP** |
| **Orchestration/Workflow** | DSH | Native DSH Plugins | [OBSERVED] Active | Không adapter ChatGPT | Native DSH + MCP Client| TIER 2 | Trung bình | Vừa | Test dispatch | **ENABLE** |

*(Ghi chú phân loại: OBSERVED = Đã thấy trong hệ thống, GAP = Thiếu hụt, INFERENCE = Suy luận, PROPOSED = Đề xuất).*
