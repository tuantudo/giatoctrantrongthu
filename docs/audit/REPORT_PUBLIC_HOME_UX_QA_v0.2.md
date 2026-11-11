# PUBLIC HOME UX QA REPORT v0.2

## 1. Executive Summary
Báo cáo này đánh giá độc lập (QA) giao diện Public Home (`/`) do Cline triển khai dựa trên các tiêu chuẩn Semantics, UX/UI, và Reference Adaptation. 

Về mặt Semantics (Ngữ nghĩa): Giao diện đạt chuẩn xuất sắc khi bảo vệ tuyệt đối ranh giới giữa Public và Nội bộ (không rò rỉ MẠCH/Clara/Phả hệ). 
Tuy nhiên, về mặt UX/UI (Trải nghiệm thị giác): Trang web thất bại trong việc tạo ra một "Institutional Presence" (Cảm giác thiết chế/gia tộc) do sự xuất hiện của thanh ContextBar mang tính kỹ thuật, bố cục xếp chồng lặp lại, và các nét đứt (dashed borders) gây cảm giác ứng dụng chưa hoàn thiện.

**TỔNG KẾT: REWORK REQUIRED.** (Cần Cline tinh chỉnh lại một số cấu trúc thị giác).

---

## 2. Tested Build / Commit State
- Nguồn kiểm tra: Local Source Tree (bản triển khai vNEXT).
- Hình ảnh chứng minh (Evidence): `docs/audit/evidence/ui_vnext/public_1440.png` và `public_375.png`.
- Automated QA: `qa_result.json` (100% Pass các điều kiện máy).

---

## 3. Reference Review (VINHDANHBUTPHA)
**Kết quả: NO MEANINGFUL APPLICATION (Không áp dụng hoặc áp dụng bề mặt)**
- Cline không thể hiện sự nghiên cứu reference `VINHDANHBUTPHA` trong implementation report, cũng như không chuyển hóa được bất kỳ nguyên tắc Editorial/Institutional Design nào vào Public Home.
- Thay vì một bố cục trang web truyền thống/tạp chí với nhịp điệu (rhythm) và khoảng trắng (whitespace) có chủ đích, Cline sử dụng phương pháp "Component Stacking" (xếp chồng các khối UI của App lên nhau).

---

## 4. Semantic QA
- [x] Public = external family voice.
- [x] MẠCH / Clara không bị rò rỉ ra Public.
- [x] Không trở thành genealogy database hay dashboard.
- [x] `/login` vẫn là cửa vào Member Space đúng chuẩn.
**Kết luận:** PASS 100%.

---

## 5. IA QA (Information Architecture)
- Vùng Threshold, Family Voice, Identity, và Gate được xếp đúng thứ tự.
- **Lỗi Hierarchy:** Family Threshold bị lặp lại thông tin (Redundancy). Thẻ H1 "Gia Tộc Trần Trọng Thu" trên cùng, và ngay dưới nó lại xuất hiện Logo to "GIA TỘC TRẦN TRỌNG THU". Điều này làm loãng điểm nhìn (Focal point).

---

## 6. ContextBar Assessment
- **Sự cố:** ContextBar ("CẤP Ứng dụng | KHÔNG GIAN... | TRUY CẬP Công khai") hiện diện chễm chệ ngay đầu trang Public.
- **Đánh giá:** REMOVE (Trên trang Public). 
- **Lý do:** Đối với một "Digital Front Door" của gia tộc, việc hiển thị thanh chẩn đoán kỹ thuật (Technical diagnostic surface) phá nát hoàn toàn cảm giác "Institutional". Người ngoài nhìn vào sẽ tưởng đây là một môi trường test (Dev/Staging) hoặc một App khô khan chứ không phải Cổng thông tin Gia tộc. (Cline đã giữ lại vì sợ phá contract của hệ thống, nhưng về UX thì đây là lỗi nghiêm trọng ở trang Public).

