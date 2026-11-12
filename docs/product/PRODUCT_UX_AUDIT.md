# BÁO CÁO ĐÁNH GIÁ TRẢI NGHIỆM NGƯỜI DÙNG GIA TỘC (PRODUCT UX AUDIT)
## KHẢO SÁT TOÀN DIỆN TỪ GÓC NHÌN NGƯỜI TRONG HỌ — PHIÊN BẢN V2.0.1 CANDIDATE

**Dự án:** Gia Tộc Trần Trọng Thu  
**Phiên bản khảo sát:** V2.0.1 Candidate (`release/v2.0.1`)  
**Chuyên viên thực hiện:** AGENT A (Product Researcher & UX Strategist — Batch 2A)  
**Thẩm quyền phê duyệt:** Tuấn (Human Final Authority / Product Owner)  
**Thẩm quyền giám sát kiến trúc & QC:** Emarald (Strategic Architecture & QC Authority)  
**Đơn vị điều phối kỹ thuật:** AGY (Master Orchestrator & Master Execution Authority)  
**Thời điểm công bố:** 2026-11-12  
**Phương pháp luận:** Khảo sát pháp y mã nguồn & dữ liệu thực tế (Empirical Data & Forensic Review), Thực nghiệm thao tác mô phỏng (Simulated Task Walkthroughs), Đối soát tiêu chuẩn tiếp cận WCAG 2.1 AA và Brand Governance v0.1.

---

## 1. TÔN CHỈ THIẾT KẾ & BỐI CẢNH DÒNG TỘC (PRODUCT PHILOSOPHY & CONTEXT)

### 1.1. Tôn chỉ: "Có một nơi để thuộc về"
Website Gia Tộc Trần Trọng Thu không phải là một phần mềm quản trị dữ liệu khô khan (SaaS), không phải một bản báo cáo phả hệ học thuật (academic research repository), và càng không phải là một cổng thông tin phô trương danh thế gia đình. 

Khởi nguồn từ động cơ cốt lõi của Người sáng lập (*Founder Story & Discovery Interview*, 2026-11-03):
> *"Tao muốn bọn nó có một nơi để thuộc về, không phải cảm giác mất mát giống tao... Mộ tổ, khi trật tự cũ bị đứt gãy, có lẽ mộ tổ sẽ sớm trở thành mộ hoang trong vài thế hệ tiếp theo... Tao chỉ thể hiện những thứ tao đã ghi chép, còn lại vẫn còn nhiều khoảng trống, nhưng tao đã tận lực rồi."*

Do đó, trải nghiệm website phải giải quyết được 3 nhu cầu tâm lý sâu sắc nhất của người trong họ:
1. **Sự kết nối cội nguồn (Belonging):** Mỗi người con cháu khi bước vào đều thấy rõ mình ở đâu trong dòng chảy 5 thế hệ, kết nối với ai, mang trong mình dòng máu nào.
2. **Sự thật lịch sử trang trọng (Historical Truth & Restraint):** Kể về tổ tiên trong hoàn cảnh lịch sử thực tế của họ; không tô hồng, không thần thánh hóa, nhưng tuyệt đối tôn kính và ấm áp.
3. **Sự trao truyền không rào cản (Intergenerational Transmission):** Các bậc trưởng bối 70-80 tuổi hay các cháu thanh thiếu niên thế hệ Z đều có thể đọc, xem và tương tác mà không bị rào cản công nghệ ngăn trở.

---

## 2. CHÂN DUNG 4 NHÓM NGƯỜI DÙNG GIA TỘC (GROUNDED CLAN PERSONAS)

