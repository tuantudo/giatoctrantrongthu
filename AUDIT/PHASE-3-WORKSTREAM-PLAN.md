# KẾ HOẠCH TRIỂN KHAI PHÂN HỆ PHASE 3 (PHASE-3-WORKSTREAM-PLAN)
**Dự án:** Cây Gia Phả — Gia Tộc Trần Trọng Thụ  
**Authority:** Tuấn (Human Final Authority) | Emarald (Architecture Authority)  
**Chief Orchestrator:** AGY  
**Căn cứ:** Chỉ thị Chiến lược Phase 2 & Phase 3 (06/11/2026)  
**Mô hình vận hành:** Multi-Agent Engineering Team + Craft Anything Continuous QA  

---

## 1. MỤC TIÊU CHIẾN LƯỢC PHASE 3

Chuyển đổi toàn diện từ giai đoạn khảo sát sang **phát triển sản phẩm có kiểm soát (Controlled Product Engineering)**, vận hành theo nguyên tắc **Seed-First**:
- Lấy 223 cá nhân và 68 gia đình hiện hữu làm **SEED DATA** để hoàn thiện các phân hệ sản phẩm.
- Không để việc chuẩn hóa dữ liệu sơ khởi làm cản trở tiến độ phát triển tính năng.
- Xây dựng sản phẩm trước, mở rộng và chuẩn hóa dữ liệu theo lộ trình tiến trình.

---

## 2. NĂM WORKSTREAMS TRIỂN KHAI SONG SONG (PARALLEL WORKSTREAMS)

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                          LỘ TRÌNH TRIỂN KHAI PHASE 3                                   │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ WORKSTREAM A: FRONTEND STABILITY & PRODUCT UX (Phụ trách: gt-frontend)                 │
│   • Hoàn thiện Person Profile 6 Layers (Tích hợp Evidence và Disputes TP-024)         │
│   • Hoàn thiện 3-Tier Me-Centric Tree (Breadcrumbs dòng dõi, chuyển đổi Dual-View)    │
│   • Bảo đảm 100% no sideways scroll trên 4 breakpoints (1440, 1024, 768, 375px)       │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ WORKSTREAM B: BACKEND RELIABILITY & API SECURITY (Phụ trách: gt-backend)               │
│   • Khóa an ninh 2 endpoint /api/people và /api/genealogy.json bằng requireAccount     │
│   • Triển khai middleware Anti-CSRF Token cho toàn bộ mutating endpoints (POST/PATCH)  │
│   • Chuẩn hóa error handling và validation cho dữ liệu đầu vào                         │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ WORKSTREAM C: DATA ARCHITECTURE & SEED INTEGRATION (Phụ trách: gt-data)               │
│   • Bảo toàn bit-for-bit file CSDL server/family_archive.db (15 bảng, 223 người)       │
│   • Hoàn thiện Platform Data Inversion Layer (DIP) và HttpDataAdapter                  │
│   • Lập phương án migration tiến trình cho quyết định DEC-A03 (bảng cms_documents)     │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ WORKSTREAM D: CRAFT ANYTHING REFERENCE & CONTINUOUS QA (Phụ trách: gt-design-qa)      │
│   • Khảo sát Clean Room đối chuẩn FamilySearch (Interaction patterns, A11y)           │
│   • Thẩm tra Visual Regression tự động sau mỗi batch, phát hiện layout drift           │
│   • Lưu trữ định lượng bằng chứng captures và hộp layout (boxes)                       │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ WORKSTREAM E: ARCHITECTURE & TECHNICAL DEBT (Phụ trách: gt-architect & gt-qa)         │
│   • Dọn dẹp an toàn hai file di sản mồ côi src/js/member-app.js và src/js/app-v2.js    │
│   • Duy trì 100% Green Tests toàn diện (12/12 Node suites và Python acceptance)        │
│   • Hợp nhất và dọn dẹp hơn 165 tài liệu markdown phân mảnh                            │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. LỘ TRÌNH CÁC IMPLEMENTATION BATCHES TUẦN TỰ

### BATCH 01: NỀN TẢNG BẢO MẬT & BẢN VÁ KIỂM THỬ (P0 SPRINT — THỰC HIỆN NGAY)
- **Mục tiêu:** Đưa toàn bộ repo về trạng thái 100% Green Tests và khóa chặt an ninh API phía máy chủ.
- **Đầu việc cụ thể:**
  1. Cập nhật `tests/test_markdown_acceptance.py`: Assert 12 bài MẠCH + P0 Clara Containment (0 bài Clara trong `mach.json`) + kiểm tra 8 thư Clara (`clara.json`).
  2. Củng cố `server/index.js`: Gắn `requireMemberOrAdmin` vào `/api/people` và `/api/genealogy.json`; kích hoạt middleware Anti-CSRF cho mutating requests.
  3. Dọn dẹp `src/js/member-app.js` và `src/js/app-v2.js` vào `archive/legacy_frontend/` dựa trên chứng cứ đồ thị AST (0 cạnh phụ thuộc).
  4. Chạy `npm test` và `python3 tests/test_markdown_acceptance.py` đạt 100% PASS.

### BATCH 02: VISUAL QUALITY & ME-CENTRIC EXPERIMENTAL CONVERGENCE (P1 SPRINT)
- **Mục tiêu:** Thẩm định trực quan qua Craft Anything và tối ưu trải nghiệm Cây Phả Hệ Me-Centric.
- **Đầu việc cụ thể:**
  1. Dùng Craft Anything đo đạc layout 4 breakpoints trên runtime local, đối soát sai lệch so với baseline production.
  2. Tối ưu hóa tương tác chuyển đổi giữa Phả đồ 3 thế hệ (Pedigree) và Danh sách lưu trữ (Archival List).
  3. Hoàn thiện bộ lọc tìm kiếm tiếng Việt có dấu/không dấu chuẩn Collation.

### BATCH 03: ADMIN CONTROL CENTER v2.1 & CMS DEC-A03 (P2 SPRINT)
- **Mục tiêu:** Nâng cấp Trung tâm Quản trị Admin và triển khai lưu trữ CMS Trang chủ.
- **Đầu việc cụ thể:**
  1. Tiếp nhận phê duyệt của Tuấn cho `DEC-A03`: Tạo bảng `cms_documents` trong SQLite.
  2. Xây dựng phân hệ `mod-public-cms` và `mod-proposals` trong `admin/`.
  3. Tích hợp quy trình duyệt bài và quản lý hộp thư đóng góp của thành viên.

---

## 4. TIÊU CHÍ HOÀN THÀNH (DEFINITION OF DONE - DoD)

Một Batch hoặc Workstream chỉ được xem là hoàn thành khi:
1. **Mã nguồn:** Tuân thủ phân tầng kiến trúc, zero circular dependencies, zero unescaped HTML.
2. **Kiểm thử tự động:** 100% unit tests và regression tests đạt kết quả PASS.
3. **Bảo mật:** Không rò rỉ dữ liệu phả hệ hay PII cho khách vãng lai; Clara Containment được kiểm chứng.
4. **Visual & Responsive:** Đo đạc qua Craft Anything xác nhận 100% no sideways scroll trên 4 kích thước (1440, 1024, 768, 375px).
5. **Khả năng khôi phục:** Có sẵn phương án hoàn nguyên (Rollback) tức thì nếu phát sinh sự cố.
6. **Báo cáo:** Biên bản bàn giao chuẩn 9 mục trình Tuấn và Emarald xem xét.

