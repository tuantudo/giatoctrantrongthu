# BÁO CÁO NGHIỆM THU IMPLEMENTATION BATCH 01 (PHASE 3)
**Dự án:** Cây Gia Phả — Gia Tộc Trần Trọng Thụ  
**Authority:** Tuấn (Human Final Authority) | Emarald (Strategic Architecture & Quality Authority)  
**Chief Orchestrator & Integration Authority:** AGY  
**Đội ngũ thực thi chuyên trách:**  
- `gt-qa` (Primary) & `gt-architect` (Reviewer): Workstream A (Test Reconciliation)  
- `gt-backend` (Primary) & `gt-security` (Reviewer): Workstream B (Backend Security & API Lockdown)  
- `gt-frontend` (Primary) & `gt-design-qa` (Reviewer): Workstream C (Frontend Stability & Gateways)  
- `gt-architect` (Read-only): Workstream D (Architecture Integrity & Domain Boundaries)  
**Thời điểm hoàn thành:** 06/11/2026  
**Trạng thái:** **COMPLETED — DỪNG TẠI HUMAN CHECKPOINT**  

---

## 1. VẤN ĐỀ BAN ĐẦU (INITIAL PROBLEM)

Trước khi thực hiện Batch 01, hệ thống tồn tại 3 khiếm khuyết kỹ thuật và an ninh trọng yếu:
1. **Lỗi kiểm thử Python acceptance kéo dài:** Lệnh `python3 tests/test_markdown_acceptance.py` thất bại tại dòng 145 với lỗi `AssertionError: 12 != 19`, làm đứt gãy quy trình kiểm định chất lượng toàn diện của dự án.
2. **Lỗ hổng API lộ lọt phả hệ phía máy chủ:** Mặc dù Client đã có Thẻ Mời cửa ngõ (`gateway.js`), nhưng trên Express server (`server/index.js`), hai endpoint `GET /api/people` và `GET /api/genealogy.json` vẫn mở `publicCors` công khai, trả về toàn bộ 223 cá nhân dòng họ cho khách vãng lai mà không kiểm tra xác thực.
3. **Thiếu vắng phòng hộ CSRF cho các yêu cầu ghi dữ liệu:** Các endpoint POST/PATCH/DELETE (đổi mật khẩu, nộp đề xuất, chỉnh sửa thông tin) chưa có cơ chế kiểm tra nguồn gốc Origin/Referer để chống tấn công Cross-Site Request Forgery.

---

## 2. NGUYÊN NHÂN ĐƯỢC XÁC MINH (VERIFIED CAUSE)

1. **Về lỗi Python test:** Test được viết từ ngày 06/09/2026 (commit `ac08c68e`) khi `data/mach.json` còn nạp gộp cả 12 bài MẠCH và 7 thư Clara. Sau đó, quyết định kiến trúc cốt lõi **P0 Clara Containment** đã tách rời 8 thư Clara sang `data/private/clara.json`, thanh lọc `data/mach.json` chỉ còn 12 bài công khai. Test cũ chưa được cập nhật assertion tương ứng nên báo lỗi sai (false positive). Dữ liệu gốc 100% nguyên vẹn.
2. **Về lỗ hổng API phả hệ:** Hai endpoint `/api/people` và `/api/genealogy.json` vốn là adapter cũ được tạo từ giai đoạn prototype, chưa được đồng bộ hóa với chính sách Gateway Hardening (W-B01-01) ở cấp độ middleware máy chủ.
3. **Về nguy cơ CSRF:** Cơ chế xác thực sử dụng Session Cookie (`sid` với `SameSite=Lax`), nhưng thiếu lớp kiểm tra xác thực Origin header cho các thao tác HTTP mang tính thay đổi trạng thái dữ liệu (state-changing requests).

---

## 3. CÁC FILE VÀ THÀNH PHẦN BỊ ẢNH HƯỞNG (AFFECTED FILES & COMPONENTS)