Dựa trên dữ liệu thực tế từ hệ thống (223 thành viên, 68 mái ấm, 185 di ảnh, 28 tiền nhân quy tiên) và tài liệu định hướng hành trình dòng họ, 4 nhóm người dùng trọng tâm được xác lập:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   HỆ SINH THÁI NGƯỜI DÙNG GIA TỘC                       │
├──────────────────────────┬─────────────────────────────────────────────┤
│  NHÓM 1: THẾ HỆ TRẺ      │  NHÓM 2: CÁC BẬC TRƯỞNG BỐI, CAO NIÊN       │
│  (18 - 35 tuổi)          │  (60 - 80+ tuổi)                            │
│  - Tra cứu nhanh Mobile  │  - Chữ to, trang trọng, tương phản cao      │
│  - Tìm hiểu vị trí phả hệ│  - Tra cứu ngày giỗ âm lịch, nhánh họ       │
│  - Đọc chuyên san MẠCH   │  - Nhắc nhở con cháu hiếu kính              │
├──────────────────────────┼─────────────────────────────────────────────┤
│  NHÓM 3: NGƯỜI ĐÓNG GÓP  │  NHÓM 4: KHÁCH & CON CHÁU XA XỨ             │
│  (35 - 60 tuổi)          │  (Mọi lứa tuổi, chưa có tài khoản)          │
│  - Giữ ảnh cũ, kỷ vật    │  - Truy cập qua mạng xã hội, Zalo           │
│  - Gửi đính chính dữ kiện│  - Tìm hiểu cội nguồn dòng họ               │
│  - Kể lại chuyện xưa     │  - Cần hướng dẫn kết nối gia đình           │
└──────────────────────────┴─────────────────────────────────────────────┘
```

---

### NHÓM 1: Con cháu thế hệ trẻ (Digital-First Descendants)
- **Độ tuổi & Bối cảnh:** 18 – 35 tuổi. Sinh sống tại các đô thị lớn hoặc học tập/làm việc xa quê. Sử dụng 100% điện thoại thông minh (iPhone, Samsung) làm thiết bị chính.
- **Tâm lý & Động cơ:**
  - Tò mò về gốc gác: *"Mình là đời thứ mấy trong họ? Cụ cố của mình tên là gì? Bác Hạnh, chú Thư có quan hệ như thế nào với mình?"*
  - Tìm kiếm cảm giác bản sắc trong một xã hội hiện đại nhiều biến động.
  - Thích đọc các bài viết sâu sắc, chân thực trên chuyên san MẠCH về quá khứ của ông bà, cha mẹ.
- **Hành vi số:**
  - Quen thuộc với thao tác vuốt chạm, cuộn nhanh, kỳ vọng tốc độ phản hồi tức thì (< 1 giây).
  - Rất nhạy cảm với lỗi giao diện (vỡ khung, tràn màn hình ngang, nút bấm không phản hồi).
  - Thường truy cập trang web thông qua các liên kết được cha mẹ gửi qua Zalo, Messenger.
- **Rào cản lớn nhất:**
  - Ngại các thủ tục hành chính công nghệ phức tạp hoặc các cây phả đồ đồ sộ khó nhìn trên màn hình nhỏ 375px.

---

### NHÓM 2: Các bậc trưởng bối, cao niên (Clan Elders & Branch Keepers)
- **Độ tuổi & Bối cảnh:** 60 – 80+ tuổi. Thường là các bác trưởng chi, cô chú lớn tuổi đang sinh sống tại quê nhà (Thanh Hóa) hoặc ở cùng con cháu. Thiết bị sử dụng là máy tính bảng (iPad) hoặc điện thoại thông minh màn hình lớn (được con cháu mua tặng).
- **Tâm lý & Động cơ:**
  - Trọng sự tôn nghiêm, nề nếp gia phong: Rất coi trọng danh xưng, tên thánh, ngày mất, nơi an táng và sự chính xác của các mối quan hệ thân tộc.
  - Trách nhiệm gìn giữ việc họ: Nhu cầu thường trực là tra cứu **ngày kỵ giỗ âm lịch** của ông bà, cụ cố để sắp xếp ngày làm lễ giỗ, nhắc nhở con cháu tề tựu.
  - Xúc động khi nhìn lại di ảnh của các anh chị em, cha mẹ thuở xưa.
- **Khả năng tiếp cận & Trợ năng:**
  - Thị lực suy giảm: Không đọc được chữ nhỏ (< 14px), chữ mờ, hoặc độ tương phản kém (xám nhạt trên nền trắng).
  - Thao tác tay kém chính xác: Khó chạm vào các icon nhỏ hoặc các đường link quá sát nhau.
  - Tâm lý e ngại công nghệ: Khi gặp màn hình lỗi (mã 502, 1033) hoặc trang trắng, các cụ dễ lo sợ mình đã "làm hỏng trang web của gia đình".
- **Rào cản lớn nhất:**
  - Thuật ngữ lập trình tiếng Anh (Login, Error, Bad Gateway, IDOR, Session Expired).
  - Giao diện có quá nhiều nút bấm, thanh điều hướng rườm rà.

---

### NHÓM 3: Thành viên đóng góp tư liệu & ký ức (Memory Contributors)
- **Độ tuổi & Bối cảnh:** 35 – 60 tuổi. Những người đang nắm giữ tài sản ký ức của các gia đình: album ảnh đen trắng thời kháng chiến/bao cấp, giấy rửa tội, văn bia, sổ ghi chép ngày giỗ cũ.
- **Tâm lý & Động cơ:**
  - Muốn di sản của gia đình mình không bị thất lạc: *"Bức ảnh cưới của bố mẹ năm 1954 nếu không đưa lên đây thì sau này con cháu không còn biết đến."*
  - Muốn gia phả dòng họ chuẩn xác: Thấy ngày sinh, năm mất trên web lệch so với bia mộ hay lời các cụ dặn thì muốn đính chính ngay.
- **Kỳ vọng trải nghiệm:**
  - Biểu mẫu đóng góp phải mộc mạc, không bắt điền quá nhiều trường kỹ thuật.
  - Phải có sự phản hồi minh bạch: Đề xuất gửi đi có được ai xem không? Bao giờ thì được cập nhật vào phả hệ?
- **Rào cản lớn nhất:**
  - Gửi dữ liệu vào "hố đen" (không có xác nhận mã đề xuất, không có trang theo dõi trạng thái đề xuất).

---

### NHÓM 4: Khách và con cháu xa xứ chưa có tài khoản (Diaspora & Unprovisioned Relatives)
- **Độ tuổi & Bối cảnh:** Mọi lứa tuổi. Bà con họ hàng xa, con cháu định cư ở nước ngoài hoặc thế hệ mới lớn tình cờ tìm thấy website qua Facebook nhóm gia tộc hoặc tìm kiếm trên Google.
- **Tâm lý & Động cơ:**
  - Tìm kiếm câu trả lời: *"Đây có phải dòng họ của ông bà mình không? Cội nguồn ở đâu? Có nhánh nào vào Nam hoặc ra nước ngoài không?"*
  - Mong muốn được kết nối và cấp tài khoản để bước vào không gian nội bộ.
- **Kỳ vọng trải nghiệm:**
  - Trang chủ phải kể được câu chuyện cội nguồn ấm áp ngay từ cái nhìn đầu tiên.
  - Lối vào hướng dẫn tham gia phải rõ ràng, không bị đẩy vào ngõ cụt (`Dead-end`).
- **Rào cản lớn nhất:**
  - Bị chặn cửa bằng màn hình đăng nhập lạnh lùng mà không có lời giải thích hay hướng dẫn liên hệ thân tình.

---

## 3. ĐÁNH GIÁ CHI TIẾT TRANG CHỦ HIỆN TẠI TỪ NHU CẦU NGƯỜI TRONG HỌ

Trang chủ công khai (`src/js/ui/public-home.js` — phiên bản Candidate V2.0.1) được cấu trúc qua 5 phân đoạn:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TRANG CHỦ CÔNG KHAI (/)                         │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION 01: HERO — LỜI HIỆU TRIỆU                                      │
│ "NĂM THẾ HỆ TIẾP NỐI. MỘT CỘI NGUỒN CHUNG."                           │
│ Ảnh tư liệu sum họp thế hệ + Nút [Bước Vào Không Gian Gia Tộc →]       │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION 02: CỘI NGUỒN — NHỮNG NGƯỜI ĐẶT NỀN MÓNG                       │
│ Cụ Giuse Trần Trọng Thu (1872-1969) & Cụ bà Nguyễn Thị Xuân (1888-1929)│
│ Biểu trưng Danh kính Monogram Crest (Không dùng ảnh bia mộ)           │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION 03: DÒNG CHẢY GIA TỘC — NĂM THẾ HỆ NỐI DÒNG                   │
│ 4 Thống kê thực chứng (5 thế hệ, 223 thành viên, 68 mái ấm, 185 di ảnh)│
│ Dải di ảnh các bậc tiền nhân đã quy tiên                               │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION 04: KHÔNG GIAN GIA TỘC — NHỮNG CÁNH CỬA TRỞ VỀ                 │
│ 01. Cây Phả Đồ  |  02. Lịch Giỗ & Niên Biểu  |  03. Kho Tư Liệu Ảnh    │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION 05: FOOTER — LƯU TRUYỀN & KẾT NỐI                              │
│ Liên kết phân hệ, Nhóm Facebook Gia tộc, Bản quyền cội nguồn Thanh Hóa │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 3.1. Các điểm sáng vượt trội (Strengths)
1. **Âm hưởng và Văn phong cội nguồn (Editorial Dignity):**
   - Tiêu đề Hero: *"Năm Thế Hệ Tiếp Nối. Một Cội Nguồn Chung."* cùng lời dẫn: *"Lịch sử của gia tộc vẫn đang được viết tiếp — bởi chính chúng ta."* tạo cảm xúc rung động mạnh mẽ cho người đọc.
   - Thể hiện sự khiêm nhường, không hoa mỹ rỗng tuếch, đúng với tâm nguyện người sáng lập.
2. **Khắc phục triệt để lỗi tâm linh nhạy cảm (IMG-01):**
   - Việc loại bỏ hoàn toàn ảnh bia mộ làm avatar của Cụ Thu và Cụ Bà Út tại Section 02, thay bằng **Honorific Monogram Crest** (Huy hiệu danh kính chữ lồng 'T' và 'X') với viền vàng đồng trang trọng là một bước tiến văn hóa lớn. Tránh cảm giác rợn ngợp, u ám khi vừa bước vào trang web.
3. **Sử dụng 100% tư liệu thật (Zero AI / Zero Stock):**
   - Bức ảnh sum họp của con cháu hậu duệ Cụ Thư - Bà Sa tại Hero Section tạo sự chân thực và gắn kết sâu sắc.
4. **Bảo vệ an toàn thông tin cá nhân (PII Protection):**
   - Dải chân dung Section 03 chỉ tôn vinh các bậc tiền nhân đã qua đời (Cụ Thư, Bác Thìn, Bác Hữu, Chú Trường). Không đưa mặt người sống ra bề mặt công khai, bảo vệ đời tư tuyệt đối.

---

### 3.2. Những điểm khó khăn, gây nhầm lẫn & rào cản thao tác (Pain Points & Friction)

Dưới góc nhìn khắt khe của người thân trong dòng họ, trang chủ hiện tại vẫn còn tồn tại các rào cản thao tác sau:

#### Rào cản 1: "Cú sốc chuyển hướng" (Cold Redirect Shock) tại Section 04
- **Thực tế thao tác:** Người dùng lướt tới Section 04 thấy 3 thẻ rất đẹp:
  - `01. CỘI NGUỒN & QUAN HỆ`: Nút bấm `[Mở Cây Phả Đồ →]` (trỏ link `/me/tree`).
  - `02. TƯỞNG NIỆM & HIẾU KÍNH`: Nút bấm `[Xem Niên Biểu →]` (trỏ link `/me/events`).
  - `03. TRAO TRUYỀN & ĐÓNG GÓP`: Nút bấm `[Vào Kho Tư Liệu →]` (trỏ link `/me/gallery`).
- **Hiện tượng:** Đối với khách hoặc người thân chưa đăng nhập, khi bấm vào một trong ba thẻ này, trình duyệt lập tức bị backend Express `redirect 302` nhảy thẳng sang `/login`.
- **Hệ quả tâm lý:**
  - Người dùng cao niên bỡ ngỡ: *"Ủa sao tôi bấm xem cây phả đồ mà nó lại đòi mật khẩu? Tôi có làm sai gì không?"*
  - Trong khi đó, hệ thống đã có component `InvitationGateway` rất trang trọng dành cho các đường dẫn `#/gia-pha`, `#/lich`, `#/tu-lieu` để giải thích lý do bảo vệ sự riêng tư trước khi mời đăng nhập. Việc Section 04 gắn link trực tiếp `/me/*` làm mất đi lớp đệm văn hóa ân cần này.

