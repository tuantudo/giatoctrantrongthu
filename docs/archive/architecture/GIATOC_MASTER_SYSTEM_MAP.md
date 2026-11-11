# GIATOC MASTER SYSTEM MAP & ROADMAP
*Bản đồ Hệ thống Tổng thể và Lộ trình Triển khai*
*Ngày: 2026-09-15*
*Trạng thái: CANONICAL ROADMAP*

---

## 1. EXECUTIVE SUMMARY
Tài liệu này là bản đồ kiến trúc toàn diện nhất của dự án Giatoc, liên kết từ Động cơ (Human Intent) cho đến Kế thừa (Inheritance). Dựa trên sự thay đổi cốt lõi từ mô hình "Tạp chí" sang "Không gian Di sản Số", lộ trình triển khai cũ đã được phản biện và sắp xếp lại. Điểm thay đổi lớn nhất: **Không được phục hồi Production (Backend/API) khi Kiến trúc Ngữ nghĩa (Ontology) và Trải nghiệm (UI) chưa được sửa lỗi.** 

---

## 2. CURRENT PROJECT STATE
[VERIFIED] Dự án đã đi qua đợt Audit sâu sắc nhất về mặt ý nghĩa (GIATOC_PROJECT_MEMORANDUM). 
- **Ý niệm (Concept):** Đã khóa (Meaning Lock hoàn tất).
- **Kiến trúc (Architecture):** Gặp lỗi Level 4 (Đang theo mô hình Tạp chí).
- **Giao diện (UI):** Bản DESIGN-001 đang chạy là prototype của mental model cũ.
- **Hệ thống (Production):** Các luồng dữ liệu (Cloudflare → NAS → DB) đang tạm gián đoạn hoặc chưa sync với thiết kế mới.

---

## 3. HUMAN INTENT
[VERIFIED] "Bọn nó sẽ có được thứ mà tao không có."
Tuấn đóng vai trò người đặt viên gạch nền móng, xây dựng một cơ chế trao truyền di sản tinh thần liên thế hệ, sử dụng các phương thức của công nghệ, nội dung và xuất bản.

---

## 4. MASTER SYSTEM MAP
Sơ đồ chuỗi giá trị cốt lõi của toàn bộ hệ thống:

```text
[1] HUMAN INTENTION (Bọn nó sẽ có thứ tao không có)
        ↓
[2] MEANING / WORLDVIEW (Sự kết nối giữa hiện tại và tương lai)
        ↓
[3] HERITAGE MODEL (Không gian di sản số: Gia phả + Ký ức + Tiếng nói + Di thư)
        ↓
[4] ONTOLOGY (Định nghĩa thực thể: Person, Family, Asset, Story, Testament)
        ↓
[5] INFORMATION ARCHITECTURE (Cấu trúc phân lớp: Public / Member / Owner)
        ↓
[6] EXPERIENCE / DESIGN (Silent UI, Pacing, Intimacy, Typography)
        ↓
[7] DATA / APPLICATION (JSON tĩnh, REST API, Node.js, Vercel Front-end)
        ↓
[8] INFRASTRUCTURE (MariaDB, Synology NAS, Cloudflare Tunnels)
        ↓
[9] PRODUCTION (Owner Control Plane: Draft → Edit → Publish)
        ↓
[10] ACCESS (Người dùng hiện tại đọc, tra cứu)
        ↓
[11] INHERITANCE (Hậu duệ tương lai nhận lại di sản)
        ↓
[12] CONTINUATION (Thế hệ sau có quyền đóng góp nếu muốn)
```

---

## 5. HERITAGE / PRODUCT MAP
[PROPOSED] Giatoc = Digital Heritage Institution.

```text
GIATOC (Heritage Space)
 ├── GENEALOGY (Data / Root)
 │    ├── Person (Nhân vật) ───[link]──> FamilySearch (External Verification)
 │    └── Family (Nhánh/Hộ)
 │
 ├── ARCHIVE (Evidence / Thô)
 │    ├── Tư liệu (Scan, Giấy tờ)
 │    └── Media (Hình ảnh, Âm thanh gốc)
 │
 ├── MẠCH (Narrative Voice / Diễn giải)
 │    ├── Story (Bài viết ký ức, suy tưởng)
 │    └── Memory (Mảnh ký ức nhỏ)
 │
 ├── DI THƯ (Testament / Trực tiếp)
 │    └── Thư gửi Clara (Lá thư thật, có Người gửi / Người nhận / Bối cảnh)
 │
 └── GOVERNANCE (Control Plane / Ẩn)
      └── Quyền chỉnh sửa, Cấu trúc phân quyền Member/Public.
```

