# LỘ TRÌNH PHÁT TRIỂN SẢN PHẨM PHÂN CẤP ƯU TIÊN (PHASE 2E)
**Dự án:** Cây Gia Phả — Gia Tộc Trần Trọng Thụ  
**Authority:** Tuấn (Product Owner / Human Final Authority) | Emarald (Strategic Architecture & Quality Authority)  
**Execution & Backlog Management:** AGY (Chief Orchestrator & Integration Authority)  
**Tài liệu gốc tham chiếu:** [`AUDIT/MASTER_COMPLETION_PLAN.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/MASTER_COMPLETION_PLAN.md)  
**Thời điểm hoàn thành:** 06/11/2026  

---

## 1. NGUYÊN TẮC PHÂN CẤP ƯU TIÊN 5 CẤP ĐỘ (P0 $\to$ P4)

Mọi hạng mục công việc được đánh giá nghiêm ngặt qua 6 chiều tiêu chuẩn:
- **Giá trị nghiệp vụ (Business Value):** Tầm quan trọng đối với dòng họ và sứ mệnh di sản số.
- **Tác động người dùng (User Impact):** Ảnh hưởng trực tiếp đến trải nghiệm của con cháu và các cụ.
- **Rủi ro kỹ thuật (Technical Risk):** Nguy cơ gây lỗi, rò rỉ dữ liệu hoặc hỏng hóc CSDL.
- **Ràng buộc phụ thuộc (Dependency):** Điều kiện tiên quyết cần giải quyết trước.
- **Khối lượng thi công (Effort):** Thời gian và tài nguyên cần thiết.
- **Tiêu chí nghiệm thu (Acceptance Criteria):** Điều kiện định lượng để đánh dấu hoàn thành.

---

## 2. MA TRẬN ĐÁNH GIÁ 11 HẠNG MỤC TỒN ĐỌNG TRỌNG YẾU

| STT | Hạng mục công việc | Phân cấp | Giá trị | Tác động | Rủi ro | Phụ thuộc | Effort | Tiêu chí nghiệm thu định lượng (Acceptance Criteria) |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **01** | **Python Test Reconciliation** | **P0** | Cao | Nền tảng | Thấp | Không | 1h | Sửa `tests/test_markdown_acceptance.py`: `python3 tests/test_markdown_acceptance.py` đạt **6/6 PASS**; bảo đảm P0 Clara Containment (0 bài Clara trong `mach.json`). |
| **02** | **CSRF Protection Middleware** | **P0** | Tối cao | Bảo mật | Trung bình | Không | 2h | Bổ sung middleware Anti-CSRF Token cho Express backend. 100% POST/PATCH/DELETE không có token bị từ chối với HTTP 403. |
| **03** | **Backend Gateway Lockdown** | **P0** | Tối cao | Bảo mật | Thấp | Không | 1h | Gắn `requireAccount` vào `/api/people` và `/api/genealogy.json` trong `server/index.js`. Khách vãng lai gọi API nhận HTTP 401. |
| **04** | **Visual Regression (Craft Anything)** | **P1** | Cao | Cao | Thấp | Không | 3h | Dùng engine Chromium CDP đối soát local runtime với baseline production ở 4 breakpoints (1440, 1024, 768, 375px), xác nhận 0 layout drift, 0 sideways scroll. |
| **05** | **Legacy Code Cleanup** | **P1** | Trung bình | Nội bộ | Thấp | Evidence AST | 1h | Dời 2 file mồ côi `src/js/member-app.js` và `src/js/app-v2.js` vào `archive/legacy-frontend/`. 12/12 unit tests và dev server vẫn chạy bình thường. |
| **06** | **Quyết định DEC-A03 Resolution** | **P1** | Cao | Quản trị | Thấp | Chờ Tuấn | 0.5h | Tuấn chọn phương án lưu trữ Homepage Copy (bảng `cms_documents` trong SQLite). Chuyển trạng thái `DEC-A03` từ `OPEN` sang `APPROVED`. |
| **07** | **Admin Control Center v2.1** | **P2** | Rất cao | Vận hành | Trung bình | DEC-A03 | 12h | Hoàn thiện 9 module quản trị (`mod-people`, `mod-editorial`, `mod-proposals`, `mod-public-cms`...) kết nối trực tiếp với CSDL SQLite thật. |
| **08** | **User Enablement (Cẩm nang)** | **P2** | Rất cao | Rất cao | Rất thấp | UI vNEXT | 4h | Soạn cẩm nang hướng dẫn thành viên và các cụ cao niên đăng nhập, tra cứu cây gia phả, ngày giỗ và gửi đề xuất hiệu đính. |
| **09** | **Docs Consolidation (Dọn dẹp)** | **P3** | Trung bình | Nội bộ | Thấp | Không | 3h | Hợp nhất hơn 165 tài liệu markdown phân mảnh, lưu trữ báo cáo cũ vào `docs/archive/`, chuẩn hóa tài liệu theo Source of Truth v2.0. |
| **10** | **E2E Staging Testing** | **P3** | Cao | Hệ thống | Trung bình | P0 + P1 | 6h | Chạy kiểm thử toàn trình từ đăng nhập, duyệt cây, tra cứu lịch, gửi đề xuất trên môi trường Staging. |
| **11** | **NAS Sync & Prod V1.0 Closure** | **P4** | Tối cao | Toàn diện | Cao | Gate 05, 06 | 4h | Đồng bộ dữ liệu lên Synology NAS, đối soát MariaDB và chính thức phát hành phiên bản V1.0 sau khi Tuấn ký duyệt `GATE-06`. |

---

## 3. LỘ TRÌNH THỰC THI TUẦN TỰ (SEQUENTIAL EXECUTION BATCHES)

### GIAI ĐOẠN 1: BẢO VỆ AN NINH & BẢN VÁ NỀN TẢNG (P0 SPRINT — 1 ĐẾN 2 NGÀY)
1. **Batch SEC-01:** Khắc phục bài kiểm thử Python `test_markdown_acceptance.py` (khôi phục trạng thái 100% green tests toàn repo).
2. **Batch SEC-02:** Vá an ninh 2 đầu: Bổ sung Anti-CSRF protection cho Backend Express và khóa an ninh hai endpoint `/api/people`, `/api/genealogy.json`.
3. **Batch CLEAN-01:** Dọn dẹp an toàn hai file di sản mồ côi `src/js/member-app.js` và `src/js/app-v2.js` dựa trên bằng chứng đồ thị AST của Craft Anything.

### GIAI ĐOẠN 2: HOÀN THIỆN SẢN PHẨM & TRẢI NGHIỆM NGƯỜI DÙNG (P1/P2 SPRINT — 3 ĐẾN 5 NGÀY)
1. **Batch UI-01:** Thẩm tra Visual Regression toàn diện qua Craft Anything ở 4 độ phân giải cho Member Home (`/me`), Hồ sơ 6 tầng và Cây phả đồ 3 thế hệ.
2. **Batch ADMIN-01:** Tuấn duyệt `DEC-A03`; hiện thực hóa bảng `cms_documents` và hoàn thiện Admin Control Center v2.1.
3. **Batch GUIDE-01:** Phát hành Cẩm nang hướng dẫn sử dụng gia tộc dành cho thành viên và các cụ cao niên.

### GIAI ĐOẠN 3: TỔNG NGHIỆM THU, ĐỒNG BỘ NAS & PHÁT HÀNH V1.0 (P3/P4 SPRINT)
1. **Batch STAGING-01:** Chạy bộ kiểm thử E2E tích hợp Staging.
2. **Batch PROD-01:** Hoàn tất Human Gate 05 và Gate 06; đồng bộ NAS MariaDB và đóng gói phát hành V1.0.