#### Rào cản 2: Sự phụ thuộc của trang Hỗ trợ (`/help`) vào máy chủ gia đình (NAS Schedule Barrier)
- **Thực tế kiến trúc:** Trang `/help` hiện đang bị cấu hình rewrite trong `vercel.json` về backend Express trên NAS (`server/help_public.html`).
- **Hệ quả:**
  - Vào khung giờ đêm (`01:00 – 09:05`), khi NAS tắt để nghỉ máy, khách vãng lai hoặc bà con ở nước ngoài bấm vào `Trợ giúp & Kết nối` (/help) sẽ gặp lỗi kết nối hoặc banner giờ nghỉ.
  - Người muốn tìm số điện thoại của Tuấn hoặc Trưởng ban điều hành để xin cấp tài khoản lại không xem được thông tin liên hệ ngay vào lúc họ rảnh rỗi nhất (đêm muộn).
  - **Khuyến nghị:** Phải tách `/help` thành trang tĩnh thuần túy phục vụ từ Vercel CDN 24/7.

#### Rào cản 3: Rối loạn nhận thức điều hướng (Anchor Jump Confusion) trên thanh Menu
- **Hiện trạng:** Thanh menu công khai (`PUBLIC_NAV`) trên header chứa các mục:
  - `Cội nguồn` (`#coi-nguon`)
  - `Dòng chảy` (`#dong-chay`)
  - `Không gian gia tộc` (`#khong-gian`)
  - `Trợ giúp & Kết nối` (`/help`)
  - `Cổng thành viên →` (`/login`)