---

## 7. Visual Quality Audit
- **Composition:** Bị tình trạng "Component stacking". Các khối (Section, Panel, Gate) xếp chồng đều đều nhau không có điểm nhấn hay nhịp điệu thiết kế.
- **Typography:** Khá đồng bộ (Serif), nhưng H1 và Logo đụng độ nhau.
- **Whitespace:** Tạm ổn trên Desktop, nhưng quá chật chội và phí phạm ở Mobile do ContextBar chiếm chỗ.
- **Institutional presence:** WEAK. Nếu bỏ các text đi, UI hiện tại trông giống một trang Dashboard trống (Empty state của SaaS) hơn là một Cổng Lưu trữ.

---

## 8. Family Voice State QA
- **Tình trạng:** Zone rỗng, hiển thị box `data-state="not-available"`.
- **Đánh giá:** WEAK.
- **Lý do:** Cline dùng Border nét đứt (Dashed border) cho vùng này. Trong thiết kế UI, nét đứt biểu thị cho "Drop zone" (kéo thả file vào đây) hoặc "Missing component / Placeholder". Nó gây cảm giác App chưa làm xong (unfinished app). Nó không mang lại cảm giác "Deliberate absence / Editorial restraint" (Sự tĩnh lặng có chủ đích).

---

## 9. Family Identity & Gate QA
- **Identity:** Không bịa đặt dữ kiện lịch sử (PASS).
- **Gate:** Cổng đăng nhập "Bạn là người trong gia tộc?" rất rõ ràng. Nhưng nút bấm bọc viền đỏ hơi mang cảm giác Alert/Warning Box của hệ thống. (Chấp nhận được nhưng thiếu tinh tế).

---

## 10. Responsive QA
- **375px (Mobile):** FAILED. Thanh ContextBar đẩy toàn bộ H1 và Logo (Family Threshold) xuống dưới, chiếm diện tích màn hình đầu tiên (First-screen). H1 bị bẻ dòng chưa mượt. Mobile đang là bản Desktop thu nhỏ nhồi nhét.

---

## 11. Technical Leakage QA
- **Phát hiện:** HIGH. ContextBar rò rỉ toàn bộ Technical Labels (Cấp, Không gian, Diễn ngôn) ra màn hình công khai cho người ngoài xem.

---

## 12. Automated QA
- Structural QA: Pass 100% (Machine-verified).
- Visual QA: Không đạt (Human-verified). 

---

## 13. Findings Table

| ID | Severity | Category | Problem / Evidence | Recommended Action |
|---|---|---|---|---|
| UX-01 | HIGH | TECHNICAL | ContextBar lộ ra ở trang Public làm phá vỡ Institutional aesthetic. (Thấy rõ ở Mobile chiếm nửa màn hình). | Ẩn hoàn toàn ContextBar trên layout trang Public Home. |
| UX-02 | HIGH | VISUAL | Dashed border ở phần Family Voice trông giống Placeholder/Empty CRUD table. | Thay nét đứt bằng nét liền mảnh, hoặc bỏ border dùng background màu nhẹ/typography để nhấn mạnh sự tĩnh lặng. |
| UX-03 | MEDIUM | TYPOGRAPHY | Lặp lặp H1 và Logo to ngay cạnh nhau ở vùng Threshold. | Gộp lại thành một điểm nhìn duy nhất (Hoặc H1 hoặc Logo typography có size đủ lớn). |
| UX-04 | HIGH | REFERENCE | Không áp dụng các pattern khoảng trắng, editorial rhythm từ các site lưu trữ văn hóa (như VINHDANHBUTPHA). Giao diện bị "App-ify". | Thêm margin/padding lớn giữa các section, loại bỏ các đường viền khối hộp không cần thiết. |

---