---

## 6. ONTOLOGY MAP
Mối quan hệ cốt lõi:
- **Person** có thể là *Author* của một Story.
- **Person** có thể là *Recipient* của một Testament.
- **Story** có thể trích dẫn **Asset** từ Archive.
- **Genealogy** cung cấp lưới tọa độ để neo giữ mọi thứ, nhưng không chứa cảm xúc. Cảm xúc nằm ở **MẠCH** và **Di Thư**.

---

## 7. TEMPORAL / INTERGENERATIONAL MAP
Mô hình dòng thời gian tiếp nối:

```text
PAST (Ông Quân): Để lại Cây gia phả giấy (Mối quan hệ lõi).
      ↓
PRESENT (Tuấn): Thu thập → Số hóa → Viết "Thư gửi Clara" → Xây Giatoc (Chuyển Data thành Di sản).
      ↓
FUTURE (Hậu duệ): Truy cập → Hiểu bối cảnh → [Possibility] Cập nhật gia phả → Viết tiếp MẠCH.
```

---

## 8. PRESERVATION vs INHERITANCE vs CONTINUATION MAP
[VERIFIED] Trạng thái hiện tại của Giatoc:
- **PRESERVATION:** [ĐẠT YÊU CẦU] Dữ liệu an toàn trên NAS + Cloudflare + Vercel.
- **INHERITANCE:** [THẤT BẠI] Lỗi thiết kế "Tòa soạn" làm mất tính thiêng liêng, người sau không có cảm giác nhận di sản.
- **CONTINUATION:** [CHƯA CÓ] Chưa có cơ chế cho thế hệ sau đóng góp. (Nên làm sau cùng).

---

## 9. DESCENDANT TEST (BÀI TEST NGƯỜI THỪA KẾ)
Đánh giá năng lực của kiến trúc hiện tại (Gap Map):

| Hậu duệ 50 năm sau có thể... | Current State | Target State | Phân tích Gap |
|---|---|---|---|
| Biết mình thuộc về đâu? | PARTIAL | CÓ | Cần UI cây phả hệ rõ ràng hơn. |
| Biết người đi trước là ai? | PARTIAL | CÓ | Cần link trực tiếp từ Bài viết sang Person profile. |
| Thấy được tư liệu gốc? | PARTIAL | CÓ | Archive chưa map tốt với Person. |
| Nghe tiếng nói thế hệ trước? | CÓ | CÓ | MẠCH đang làm việc này. |
| **Cảm nhận tính Di thư riêng tư?** | **FAIL** | CÓ | "Thư gửi Clara" đang bị xếp chung mâm với "Bài viết". Cần UI riêng. |
| Phân biệt Fact và Interpretation?| FAIL | CÓ | Archive vs MẠCH chưa có vách ngăn rõ ràng trên UI. |
| Tiếp nhận di sản? | FAIL | CÓ | Cảm giác UI đang là "Khách xem tạp chí", không phải "Chủ nhân tương lai". |

---

## 10. CURRENT STATE GAP MAP

| Layer | Current State | Target State | Gap | Priority |
|---|---|---|---|---|
| Intent | Tạp chí số | Không gian di sản | Đã chốt qua Memorandum | DONE |
| Ontology | Thư = Bài viết | Thư = Di thư (Testament) | Tách riêng cấu trúc dữ liệu | HIGH |
| Info Arch | Lưới tin tức (Feed) | Phân khu Di sản/Ký ức | Đổi cấu trúc Navigation | HIGH |
| Design | Magazine/Editorial | Intimate/Heritage | Silent UI, Pacing mới | HIGH |
| Frontend | React/HTML cũ | React/HTML mới | Re-build layout Di thư | HIGH |
| API / DB | Đang gián đoạn | Hoạt động trơn tru | Mapping lại API theo Ontology mới | MEDIUM |
| Infrastructure| Cloudflare/NAS | Tối ưu bảo mật | Review access control | LOW |

---

## 11. REVIEW & PHẢN BIỆN ROADMAP CŨ

**Roadmap cũ (Đề xuất của User/ChatGPT):**
Phase 0: Meaning Lock → Phase 1: System Recon → **Phase 2: Restore Production** → Phase 3: Product Arch → Phase 4: UI Redesign.