- **Phân tích thao tác:**
  - Đối với người trẻ, việc bấm menu cuộn xuống các vị trí trong cùng trang là bình thường.
  - Nhưng với các bác lớn tuổi, việc bấm vào `Cội nguồn` làm trang màn hình tự động giật cuộn xuống khiến các bác ngỡ ngàng, tưởng web bị lỗi nhảy trang. Khi muốn quay lại đầu trang lại không biết bấm vào đâu (do chưa có nút "Lên đầu trang" cố định).
  - Tên nhãn menu `#coi-nguon`, `#dong-chay` mang tính trừu tượng văn chương, chưa mô tả trực diện nội dung thông tin (ví dụ: "Tiền nhân", "Số liệu gia tộc").

#### Rào cản 4: Thiếu "Cửa sổ tra cứu danh xưng dòng họ" (Public Name Presence Check)
- **Nhu cầu thực tế:** Một người con cháu xa quê khi nghe nói đến trang web, câu hỏi đầu tiên họ muốn kiểm chứng là: *"Trong họ này có chi nhánh của bố mình là ông X, bà Y hay không?"*
- **Điểm nghẽn:** Hiện tại trang chủ chỉ hiển thị tên Cụ Thu, Cụ Bà Út và 4 vị tiền bối đã khuất. Toàn bộ 223 thành viên còn lại bị khóa hoàn toàn.
- **Ranh giới cần giải quyết:** Cần cân bằng giữa bảo vệ quyền riêng tư (Privacy) và sự nhận diện thân thuộc (Recognition). Một công cụ tra cứu chi nhánh hoặc xem danh mục các chi phái mà không lộ dữ liệu người sống sẽ giúp gia tăng tính gắn kết vượt bậc.

