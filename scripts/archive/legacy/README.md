# KHO LƯU TRỮ SCRIPTS LỊCH SỬ (LEGACY SCRIPTS ARCHIVE)
## WORKSTREAM 08 — MIG-01 ARCHIVE CATALOG

Thư mục này lưu trữ 37 scripts lịch sử thuộc dự án Gia Tộc Trần Trọng Thu đã hoàn thành nhiệm vụ trong các sprint trước đó, được di chuyển từ thư mục gốc trong khuôn khổ kế hoạch `MIG-01` (Clean Root & Archive Legacy).

> [!NOTE]
> **Xử lý Project Boundary (Mini Expo 2026):**  
> 13 scripts thuộc chiến dịch bên ngoài "MINI EXPO CÀ PHÊ NĂM 2026" trước đây nằm lạc tại root đã được chuyển trả về đúng workspace canonical của dự án đó:  
> `/Users/tuantq/Library/CloudStorage/OneDrive-PVCFC/TEAM DESIGN/2026/MINI EXPO CAY CA PHE NAM 2026/ARCHIVE/root_scripts/`  
> Toàn bộ 13 tệp đã được đối soát SHA-256 byte-for-byte và đã được gỡ bỏ hoàn toàn khỏi repository `giatoctrantrongthu`.

### Cấu trúc phân loại hiện tại trong repository gia phả:

1. **`code_patches/` (33 tệp):**
   - Các bản vá mã nguồn và CSS một lần (one-off patches) chạy bằng regex/chuỗi để cập nhật giao diện, routes, hoặc hợp đồng dự án trong các sprint trước.
   - Nội dung đã được phản ánh vĩnh viễn vào mã nguồn đích trong `src/`, `server/`, `admin/`, `.aios/`.
   - Danh sách: `enforce_gate.js`, `fix_footer.js`, `fix_member.js`, `patch_admin_js.js`, `patch_agents.js`, `patch_api_fetch.js`, `patch_app.js`, `patch_comments.py`, `patch_components.js`, `patch_components_v0.8.js`, `patch_contract.js`, `patch_css_v02.js`, `patch_db_route.js`, `patch_dom.js`, `patch_footer.js`, `patch_footer_v0.8.js`, `patch_login.js`, `patch_logout.js`, `patch_public_css.js`, `patch_public_home.js`, `patch_public_home_content.js`, `patch_public_home_v02.js`, `patch_shell.js`, `patch_shell_footer.js`, `patch_shell_nav.js`, `patch_states.js`, `patch_threshold.py`, `patch_tokens.js`, `patch_v06.js`, `patch_v0_3_research_impl.js`, `remove_threshold.js`, `restore_hero.js`, `update_public_home.js`.

2. **`doc_generators/` (4 tệp):**
   - Các scripts tạo tài liệu báo cáo Markdown dùng một lần trong các đợt audit trước. Báo cáo đích đã tồn tại trong `docs/audit/`.
   - Danh sách: `create_grammar_audit.py`, `create_m05.py`, `create_m08.py`, `update_report.py`.


