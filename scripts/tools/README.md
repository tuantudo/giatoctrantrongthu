# CLI TOOLS & DEVELOPER UTILITIES
## THƯ MỤC CÔNG CỤ CHẨN ĐOÁN & THIẾT LẬP MÔI TRƯỜNG

Thư mục này lưu trữ các công cụ dòng lệnh (CLI tools) phục vụ chẩn đoán CSDL phả hệ và thiết lập môi trường phát triển cục bộ.

### Danh mục công cụ được bảo tồn:

1. **`test_relationships.py`**
   - **Chức năng:** Chẩn đoán và kiểm tra tính toàn vẹn quan hệ gia đình (vợ/chồng, con cái) trong CSDL SQLite `server/family_archive.db`.
   - **Cách chạy từ root:**
     ```bash
     python3 scripts/tools/test_relationships.py
     ```
   - **Kết quả kỳ vọng:** 68 gia đình, 0 orphan references.

2. **`test_media_assoc.py`**
   - **Chức năng:** Chẩn đoán và kiểm tra liên kết giữa `person_media` và `media` trong CSDL SQLite `server/family_archive.db`.
   - **Cách chạy từ root:**
     ```bash
     python3 scripts/tools/test_media_assoc.py
     ```
   - **Kết quả kỳ vọng:** 173 media mapped qua heuristic relation_id.

3. **`patch_global_mcp.js`**
   - **Chức năng:** Thiết lập cấu hình MCP server toàn cục cho Cline (`~/.cline/data/settings/cline_mcp_settings.json`), đăng ký filesystem server cho workspace.
   - **Cách chạy từ root:**
     ```bash
     node scripts/tools/patch_global_mcp.js
     ```

4. **`patch_vscode_mcp.js`**
   - **Chức năng:** Thiết lập cấu hình MCP server cho tiện ích mở rộng VS Code Claude Dev / Cline, đăng ký filesystem server.
   - **Cách chạy từ root:**
     ```bash
     node scripts/tools/patch_vscode_mcp.js
     ```