## 14. Scorecard (Summary)
- Semantic integrity: **5/5** (Bảo vệ rất tốt)
- UX hierarchy: **3/5**
- Visual hierarchy: **2/5**
- Typography: **3/5**
- Composition: **2/5** (Stacking)
- Whitespace: **2/5**
- Editorial quality: **4/5** (Văn phong tốt)
- Institutional presence: **1/5** (Giống SaaS dashboard bị rỗng)
- Family Voice treatment: **2/5** (Dashed border)
- Gate clarity: **4/5**
- Responsive quality: **2/5** (ContextBar phá mobile)
- Reference adaptation: **0/5**
- Technical cleanliness: **2/5** (Lộ ContextBar)

## 15. Final Verdict
**REWORK REQUIRED** 
(Semantics hoàn hảo nhưng Visual UI cần đợt tinh chỉnh thứ hai để gỡ bỏ cảm giác "App").

---

## IMPLEMENTATION FIX BRIEF FOR CLINE

> **GỬI CLINE (EXECUTION AGENT):**
> Giao diện Public Home hiện tại đã rất chuẩn về mặt Dữ liệu/Ngữ nghĩa, nhưng về mặt Thị giác (Visual) nó đang trông giống một trang "Dashboard bị bỏ trống" hơn là một Cổng thông tin Gia tộc.
> Hãy thực hiện chính xác các hành động sau để sửa lỗi (Fixes):

**FINDING UX-01: GỠ BỎ CONTEXTBAR (Severity: HIGH)**
- **Problem:** Thanh ContextBar phơi bày các thuật ngữ kỹ thuật kiến trúc ra Public, phá hỏng giao diện Mobile.
- **Required Action:** Ẩn (Hide) hoặc không render `ContextBar` trên `public-home.js` hoặc trên layout của trang `/` đối với khách vãng lai. 
- **Acceptance Criteria:** Không còn dải metadata kỹ thuật trên đầu trang.

**FINDING UX-02: BỎ NÉT ĐỨT Ở FAMILY VOICE (Severity: HIGH)**
- **Problem:** Border dạng nét đứt (Dashed) làm vùng Tiếng nói gia tộc trông giống một vùng "Kéo thả file" hoặc một tính năng "Đang xây dựng dở".
- **Required Action:** Xóa style dashed border. Có thể thay bằng viền liền thật mỏng (1px solid màu nhạt), hoặc chỉ dùng Text padding rộng rãi ở giữa (để text tự đứng độc lập bằng Typography) thể hiện một sự "Im lặng có chủ đích".
- **Acceptance Criteria:** Không còn nét đứt trên toàn trang Public.

**FINDING UX-03: CHỐNG LẶP H1 VÀ LOGO (Severity: MEDIUM)**
- **Problem:** Chữ "Gia Tộc Trần Trọng Thu" xuất hiện 3 lần (Ở Header bar, ở H1, và ở Logo giữa trang).
- **Required Action:** Hợp nhất phần Threshold. Nếu đã dùng Logo làm trung tâm, hãy ẩn H1 (bằng sr-only) hoặc thiết kế lại cấu trúc Header Bar gọn gàng hơn. Đảm bảo điểm chạm đầu tiên (Focal point) tập trung vào 1 cái tên Gia tộc duy nhất.

**FINDING UX-04: DE-APP-IFICATION (Severity: MEDIUM)**
- **Problem:** Các phần tử đang nằm trong hộp (Card/Box) gây cảm giác App.
- **Required Action:** Áp dụng mô hình Editorial (Tạp chí/Lưu trữ). Tăng margin-bottom giữa các Section (Family Voice, Về Gia tộc, Gate) lên ít nhất gấp đôi để tạo "Breathing room" (Khoảng trắng). Bỏ các border không cần thiết.

Vui lòng áp dụng các thay đổi này vào `public-home.js` và CSS tương ứng!


# V0 → V1 PRODUCT TRANSITION AUDIT
*(Static Public Website → Dynamic Family Web / Digital Family Institution)*

