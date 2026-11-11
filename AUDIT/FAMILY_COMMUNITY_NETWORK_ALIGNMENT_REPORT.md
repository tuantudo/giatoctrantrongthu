# BÁO CÁO BÀN GIAO — MỞ RỘNG MẠNG LƯỚI CỘNG ĐỒNG GIA ĐÌNH & KIẾN TRÚC NỘI DUNG
## (Family Community Network & Content Architecture Alignment)

- **Thời gian thực hiện:** 2026-11-02 09:42:00+07:00
- **Thực hiện bởi:** AGY — Execution Coordinator
- **Thẩm quyền phê duyệt tối cao:** Tuấn — Human Final Authority
- **Thẩm định & Giám sát:** Emarald — Analysis & Governance
- **Chế độ thực thi:** **DOCUMENT EDITING ONLY (Chỉ cập nhật tài liệu kế hoạch, không sửa code, không đổi CSDL, không can thiệp production)**
- **Nguồn chỉ thị:** `EXECUTION DIRECTIVE — FAMILY COMMUNITY NETWORK & CONTENT ARCHITECTURE`

---

## 1. Danh Sách Tài Liệu Đã Cập Nhật

1. [`AUDIT/MASTER_COMPLETION_PLAN.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/MASTER_COMPLETION_PLAN.md):
   - Nâng phiên bản: `v2.2 (Digital Heritage Canonical Plan + Family Community Network Architecture)`.
   - Bổ sung định hướng mở rộng tại Mục 0 (Executive Summary).
   - Bổ sung **§1.1B Nguyên Tắc Mở Rộng: Mạng Lưới Cộng Đồng Gia Đình (Family Community Network)** gồm 6 nhận thức nền tảng.
   - Bổ sung 2 điều cấm tại **§1.2** (cấm giới hạn sản phẩm trong một dòng họ đơn nhất; cấm hard-code 3 scope đóng).
   - Tái định vị **§1.4**: Xác định rõ CLARA – MẠCH – PUBLIC là **3 instance cụ thể của giai đoạn hiện tại (current instances)**, không phải taxonomy đóng của tương lai.
   - Bổ sung **§1.5 Các Nguyên Tắc Kiến Trúc Mạng Lưới & Nội Dung** (6 nguyên tắc bảo toàn khả mở: không hard-code, phân biệt 7 thực thể khái niệm, phân tầng đồ thị phả hệ vs cộng đồng, quyền tự kể chuyện, quyền riêng tư khi giao thoa, ranh giới triển khai giữ nguyên V1.0).
   - Bổ sung quyết định chiến lược **DEC-14** vào Decision Register (§7).
2. [`AUDIT/FRONTEND_COMPLETION_PLAN.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/FRONTEND_COMPLETION_PLAN.md):
   - Nâng phiên bản: `v1.2 (Frontend Specialized Alignment + Family Community Network Framing)`.
   - Cập nhật Nguyên tắc cốt lõi số 5 và Bảng Navigation Registry: Khẳng định CLARA, MẠCH, PUBLIC trên giao diện V1.0 là các không gian hiện hành; **Frontend tuyệt đối KHÔNG xây dựng thêm giao diện, route hay navigation giả định cho các cộng đồng tương lai trong giai đoạn này**, bảo toàn 100% phạm vi 6 bề mặt cốt lõi hiện có.