---

## 4. MA TRẬN ĐÁNH GIÁ 7 TIÊU CHÍ UX CHO NGƯỜI TRONG HỌ (UX HEURISTIC SCORECARD)

Đánh giá tổng thể hệ thống phiên bản V2.0.1 Candidate qua 7 tiêu chuẩn tương tác:

| Tiêu chuẩn UX | Điểm hiện tại (1-5) | Hiện trạng thực tế | Điểm cần hoàn thiện |
| :--- | :---: | :--- | :--- |
| **1. Discoverability** (Dễ thấy) | **4/5** | Các nút chính to rõ, màu huyết dụ tương phản tốt. Section 04 bố trí ngay trên luồng cuộn tự nhiên. | Cần làm rõ nhãn "(Dành cho thành viên)" trên các link nội bộ để người dùng không bị bất ngờ. |
| **2. Comprehension** (Dễ hiểu) | **4.2/5** | Ngôn từ trang trọng, mộc mạc, đậm chất gia đình truyền thống. Đã loại bỏ các thuật ngữ SaaS/Dev. | Bổ sung thêm giải thích ngắn gọn về cách phân chia thế hệ F0, F1, F2 cho các bạn trẻ. |
| **3. Efficiency** (Thuận tiện) | **3.8/5** | Thao tác 1 chạm trên mobile mượt mà. Hệ thống phả đồ 3 tầng chuyển đổi linh hoạt giữa phả hệ và danh bạ. | Cần có đường dẫn tắt (Shortcuts) từ hồ sơ nhân vật sang xem ngày giỗ hoặc album ảnh mà không phải quay lại trang chủ. |
| **4. Feedback** (Phản hồi) | **4.5/5** | Banner giờ nghỉ NAS nhã nhặn, giải thích rõ ràng lý do bảo vệ phần cứng. Biểu mẫu có thông báo thành công xanh lá. | Các trường nhập liệu cần báo lỗi trực tiếp (inline validation) thay vì chỉ báo sau khi bấm submit. |
| **5. Recovery** (Lối thoát lỗi) | **4.0/5** | Trang `/help/recovery` hướng dẫn 4 bước liên hệ người thân rất ấm áp, không ép dùng OTP phức tạp. | Cần biến `/help` thành trang tĩnh để luôn truy cập được khi máy chủ ngắt kết nối. |
| **6. Accessibility** (Trợ năng) | **4.6/5** | Kích thước touch target đạt chuẩn `>= 44px`. Màu chữ xám mờ đã được nâng lên `#5c5b5a` (>4.5:1 WCAG AA). Không bo tròn, không đổ bóng. | Bổ sung nút tăng kích cỡ chữ (Font resizer: A / A+) ở góc màn hình dành cho các bậc cao niên. |
| **7. Mobile Ergonomics** | **4.8/5** | Header mobile cuộn ngang 42px gọn gàng (`LAY-01`). 0 pixel tràn ngang trên toàn bộ 36 kịch bản kiểm thử. | Thanh cuộn ngang menu mobile cần có chỉ báo thị giác (mũi tên mờ hoặc bóng mờ) để người già biết là có thể vuốt sang ngang. |