## 1. Runtime Identification
- **V0 Runtime:** `http://localhost:8080/#/` (Tương đương `giatoctrantrongthu.com`). 
  - **Path/Source:** Chạy qua `python -m http.server 8080`.
  - **Evidence:** Phục vụ hoàn toàn file tĩnh (HTML/CSS/JS thuần, Hash routing SPA ở `app-v2.js`, data load từ `generator/` JSON). Không có kết nối DB.
- **V1 Runtime:** `http://localhost:3000/#/` (Candidate Dynamic System).
  - **Path/Source:** Chạy qua `server/index.js` (Express Node.js).
  - **Evidence:** Cung cấp các endpoint `/api/auth`, `/api/admin/database/schema`, kết nối thẳng vào `family_archive.db` (SQLite/MariaDB) và quản lý Session/Cookie.

## 2. V0 Baseline (Static Public Website)
V0 (đang live) là một nguyên mẫu (Prototype) thiết kế theo hướng Tạp chí số / Ấn phẩm lưu trữ. Nó phơi bày toàn bộ kiến trúc thông tin (Gia phả, Lịch, Ký ức, Tư liệu, MẠCH, Thư Clara) ra màn hình công khai cho bất kỳ ai truy cập. V0 có bản sắc văn hóa mạnh, điều hướng phong phú và đặc biệt có trang "Tư cách thành viên" diễn giải xuất sắc lý do người trong gia tộc nên tham gia.

## 3. V1 Candidate (Dynamic Family Institution)
V1 là một bước đại nhảy vọt về Kiến trúc (Architecture) khi đưa Hệ thống Xác thực (Auth), Database, Identity Mapping và Phân quyền (Authority) vào vận hành. V1 định nghĩa lại Public Home không phải là Nơi Trưng Bày, mà là một "Cánh Cổng" (The Gate). Public Home của V1 trống trải, tĩnh lặng, và đẩy mọi dữ liệu quan trọng vào Không gian Thành viên (Member Space) được bảo mật.

## 4. Static → Dynamic Transition Model
Sự chuyển đổi không phải là "Mang website V0 ráp vào Database". Mà là sự chuyển đổi Mô hình Sản phẩm:
**Từ:** Một "Bảo tàng mở cửa tự do" (Mọi thứ Public)
**Sang:** Một "Gia Trang Khép Kín" (Có Cổng chào Public tĩnh lặng, Không gian nội bộ năng động được bảo vệ).

## 5. V0 → V1 Comparison Matrix