| Tệp tin | Thành phần | Loại thay đổi | Trách nhiệm |
| :--- | :--- | :---: | :--- |
| [`tests/test_markdown_acceptance.py`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/tests/test_markdown_acceptance.py) | Bộ test Python acceptance | Sửa đổi | `gt-qa` / `gt-architect` |
| [`server/index.js`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/index.js) | Backend Express routes & middleware | Sửa đổi | `gt-backend` / `gt-security` |
| [`scripts/test_backend_security_verification.mjs`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/scripts/test_backend_security_verification.mjs) | Kịch bản kiểm toán an ninh API độc lập | Tạo mới | `gt-security` |
| `.agents/agents/*` (7 files) | Định nghĩa persistent của 7 subagents | Tạo mới | AGY |
| `src/js/member-app.js` & `src/js/app-v2.js` | Hai file di sản mồ côi | **BẢO TỒN NGUYÊN VẸN** (Không archive theo chỉ thị Tuấn) | `gt-architect` |

---

## 4. THAY ĐỔI ĐÃ THỰC HIỆN (CHANGES MADE)

### Workstream A: Test Reconciliation
- Cập nhật `tests/test_markdown_acceptance.py`:
  - Assert đúng 12 bài viết MẠCH công khai trong `data/mach.json`.
  - Bổ sung assertion giám sát **P0 Clara Containment**: cấm tiệt bài viết có slug `clara*` hoặc `seriesSlug == "thu-gui-clara"` lọt vào `data/mach.json`.
  - Nạp và kiểm tra đủ 8 thư Clara từ `data/private/clara.json`, kiểm tra chữ ký `"Bác Tuấn"` tại `clara-001`.
  - Kiểm tra toàn bộ các khối nội dung (blocks) để bảo đảm không rò rỉ ký tự markdown thô (`**`, `__`, `[^]`, `[[]]`).

### Workstream B: Backend Security & API Lockdown
- Cập nhật `server/index.js`:
  - Thiết lập middleware `requireMemberOrAdmin`: bắt buộc phiên đăng nhập thành viên (`req.session.accountId`) hoặc quản trị viên (`req.session.userId`).
  - Khóa chặt hai endpoint `GET /api/people` và `GET /api/genealogy.json`: Khách vãng lai gọi vào sẽ nhận ngay mã lỗi `HTTP 401 Unauthorized` kèm thông báo `UNAUTHORIZED_MEMBER_GATEWAY`.
  - Giữ nguyên trạng thái **CÔNG KHAI HOÀN TOÀN** cho các endpoint phục vụ đối ngoại theo đúng thiết kế: `GET /api/mach.json`, `GET /api/calendars/:filename`, `GET /assets/*`, `POST /api/auth/login`, `POST /api/member/login`.
  - Tích hợp middleware **Anti-CSRF Protection**: Tự động chặn các yêu cầu POST/PUT/PATCH/DELETE có Origin header không khớp với host máy chủ (trả về `HTTP 403 CSRF_ORIGIN_MISMATCH`), ngoại trừ các tuyến đăng nhập ban đầu.

### Workstream C & D: Frontend Stability & Architecture Integrity
- Bảo toàn nguyên vẹn 100% hai file di sản `src/js/member-app.js` và `src/js/app-v2.js` trong thư mục `src/js/` theo đúng chỉ thị điều chỉnh phạm vi của Tuấn.
- Xác nhận các tuyến điều hướng Client-Side (`boot-public.js`, `gateway.js`, `dashboard.js`, `tree.js`, `person.js`) vận hành ổn định, không phát sinh bất kỳ lỗi console hay runtime regression nào.

---

## 5. KẾT QUẢ KIỂM THỬ (TEST RESULTS)

### A. Bộ Kiểm Thử Node.js (`npm test`)
```text
> giatoctrantrongthu@1.0.0 test
> node --test tests/test_*.mjs

ℹ tests 12 | ℹ suites 0 | ℹ pass 12 | ℹ fail 0 | ℹ cancelled 0 | ℹ duration_ms 428.23ms
```
- **Kết quả:** **12/12 test suites PASS 100%**.
  - `test_batch_ui_02_03.mjs`: PASS
  - `test_batch_ui_03_deep_qa.mjs`: PASS
  - `test_consumer_integration.mjs`: PASS
  - `test_domain_archive.mjs`: PASS
  - `test_domain_calendar.mjs`: PASS
  - `test_domain_editorial.mjs`: PASS
  - `test_domain_genealogy.mjs`: PASS
  - `test_domain_kinship.mjs`: PASS
  - `test_gateway_hardening.mjs`: PASS
  - `test_member_home_convergence.mjs`: PASS
  - `test_platform_data.mjs`: PASS
  - `test_shared_layer.mjs`: PASS