3. [`AUDIT/ARCHITECTURE_DISCOVERY_RELATIONAL_IDENTITY_PRIVACY.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/ARCHITECTURE_DISCOVERY_RELATIONAL_IDENTITY_PRIVACY.md):
   - Bổ sung ghi chú định hướng Mạng lưới Cộng đồng Gia đình tại Mục 14 (Data Classification): Một cá nhân thuộc nhiều cộng đồng mà không nhân bản hồ sơ nhân thân; bảo toàn ranh giới tiếp cận khi các cộng đồng giao thoa.
4. [`/Users/tuantq/Obsidian/20_PROJECTS/Mach/MACH_SYSTEM/CORE_DECISIONS.md`](file:///Users/tuantq/Obsidian/20_PROJECTS/Mach/MACH_SYSTEM/CORE_DECISIONS.md):
   - Bổ sung quyết định **D009** (Định hướng Mạng lưới Cộng đồng Gia đình & Kiến trúc Nội dung).
   - Tái biên dịch `mach_audit_pipeline.sh` cập nhật `MACH_AUDIT.md` và `MACH_SOURCE_OF_TRUTH.md`.

---

## 2. Những Nguyên Tắc Mới Được Ghi Nhận

1. **Định hướng Mạng lưới Cộng đồng Gia đình (Family Community Network):** CÂY GIA PHẢ không giới hạn tư duy sản phẩm trong phạm vi một dòng họ đơn nhất. Hệ thống có khả năng mở rộng thành mạng lưới các cộng đồng gia đình có liên hệ; trong đó mỗi cá nhân, gia đình, nhánh và dòng họ đều có thể lưu giữ, kể lại và truyền tiếp câu chuyện của mình với phạm vi do chủ thể có thẩm quyền xác lập.
2. **Sáu nhận thức nền tảng về quan hệ và cộng đồng:**
   - Một cá nhân có thể thuộc nhiều cộng đồng gia đình (nội, ngoại, ông bà, cha mẹ, hạt nhân, thân tộc khác).
   - Một gia đình có thể có câu chuyện, ký ức, tư liệu, lịch sử riêng cho con cháu.
   - Một nhánh gia đình có thể tự lưu giữ và truyền tiếp câu chuyện của nhánh mình.
   - Một dòng họ có thể có không gian ghi nhận lịch sử, văn hóa, tư tưởng chung.
   - Các cộng đồng có thể liên hệ, giao thoa, chia sẻ cá nhân/tư liệu mà không mất quyền xác lập phạm vi riêng tư.
   - Mỗi cộng đồng có cách kể, tổ chức tư liệu riêng, không bắt buộc theo một khuôn mẫu biên tập duy nhất.
3. **Phân biệt 4 tầng khái niệm (Không đồng nhất Cây phả hệ với toàn bộ Mạng lưới):**
   - Đồ thị quan hệ huyết thống / gia đình (Family Graph).
   - Tư cách thành viên trong từng cộng đồng gia đình (Community Membership).
   - Quan hệ giữa các cộng đồng (Inter-community Relations).
   - Quan hệ sở hữu, đóng góp và quyền truy cập nội dung (Content Rights & Ownership).
   - *Hệ quả:* Một cá nhân có thể xuất hiện trong nhiều câu chuyện của nhiều cộng đồng mà **không cần nhân bản hồ sơ nhân thân**.
4. **Bảo toàn quyền riêng tư khi giao thoa:** Việc một cá nhân thuộc nhiều cộng đồng không đồng nghĩa các cộng đồng có quyền xem chéo toàn bộ dữ liệu hay câu chuyện của cá nhân đó. Quyền truy cập xác lập theo từng nội dung và phạm vi thẩm quyền.

---

## 3. Những Nội Dung Cũ Đã Được Điều Chỉnh (Tránh Hard-code CLARA – MẠCH – PUBLIC)

- **Tại Master Plan §1.4 & §1.5:**
  - *Trước đây:* Định nghĩa CLARA, MẠCH, PUBLIC như 3 Discourse Scopes cố định duy nhất của toàn bộ sản phẩm.
  - *Hiện tại:* Xác định rõ CLARA, MẠCH, PUBLIC là **ba trường hợp cụ thể của giai đoạn hiện tại (current instances)**:
    - CLARA = một câu chuyện gia đình riêng tư cụ thể (Tuấn & Clara). Các gia đình khác có thể có câu chuyện riêng tương tự.
    - MẠCH = một không gian tư tưởng, khảo sát, nghiên cứu văn hóa cụ thể của dòng họ Trần Trọng Thu. Các dòng họ/cộng đồng khác có thể có không gian tương tự.
    - PUBLIC = không gian phát ngôn hướng ra xã hội cụ thể của dòng họ, hiện do Tuấn đảm nhiệm.
  - Bổ sung điều cấm rõ ràng: Không hard-code ba không gian này thành taxonomy đóng của sản phẩm.
- **Tại Frontend Plan (Nguyên tắc 5 & Navigation Registry):**
  - Khẳng định 3 scope trong UI System vNEXT là các không gian hiện hành phục vụ V1.0, không phải taxonomy đóng của tương lai.
  - Quy định chặn (boundary guard): Frontend **không tự ý triển khai giao diện hoặc navigation giả định cho các cộng đồng tương lai**; tập trung hoàn thành 6 bề mặt cốt lõi hiện hành.

---

## 4. Những Điểm Còn Chưa Đủ Căn Cứ / Cần Tuấn Quyết Định

1. **Phân biệt 7 khái niệm định hướng:** Individual/Person, Relationship, Family/Family Community, Branch/Lineage, Story/Narrative, Discourse Space, Access Policy được ghi nhận ở mức **định hướng kiến trúc bảo toàn tính khả mở**. Chưa có chỉ thị của Tuấn/Emarald về việc chuyển đổi các khái niệm này thành Ontology chính thức hay DDL Database Schema.
2. **Các Open Questions cốt lõi của V1.0 tiếp tục duy trì:**
   - `OQ-06` (P0): Cách thức gỡ/cô lập 7 thư Clara đang công khai trên API/file tĩnh/ảnh để mở khóa `TASK-06D` → `TASK-06C`.
   - `OQ-01`: Tiêu chí và nguồn dữ liệu xác định "thành viên nhánh ông bà Hạnh Đào".
   - `OQ-02`: Thẩm quyền biên tập và quản trị nội dung của các không gian.
   - `OQ-05`: Cách hiển thị trạng thái khi người dùng không có quyền truy cập Clara (ẩn hoàn toàn hay báo từ chối trang nhã).
   - `OQ-09`: Nhãn attribution cho phát ngôn Public.

---

## 5. Xác Nhận Phạm Vi Thay Đổi (Scope Invariants)

- ✅ **Chỉ chỉnh sửa tài liệu kế hoạch và kiến trúc:** `MASTER_COMPLETION_PLAN.md` (v2.2), `FRONTEND_COMPLETION_PLAN.md` (v1.2), `ARCHITECTURE_DISCOVERY_RELATIONAL_IDENTITY_PRIVACY.md`, và `CORE_DECISIONS.md`.
- ❌ **Không sửa mã nguồn:** 0 dòng code JavaScript, CSS, HTML bị thay đổi.
- ❌ **Không sửa CSDL / Schema:** Không tạo bảng mới, không thêm migration, không sửa `family_archive.db` hay MariaDB.
- ❌ **Không sửa GEDCOM:** Tệp `GIADINHONGTHU.ged` giữ nguyên vẹn 100% ở chế độ STRICT READ-ONLY.
- ❌ **Không can thiệp Production:** Không deploy, không sửa DNS/Cloudflare/Vercel/NAS.
- ❌ **Không làm thay đổi lộ trình triển khai:** Lộ trình 5 Stage và đường găng kỹ thuật của Master Plan được bảo tồn nguyên vẹn.

---

*Báo cáo được hoàn lập và lưu giữ tại `AUDIT/FAMILY_COMMUNITY_NETWORK_ALIGNMENT_REPORT.md` để Tuấn và Emarald tiện theo dõi.*