| Dimension | V0 (Static) | V1 (Dynamic) | Delta Classification | Evidence |
|---|---|---|---|---|
| **Family identity** | Tạp chí số mở | Thiết chế lưu trữ đóng | TRANSFORMED | H1, Logo, Copy giới hạn. |
| **Public narrative** | Kể chuyện qua MẠCH/Ký ức | Tĩnh lặng, chờ tiếng nói | SUPERSEDED | Rút hết bài MẠCH khỏi trang nhất. |
| **Content allocation** | Mọi thứ ở Public | Public rỗng, giấu sau Auth | INTENTIONALLY REMOVED | Đã cắt JSON data leak ở Public. |
| **Navigation** | Đa dạng (Gia phả, MẠCH...) | Đơn giản (Về gia tộc, Gate) | TRANSFORMED | Lược bỏ các route không thuộc Public. |
| **Member recognition** | Trang "Tư cách thành viên" | Box "Bạn là người trong gia tộc"| TRANSFORMED | Box đăng nhập ngắn gọn. |
| **Member Pitch** | 4 gạch đầu dòng lợi ích tham gia | Bị xoá bỏ hoàn toàn | ACCIDENTALLY LOST | Nút CTA cứng nhắc, mất đi Copy thuyết phục. |
| **Family Voice** | Trộn lẫn với MẠCH | Tách biệt hoàn toàn (đang rỗng)| TRANSFORMED | Kiến trúc Semantic tách bạch rõ. |
| **Genealogy exposure** | Phơi bày công khai | Cấm tuyệt đối ở Public | SEMANTIC IMPROVEMENT | Không còn route `#/gia-pha` ngoài Gate. |
| **MẠCH exposure** | Phơi bày công khai | Bảo vệ nội bộ | SEMANTIC IMPROVEMENT | MẠCH không còn bị leak ra ngoài. |
| **Clara exposure** | Phơi bày công khai | Bảo vệ nội bộ (Private) | SEMANTIC IMPROVEMENT | Tôn trọng sự riêng tư. |
| **Authentication** | Prototype (Giả lập) | Có thật (Cookie/Session) | MIGRATED (To Reality) | Express + SQLite Accounts table. |
| **Identity** | Không có | Tách bạch Person vs Account | TRANSFORMED | Backend Database Architecture. |
| **Family Space** | N/A | Được quy hoạch sau Login | NOT YET REALIZED | Backend có khái niệm nhưng UI chưa có. |
| **Dynamic content** | Static JSON generated | Lấy từ DB qua API | MIGRATED | Các route API /auth. |
| **Privacy** | 0 (Public hớ hênh) | Tối đa (Cửa đóng kín) | SEMANTIC IMPROVEMENT | Ranh giới Auth rất cứng. |
| **Visual hierarchy** | Tốt, nhịp điệu Editorial | Cứng nhắc (Component stacking) | PRODUCT REGRESSION | Bị App-ify, mất khoảng trắng. |
| **Editorial rhythm** | Có sự dẫn dắt (Scrolly) | Cụt lủn | PRODUCT REGRESSION | Các box đè lên nhau. |
| **Responsive** | Ổn định | Vỡ do ContextBar | PRODUCT REGRESSION | ContextBar phá vỡ mobile first-screen. |
| **Extensibility** | Thấp (Phụ thuộc script gen) | Cực cao (Database-driven) | TRANSFORMED | Node API foundation. |

## 6. Preserved Strengths
- Việc phân định Identity rõ ràng được bảo toàn ở tầng kiến trúc.
- Font chữ Serif (cảm giác Heritage) vẫn được giữ lại làm ngôn ngữ thị giác cốt lõi.

## 7. Transformations
- **Public Website → The Gate:** V1 đã gánh vác xuất sắc vai trò Cổng Chào, rũ bỏ hoàn toàn tàn dư của một Website Tạp chí.

## 8. Intentional Removals
- **Gia phả, MẠCH, Clara khỏi Public:** Đây không phải là sự thụt lùi (regression), đây là một **SEMANTIC IMPROVEMENT** cực kỳ quan trọng để bảo vệ quyền riêng tư dòng họ.

## 9. Lost / Missing Capabilities
- **Member Pitch (UX):** Trang "Tư cách thành viên" của V0 giải thích rất nhân văn tại sao mọi người nên đóng góp vào gia phả. V1 đã làm mất hoàn toàn phần Copy này (ACCIDENTALLY LOST), biến nó thành một form Đăng nhập lạnh lùng.
- **Editorial Rhythm (Visual):** Nhịp điệu không gian tinh tế của V0 bị mất, thay bằng Component Stacking kiểu SaaS.

## 10. Content Allocation Delta
- Public: V0 có mọi thứ -> V1 trống (Chính xác).
- MẠCH / Clara: V0 Public -> V1 Nội bộ (Chính xác).
- Thành viên: V0 Prototype -> V1 Auth thật (Chính xác).

## 11. Member Pitch Assessment
**PRODUCT REGRESSION**. 
Việc chuyển đổi sang Dynamic Auth đã làm rơi rớt đi "Lý do tham gia" (Proposition) của người dùng. V1 hiện tại chỉ còn nút "Đăng nhập", thiếu vắng hoàn toàn lời mời gọi ấm áp của V0. Lời mời gọi này cần được khôi phục hoặc thiết kế thành một luồng Onboarding động trong tương lai.

