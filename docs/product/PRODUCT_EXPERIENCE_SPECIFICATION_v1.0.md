# BỘ ĐẶC TẢ TRẢI NGHIỆM SẢN PHẨM — PRODUCT EXPERIENCE SPECIFICATION (v1.0 CANONICAL)
**Nền tảng:** `giatoctrantrongthu.com`  
**Dự án:** CÂY GIA PHẢ — GIA TỘC TRẦN TRỌNG THU  
**Thẩm quyền tối cao & Product Owner:** Tuấn (Human Final Authority)  
**Thẩm định chiến lược & Kiến trúc sản phẩm:** Emarald (Analysis Authority)  
**Điều phối & Kỹ thuật:** AGY (Execution Coordinator / Primary Agent)  
**Ngày ban hành:** 2026-11-03  
**Trạng thái tài liệu:** `CANONICAL PRODUCT SPECIFICATION — READY FOR PRODUCT OWNER ACCEPTANCE`  

---

## MỤC LỤC TỔNG QUAN

1. [PHẦN I — PRODUCT CHARTER (HIẾN CHƯƠNG SẢN PHẨM)](#phần-i--product-charter-hiến-chương-sản-phẩm)
2. [PHẦN II — PRODUCT EXPERIENCE SPECIFICATION (ĐẶC TẢ TRẢI NGHIỆM CHI TIẾT)](#phần-ii--product-experience-specification-đặc-tả-trải-nghiệm-chi-tiết)
3. [PHẦN III — DECISION & EVIDENCE REGISTER (DANH MỤC QUYẾT ĐỊNH & ĐỐI CHIẾU 30 TOUCHPOINTS TP-001 ĐẾN TP-030)](#phần-iii--decision--evidence-register-danh-mục-quyết-định--đối-chiếu-30-touchpoints-tp-001-đến-tp-030)
4. [PHẦN IV — DOMAIN, GOVERNANCE & PERMISSION MODEL (MÔ HÌNH QUẢN TRỊ & PHÂN QUYỀN ĐA CHIỀU)](#phần-iv--domain-governance--permission-model-mô-hình-quản-trị--phân-quyền-đa-chiều)
5. [PHẦN V — IMPLEMENTATION TRACEABILITY & BATCHING STRATEGY (MA TRẬN TRUY VẾT TOÀN DIỆN & KẾ HOẠCH BATCH)](#phần-v--implementation-traceability--batching-strategy-ma-trận-truy-vết-toàn-diện--kế-hoạch-batch)

---

# PHẦN I — PRODUCT CHARTER (HIẾN CHƯƠNG SẢN PHẨM)

## 1.1. Danh Tính Sản Phẩm
- **Tên dự án:** Cây Gia Phả
- **Tên sản phẩm chính thức:** Gia Tộc Trần Trọng Thu
- **Tên miền cốt lõi:** `giatoctrantrongthu.com`
- **Bản chất sản phẩm:** Nền tảng số phục vụ đời sống, ký ức, tri thức, gắn kết thân tộc và bảo tồn di sản của Gia tộc Trần Trọng Thu qua các thế hệ.
- **Đối tượng ưu tiên hàng đầu:** Thành viên trong dòng tộc (quan hệ huyết thống) và người thân thuộc các gia đình liên quan (vợ/chồng, con dâu, con rể, con cháu thân thuộc).
- **Mô hình tiếp cận ban đầu:** Triển khai nội bộ có kiểm soát, tương tự một *Private Community Platform*. Không phải mạng xã hội công khai, không quảng bá đại trà.
- **Định vị đối ngoại:** Người ngoài chỉ tiếp cận một cánh cửa thông tin tối giản; việc mở rộng cho công chúng xã hội là giai đoạn tương lai.

## 1.2. Mục Đích & Sứ Mệnh Cốt Lõi
Nền tảng được xây dựng để giúp các thế hệ:
1. **Nhận biết bản thân và cội nguồn:** Mỗi thành viên biết rõ mình là ai, sinh ra từ đâu, thuộc nhánh phả hệ nào.
2. **Hiểu các mối quan hệ gia đình:** Nhận diện vị trí của mình trong cấu trúc gia tộc và sự kết nối với các gia đình liên quan.
3. **Gìn giữ và bổ sung ký ức, tư liệu:** Thu thập, số hóa và lưu trữ những câu chuyện, di ảnh, kỷ vật, chứng tích lịch sử.
4. **Kết nối tri thức và đời sống:** Cung cấp không gian trao đổi, học hỏi, phản biện văn hóa gia đình và kinh nghiệm sống.
5. **Ghi nhận sự hiện diện và cống hiến:** Tôn vinh và ghi nhớ những người đã sống, đang sống và những đóng góp cho gia đình, dòng họ và xã hội.
6. **Tiếp nối di sản liên thế hệ:** Tạo nền móng tư liệu và công nghệ để thế hệ sau tiếp tục nghiên cứu, chỉnh lý, bảo tồn hoặc phát triển theo sự lựa chọn và nhận thức riêng của thời đại họ.

> **Định vị làm việc (Working Positioning):**  
> *"giatoctrantrongthu.com là nơi các thế hệ nhận biết cội nguồn, gìn giữ ký ức, kết nối tri thức và tiếp nối di sản của Gia tộc Trần Trọng Thu."*

## 1.3. Hệ Giá Trị Trải Nghiệm (Core Experience Values)
- **Cội nguồn (Origins):** Vững chãi, tôn nghiêm, minh bạch.
- **Ký ức (Memory):** Sâu sắc, chân thực, giàu tính nhân bản.
- **Quan hệ (Kinship):** Thân tình, ấm áp, rõ ràng tôn ty nhưng bình đẳng trong đối thoại.
- **Tri thức (Intellect):** Nghiêm túc, cởi mở, khuyến khích phản biện có trách nhiệm ("Lập ngôn" gắn với "Lập thân").
- **Tính tiếp nối (Continuity):** Tôn trọng quyền tự quyết của thế hệ tương lai; không áp đặt thế hệ sau phải sao chép máy móc mô hình của thế hệ trước.
- **Sức bền (Durability):** Học hỏi triết lý bền bỉ hàng trăm năm của FamilySearch; giá trị nằm ở khả năng trường tồn qua nhiều thế hệ chứ không chạy theo số lượng tính năng bề nổi.

## 1.4. Các Nguyên Tắc Phân Định Tuyệt Đối Không Đánh Đồng
1. **Gia phả ≠ Toàn bộ đời sống gia tộc:** Gia phả là cấu trúc quan hệ huyết thống và niên biểu; đời sống gia tộc bao gồm cả tình cảm, ký ức, văn hóa và sinh hoạt hiện tại.
2. **Tư liệu ≠ Dữ kiện lịch sử chính thức:** Một bức ảnh hay kỷ vật là đối tượng lưu trữ; một câu chuyện truyền khẩu là ký ức; không thể xem mọi lời kể là dữ kiện lịch sử đã xác minh.
3. **MẠCH ≠ Kho tư liệu chung:** MẠCH là không gian tri thức, suy tư và đối thoại; kho tư liệu là nơi lưu giữ hiện vật số độc lập.
4. **Family Space ≠ MẠCH:** Family Space là không gian sinh hoạt riêng của từng gia đình hạt nhân/nhánh; MẠCH là không gian tri thức chung của toàn cộng đồng dòng họ.
5. **Không gian cá nhân ≠ Tài sản nội dung cộng đồng:** Những gì thành viên ghi chép riêng tư mặc định thuộc về cá nhân; hệ thống không tự động đưa lên làm nội dung chung.
6. **Thư gửi Clara ≠ Module mở mặc nhiên:** Đây là không gian độc lập của gia đình Hạnh–Đào; tư cách thành viên gia tộc không tự động đem lại quyền truy cập vào Thư gửi Clara.
7. **Huyết thống ≠ Thẩm quyền quản trị/biên tập:** Quyền quản trị kỹ thuật hay biên tập nội dung phát sinh từ năng lực và sự ủy thác cụ thể; không mặc nhiên gán theo thứ bậc chi trưởng hay thế hệ.

---

# PHẦN II — PRODUCT EXPERIENCE SPECIFICATION (ĐẶC TẢ TRẢI NGHIỆM CHI TIẾT)

## 2.1. Cánh Cửa Công Khai (Public Gateway)
- **Bản chất:** Giao diện tối giản, trang trọng, trang nhã.
- **Nội dung hiển thị:**
  - Định vị nhận diện: Logo ngang chính thức, tên Gia tộc Trần Trọng Thu.
  - Lời giới thiệu ngắn gọn, trung tính về cội nguồn và ý nghĩa việc lưu giữ di sản gia đình.
  - Loại bỏ hoàn toàn các khẩu hiệu mang tính phô trương hoặc cách dùng từ hạ thấp (ví dụ: cấm tuyệt đối cụm từ "một dòng dõi bình dân").
  - Nút dẫn vào cổng thành viên: `[Dành Cho Thành Viên →]`.
- **Ranh giới an ninh:** Không công khai phả hệ, không lộ danh sách thành viên, không có ô tìm kiếm dữ liệu nội bộ ra ngoài Internet.

## 2.2. Quy Trình Nhận Diện & Kích Hoạt Thành Viên (Member Onboarding)
- **Nguyên tắc định hướng (DECIDED):** Kết hợp giữa xác nhận trực tiếp từ Quản trị viên (Admin) và liên kết tài khoản định danh (Google Sign-In hoặc Email/Mật khẩu cá nhân).
- **Quy trình tham chiếu (PROPOSED — Chi tiết kỹ thuật):**
  1. *Khởi tạo hồ sơ:* Admin hoặc Trưởng nhánh tạo bản ghi thành viên trên cây gia phả.
  2. *Cấp mã kích hoạt:* Hệ thống tạo mã liên kết dùng một lần (Single-use Activation Token) có thời hạn 72 giờ.
  3. *Xác thực danh tính số:* Người thân nhận link qua Zalo/Facebook, bấm vào, đăng nhập tài khoản Google để xác thực địa chỉ email.
  4. *Liên kết hồ sơ:* Nhập mã kích hoạt; hệ thống map tài khoản Google với `person_id` trên cây gia phả.
  5. *Kích hoạt tài khoản:* Người thân hoàn thiện tên hiển thị và mật khẩu dự phòng.
- **Ranh giới bảo mật bắt buộc:**
  - Không sử dụng ngày sinh, số CMND/CCCD hoặc tên cha mẹ làm mật khẩu mặc định.
  - Google Sign-In chỉ xác minh danh tính số của Google; không tự động cấp tư cách thành viên nếu chưa được Admin duyệt.
  - Phải có phương thức xác thực thay thế cho người cao niên không có tài khoản Google.

## 2.3. Bảy Không Gian Trải Nghiệm Sau Đăng Nhập

```text
                               KHÔNG GIAN THÀNH VIÊN
                                         │
    ┌──────────────┬──────────────┬──────┴───────┬──────────────┬──────────────┐
    ▼              ▼              ▼              ▼              ▼              ▼
[01. HOME]    [02. PHẢ HỆ]  [03. TƯ LIỆU]   [04. MẠCH]     [05. LỊCH]    [06. GIA ĐÌNH]
 Lời chào về   Cá nhân làm    Kho số hóa     Tri thức &     Tưởng nhớ &   Family Spaces
 nhà & nhắc việc tâm điểm     đa đối tượng   đối thoại sâu  nhắc nhở      & Cá nhân
                                                                           │
                                                                           ▼
                                                                     [07. CLARA]
                                                                     (Độc lập cô lập)
```

### Không Gian 01: Chào Mừng & Đời Sống (Home / Welcome)
- **Bản chất:** Không gian sinh hoạt trung tâm, gợi cảm giác bước chân vào ngôi nhà chung. Không phải trang dashboard tài khoản hay bảng điều khiển admin khô cứng.
- **Cơ chế lời chào theo ngữ cảnh (Contextual Greetings):**
  - Thông điệp thay đổi theo thời gian trong ngày (sáng, chiều, tối), theo ngày lễ giỗ, theo nhánh gia đình hoặc tần suất trở lại.
  - Sắc thái trung tính kết hợp lời dẫn mang tinh thần tiền nhân nhưng **tuyệt đối không giả danh một tiền nhân cụ thể** (tránh mê tín, tránh mạo nhận).
  - Trích dẫn lời tiền nhân bắt buộc phải ghi rõ nguồn gốc văn bản hoặc chứng tích.
  - Không biến nền tảng thành "từ đường ảo" hay "chùa online"; tôn trọng tín ngưỡng phụng vụ gia tiên và Công giáo truyền thống.
- **Phân cấp hiển thị:** Ưu tiên số 1 là các sự kiện cần nhớ trong ngày (giỗ tiền nhân, sinh nhật), kế đến là thông báo của gia đình, gợi ý tư liệu mới và danh mục lối vào các không gian.

### Không Gian 02: Gia Phả & Hồ Sơ Nhân Vật (Genealogy & Person Profile)
- **Điểm neo trải nghiệm (Anchor Point):** Bắt đầu từ **Chính Bản Thân Thành Viên** (`Me-Centric Exploration`). Người dùng nhìn thấy ngay vị trí của mình, cha mẹ, anh chị em và con cái trước khi mở rộng lên tổ tiên hoặc sang các chi phái khác.
- **Cấu trúc Hồ Sơ Nhân Vật (Person Profile) tham chiếu FamilySearch:**
  - *Tầng 1: Thông tin định danh:* Họ tên, tên thánh (nếu có), bí danh, năm sinh, năm mất, giới tính, thế hệ, chi nhánh.
  - *Tầng 2: Lý lịch & Niên biểu (Timeline):* Các dấu mốc cuộc đời gắn với sự kiện lịch sử (nơi sinh, biến cố di cư, hôn phối, ngày mất, nơi an nghỉ).
  - *Tầng 3: Các mối quan hệ 4 chiều:* Cha mẹ (Parents), Vợ/chồng (Spouses), Con cái (Children), Anh chị em (Siblings).
  - *Tầng 4: Trích lục nguồn & Bằng chứng (Sources & Provenance):* Giấy khai sinh, sổ gia phả, trích lục FamilySearch FSID, chứng thư rửa tội.
  - *Tầng 5: Ký ức & Câu chuyện (Memories & Stories):* Lời kể của con cháu, hồi ức gia đình.
  - *Tầng 6: Lịch sử biên tập & Đề xuất (Latest Changes & Proposals):* Ai đã cập nhật, ai đề xuất đính chính, lý do thay đổi.

### Không Gian 03: Tư Liệu Dòng Họ (Family Archive)
- **Tư liệu là đối tượng độc lập (First-Class Entity):** Một bức ảnh, lá thư, giấy tờ hay hiện vật số là một thực thể riêng trong kho chung, không phụ thuộc cứng vào một trang cá nhân nào.
- **Mối liên kết đa đối tượng (Many-to-Many Linking):**
  - 1 Tư liệu có thể liên kết đồng thời tới: Nhiều Nhân vật (`Person Tags`), Nhiều Gia đình (`Family Tags`), Sự kiện (`Event Tags`), Địa danh (`Place Tags`) và Bài viết MẠCH.
- **Cơ chế Gắn Thẻ Xã Hội (Social Tagging):**
  - Mọi thành viên có quyền đề xuất gắn tag (nhận diện khuôn mặt người thân trong ảnh cũ).
  - Người quản lý tư liệu hoặc người có thẩm quyền xác nhận trước khi tag được chính thức liên kết vào hồ sơ nhân vật.

### Không Gian 04: Không Gian Tri Thức & Đối Thoại MẠCH
- **Bản chất:** Không gian tri thức cộng đồng được hình thành từ văn hóa gia đình; không giới hạn lĩnh vực (lịch sử, văn hóa, giáo dục, đời sống, khoa học, triết học...).
- **Không giản lược thành Blog hay Diễn đàn giải trí:** MẠCH duy trì tiêu chuẩn chiều sâu, phong cách trang nhã, kích thích tư duy và trao truyền tri thức.
- **Tuyến nghiên cứu chuyên sâu của Người sáng lập:** Các khảo cứu của Tuấn về di sản gia tộc, lịch sử di cư và văn hóa dòng họ là một mạch nội dung trụ cột bên trong MẠCH; được phát triển theo lộ trình sau khi khung sản phẩm hoàn tất.
- **Mô hình biên tập kết hợp (Hybrid Editorial Model):**
  - Thành viên gửi bài viết ──► Ban biên tập duyệt tiêu chuẩn ──► Xuất bản.
  - Thành viên được phân quyền cộng tác viên đặc biệt có thể xuất bản trực tiếp trong chuyên mục được giao.
- **Cơ chế đối thoại có trách nhiệm:**
  - Bình luận hiển thị trực tiếp (không kiểm duyệt trước từng từ).
  - Áp dụng cơ chế **Hậu kiểm (Post-moderation)** kết hợp báo cáo vi phạm và quy tắc ứng xử.
  - Cho phép phản biện, bất đồng quan điểm nhưng phải văn minh, tôn trọng sự thật và chịu trách nhiệm với danh tính của mình ("Lập ngôn gắn với Lập thân").

### Không Gian 05: Lịch Gia Tộc (Family Calendar & Remembrance)
- **Giá trị tinh thần cốt lõi:** *"Lịch là nơi nhắc về các thành viên, là nơi để mọi người được nhắc đến, được nhớ đến."*
- **Các nhóm sự kiện:**
  1. Kỵ giỗ tiền nhân, ngày mất, ngày tưởng niệm tổ tiên.
  2. Sinh nhật thành viên, ngày cưới, kỷ niệm gia đình.
  3. Lễ bổn mạng, quan thầy (truyền thống Công giáo gia tộc).
  4. Họp mặt dòng họ, tảo mộ, lễ Tết và các sự kiện chung do thành viên đề xuất.
- **Nguyên tắc bảo tồn:** Kế thừa trọn vẹn dữ liệu và module Lịch hiện có từ production/Vercel baseline; không xây dựng lại từ đầu.

### Không Gian 06: Khám Phá Gia Đình & Không Gian Cá Nhân (Family & Personal Spaces)
- **Family Spaces (Không gian gia đình hạt nhân/nhánh):**
  - *Family Directory:* Danh mục các gia đình con cháu qua 5 thế hệ.
  - *Family Profile:* Thế hệ, thành viên, ảnh đại diện, dấu mốc lịch sử của gia đình đó.
  - *Family Space:* Không gian riêng tư để các thành viên trong gia đình đó đăng ảnh sinh hoạt, kỷ niệm mà không cần chia sẻ ra toàn bộ dòng họ.
- **Personal Space (Không gian riêng tư cá nhân):**
  - *Personal Journal:* Nhật ký suy ngẫm cá nhân.
  - *Research Notes:* Sổ tay ghi chép giả thuyết gia phả, tư liệu đang tra cứu.
  - *Personal Archive:* Kho lưu trữ tài liệu cá nhân.
  - *Quyền riêng tư tuyệt đối:* Mặc định chỉ chủ sở hữu được truy cập; chủ sở hữu chủ động quyết định việc chia sẻ.

### Không Gian 07: Thư Gửi Clara (Independent Dedicated Space)
- **Vị trí & Tính chất:** Không gian văn học và tâm tình độc lập của gia đình Hạnh–Đào.
- **Nguyên tắc cô lập an ninh:**
  - Không gian này không phải là quyền lợi mặc nhiên của thành viên dòng họ.
  - Chỉ những tài khoản nằm trong danh sách được gia đình Hạnh–Đào cấp phép cụ thể (`Allowlist Policy`) mới có quyền truy cập.
  - Dữ liệu và hình ảnh của Clara được lưu trữ và truy vấn qua endpoint độc lập; không trả về qua Global Search.

## 2.4. Tra Cứu Toàn Nền Tảng (Global Search)
- Một thanh tìm kiếm trung tâm trên thanh điều hướng thành viên.
- Cho phép tìm kiếm chéo: Nhân vật, Tư liệu, Bài viết MẠCH, Sự kiện Lịch, Gia đình.
- **Ranh giới an ninh bắt buộc (Permission-Aware Search):**
  - Công cụ tìm kiếm chỉ trả về các kết quả mà người dùng có quyền đọc.
  - Tuyệt đối không để rò rỉ tiêu đề, đoạn trích (snippet) hay metadata của dữ liệu hạn chế (như Thư Clara hoặc tài liệu gia đình riêng tư).

---

# PHẦN III — DECISION & EVIDENCE REGISTER (DANH MỤC QUYẾT ĐỊNH & ĐỐI CHIẾU 30 TOUCHPOINTS TP-001 ĐẾN TP-030)

Phần này bảo toàn toàn diện và chính xác 100% bản ghi 30 Touchpoints (`TP-001` đến `TP-030`) từ bản discovery giữa Emarald và Tuấn.

**Phân bổ trạng thái quản trị của 30 Touchpoints:**
- **23 Touchpoints Đã Quyết Định Trọn Vẹn (`DECIDED`):** TP-001, TP-004, TP-005, TP-007, TP-008, TP-009, TP-010, TP-012, TP-013, TP-015, TP-016, TP-017, TP-018, TP-019, TP-022, TP-023, TP-024, TP-025, TP-026, TP-027, TP-028, TP-029, TP-030.
- **07 Touchpoints Đã Quyết Định Nguyên Lý / Định Hướng Cốt Lõi Kèm Hạng Mục Cần Thiết Kế Chi Tiết Hoặc Chờ Quyết Định (`DECIDED + PROPOSED / OPEN`):**
  1. `TP-002`: Định hướng kết hợp Admin xác nhận + Google Sign-In (`DECIDED`); Quy trình kích hoạt chi tiết (`PROPOSED / OPEN`).
  2. `TP-003`: Mô hình quản trị tạm thời dựa trên Đích tôn / Người thừa kế (`DECIDED`); Cơ chế kế nhiệm chi tiết tương lai (`OPEN`).
  3. `TP-006`: Định hướng giá trị bền bỉ học hỏi FamilySearch (`DECIDED`); Câu từ định vị chính thức (`PROPOSED`).
  4. `TP-011`: Chủ đề là trục phân loại neo chính (`DECIDED — PROVISIONAL`); Taxonomy chi tiết (`OPEN`).
  5. `TP-014`: Nguyên lý Lập ngôn gắn lập thân & Quyền tài phán hậu duệ Tuấn (`DECIDED — PRINCIPLE`); Cơ chế bảo đảm tính liên tục và quyền tự quyết thế hệ sau (`OPEN — FUTURE GOVERNANCE`).
  6. `TP-020`: Quyền đồng thuận và yêu cầu gỡ của người xuất hiện (`DECIDED`); Quy chế cho trẻ vị thành niên, người đã mất, tranh chấp (`OPEN — REQUIRES PRODUCT OWNER DECISION`).
  7. `TP-021`: Người đăng chủ động chọn phạm vi chia sẻ (`DECIDED`); Danh sách phạm vi và cách biểu diễn quyền (`OPEN`).

| Mã TP | Tên Điểm Chạm & Nội Dung Quyết Định Của Tuấn | Trạng Thái Gốc (Discovery v0.1) | Vị Trí Trong Bản Đặc Tả v1.0 | Hiện Trạng Đối Chiếu & Bằng Chứng Kỹ Thuật |
| :---: | :--- | :---: | :---: | :--- |
| **TP-001** | **Cánh cửa thông tin công khai:** Triển khai nội bộ có kiểm soát; người ngoài chỉ thấy cổng tối giản; cấm cụm từ "một dòng dõi bình dân". | `DECIDED` | Mục 1.1, 2.1 | `CONFIGURED` trong `public-home.js` và `boot-public.js`. |
| **TP-002** | **Onboarding thành viên:** Kết hợp Admin xác nhận trực tiếp + Google Sign-In; không dùng dữ liệu gia phả làm mật khẩu mặc định. | `DECIDED — định hướng`<br>`PROPOSED — quy trình` | Mục 2.2 | `CONFIGURED` màn hình login; flow liên kết token cần hoàn thiện ở Batch 01. |
| **TP-003** | **Quyền thành viên & quản trị:** Dữ liệu chính danh sửa qua workflow đề xuất; quản trị tối cao thuộc đích tôn/thừa kế. | `DECIDED — PROVISIONAL`<br>`OPEN — kế nhiệm` | Mục 4.1 | `OBSERVED` modal đề xuất mẫu trong `person.js`; backend table `proposals` đang chờ triển khai. |
| **TP-004** | **Không gian sau đăng nhập:** Home là không gian đời sống chung (Lời chào, Lịch, MẠCH, Tư liệu, Gia đình, Cá nhân), không phải dashboard tài khoản. | `DECIDED` | Mục 2.3 (KG 01) | `OBSERVED` cấu trúc khung trong `dashboard.js`. |
| **TP-005** | **Lời chào & giọng kể:** Ngữ cảnh theo ngày/sự kiện; mang sắc thái tiền nhân nhưng không giả danh cụ thể; không làm "chùa online"/từ đường ảo. | `DECIDED` | Mục 2.3 (KG 01) | `DOCUMENTED` quy tắc nội dung; kho lời chào đang chờ biên soạn. |
| **TP-006** | **Định vị giá trị / sức bền:** Học hỏi tính bền bỉ hàng trăm năm của FamilySearch; dung hòa Công giáo & tín ngưỡng Việt Nam; không áp đặt thế hệ sau. | `DECIDED — giá trị`<br>`PROPOSED — câu định vị` | Mục 1.2, 1.3 | `DOCUMENTED` trong `GENEALOGY_ARCHITECTURE_SURVEY.md`. |
| **TP-007** | **Ba hình thức đóng góp:** Tách biệt Kho tư liệu chung, Bài viết MẠCH và Đề xuất dữ kiện gia phả; một câu chuyện không tự thành dữ kiện lịch sử. | `DECIDED` | Mục 1.4, 2.3 | `OBSERVED` trong mockup UI; cần hoàn thiện modal điều hướng 3 luồng ở Batch 04/05. |
| **TP-008** | **Mô hình biên tập MẠCH:** Hybrid Editorial; thành viên gửi qua duyệt; người phân quyền đăng trực tiếp; ban biên tập giữ chất lượng. | `DECIDED` | Mục 2.3 (KG 04) | `CONFIGURED` component đọc bài `discourse.js`; bảng phân quyền tác giả chờ Batch 05. |
| **TP-009** | **Đối tượng MẠCH:** Mở rộng cho cả dâu/rể/người thân trong các gia đình; không giới hạn hẹp huyết thống. | `DECIDED` | Mục 1.1, 2.3 (KG 04) | `CONFIGURED` role `family_member` trong schema người dùng. |
| **TP-010** | **Định vị & phạm vi MẠCH:** Không giới hạn lĩnh vực (lịch sử, văn hóa, khoa học, triết học, đời sống); tri thức từ cộng đồng gia đình. | `DECIDED` | Mục 2.3 (KG 04) | `DOCUMENTED` trong `PUBLIC_COMMUNICATION_ARCHITECTURE_v1.0.md`. |
| **TP-011** | **Phân loại tri thức MẠCH:** Đa chiều nhưng lấy chủ đề làm điểm neo nhận thức chính; hình thức là bổ trợ; không bắt học taxonomy phức tạp. | `DECIDED — PROVISIONAL`<br>`OPEN — taxonomy` | Mục 2.3 (KG 04) | `CONFIGURED` 5 chủ đề neo trong `fixtures/synthetic_mach.json`. |
| **TP-012** | **Quyền đọc MẠCH:** Thành viên cộng đồng được đọc toàn bộ MẠCH; quyền đọc không mở quyền truy cập dữ liệu riêng tư hay Thư Clara. | `DECIDED` | Mục 1.4, 2.3 (KG 04) | `CONFIGURED` policy đọc nội bộ trong mock session. |
| **TP-013** | **Bình luận MẠCH:** Hiển thị trực tiếp, quản trị hậu kiểm; cho phép phản biện văn minh; có nút báo cáo vi phạm. | `DECIDED` | Mục 2.3 (KG 04) | `DOCUMENTED` quy tắc hậu kiểm; component comment chờ Batch 05. |
| **TP-014** | **Lập ngôn & Quyền tài phán:** "Lập ngôn" gắn với "Lập thân"; quyền tài phán thuộc hậu duệ của Tuấn; thế hệ sau có quyền tự quyết cách bảo tồn. | `DECIDED — PRINCIPLE`<br>`OPEN — chuyển giao` | Mục 1.3, 4.1 | `DOCUMENTED` nguyên lý quản trị tối cao; không suy diễn cơ chế hành chính giả tạo. |
| **TP-015** | **Quan hệ MẠCH publication & online:** MẠCH trực tuyến là không gian tri thức cộng đồng; khảo cứu chuyên sâu của Tuấn là trụ cột phát triển theo giai đoạn. | `DECIDED — định hướng mới` | Mục 2.3 (KG 04) | `DOCUMENTED` chuyển hướng kiến trúc web động. |
| **TP-016** | **Điểm xuất phát gia phả:** Lấy cá nhân làm tâm điểm (`Me-Centric`), thấy mình và quan hệ gần trước khi mở rộng toàn cây. | `DECIDED — A` | Mục 2.3 (KG 02) | `TESTED` thuật toán Focus Person trong `tree.js` và `person.js`. |
| **TP-017** | **Cấu trúc hồ sơ cá nhân:** Phân lớp đầy đủ tham chiếu FamilySearch Person Page (6 tầng thông tin: Danh tính, Niên biểu, Quan hệ, Nguồn, Ký ức, Đề xuất). | `DECIDED — C / ref FS` | Mục 2.3 (KG 02) | `TESTED` component `src/js/ui/person.js` qua dữ liệu `synthetic_profile.json`. |
| **TP-018** | **Tổ chức & liên kết tư liệu:** Tư liệu là thực thể độc lập trong kho chung; liên kết nhiều người, gia đình, sự kiện, địa điểm, bài MẠCH. | `DECIDED — C` | Mục 2.3 (KG 03) | `CONFIGURED` trong `synthetic_media.json`; bảng liên kết trung gian chờ Batch 04. |
| **TP-019** | **Quyền gắn tag tư liệu:** Thành viên đề xuất tag; người quản lý tư liệu xác nhận trước khi áp dụng chính thức. | `DECIDED — C` | Mục 2.3 (KG 03) | `DOCUMENTED` luồng tag đề xuất; UI gắn thẻ chờ Batch 04. |
| **TP-020** | **Quyền riêng tư người còn sống trong tư liệu:** Người xuất hiện có quyền đồng thuận và yêu cầu gỡ; người đăng không có quyền phủ quyết quyền riêng tư. | `DECIDED — B + C`<br>`OPEN — trẻ em/mất/tranh chấp`| Mục 4.2 | `DOCUMENTED` nguyên tắc bảo vệ quyền chủ thể; chính sách mặc định hạn chế tiếp cận. |
| **TP-021** | **Quyền chia sẻ tư liệu:** Người đăng chủ động chọn phạm vi (Riêng tư, Gia đình, Dòng họ, Công khai) và có thể thu hồi; cùng tồn tại với quyền người xuất hiện. | `DECIDED — người đăng chọn`<br>`OPEN — danh sách phạm vi`| Mục 4.2 | `CONFIGURED` metadata trường `visibility` trong media schema. |
| **TP-022** | **Quyền tương tác tư liệu:** Xem theo quyền, bình luận, bày tỏ cảm xúc, đề xuất tag, đề xuất bổ sung thông tin; không tự ý sửa dữ liệu gốc. | `DECIDED — C` | Mục 2.3 (KG 03) | `DOCUMENTED` phạm vi tương tác; UI tương tác chờ Batch 04. |
| **TP-023** | **Lịch sử & nguồn gốc tư liệu:** Lưu vết ai đăng, ai bổ sung, ai gắn tag, ai duyệt, thời điểm, lý do (Latest Changes pattern của FamilySearch). | `DECIDED — C / ref FS` | Mục 2.3 (KG 03) | `DOCUMENTED` cấu trúc audit log cho tài sản số. |
| **TP-024** | **Xử lý bất đồng dữ kiện:** Bảo toàn các nhận định và bằng chứng khác nhau; người có thẩm quyền quyết định trạng thái chính thức; không xóa lịch sử. | `DECIDED — C` | Mục 4.3 | `DOCUMENTED` quy tắc lưu trữ bất đồng; UI thảo luận dữ kiện chờ Batch 02. |
| **TP-025** | **Trạng thái thông tin gia phả:** Hồ sơ phân biệt rõ trạng thái nhận thức của từng dữ kiện (Đã xác minh, Chưa xác minh, Suy luận, Có tranh chấp, Chưa xác định). | `DECIDED — C` | Mục 4.3 | `TESTED` component `EpistemicBadge` hiển thị trạng thái nhận thức. |
| **TP-026** | **Lịch gia tộc:** Nơi thành viên được nhắc đến và nhớ đến; kế thừa nguyên trạng module Lịch trên production (giỗ chạp, sinh nhật, họp mặt). | `DECIDED — D`<br>`EXISTING PRODUCT AREA — NOT VERIFIED` | Mục 2.3 (KG 05) | `CONFIGURED` router `/server/calendars/` và engine âm dương `lunar-engine.js`. |
| **TP-027** | **Tìm kiếm toàn nền tảng:** Global Search trung tâm tìm kiếm chéo có phân quyền; không rò rỉ dữ liệu giới hạn ra ngoài quyền đọc. | `DECIDED — E` | Mục 2.4 | `PARTIAL` thanh tìm kiếm UI; backend filter lọc theo session chờ Batch 07. |
| **TP-028** | **Khám phá các gia đình:** Cấu trúc 3 lớp gồm Family Directory, Family Profile và Family Space (không gian riêng tư của từng gia đình). | `DECIDED — D` | Mục 2.3 (KG 06) | `PARTIAL` khung sườn `spaces.js`; giao diện 3 lớp chờ hoàn thiện ở Batch 06. |
| **TP-029** | **Không gian ghi chép riêng tư:** Personal Journal, Research Notes và Personal Archive; mặc định cô lập 100%, chỉ chủ sở hữu quyết định chia sẻ. | `DECIDED — D` | Mục 2.3 (KG 06) | `DOCUMENTED` nguyên tắc cô lập dữ liệu người dùng. |
| **TP-030** | **Ranh giới quyền truy cập giữa 6 không gian:** Ranh giới kỹ thuật bất khả xâm phạm giữa Phả hệ, Tư liệu, MẠCH, Family Space, Cá nhân và Thư Clara. | `DECIDED — APPROVED` | Mục 2.3, 4.2 | `CONFIGURED` middleware kiểm tra token độc lập cho Thư Clara; ReBAC engine bảo vệ. |

---

# PHẦN IV — DOMAIN, GOVERNANCE & PERMISSION MODEL (MÔ HÌNH QUẢN TRỊ & PHÂN QUYỀN ĐA CHIỀU)

## 4.1. Phân Định 5 Tầng Trách Nhiệm Quản Trị Hệ Thống (Five Responsibility Layers)
Nhằm bảo đảm tính khách quan khoa học và tránh việc tùy tiện áp đặt danh xưng quyền lực phong kiến, hệ thống phân định rạch ròi 5 tầng trách nhiệm chức năng:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ 1. JURISDICTION & FOUNDER AUTHORITY (Quyền Tài Phán Tối Cao)           │
│ • Thuộc về Tuấn (Product Owner) và người thừa kế chính danh được chỉ   │
│   định theo nguyên tắc Đích tôn / Người đại diện dòng họ.             │
│ • Thẩm quyền: Định vị sản phẩm, chính sách nền tảng, kế thừa di sản.   │
├────────────────────────────────────────────────────────────────────────┤
│ 2. GENEALOGICAL GOVERNANCE (Quản Trị Dữ Kiện Phả Hệ)                   │
│ • Hiện tại: Tuấn và đại diện gia đình trực tiếp xác nhận.              │
│ • Tương lai [PROPOSED/OPEN]: Đại diện các chi nhánh gia đình tham gia  │
│   tiếp nhận và sơ duyệt đề xuất từ con cháu trong nhánh.               │
│ • Thẩm quyền: Phê duyệt cập nhật chính thức vào phả hệ, xử lý bất đồng.│
├────────────────────────────────────────────────────────────────────────┤
│ 3. EDITORIAL STEWARDSHIP (Quản Trị Biên Tập Tri Thức MẠCH)             │
│ • Hiện tại: Tuấn phụ trách định hướng và thẩm định bài viết.           │
│ • Tương lai [PROPOSED/OPEN]: Nhóm biên tập được ủy quyền theo năng lực.│
│ • Thẩm quyền: Duyệt bài viết MẠCH, quản trị hậu kiểm bình luận.       │
├────────────────────────────────────────────────────────────────────────┤
│ 4. OPERATIONAL ADMINISTRATION (Quản Trị Vận Hành Cộng Đồng)            │
│ • Người điều phối do Tuấn ủy thác.                                     │
│ • Thẩm quyền: Cấp mã kích hoạt tài khoản, hỗ trợ thành viên cao niên.  │
├────────────────────────────────────────────────────────────────────────┤
│ 5. TECHNICAL INFRASTRUCTURE (Quản Trị Kỹ Thuật & An Ninh Nền Tảng)    │
│ • AGY (Primary Agent) & Quản trị viên hệ thống kỹ thuật.               │
│ • Thẩm quyền: Vận hành máy chủ, cơ sở dữ liệu, an ninh, sao lưu, CI/CD.│
│ • Ranh giới cấm: Tuyệt đối không can thiệp vào dữ kiện lịch sử gia phả.│
└────────────────────────────────────────────────────────────────────────┘
```

> **Lưu ý quản trị tối cao:** Các cơ cấu như "Hội đồng gia tộc" hay "Ban chấp sự các chi phái" hiện chưa được thành lập và **chỉ được xem là đề xuất kiến trúc (PROPOSED/OPEN)** phục vụ giai đoạn phát triển cộng đồng trong tương lai khi số lượng thành viên mở rộng. Quyền tài phán và quyết định cao nhất hiện tại thuộc về Tuấn.

## 4.2. Ma Trận Phân Quyền & Ranh Giới Riêng Tư Đa Chiều (Permission Matrix)
Quyền truy cập không chỉ phụ thuộc vào vai trò (Role-based), mà phụ thuộc vào mối quan hệ giữa **Chủ thể đóng góp (Uploader)**, **Đối tượng xuất hiện (Subject)**, **Quan hệ gia đình (Kinship)** và **Phạm vi không gian (Space Scope)**:

| Không Gian / Thực Thể | Quyền Của Người Đăng (Uploader) | Quyền Của Người Xuất Hiện (Subject) | Quyền Của Thành Viên Gia Tộc | Quyền Của Công Chúng (Public) | Cơ Chế Thực Thi Kỹ Thuật |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Gia Phả (Cây & Hồ Sơ)** | Gửi đề xuất đính chính/bổ sung | Xem hồ sơ mình; yêu cầu đính chính dữ kiện sai | Xem theo mức độ thân cận và thế hệ | Không được xem (Ẩn 100%) | Server ReBAC check `membership_status` |
| **Tư Liệu Ảnh / Kỷ Vật** | Chọn phạm vi chia sẻ (Private / Family / Clan) | **Quyền đồng thuận**; quyền yêu cầu gỡ/giới hạn | Xem và tương tác nếu nằm trong phạm vi chia sẻ | Chỉ xem nếu người đăng bật `Public` và người xuất hiện đồng thuận | Multi-party consent logic trên API |
| **Bài Viết MẠCH** | Biên tập, sửa bài của mình | Phản hồi, yêu cầu đính chính nếu bị nhắc tên | Đọc toàn bộ; bình luận trực tiếp; chia sẻ nội bộ | Chỉ xem các bài tuyển chọn được phép xuất bản ra ngoài | Post-moderation + Content State |
| **Family Space** | Toàn quyền trong gia đình mình | Đồng thuận chia sẻ nội bộ gia đình | Không được xem nếu không thuộc gia đình/nhánh đó | Không được xem (Ẩn 100%) | Relationship traversal check |
| **Không Gian Cá Nhân** | Toàn quyền kiểm soát, tải về, xóa | N/A (Thuộc về chủ sở hữu) | Không được xem (Mặc định cô lập) | Không được xem (Ẩn 100%) | User isolation (`user_id = session.uid`) |
| **Thư Gửi Clara** | Thuộc gia đình Hạnh–Đào | Thuộc đối tượng trong thư | Bị từ chối mặc định (Deny by default) | Không được xem (Ẩn 100%) | Độc lập Allowlist token check |

### Ranh Giới Giải Quyết Xung Đột Quyền (Rights Conflict Resolution Rules):
1. **Nguyên tắc Tối Thượng: Quyền của Người Đăng KHÔNG BAO GIỜ vượt qua quyền của Người Xuất Hiện:**  
   Nếu người đăng muốn chia sẻ một bức ảnh hoặc câu chuyện liên quan đến một thành viên còn sống, nhưng thành viên đó yêu cầu ẩn hoặc gỡ, hệ thống **bắt buộc tuân theo yêu cầu của Người Xuất Hiện (Subject Rights Override Uploader Rights)**.
2. **Xử lý các tình huống mở (`OPEN — REQUIRES PRODUCT OWNER DECISION`):**
   - *Trẻ vị thành niên (Minors):* Chưa có quy chế pháp lý/gia ước chính thức quy định độ tuổi cụ thể (16 hay 18). **Trạng thái: `OPEN`**. Cơ chế an toàn kỹ thuật tạm thời: Mặc định hạn chế hiển thị công cộng (`Restrict by default`), chỉ hiển thị trong nội bộ gia đình trực hệ của trẻ cho đến khi có quy định chính thức từ Tuấn.
   - *Người đã mất (Deceased Persons):* Tư liệu lịch sử nhằm tôn vinh và tưởng nhớ chung, nhưng nếu có ý kiến từ con cháu trực hệ về tính riêng tư hoặc trang nghiêm thì xử lý thế nào? **Trạng thái: `OPEN`**. Tạm thời đưa vào trạng thái cân nhắc nội bộ; Tuấn là người ra quyết định cuối cùng.
   - *Ảnh tập thể / Nhiều người cùng xuất hiện (Group Photos):* Khi một người đồng ý nhưng người khác phản đối việc chia sẻ rộng rãi. **Trạng thái: `OPEN`**. Kỹ thuật áp dụng giải pháp an toàn cao nhất: Giới hạn phạm vi hiển thị về mức an toàn chung (Family/Private) hoặc làm mờ/ẩn khuôn mặt người phản đối theo yêu cầu.
   - *Tranh chấp dữ liệu phả hệ (Disputed Genealogical Claims):* Bảo toàn nguyên văn dữ liệu kèm nhãn `DISPUTED_CLAIM`, tuyệt đối không tự ý xóa bỏ lập luận của các bên trong khi chờ thẩm định.

## 4.3. Mô Hình Nhận Thức Cấp Dữ Kiện Trong Gia Phả (Claim-Level Epistemic Model)
Một hồ sơ nhân vật không mang một trạng thái cứng nhắc chung chung ("đã xác thực" hay "chưa xác thực"). Hệ thống quản lý tính xác thực ở **cấp độ từng thuộc tính dữ kiện (Claim-Level Fact)**:

```text
[HỒ SƠ NHÂN VẬT: CỤ TRẦN TRỌNG THU]
  ├── Họ và tên: "Trần Trọng Thu" ────────────► [VERIFIED FACT] (Có bia mộ, giấy tờ khai sinh, sổ thờ)
  ├── Năm sinh: 1872 ────────────────────────► [VERIFIED FACT] (Khớp sổ rửa tội và phả ký)
  ├── Năm mất: 1969 ────────────────────────► [VERIFIED FACT] (Con cháu trực tiếp chứng kiến)
  ├── Nơi sinh: "Kim Sơn, Ninh Bình" ────────► [INFERENCE] (Suy luận từ quê quán thân mẫu)
  └── Biến cố di cư 1954 ────────────────────► [UNVERIFIED CLAIM] (Lời kể khẩu truyền, đang tìm nhân chứng)
```

Mỗi dữ kiện (Fact/Claim) trong CSDL lưu trữ đủ 5 thuộc tính nhận thức:
1. `epistemic_status`: `VERIFIED_FACT` | `UNVERIFIED_CLAIM` | `INFERENCE` | `DISPUTED_CLAIM` | `UNKNOWN`.
2. `source_id`: Khóa ngoại trỏ đến tài liệu chứng minh trong kho tư liệu.
3. `contributor_id`: Thành viên cung cấp thông tin.
4. `verified_by`: Người có thẩm quyền xác nhận.
5. `revision_history`: Lịch sử các lần chỉnh lý trước đó.

---

# PHẦN V — IMPLEMENTATION TRACEABILITY & BATCHING STRATEGY (MA TRẬN TRUY VẾT TOÀN DIỆN & KẾ HOẠCH BATCH)

## 5.1. Ma Trận Truy Vết Toàn Diện 30 Touchpoints (Comprehensive Traceability Matrix)

Tiêu chuẩn đánh giá mức độ kiểm chứng kỹ thuật:
- `DOCUMENTED`: Đã được chuẩn hóa trong tài liệu đặc tả, chưa viết mã.
- `CONFIGURED`: Đã có cấu trúc dữ liệu, schema hoặc cấu hình trong mã nguồn.
- `OBSERVED`: Đã chạy thử nghiệm trên giao diện tĩnh hoặc mock UI trong Vibecode Lab.
- `TESTED`: Đã chạy kịch bản kiểm thử có đối soát đầu ra (Unit/Integration Test trong Lab).
- `PROVEN`: Đã kiểm chứng độc lập trên môi trường runtime thực tế với dữ liệu định lượng đầy đủ.
- `PARTIAL`: Đã triển khai một phần, còn các module phụ thuộc chưa kết nối.
- `BLOCKED`: Đang bị nghẽn do chờ quyết định hoặc tài nguyên phụ thuộc.
- `UNKNOWN`: Chưa khảo sát hoặc chưa có thông tin kiểm chứng.

| Mã TP | Yêu Cầu Sản Phẩm (Requirements) | Module / Giao Diện Tương Ứng | Thành Phần Mã Nguồn Liên Quan | Kịch Bản Kiểm Thử Bắt Buộc | Mức Độ Kiểm Chứng Hiện Tại |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **TP-001** | Cổng công khai tối giản, an toàn, cấm cụm từ hạ thấp | Public Gateway | `public-home.js`, `boot-public.js` | Quét nội dung không có từ cấm, không lộ link phả hệ ra ngoài | `TESTED` |
| **TP-002** | Onboarding liên kết Admin duyệt + Google Sign-In | Cổng thành viên | `auth.js`, `member.js`, `login.html` | Đăng nhập Google, nhập token kích hoạt hợp lệ map vào `person_id` | `CONFIGURED` |
| **TP-003** | Quy trình đề xuất duyệt dữ kiện phả hệ | Hồ sơ nhân vật | `person.js`, `spaces_router.js` | Gửi đề xuất sửa năm sinh, ghi log audit, không ghi đè trực tiếp DB | `OBSERVED` |
| **TP-004** | Home là không gian đời sống chung 7 thành phần | Welcome Home | `dashboard.js`, `shell.js` | Kiểm tra render đủ 7 widget thành phần theo vai trò thành viên | `OBSERVED` |
| **TP-005** | Lời chào ngữ cảnh, giọng kể mang sắc thái tiền nhân | Welcome Home | `dashboard.js`, `greetings.json` | Thay đổi lời chào theo giờ, không mạo danh tiền nhân cụ thể | `DOCUMENTED` |
| **TP-006** | Học hỏi tính bền bỉ và sức sống FamilySearch | Toàn hệ thống | Kiến trúc dữ liệu và tài liệu nghiên cứu | Đối soát schema phả hệ tương thích chuẩn lưu trữ lâu dài | `DOCUMENTED` |
| **TP-007** | Đóng góp phân định 3 luồng riêng biệt | Modal đóng góp | `lab.js`, `components.js` | Bấm nút đóng góp hiển thị 3 lựa chọn Tư liệu / MẠCH / Phả hệ | `PARTIAL` |
| **TP-008** | MẠCH Hybrid Editorial Workflow | Không gian MẠCH | `discourse.js`, `editorial.js` | Phân quyền tác giả, luồng gửi bài qua biên tập viên duyệt | `PARTIAL` |
| **TP-009** | Đối tượng tham gia MẠCH gồm dâu/rể/người thân | User Identity | `server/auth.js`, bảng `users` | Gán role `family_member` cho dâu/rể và kiểm tra quyền truy cập | `CONFIGURED` |
| **TP-010** | MẠCH đa lĩnh vực tri thức cộng đồng | Chuyên mục MẠCH | `discourse.js`, `synthetic_mach.json` | Cho phép đăng bài thuộc các chủ đề văn hóa, lịch sử, đời sống | `CONFIGURED` |
| **TP-011** | Taxonomy MẠCH neo theo chủ đề chính | Bộ lọc MẠCH | `discourse.js`, `filter.js` | Lọc bài viết theo 5 chủ đề chính; không bắt buộc phân loại phụ | `CONFIGURED` |
| **TP-012** | Quyền đọc MẠCH cho mọi thành viên cộng đồng | Content Engine | `discourse.js`, ReBAC policy | Thành viên đăng nhập đọc được mọi bài MẠCH nội bộ; ẩn với khách | `CONFIGURED` |
| **TP-013** | Bình luận MẠCH hiển thị trực tiếp, hậu kiểm | Trao đổi MẠCH | `comments.js`, ReBAC policy | Đăng bình luận tức thì; bấm báo cáo vi phạm chuyển cờ hậu kiểm | `DOCUMENTED` |
| **TP-014** | Lập ngôn gắn lập thân & Quyền tài phán hậu duệ Tuấn | Governance Engine | Policy tài liệu & Hiến chương | Quyền quản trị tối cao và chuyển giao kế nhiệm được bảo vệ | `DOCUMENTED` |
| **TP-015** | MẠCH trực tuyến là không gian tri thức cộng đồng | Không gian MẠCH | `discourse.js` | Cấu trúc xuất bản bài viết động; tuyến khảo cứu chuyên sâu tách biệt | `DOCUMENTED` |
| **TP-016** | Gia phả lấy chính cá nhân làm tâm điểm (Me-Centric) | Interactive Tree | `tree.js`, Canvas Pan/Zoom | Mở cây hiển thị ngay bản thân ở trung tâm và các quan hệ 1st-degree | `TESTED` |
| **TP-017** | Cấu trúc Hồ sơ nhân vật 6 tầng theo FamilySearch | Person Profile | `person.js`, `synthetic_profile.json` | Render đủ 6 tab: Định danh, Niên biểu, Quan hệ, Nguồn, Ký ức, Lịch sử | `TESTED` |
| **TP-018** | Tư liệu là thực thể độc lập, liên kết đa chiều | Family Archive | `synthetic_media.json`, Media Gallery | 1 ảnh liên kết đồng thời 2 nhân vật, 1 sự kiện và 1 bài MẠCH | `CONFIGURED` |
| **TP-019** | Cơ chế đề xuất và duyệt gắn thẻ (Tagging) | Media Viewer | `media-viewer.js`, `tags.js` | Thành viên đề xuất tag mặt người; người quản lý bấm chấp thuận | `DOCUMENTED` |
| **TP-020** | Quyền đồng thuận của người còn sống trong tư liệu | Media Privacy | `visibility.js`, ReBAC policy | Người xuất hiện gửi yêu cầu ẩn ảnh; ảnh lập tức bị hạ khỏi luồng chung | `DOCUMENTED` |
| **TP-021** | Người đăng chủ động chọn phạm vi chia sẻ | Upload Modal | `media-uploader.js` | Chọn phạm vi Riêng tư / Gia đình / Dòng họ; cập nhật quyền sau upload | `CONFIGURED` |
| **TP-022** | Tương tác tư liệu (Bình luận, cảm xúc, đề xuất) | Media Viewer | `media-viewer.js` | Bình luận và thả cảm xúc trên tư liệu; đề xuất không ghi đè gốc | `DOCUMENTED` |
| **TP-023** | Ghi vết lịch sử và nguồn gốc tư liệu (Provenance) | Media Audit Log | `audit_logger.js`, DB schema | Ghi nhận người đăng, ngày giờ, nguồn gốc văn bản, lịch sử chỉnh sửa | `DOCUMENTED` |
| **TP-024** | Bảo tồn bất đồng về dữ kiện lịch sử (Disputes) | Person Profile | `person.js`, bảng `disputes` | Ghi nhận 2 luồng ý kiến khác nhau về năm sinh, không xóa lập luận cũ | `DOCUMENTED` |
| **TP-025** | Nhãn trạng thái nhận thức dữ kiện (Epistemic Status)| Hồ sơ phả hệ | `EpistemicBadge`, `person.js` | Gắn nhãn Fact/Claim/Inference/Dispute trên từng dòng dữ kiện | `TESTED` |
| **TP-026** | Kế thừa module Lịch gia tộc hiện có | Lịch gia tộc | `/server/calendars/`, `lunar-engine.js` | Tính đúng ngày giỗ âm lịch, sinh nhật; render widget lịch trên Home | `CONFIGURED` |
| **TP-027** | Global Search toàn nền tảng tôn trọng quyền đọc | Search Engine | API `/api/search`, UI Searchbar | Tìm từ khóa chéo 5 loại thực thể; không rò rỉ dữ liệu ngoài quyền | `PARTIAL` |
| **TP-028** | Khám phá các gia đình 3 lớp (Directory/Profile/Space)| Family Spaces | `spaces.js`, `spaces_router.js` | Xem danh mục chi nhánh, xem hồ sơ nhánh, truy cập không gian riêng | `PARTIAL` |
| **TP-029** | Không gian ghi chép cá nhân cô lập 100% | Personal Space | Local storage / Encrypted DB table | Thành viên ghi nhật ký, ghi chú nghiên cứu; người khác không thể xem | `DOCUMENTED` |
| **TP-030** | Ranh giới kỹ thuật cô lập giữa 6 không gian & Clara | Security Engine | `server/auth.js`, Middleware | Token Clara riêng biệt; request không có allowlist token bị từ chối 403 | `CONFIGURED` |

## 5.2. Kế Hoạch Triển Khai Phân Rã Theo Batch (Batched Implementation Plan)

Nhằm đảm bảo an toàn dữ liệu và có thể kiểm chứng độc lập ở từng bước, toàn bộ quá trình triển khai sản phẩm thực tế được chia thành **8 Batch tuần tự**:

```text
Batch 01 ──► Batch 02 ──► Batch 03 ──► Batch 04 ──► Batch 05 ──► Batch 06 ──► Batch 07 ──► Batch 08
Identity     Person &     Family Tree  Family       Community    Family       Search &     Final
& Auth       Epistemic    Canvas       Archive      MẠCH Space   Spaces       Remembrance  Integration
```

### Chi tiết các Batch thực thi:
1. **BATCH 01 — Identity, Onboarding & Security Boundary:**
   - *Phạm vi:* Hoàn thiện luồng kích hoạt tài khoản thành viên, liên kết danh tính số, bảo vệ ranh giới an ninh Thư Clara (`TP-001`, `TP-002`, `TP-030`).
   - *Deliverable:* Giao diện kích hoạt, middleware xác thực server-side, kiểm thử deny-by-default.
2. **BATCH 02 — Person Profile & Claim-Level Epistemic System:**
   - *Phạm vi:* Hoàn thiện 6 phân lớp Hồ sơ nhân vật, nhãn trạng thái nhận thức `EpistemicBadge`, form đề xuất thay đổi dữ kiện và bảo tồn bất đồng (`TP-003`, `TP-017`, `TP-024`, `TP-025`).
   - *Deliverable:* Module `person.js` hoàn thiện, API lưu trữ đề xuất vào bảng `proposals`.
3. **BATCH 03 — Interactive Family Tree Canvas:**
   - *Phạm vi:* Tích hợp thuật toán Canvas tương tác Pan/Zoom/Drag đa thế hệ vào không gian gia phả, lấy cá nhân làm tâm điểm (`TP-006`, `TP-016`).
   - *Deliverable:* Component `tree-canvas.js` thay thế bảng danh sách phẳng.
4. **BATCH 04 — Family Archive & Multi-Party Tagging:**
   - *Phạm vi:* Xây dựng kho tư liệu ảnh và hiện vật số độc lập; cơ chế Person Tagging và ranh giới quyền riêng tư người còn sống (`TP-007`, `TP-018`, `TP-019`, `TP-020`, `TP-021`, `TP-022`, `TP-023`).
   - *Deliverable:* Module thư viện ảnh thẻ, API gắn thẻ và luồng phê duyệt tag.
5. **BATCH 05 — MẠCH Knowledge & Hybrid Editorial Workflow:**
   - *Phạm vi:* Không gian tri thức MẠCH, luồng gửi bài - biên tập - xuất bản, khu vực bình luận đối thoại hậu kiểm (`TP-008`, `TP-009`, `TP-010`, `TP-011`, `TP-012`, `TP-013`, `TP-014`, `TP-015`).
   - *Deliverable:* Giao diện đọc bài, form gửi bài, bảng quản trị bài viết.
6. **BATCH 06 — Family Directory & Family Spaces:**
   - *Phạm vi:* Danh mục các gia đình con cháu qua 5 thế hệ, hồ sơ gia đình và không gian sinh hoạt riêng từng nhánh, không gian cá nhân (`TP-028`, `TP-029`).
   - *Deliverable:* Module `spaces.js` kết nối dữ liệu chi nhánh.
7. **BATCH 07 — Global Search & Calendar Remembrance:**
   - *Phạm vi:* Tích hợp thanh tìm kiếm toàn nền tảng tôn trọng quyền riêng tư; kết nối module Lịch gia tộc hiện có và lời chào ngữ cảnh (`TP-004`, `TP-005`, `TP-026`, `TP-027`).
   - *Deliverable:* Endpoint `/api/search`, giao diện kết quả phân loại, widget nhắc việc trên Home.
8. **BATCH 08 — System Integration, E2E Verification & Baseline Freezing:**
   - *Phạm vi:* Kiểm thử hồi quy toàn diện 7 bề mặt trên 4 kích thước responsive; đóng gói Approved Product Baseline v1.0.
   - *Deliverable:* Báo cáo nghiệm thu tổng thể trình Tuấn phê duyệt.
