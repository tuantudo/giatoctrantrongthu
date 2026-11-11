# GIATOC V1 EXECUTION READINESS REPORT

**Mission:** GIATOC V1 CLOSURE
**Objective:** Đưa Giatoc từ prototype/degraded state sang một V1 Live Product đủ nhất quán để bắt đầu đời sống thật.
**Priority:** 1. Real Data -> 2. API -> 3. DB -> 4. Integration -> 5. E2E -> 6. V1 Release -> 7. Live.

---

## 1. STATE ASSESSMENT
- **Current Project State:** Đang chuyển tiếp từ Prototype tĩnh sang Integration. Kiến trúc tĩnh (HTML/CSS/IA) đã được duyệt. Luồng dữ liệu tĩnh đã bị gỡ bỏ (OBSOLETE).
- **Production State:** Đang gián đoạn (Degraded). File `src/js/app.js` đang chứa một lỗi cú pháp nghiêm trọng (dư dấu `}`) khiến hệ thống routing và render bị sập.
- **Prototype State:** Giao diện `design-playground/index.html` đã sạch sẽ, tuân thủ đúng Narrative IA mới, sẵn sàng để được bóc tách và tích hợp vào Production.
- **API State:** Backend API đã tồn tại (VD: `api/public/genealogy`, `mach.json`), nhưng chưa được ánh xạ (map) tương thích với cấu trúc của IA trang chủ mới.
- **DB State:** Database MariaDB đang chứa dữ liệu thật (Real Data).
- **Frontend State:** Cần thay thế hệ thống Vanilla JS cũ bằng code giao diện lấy từ Prototype và thiết lập Fetch logic kết nối thẳng tới API.
- **Missing Integration:** Thiếu cầu nối giữa `design-playground/js/prototype.js` (logic render) và `server/index.js` (endpoints). Thiếu cơ chế Auth cho luồng "Member Space".

## 2. EXISTING ASSETS & BROKEN PATHS
- **Existing Real Data:** Dữ liệu nhân vật, gia đình, ký ức đang nằm an toàn trong DB và file JSON.
- **Existing Endpoints:** Có sẵn các route API, tuy nhiên cần kiểm tra kỹ lại contract trả về.
- **Broken Paths:** File `src/js/app.js` (Production) là rào cản lớn nhất. Sự kiện DOM loading bị ngắt quãng hoàn toàn.

## 3. DEPENDENCIES & RISKS
- **Dependencies:** API Integration phải xong trước khi Frontend Rendering có thể hiển thị data thật.
- **Risks:** 
  - Khả năng payload API trả về không khớp với cấu trúc UI Curated Content mà Prototype đang mong đợi.
  - Vô tình đẩy code Prototype lên thẳng Production đè nát các logic khác nếu không làm tuần tự.

## 4. EXECUTION RECOMMENDATION
**First Orchestrated Task:** API & DATA LAYER MAPPING
**Recommended Agent:** OpenCode (Technical Lead)

- **Tại sao:** OpenCode cần đóng vai trò Systems Engineer để đi trước một bước: khảo sát các API endpoints hiện có, đối chiếu với nhu cầu hiển thị của Prototype (VD: Lead MẠCH, Ký ức nổi bật), và viết các hàm Fetch/Data layer cơ bản. Khi móng dữ liệu (Data Bridge) đã vững, Cline (Web UI Engineer) mới có thể vào bóc HTML/CSS lắp ráp thành giao diện hoàn chỉnh.
- **Evidence Required:** Một bản mapping chính xác giữa Backend Endpoints và Frontend Data Requirements; hoặc một đoạn code Fetch API thử nghiệm thành công (log ra console).
- **Human Gates:** Không yêu cầu Human Gate cho việc khảo sát và viết Data layer nội bộ. Sẽ cần Human Gate khi Cline chuẩn bị ghi đè `src/js/app.js` (Production deployment).

---
*Report by AGY (Heritage / Product Architect).*
*LƯU Ý: Đây là bản báo cáo sẵn sàng. Không Agent nào được tự ý code sau report này. Orchestrator sẽ lấy quyền điều phối.*