## 12. Dynamic Capability Assessment
- **Authenticated Identity:** REALIZED. (Đã có bảng `accounts` và API `/login`).
- **Account ↔ Person:** BACKEND ONLY. (Bảng `identity_mappings` có, nhưng UI chưa hiển thị Profile mapping).
- **Member-specific experience:** PARTIALLY REALIZED. (Đã chặn cửa, nhưng bên trong chưa có Dashboard cá nhân hóa).
- **Protected Genealogy:** REALIZED. (Dữ liệu đã an toàn).
- **Submissions / Canonicalization:** NOT IMPLEMENTED. (Chưa có flow đề xuất sửa gia phả).
=> **Kết luận:** V1 đang là một Dynamic Web ở dạng *Nền móng (Foundation)*. Technical Capability đã xong, nhưng Product Capability (Trải nghiệm thực sự) mới chỉ dừng ở bước "Khóa cửa".

## 13. UX/UI Delta
V1 bị thụt lùi (Regression) so với V0 về mặt thị giác do cố gắng áp dụng UI System một cách cứng nhắc (Leakage ContextBar ra Public, Dashed border), làm mất đi cảm giác của một Thiết chế Văn hóa (Institutional Quality).

## 14. Semantic Delta
V1 vượt trội hoàn toàn V0. Nó thực thi chính xác Ranh giới Diễn ngôn (Discourse Boundary).

## 15. Privacy / Authority Delta
V1 vượt trội hoàn toàn V0. Auth-wall hoạt động tốt.

## 16. Architectural Capability vs Product Capability
V1 có một khoảng cách lớn (Gap) giữa hai tầng này. Cơ sở dữ liệu và API đã sẵn sàng (Architecture), nhưng ở bề mặt (Product), User chỉ thấy một trang web tĩnh lặng và đôi khi khó hiểu (do lỗi UI).

## 17. Replacement Readiness
(Thử nghiệm thay thế V0 bằng V1 ngay ngày mai).
- **Ưu điểm:** Gia tộc lập tức được bảo vệ dữ liệu.
- **Rủi ro:** Khách truy cập sẽ bị hụt hẫng vì giao diện rỗng, bị nhiễu vì thanh ContextBar (technical leakage), và người trong họ không hiểu tại sao phải đăng nhập (mất Member Pitch).
- **Kết luận:** Chưa sẵn sàng thay thế nếu không có bản vá UX.

## 18. Transition Verdict
**TRANSITION PARTIAL**
(Quá trình chuyển đổi Static → Dynamic đã hoàn thành xuất sắc ở tầng Kiến trúc (Architecture) và Bảo mật (Privacy). Tuy nhiên, tầng Sản phẩm (Product Realization) mới chỉ đi được nửa đường do UX bị App-ify và rơi rớt Copy quan trọng).

## 19. Replacement Verdict
**NOT READY**
(V1 cần Cline thực hiện xong FIX BRIEF (gỡ ContextBar, khôi phục khoảng trắng, sửa dashed border) và lý tưởng nhất là khôi phục lại phần Member Pitch trước khi đưa lên thay thế V0).

## 20. Evidence
- Source code V1 (`server/index.js`, `public-home.js`).
- Hình ảnh chụp V0 (`giatoctrantrongthu.com`) và V1 (`public_1440.png`, `public_375.png`).
- Báo cáo Forensic DB (`DATABASE_FORENSICS_v0.4.md`).

## 21. Remaining Unknowns
- Liệu phần "Member Pitch" bị xóa là do Cline quên (Accidental Loss) hay do Human chưa cung cấp API để render nó động? (Cần Human xác nhận).
- Hình thức thực sự của Family Space sau khi Login sẽ là gì (Vẫn là Open Question).