### B. Bộ Kiểm Thử Python Acceptance (`python3`)
```text
$ python3 tests/test_markdown_acceptance.py
Ran 4 tests in 0.010s
OK

$ python3 tests/verify_mach_blocks.py
Total articles: 12
Checked 360 blocks across 12 articles.
PASS: Zero raw markdown syntax leaked across all articles!
```
- **Kết quả:** **100% PASS** (4/4 tests trong test_markdown_acceptance, 360/360 blocks trong verify_mach_blocks).

### C. Kiểm Tra An Ninh API Thực Tế (`scripts/test_backend_security_verification.mjs`)
```text
🔒 Starting Independent Security Verification (Workstream B)...
  ✅ [PASS] Probe 1: Public endpoint /api/mach.json is accessible (Status 200)
  ✅ [PASS] Probe 2: /api/people correctly rejects unauthenticated guest (Status 401 UNAUTHORIZED_MEMBER_GATEWAY)
  ✅ [PASS] Probe 3: /api/genealogy.json correctly rejects unauthenticated guest (Status 401)
  ✅ [PASS] Probe 4: SENSITIVE_PATH regex blocks /data/private/clara.json (Status 404)
  ✅ [PASS] Probe 5: CSRF attack attempt from foreign origin is blocked (Status 403 CSRF_ORIGIN_MISMATCH)
  ✅ [PASS] Probe 6: Public login endpoint correctly exempted from pre-auth token (Status 200)

🎉 ALL 6 BACKEND SECURITY PROBES PASSED WITH 100% SUCCESS!
```

---

## 6. BẰNG CHỨNG CRAFT ANYTHING (CRAFT ANYTHING EVIDENCE)

- **Mã bằng chứng đồ thị AST:** `ev_87ca217c9566fbe4f9a2cd3f19d8a2e86c354a0394168ee12ae84eac26d15609`
- **Kết quả phân tích cú pháp AST ở chế độ Deep Mode (`--deep`):**
  - Tổng số modules quét: `203 source files`
  - Tổng số nodes đồ thị: `1.686 nodes`
  - Tổng số edges liên kết: `3.010 edges`
  - Tổng số HTTP endpoints: `43 endpoints`
  - Tổng số routes: `59 routes`
  - **Xác nhận chất lượng:** 0 lỗi cú pháp parse, toàn bộ các lời gọi DataService DIP và Express middleware kết nối liền mạch, không làm đứt gãy bất kỳ Event Listener nào.

---

## 7. RỦI RO CÒN LẠI (REMAINING RISKS)

- **Rủi ro API Client cũ:** Các đoạn mã bên ngoài (nếu có) trước đây gọi trực tiếp vào `GET /api/people` hoặc `GET /api/genealogy.json` mà không đăng nhập sẽ nhận mã lỗi 401. Đây là hành vi mong muốn theo đúng chính sách bảo vệ gia phả.
- **Dữ liệu thật CSDL:** File SQLite `server/family_archive.db` và file GEDCOM gốc `GIADINHONGTHU.ged` được giữ nguyên bit-for-bit, hoàn toàn không bị can thiệp.

---

## 8. PHƯƠNG ÁN HOÀN NGUYÊN (ROLLBACK METHOD)

Nếu phát sinh bất kỳ trục trặc nào, toàn bộ Batch 01 có thể được hoàn nguyên tức thì trong 1 giây qua Git:
```bash
git checkout tests/test_markdown_acceptance.py server/index.js
rm -f scripts/test_backend_security_verification.mjs
```

---

## 9. CÔNG VIỆC TIẾP THEO & DỪNG TẠI HUMAN CHECKPOINT

Batch 01 đã được thực thi và nghiệm thu thành công mỹ mãn:
- Khôi phục **100% Green Tests** toàn diện trên cả Node.js (12/12) và Python (4/4).
- Khóa chặt an ninh API phả hệ phía máy chủ, đồng bộ hoàn hảo với Thẻ Mời cửa ngõ của Client.
- Kích hoạt phòng hộ CSRF cho toàn bộ backend Express.
- Bảo tồn nguyên vẹn hai file di sản và toàn bộ CSDL seed data.

> [!CAUTION]
> **DỪNG LẠI TẠI CHECKPOINT:**  
> AGY và toàn bộ đội ngũ dừng lại tại đây, không deploy production, kính trình **Emarald** tiến hành thẩm tra độc lập (Architecture & Quality Review) và chờ quyết định của **Tuấn** cho Implementation Batch 02 (Visual Quality & Me-Centric Experimental Convergence).