**PHẢN BIỆN (Trả lời 13 câu hỏi):**
1. *Sai thứ tự nghiêm trọng:* Phase 2 (Phục hồi API/DB) đang nằm TRƯỚC Phase 3 (Sửa Ontology) và Phase 4 (Sửa UI). Nếu phục hồi Backend bây giờ, ta đang viết API cho một mô hình Dữ liệu sai (Tạp chí).
2. *Làm sớm sẽ phải làm lại:* Nếu nối Node.js với MariaDB ngay hôm nay, khi đổi cấu trúc "Thư gửi Clara" thành Testament, ta sẽ phải đập đi viết lại toàn bộ SQL/API.
3. *Vừa phục hồi vừa kiến trúc?* Phải TÁCH HẲN. Kiến trúc đi trước, Công nghệ đi sau.
4. *DESIGN-001 giữ hay bỏ?* DESIGN-001 là prototype của Mental Model cũ. Nó chứa các tài nguyên tốt (Typography, CSS tổ chức tốt) nhưng phải được **Tiến hóa (Evolve)**, đập bỏ các grid "Tin tức".
5. *Governance:* Nằm ở Owner Control Plane (nơi Tuấn soạn bài). Hoàn toàn tàng hình với Public.
6. *Continuity:* Là một Architectural Principle, không phải 1 tính năng. Mọi view đều phải toát lên sự tiếp nối.

---

## 12. REVISED MASTER ROADMAP (LỘ TRÌNH MỚI)

### PHASE 0: MEANING LOCK (Đã hoàn thành)
- Output: `GIATOC_PROJECT_MEMORANDUM.md`, `GIATOC_MASTER_SYSTEM_MAP.md`.

### PHASE 1: ONTOLOGY & IA REDESIGN [Tiếp theo]
- **Objective:** Tái cấu trúc dữ liệu trên giấy (conceptual). Tách bạch Story vs Testament. Phác thảo lại Navigation (Không còn "Ấn phẩm số").
- **Dependencies:** Phase 0.

### PHASE 2: SEMANTIC UI & EXPERIENCE REDESIGN (Tiến hóa DESIGN-001)
- **Objective:** Áp dụng Mental Model mới vào Giao diện. Thiết kế "Silent UI" cho Di Thư. Thiết kế Homepage mang tính "Đón nhận Di sản".
- **Outputs:** Static HTML/CSS mới (Mock với JSON tĩnh). Chặt đứt mọi rườm rà của phong cách Tạp chí.

### PHASE 3: PRODUCTION RECONCILIATION & DATA MIGRATION
- **Objective:** Sửa database (MariaDB) và API (Node.js) để khớp với Ontology mới ở Phase 1.
- **Why now:** Vì giao diện và cấu trúc dữ liệu đã chốt, code backend không sợ phải làm lại.

### PHASE 4: FULL RESTORATION & DEPLOYMENT
- **Objective:** Nối Vercel Frontend → Node.js API → MariaDB → NAS. Mở lại Cloudflare Tunnels một cách bảo mật.

### PHASE 5: CONTINUITY / GOVERNANCE MECHANISMS
- **Objective:** Quy hoạch lại cách Tuấn publish nội dung (Obsidian to DB) và cách thế hệ sau có thể đóng góp trong tương lai.

---

## 13. HUMAN DECISIONS REQUIRED
1. Cấu trúc Database hiện tại ở MariaDB có được phép Alter (thêm bảng Testament) hay phải tìm cách dùng chung bảng Story nhưng thêm flag?
2. Có giữ lại các thành phần "Trợ lý ảo" ở giao diện Public không? (Trợ lý ảo đi ngược lại cảm giác Intimacy của một di sản gia đình).

---

## 14. IMMEDIATE NEXT STEP

**[HÀNH ĐỘNG DUY NHẤT CẦN LÀM TIẾP THEO]**

**Khởi động PHASE 1 & 2: SEMANTIC UI TRANSLATION (Thiết kế lại Giao diện Di Thư & IA).**
*Mô tả:* Lấy file `index.html` của DESIGN-001 hiện tại, gọt bỏ ngôn ngữ Tạp chí, thiết kế lại Navigation (IA mới), và tạo ra một HTML View hoàn toàn mới dành riêng cho `Thư gửi Clara` (Testament View) sử dụng mock JSON. 
*Tại sao?* Vì giao diện là thứ định hình rõ nhất Ontology trong mắt người dùng. Giải quyết xong Frontend Prototype mới, Backend tự động sẽ có bản vẽ kỹ thuật (Specs) chuẩn xác để làm Phase 3.