---

## 5. KẾT LUẬN & ĐỀ XUẤT HÀNH ĐỘNG CHIẾN LƯỢC

### 5.1. Kết luận tổng quan
Phiên bản Gia Tộc Trần Trọng Thu V2.0.1 Candidate đã đạt được một bước tiến vượt bậc về **tính nhân bản và chiều sâu văn hóa**. Website đã thoát ly hoàn toàn khỏi tư duy của một "ứng dụng quản trị" để trở thành một **Ngôi Nhà Ký Ức Trang Trọng** của dòng họ. Việc kiểm soát lịch bảo vệ thiết bị NAS và thay thế ảnh bia mộ bằng biểu trưng danh kính là minh chứng cho sự tôn trọng sâu sắc đối với tiền nhân và người dùng.

### 5.2. Ba khuyến nghị ưu tiên cao cho các Batch tiếp theo:
1. **Chuyển hóa lối vào Section 04:** Thay vì để link cứng `/me/*` gây redirect đột ngột sang `/login`, hãy chuyển hướng người dùng chưa đăng nhập qua trang đệm giới thiệu ấm áp (`Invitation Card`) kèm nút bấm đăng nhập hoặc hướng dẫn xin cấp tài khoản.
2. **Tách tĩnh hóa trang Trợ giúp (`/help`):** Đưa toàn bộ nội dung hướng dẫn liên hệ và số điện thoại hỗ trợ của gia đình lên Vercel Edge CDN để bà con có thể tiếp cận 24/7 bất kể ngày đêm.
3. **Thêm công cụ Trợ năng Cao niên (Elder Friendly Toggle):** Tích hợp nút phóng to cỡ chữ nhanh và chuyển đổi âm dương lịch trực quan trên điện thoại để các bác cao niên dễ dàng theo dõi ngày giỗ.
