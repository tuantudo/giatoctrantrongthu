# GIATOCTRA NTRONGTHU.COM
# PRODUCT EXPERIENCE SPECIFICATION — DISCOVERY HANDOFF

**Phiên bản:** 0.1 — Draft for Tuấn's review  
**Ngày tổng hợp:** 03/11/2026  
**Phạm vi:** Tổng hợp phỏng vấn TP-001–TP-030  
**Trạng thái:** `DRAFT — AWAITING PRODUCT OWNER REVIEW`  
**Product Owner / Final Authority:** Tuấn  
**Strategic Analysis & Product Architecture:** Emarald  
**Execution Authority:** AGY  
**Implementation status:** Chưa bàn giao triển khai; chưa có quyết định thay đổi code, database hoặc Production.

---

# 0. Cách đọc tài liệu và quy ước trạng thái

Tài liệu này chuyển các quyết định trong phiên phỏng vấn thành một bản đặc tả trải nghiệm ở mức sản phẩm. Đây **không phải** tài liệu thiết kế kỹ thuật cuối cùng, không phải PRD đã duyệt và không phải lệnh triển khai.

## 0.1. Trạng thái

| Trạng thái | Ý nghĩa |
|---|---|
| `DECIDED` | Tuấn đã xác nhận lựa chọn/nguyên tắc |
| `PROPOSED` | Đề xuất của Emarald, chưa được Tuấn duyệt |
| `OPEN` | Chưa đủ thông tin hoặc chưa cần quyết định |
| `ASSUMPTION` | Giả định tạm thời cần kiểm chứng |
| `RISK` | Rủi ro cần xử lý hoặc kiểm chứng |
| `DEFERRED` | Chủ động để lại cho giai đoạn sau |
| `NOT VERIFIED` | Chưa kiểm tra trên sản phẩm/runtime hiện tại |

Không được chuyển `PROPOSED`, `OPEN`, `ASSUMPTION` thành `DECIDED` nếu chưa có xác nhận của Tuấn.

## 0.2. Phạm vi hiệu lực

- Website Production là Product Baseline canonical.
- Vibecode Lab là môi trường review UI/UX, không phải một sản phẩm độc lập.
- Không rebuild website, không tạo website thứ hai.
- Không tự động deploy từ Lab sang Production.
- Tuấn quyết định trải nghiệm, nội dung, cấu trúc, UI/UX và nghiệm thu.
- AGY thực thi kỹ thuật theo từng gói công việc được duyệt.
- Bản tổng hợp này chỉ là đầu vào cho bước review. **Chưa được phép triển khai.**

---

# 1. Executive Product Brief

## 1.1. Danh tính sản phẩm

| Thành phần | Định nghĩa |
|---|---|
| Dự án | Cây Gia Phả |
| Tên sản phẩm | Gia tộc Trần Trọng Thu |
| Nền tảng | `giatoctrantrongthu.com` |
| Bản chất | Nền tảng số phục vụ đời sống, ký ức, tri thức và di sản của Gia tộc Trần Trọng Thu |
| Đối tượng ưu tiên | Thành viên trong dòng họ và người thân thuộc các gia đình liên quan |
| Mô hình tiếp cận ban đầu | Triển khai nội bộ, tương tự một private community |
| Định vị hướng ra ngoài | Người ngoài chỉ thấy một cánh cửa thông tin tối giản; chưa hướng đến công chúng ở giai đoạn đầu |

## 1.2. Mục đích

Nền tảng giúp các thế hệ:

- Nhận biết bản thân và nguồn cội.
- Hiểu các mối quan hệ gia đình và vị trí của mình trong dòng họ.
- Tiếp cận, gìn giữ và bổ sung ký ức, tư liệu, tri thức.
- Kết nối đời sống giữa các thành viên và các gia đình.
- Ghi nhận những người đã sống, đang sống và những đóng góp của họ.
- Tạo điều kiện để thế hệ sau tiếp tục nghiên cứu, chỉnh lý, bảo tồn hoặc phát triển di sản theo lựa chọn của họ.

Định vị làm việc đã hình thành trong phỏng vấn:

> giatoctrantrongthu.com là nơi các thế hệ nhận biết cội nguồn, gìn giữ ký ức, kết nối tri thức và tiếp nối di sản của Gia tộc Trần Trọng Thu.

Đây là định vị tổng hợp tạm thời, chưa phải tuyên ngôn thương hiệu cuối cùng.

## 1.3. Giá trị cốt lõi của trải nghiệm

1. **Nguồn cội:** Thành viên biết mình là ai và thuộc về đâu.
2. **Ký ức:** Con người và những gì họ để lại được ghi nhận.
3. **Quan hệ:** Gia đình và dòng họ được thể hiện qua các mối liên hệ có ý nghĩa.
4. **Tri thức:** Thành viên có thể đóng góp, nghiên cứu, trao đổi và phản biện.
5. **Liên thế hệ:** Nền tảng tạo điều kiện cho sự tiếp nối, không áp đặt thế hệ sau phải bảo tồn theo một cách duy nhất.
6. **Tính bền bỉ:** Giá trị nằm ở khả năng duy trì và làm giàu di sản qua nhiều thế hệ, không chỉ ở số lượng tính năng.

## 1.4. Nguyên tắc không được đánh đồng

- Gia phả là cấu trúc quan hệ; không phải toàn bộ đời sống gia tộc.
- Tư liệu là đối tượng lưu trữ và bằng chứng; không phải mọi câu chuyện đều tự động trở thành dữ kiện lịch sử.
- Ký ức là di sản tinh thần; không đồng nhất với dữ kiện đã xác minh.
- MẠCH là không gian tri thức; không phải toàn bộ kho tư liệu.
- Family Space là không gian đời sống của từng gia đình; không thay thế MẠCH.
- Không gian cá nhân không tự động trở thành tài sản nội dung chung.
- Thư gửi Clara là không gian độc lập, không phải module mặc nhiên mở cho toàn gia tộc.
- Tư cách thành viên, quan hệ huyết thống, quan hệ hôn nhân và quyền truy cập là các khái niệm khác nhau.

---

# 2. Đối tượng và mô hình tham gia

## 2.1. Nhóm đối tượng

| Nhóm | Vai trò trong sản phẩm | Trạng thái |
|---|---|---|
| A. Thành viên thuộc Gia tộc Trần Trọng Thu | Thành viên có vị trí trong phả hệ | `DECIDED` |
| B. Người thân trong các gia đình liên quan: vợ/chồng, con cái, con cháu, dâu/rể | Đối tượng tham gia chính; cộng đồng không chỉ giới hạn ở người có quan hệ huyết thống trực tiếp | `DECIDED` |
| C. Khách mời, chuyên gia, nhà nghiên cứu, người có tư liệu | Có thể được mời trong tương lai khi cần chuyên môn hoặc nguồn tư liệu | `OPEN / FUTURE` |

Quan hệ huyết thống, hôn nhân, hậu duệ và thân tộc mở rộng phải được biểu diễn rõ, không gom thành một loại quan hệ duy nhất.

## 2.2. Cánh cửa công khai

- Kênh triển khai ban đầu: người thân gửi đường dẫn qua Zalo, bài viết Facebook, hoặc giới thiệu trực tiếp.
- Người ngoài chỉ thấy phần giới thiệu ngắn gọn, tối giản về Gia tộc Trần Trọng Thu.
- Không công khai gia phả, hồ sơ cá nhân, tư liệu nội bộ hoặc nội dung thành viên.
- Sản phẩm hiện không nhắm đến người ngoài gia tộc; việc mở rộng đối tượng là giai đoạn sau.
- Bỏ hoàn toàn cách dẫn chuyện “một dòng dõi bình dân”.

`DECIDED`

## 2.3. Onboarding và xác minh thành viên

Tuấn đã định hướng kết hợp:
- Admin xác nhận trực tiếp từng người trước khi kích hoạt.
- Thành viên có thể đăng nhập bằng Google trước, sau đó cung cấp mã/thông tin để liên kết với hồ sơ đã tạo.

Emarald từng đề xuất quy trình tham chiếu:
1. Admin tạo hồ sơ thành viên trước.
2. Admin xác nhận đúng người.
3. Hệ thống tạo link/mã kích hoạt dùng một lần, có thời hạn.
4. Thành viên xác thực bằng Google Sign-In.
5. Hệ thống liên kết tài khoản Google với hồ sơ đã xác minh.
6. Thành viên hoàn thiện thông tin tài khoản.

**Trạng thái:** Ý tưởng kết hợp A/B đã được Tuấn nêu; quy trình chi tiết trên là `PROPOSED`, chưa được duyệt hoàn toàn.

Nguyên tắc bảo mật:
- Không dùng họ tên, tên cha mẹ hoặc dữ liệu gia đình làm mật khẩu mặc định.
- Google Sign-In chỉ xác thực tài khoản Google, không tự xác nhận tư cách thành viên.
- Cần phương án đăng nhập thay thế cho người không dùng Google.
- Authorization phải được thực thi ở server/API; không dựa vào ẩn/hiện giao diện.
- Database không được truy cập trực tiếp từ browser.
- Cần least privilege, quản lý session, audit log và account recovery.

---

# 3. Product Experience Architecture

## 3.1. Các không gian chính sau đăng nhập

| Không gian/module | Vai trò |
|---|---|
| Chào mừng / Home | Điểm bắt đầu, lời chào theo ngữ cảnh và gợi mở hoạt động |
| Gia phả | Nhận biết vị trí cá nhân và khám phá quan hệ |
| Hồ sơ cá nhân/người thân | Tập hợp thông tin, quan hệ, sự kiện, tư liệu và nguồn |
| Tư liệu dòng họ | Kho tư liệu chung có liên kết đa đối tượng và lịch sử đóng góp |
| MẠCH | Không gian tri thức được hình thành từ cộng đồng gia đình |
| Lịch | Nhắc đến thành viên, sự kiện và những người cần được nhớ đến |
| Tìm kiếm | Tìm kiếm xuyên toàn nền tảng |
| Khám phá các gia đình | Danh mục, hồ sơ và không gian sinh hoạt của từng gia đình |
| Không gian cá nhân | Nhật ký, sổ nghiên cứu và kho lưu trữ cá nhân |
| Thư gửi Clara | Không gian độc lập, giới hạn theo quyền gia đình Hạnh–Đào |

## 3.2. Mô hình trải nghiệm tổng quan

```text
CỬA THÔNG TIN CÔNG KHAI
        |
        v
DÀNH CHO THÀNH VIÊN
        |
        v
XÁC MINH / ĐĂNG NHẬP / LIÊN KẾT HỒ SƠ
        |
        v
KHÔNG GIAN THÀNH VIÊN
        |
        +-- Chào mừng / Home
        |
        +-- Gia phả
        |     +-- Vị trí của tôi
        |     +-- Quan hệ gần
        |     +-- Hồ sơ người thân
        |     +-- Mở rộng nhánh / toàn gia tộc
        |
        +-- Tư liệu dòng họ
        |     +-- Kho tư liệu
        |     +-- Liên kết người / gia đình / sự kiện / địa điểm / MẠCH
        |     +-- Tag / đóng góp / lịch sử
        |
        +-- MẠCH
        |     +-- Đọc
        |     +-- Viết / gửi bài
        |     +-- Bình luận / phản biện
        |     +-- Biên tập theo vai trò
        |
        +-- Lịch
        |
        +-- Tìm kiếm toàn nền tảng
        |
        +-- Khám phá các gia đình
        |
        +-- Không gian cá nhân
        |
        +-- Thư gửi Clara (phân quyền độc lập)
```

Sơ đồ là kiến trúc khái niệm, chưa phải sitemap hoặc luồng UI đã nghiệm thu.

---

# 4. Touchpoint Register — TP-001 đến TP-030

## TP-001 — Cánh cửa thông tin công khai
**Trạng thái:** `DECIDED`

- Triển khai ban đầu trong nội bộ, tương tự private group.
- Người thân gửi link qua Zalo, Facebook hoặc giới thiệu trực tiếp.
- Người ngoài chỉ thấy một cánh cửa thông tin tối giản giới thiệu ngắn về Gia tộc Trần Trọng Thu.
- Không công khai nội dung nội bộ.
- Ưu tiên thành viên dòng họ; đối tượng ngoài gia tộc là giai đoạn sau.
- Bỏ cách diễn đạt “một dòng dõi bình dân”.

## TP-002 — Dành cho thành viên / onboarding
**Trạng thái:** `DECIDED — định hướng kết hợp`; `PROPOSED — quy trình chi tiết`

- Có điểm vào “Dành cho thành viên”.
- Có thể sử dụng mã mời/mã liên kết.
- Admin xác nhận trực tiếp người dùng trước khi kích hoạt.
- Thành viên có thể đăng nhập Google rồi liên kết với hồ sơ đã tạo.
- Cần phân biệt mã mời, xác thực danh tính tài khoản và xác minh tư cách thành viên.
- Không dùng dữ liệu gia đình làm mật khẩu mặc định.
- Quy trình kích hoạt cụ thể vẫn cần duyệt.

## TP-003 — Quyền thành viên và quản trị gia phả
**Trạng thái:** `DECIDED — PROVISIONAL GOVERNANCE MODEL`

- Vị trí của mỗi người trong dòng họ đã được xác lập.
- Thành viên được đề xuất bổ sung/đính chính/thay đổi; không tự ý sửa dữ liệu chính danh.
- Quy trình: Đề xuất → Tiếp nhận → Thẩm định → Phê duyệt → Cập nhật chính thức.
- Ghi lịch sử ai đề xuất, ai thẩm định/phê duyệt và dữ liệu thay đổi.
- Người quản trị nền tảng tối cao là đích tôn/người thừa kế chính danh theo mô hình tạm thời.
- Nhóm quản trị hỗ trợ người quản trị nền tảng.
- Có phân cấp vai trò theo nhánh; cấp nhánh xác nhận trước, quản trị trung tâm phê duyệt cuối.
- Người phụ trách nhánh hỗ trợ xác minh và tiếp nhận đề xuất.
- Người nắm quyền hiện tại chỉ định người kế thừa; nguyên tắc đích tôn được ưu tiên xác lập.
- Quyền kế thừa quản trị không đồng nghĩa khôi phục quyền lực xã hội của trật tự gia tộc cũ.
- Cơ chế kế nhiệm chi tiết vẫn `OPEN`.

## TP-004 — Không gian thành viên sau đăng nhập
**Trạng thái:** `DECIDED`

Các module được Tuấn nêu:
- Lời chào mừng.
- Lịch.
- MẠCH.
- Tìm kiếm.
- Tư liệu dòng họ.
- Khám phá các gia đình.
- Không gian ghi chép riêng tư.
- Gia phả và thông tin quan hệ mà thành viên mặc nhiên có quyền biết.

Đây là không gian đời sống chung của gia tộc, không phải trang quản lý tài khoản.

## TP-005 — Lời chào, lời nhắc và giọng kể
**Trạng thái:** `DECIDED`

- Lời chào gợi cảm giác thành viên trở về, không phải thông điệp hệ thống khô cứng.
- Lời chào thay đổi theo ngữ cảnh/lần trở lại; tham khảo cách Duolingo thay đổi thông điệp nhưng không gamification.
- Ưu tiên sự kiện quan trọng, thông tin liên quan trực tiếp, hoạt động gia đình, gợi ý khám phá rồi mới đến lời chào luân phiên.
- Tương tác nhẹ, không phô trương; cảm giác bước vào nhà.
- Chủ thể biểu tượng có sắc thái tiền nhân nhưng không giả danh một tiền nhân cụ thể.
- Kết hợp giọng dẫn chuyện trung tính và sắc thái tiền nhân trong một số ngữ cảnh.
- Trích dẫn lời tiền nhân phải có nguồn; lời dẫn biên soạn phải được nhận diện là lời dẫn biểu tượng.
- Không biến nền tảng thành “chùa online” hoặc từ đường ảo; không thay thế chức năng thờ tự.

## TP-006 — Định vị giá trị / sức bền / truyền đời
**Trạng thái:** `DECIDED — định hướng giá trị`; `PROPOSED — câu định vị`

- Giá trị đáng học hỏi ở FamilySearch là tính bền bỉ và khả năng duy trì công việc gia phả qua thế hệ.
- Điều chỉnh phù hợp với Công giáo và tín ngưỡng bản địa Việt Nam; không ép các truyền thống thành một hệ tư tưởng duy nhất.
- Giá trị thế hệ sau nhận được: biết nguồn cội; hiểu trải nghiệm thế hệ trước; có trách nhiệm với quan hệ/ký ức/di sản; có nền tảng để tiếp tục bổ sung và nghiên cứu.
- Không áp đặt cách thế hệ sau phải bảo tồn, kế thừa hay phát triển.

## TP-007 — Đóng góp tư liệu và tri thức
**Trạng thái:** `DECIDED`

Ba hình thức đóng góp:
1. Kho tư liệu chung: ảnh, tài liệu, hiện vật số.
2. MẠCH: câu chuyện, ký ức, góc nhìn, tri thức.
3. Đề xuất dữ kiện: bổ sung/đính chính phả hệ theo quy trình xác minh.

Hệ thống phải hướng dẫn thành viên chọn đúng loại đóng góp. Một câu chuyện không tự động trở thành dữ kiện lịch sử chính thức.

## TP-008 — Mô hình biên tập MẠCH
**Trạng thái:** `DECIDED`

- Mô hình Hybrid Editorial.
- Thành viên thông thường gửi bài qua biên tập trước khi xuất bản.
- Thành viên được phân quyền có thể đăng trực tiếp trong phạm vi được giao.
- Ban biên tập duy trì tiêu chuẩn, chất lượng và xử lý khiếu nại.
- Quyền biên tập phát sinh từ trách nhiệm/năng lực được giao, không mặc nhiên từ thứ bậc huyết thống.

## TP-009 — Đối tượng tham gia MẠCH
**Trạng thái:** `DECIDED`

- Thành viên gia tộc và người thân trong các gia đình liên quan là nhóm tham gia trước mắt.
- Trọng tâm là nhóm B: vợ/chồng, con cái, con cháu, dâu/rể và người thân.
- Khách mời/chuyên gia/nhà nghiên cứu có thể được mời trong tương lai.
- Không giới hạn cộng đồng chỉ ở quan hệ huyết thống.

## TP-010 — Định vị và phạm vi MẠCH
**Trạng thái:** `DECIDED`

- MẠCH không giới hạn lĩnh vực tri thức.
- Có thể bao gồm lịch sử, văn hóa, xã hội, giáo dục, khoa học, công nghệ, triết học, nghệ thuật, đời sống...
- Định vị: không gian tri thức được hình thành từ cộng đồng gia đình.
- Không phải mạng xã hội đại trà và không chỉ là diễn đàn gia đình.

## TP-011 — Hệ thống phân loại tri thức MẠCH
**Trạng thái:** `DECIDED — PROVISIONAL`

- Phân loại đa chiều nhưng cần một điểm neo nhận thức.
- Chủ đề là chiều phân loại chính.
- Hình thức nội dung là chiều bổ trợ.
- Chỉ thêm chiều phân loại khác khi có nhu cầu thực tế.
- Không bắt thành viên phải hiểu taxonomy mới có thể viết bài.
- Taxonomy chi tiết chưa được chốt.

## TP-012 — Quyền đọc MẠCH
**Trạng thái:** `DECIDED`

- Thành viên cộng đồng được đọc toàn bộ bài viết MẠCH.
- Quyền đọc không đồng nghĩa quyền viết/biên tập.
- Quyền đọc MẠCH không mở quyền truy cập tư liệu riêng tư, dữ liệu gia phả giới hạn hoặc Clara.

## TP-013 — Bình luận và đối thoại MẠCH
**Trạng thái:** `DECIDED`

- Bình luận hiển thị trực tiếp.
- Quản trị hậu kiểm, có báo cáo vi phạm và quy tắc ứng xử.
- Không kiểm duyệt trước mọi bình luận.
- Cho phép bất đồng, phản biện, chất vấn có trách nhiệm.
- Người phát biểu chịu trách nhiệm với lời nói và hình ảnh của mình trong cộng đồng.

## TP-014 — Lập ngôn, lập thân và quyền tài phán
**Trạng thái:** `DECIDED — PRINCIPLE`; `OPEN — FUTURE GOVERNANCE`

- “Lập ngôn” gắn với “lập thân”: trọng lời nói, suy nghĩ trước khi phát biểu và chịu trách nhiệm.
- MẠCH là nền tảng hình thành văn hóa suy nghĩ và đối thoại có trách nhiệm, không phải cuộc đua số lượng bài viết/tương tác.
- Quyền tài phán đối với giatoctrantrongthu.com thuộc về hậu duệ của Tuấn trên các phương diện chính danh, quản trị, biên tập, di sản, công nghệ, tài sản và tương lai.
- Không đồng nghĩa mọi thành viên có quyền quyết định ngang nhau.
- Thế hệ sau có quyền bất đồng với người sáng lập và tự quyết cách bảo tồn/kế thừa/phát triển.
- Cơ chế bảo đảm tính liên tục và quyền tự quyết là câu hỏi mở, không áp đặt lời giải hiện tại.

## TP-015 — Quan hệ MẠCH publication và MẠCH trực tuyến
**Trạng thái:** `DECIDED — UPDATED UNDERSTANDING`

- MẠCH ban đầu là ý tưởng tập san cho dòng họ; Tuấn dự kiến làm chủ biên và tác giả các bài nghiên cứu/khảo cứu.
- Khi chọn nền tảng online/web, hướng triển khai thay đổi.
- MẠCH giữ lại giá trị cốt lõi; hình thức xuất bản thay đổi.
- MẠCH vẫn là nơi Tuấn ghi nhận các mối quan tâm về văn hóa dòng họ, lịch sử chung và lịch sử gia tộc.
- Đây là tuyến nội dung sâu; ưu tiên trước mắt là hình thành khung sản phẩm giatoctrantrongthu.com.
- Không coi MẠCH online là một tập san cũ được bê nguyên lên web.
- Không gộp máy móc mô hình publication cũ vào toàn bộ mô hình cộng đồng mới.
- MẠCH trực tuyến là không gian tri thức cộng đồng; tuyến nghiên cứu/khảo cứu chuyên sâu là một hướng nội dung quan trọng bên trong MẠCH, sẽ phát triển theo giai đoạn.

## TP-016 — Điểm xuất phát của hành trình gia phả
**Trạng thái:** `DECIDED — A`

- Lấy cá nhân làm điểm xuất phát.
- Thành viên nhìn thấy vị trí của mình, quan hệ gần trước, rồi mở rộng ra gia đình, nhánh và toàn gia tộc.
- Không bắt thành viên hiểu toàn bộ cây trước khi tìm được vị trí của mình.

## TP-017 — Cấu trúc hồ sơ cá nhân
**Trạng thái:** `DECIDED — C / REFERENCE FAMILYSEARCH`

- Hồ sơ đầy đủ, phân lớp thông tin.
- Học hỏi FamilySearch Person Page, không sao chép nguyên trạng.
- Các lớp có thể gồm thông tin cơ bản, tiểu sử, sự kiện, timeline/map, quan hệ, nguồn, tư liệu, ảnh, câu chuyện, ghi chú/thảo luận và lịch sử thay đổi.
- Mọi lớp thông tin phải tuân theo quyền riêng tư và quyền truy cập.

## TP-018 — Tổ chức và liên kết tư liệu
**Trạng thái:** `DECIDED — C`

- Tư liệu là đối tượng độc lập trong kho chung.
- Một tư liệu có thể liên kết với nhiều người, gia đình/nhánh, sự kiện, địa điểm, bài viết MẠCH và tư liệu liên quan.
- Học hỏi FamilySearch về Person Tags và Topic Tags.
- Đề xuất thêm Event/Place Tags và Collections/Albums là hướng nghiên cứu, chưa phải đặc tả đã duyệt.
- Tag không tự xác lập quan hệ huyết thống.

## TP-019 — Ai được quyền gắn tag?
**Trạng thái:** `DECIDED — C`

- Thành viên có thể đề xuất/gắn tag.
- Có cơ chế người quản lý tư liệu xác nhận trước khi tag được áp dụng chính thức theo mô hình đã chọn.
- Tham khảo Facebook về trải nghiệm tag xã hội và FamilySearch về liên kết tag với hồ sơ người trong cây.
- Chi tiết có thể khác theo loại tag và phạm vi chia sẻ; chưa chốt UI/flow.

## TP-020 — Quyền riêng tư của người còn sống trong tư liệu
**Trạng thái:** `DECIDED — B + C`

- Người xuất hiện trong ảnh/tư liệu có quyền đồng thuận trước khi nội dung được chia sẻ trong phạm vi cộng đồng theo nguyên tắc Tuấn chọn.
- Người xuất hiện có quyền yêu cầu giới hạn phạm vi hiển thị hoặc gỡ tư liệu.
- Người tải lên không mặc nhiên có quyền phủ quyết quyền riêng tư của người liên quan.
- Cần làm rõ các trường hợp trẻ vị thành niên, người mất năng lực tự quyết, người đã mất, tranh chấp và yêu cầu gỡ bỏ: `OPEN`.

## TP-021 — Quyền chia sẻ tư liệu
**Trạng thái:** `DECIDED — Người đăng chủ động chọn phạm vi`

- Người đăng có quyền lựa chọn phạm vi chia sẻ như mô hình Facebook.
- Các mức tham chiếu: chỉ mình tôi; phạm vi gia đình; cộng đồng gia tộc; công khai.
- Có thể thay đổi phạm vi sau khi đăng và thu hồi quyền chia sẻ.
- Quyền của người đăng phải cùng tồn tại với quyền riêng tư của người xuất hiện/được đề cập trong tư liệu.
- Danh sách phạm vi và cách biểu diễn quyền cuối cùng cần thiết kế/kiểm thử.

## TP-022 — Quyền tương tác với tư liệu
**Trạng thái:** `DECIDED — C`

Thành viên có thể:
- Xem theo quyền được cấp.
- Bình luận, bày tỏ cảm xúc.
- Chia sẻ nếu người đăng cho phép.
- Đề xuất Person Tags, Topic Tags.
- Đề xuất bổ sung thông tin.
- Đề xuất liên kết tư liệu với người, gia đình, sự kiện, địa điểm.

Đề xuất không tự động thay đổi dữ liệu chính thức.

## TP-023 — Lịch sử và nguồn gốc tư liệu
**Trạng thái:** `DECIDED — C / REFERENCE FAMILYSEARCH`

Lưu lịch sử đóng góp và thay đổi:
- Người tải lên.
- Người bổ sung nội dung.
- Người gắn tag.
- Người đề xuất liên kết.
- Người xác nhận.
- Thời điểm, lý do, nội dung trước/sau thay đổi.
- Nguồn tham chiếu và khả năng khôi phục khi phù hợp.

Tham khảo các pattern FamilySearch: Latest Changes, contributor identity, reason statements, sources, restore và theo dõi đóng góp.

## TP-024 — Xử lý bất đồng về tư liệu và dữ kiện
**Trạng thái:** `DECIDED — C`

- Bảo toàn các nhận định, lập luận và bằng chứng khác nhau.
- Người có thẩm quyền quyết định trạng thái dữ kiện chính thức.
- Không xóa lịch sử bất đồng.
- Ghi lại quyết định, người quyết định, lý do và bằng chứng được xem xét.
- Phân biệt dữ kiện xác minh, nhận định có căn cứ và vấn đề chưa thể kết luận.

## TP-025 — Trạng thái thông tin trong gia phả
**Trạng thái:** `DECIDED — C`

- Thông tin đã xác lập hiển thị trong cây.
- Thông tin chưa xác minh vẫn có thể xuất hiện trong hồ sơ.
- Phải hiển thị trạng thái, nguồn và mức độ chắc chắn phù hợp.
- Trạng thái tham chiếu: đã xác minh; chưa xác minh; đang nghiên cứu; có tranh chấp; chưa xác định.
- Không biến thiếu hụt bằng chứng thành sự chắc chắn giả tạo.

## TP-026 — Lịch gia tộc
**Trạng thái:** `DECIDED — D`; `EXISTING PRODUCT AREA — NOT VERIFIED`

- Bao gồm giỗ chạp/ngày mất/tưởng niệm; sinh nhật/ngày cưới/kỷ niệm; họp mặt/lễ Tết/hoạt động chung; sự kiện khác do thành viên đóng góp.
- Giá trị cốt lõi: “Lịch là nơi nhắc về các thành viên, là nơi để mọi người được nhắc đến, được nhớ đến.”
- Tuấn cho biết module Lịch đã làm xong và đang còn trong bản triển khai tại `www.giatoctrantrongthu.vercel.app`.
- Chưa audit hoặc xác minh giao diện/runtime hiện tại trong phiên này.
- Không yêu cầu xây dựng lại; cần inspect/review trước khi đề xuất thay đổi.

## TP-027 — Tìm kiếm toàn nền tảng
**Trạng thái:** `DECIDED — E`

- Một Global Search chung.
- Tìm người/quan hệ gia phả, tư liệu, MẠCH, sự kiện Lịch, gia đình/nhánh.
- Kết quả phân loại theo loại nội dung.
- Có bộ lọc và khả năng thu hẹp kết quả.
- Hiển thị liên kết giữa các kết quả liên quan.
- Chỉ trả về nội dung người dùng có quyền truy cập.

## TP-028 — Khám phá các gia đình
**Trạng thái:** `DECIDED — D`

Ba lớp:
1. Family Directory: danh mục gia đình/nhánh.
2. Family Profile: thế hệ, thành viên, hình ảnh, câu chuyện, tư liệu và dấu mốc.
3. Family Space: không gian sinh hoạt, chia sẻ và lưu giữ ký ức của từng gia đình.

Family Space không thay thế MẠCH. MẠCH là không gian tri thức chung; Family Space tập trung vào đời sống của từng gia đình.

## TP-029 — Không gian ghi chép riêng tư
**Trạng thái:** `DECIDED — D`

Kết hợp:
1. Personal Journal — nhật ký cá nhân.
2. Research Notes — sổ nghiên cứu gia phả/nguồn/giả thuyết/câu hỏi.
3. Personal Archive — kho ảnh, tài liệu, đường dẫn và nội dung cá nhân.

Nguyên tắc:
- Mặc định chỉ chủ sở hữu truy cập.
- Chủ sở hữu chủ động chia sẻ.
- Không tự động chuyển thành tư liệu chung, bài MẠCH hoặc dữ kiện gia phả chính thức.

## TP-030 — Ranh giới quyền truy cập
**Trạng thái:** `DECIDED — APPROVED`

| Không gian | Nguyên tắc truy cập |
|---|---|
| Gia phả | Theo tư cách thành viên và quan hệ gia đình |
| Tư liệu dòng họ | Theo quyền chia sẻ của người đóng góp và quyền riêng tư của người liên quan |
| MẠCH | Thành viên cộng đồng được đọc toàn bộ; quyền viết/biên tập theo vai trò |
| Family Space | Theo tư cách thành viên của từng gia đình |
| Không gian cá nhân | Mặc định riêng tư; chủ sở hữu quyết định chia sẻ |
| Thư gửi Clara | Không gian độc lập, chỉ nhóm được gia đình Hạnh–Đào cho phép |

Các ranh giới phải được bảo đảm ở tầng phân quyền và dữ liệu, không chỉ bằng ẩn/hiện giao diện.

---

# 5. User Journey Map — Các luồng trải nghiệm chính

Các luồng dưới đây là bản đồ mức khái niệm, được suy ra từ các quyết định TP. Chưa phải wireflow hoặc prototype đã được nghiệm thu.

## J-01 — Người thân nhận lời mời và trở thành thành viên

| Bước | Trải nghiệm | Hệ thống cần hỗ trợ |
|---|---|---|
| 1 | Nhận link qua Zalo/Facebook/giới thiệu trực tiếp | Cửa thông tin công khai tối giản |
| 2 | Chọn “Dành cho thành viên” | Điểm vào onboarding |
| 3 | Xác thực tài khoản | Google Sign-In hoặc phương thức thay thế |
| 4 | Cung cấp mã/thông tin liên kết | Liên kết với hồ sơ thành viên đã được tạo |
| 5 | Admin xác nhận | Quy trình xác minh và kích hoạt |
| 6 | Hoàn thiện tài khoản | Tên hiển thị và thông tin cần thiết |
| 7 | Vào không gian thành viên | Home và các module theo quyền |

`PROPOSED`: flow chi tiết, cơ chế invitation, recovery và xử lý ngoại lệ.

## J-02 — Thành viên khám phá gia phả từ chính mình

| Bước | Trải nghiệm |
|---|---|
| 1 | Mở Gia phả |
| 2 | Thấy hồ sơ/vị trí của chính mình |
| 3 | Khám phá cha mẹ, anh chị em |
| 4 | Mở rộng lên ông bà/tổ tiên |
| 5 | Khám phá con cái/hậu duệ |
| 6 | Mở rộng ra nhánh và toàn gia tộc |
| 7 | Mở hồ sơ người thân để xem thông tin, quan hệ, tư liệu và nguồn |

Nguyên tắc: cá nhân là điểm neo; không bắt đầu bằng một sơ đồ toàn gia tộc quá lớn.

## J-03 — Thành viên phát hiện sai/thiếu thông tin gia phả

1. Mở hồ sơ người.
2. Nhận thấy dữ kiện sai/thiếu/chưa rõ.
3. Gửi đề xuất bổ sung/đính chính.
4. Đính kèm nguồn hoặc giải thích.
5. Theo dõi trạng thái.
6. Cấp nhánh hỗ trợ xác minh.
7. Quản trị trung tâm phê duyệt cuối.
8. Dữ liệu chính thức được cập nhật; lịch sử và bằng chứng được lưu.

Không cho phép tự ý sửa dữ liệu chính danh.

## J-04 — Đóng góp một tư liệu vào kho chung

1. Thành viên chọn đóng góp.
2. Hệ thống hướng dẫn phân loại: tư liệu chung, câu chuyện MẠCH hay đề xuất dữ kiện.
3. Người đăng mô tả nguồn gốc, bối cảnh và quyền chia sẻ.
4. Nếu có người còn sống xuất hiện/được đề cập, xử lý quyền đồng thuận và riêng tư.
5. Tư liệu được lưu thành đối tượng độc lập.
6. Có thể liên kết nhiều người, gia đình, sự kiện, địa điểm và nội dung.
7. Thành viên đề xuất tag/liên kết bổ sung.
8. Người quản lý tư liệu xác nhận theo quy trình.
9. Lịch sử đóng góp và thay đổi được ghi nhận.

## J-05 — Xem, tương tác và đóng góp vào tư liệu người khác

1. Thành viên tìm thấy tư liệu trong kho hoặc hồ sơ người.
2. Hệ thống kiểm tra quyền truy cập.
3. Thành viên xem, bình luận, bày tỏ cảm xúc hoặc chia sẻ nếu được phép.
4. Có thể đề xuất tag, bổ sung thông tin hoặc liên kết.
5. Người quản lý/người có thẩm quyền xem xét đề xuất.
6. Hệ thống ghi nhận người đề xuất, người xác nhận và kết quả.

## J-06 — Bất đồng về một dữ kiện lịch sử

1. Thành viên phát hiện dữ kiện có vấn đề.
2. Gửi nhận định và bằng chứng.
3. Hệ thống lưu các nhận định khác nhau.
4. Trạng thái dữ kiện được thể hiện rõ: xác minh/chưa xác minh/đang nghiên cứu/tranh chấp/chưa xác định.
5. Người có thẩm quyền quyết định trạng thái dữ kiện chính thức.
6. Lịch sử bất đồng, bằng chứng và quyết định được giữ lại.

## J-07 — MẠCH: đọc, viết và đối thoại

- Thành viên đọc toàn bộ nội dung MẠCH.
- Thành viên thông thường gửi bài qua quy trình biên tập.
- Người được phân quyền có thể đăng trực tiếp trong phạm vi được giao.
- Bình luận hiển thị trực tiếp; quản trị hậu kiểm.
- Thành viên được phản biện và bất đồng có trách nhiệm.
- Nội dung chuyên sâu về văn hóa dòng họ/lịch sử chung/lịch sử gia tộc là tuyến nội dung quan trọng, nhưng không phải điều kiện để toàn bộ MẠCH vận hành như một tập san.

## J-08 — Lịch: được nhắc đến và được nhớ đến

- Thành viên xem các sự kiện liên quan.
- Lịch có thể nhắc giỗ, ngày mất, sinh nhật, ngày cưới, kỷ niệm, họp mặt và hoạt động chung.
- Thành viên có thể đóng góp sự kiện.
- Giá trị trung tâm là ghi nhận con người và những ngày có ý nghĩa.
- Module hiện hữu cần được review, không xây lại khi chưa kiểm tra.

## J-09 — Khám phá các gia đình

1. Mở danh mục gia đình.
2. Chọn gia đình/nhánh.
3. Xem hồ sơ gia đình và các thế hệ.
4. Khám phá thành viên, hình ảnh, câu chuyện và tư liệu.
5. Vào Family Space nếu có quyền.
6. Chia sẻ và lưu giữ ký ức trong phạm vi gia đình.

## J-10 — Ghi chép riêng tư

- Thành viên mở không gian cá nhân.
- Tạo nhật ký, research note hoặc lưu trữ cá nhân.
- Nội dung mặc định riêng tư.
- Chủ sở hữu có thể chủ động chia sẻ.
- Không tự động chuyển thành dữ kiện, tư liệu chung hoặc bài MẠCH.

## J-11 — Tìm kiếm toàn nền tảng

- Thành viên nhập một truy vấn tại Global Search.
- Hệ thống tìm trên các miền nội dung được phép.
- Kết quả được nhóm theo người, quan hệ, tư liệu, MẠCH, Lịch và gia đình.
- Có bộ lọc.
- Không tiết lộ sự tồn tại hoặc nội dung mà người dùng không có quyền truy cập.

## J-12 — Clara

- Clara là không gian độc lập.
- Chỉ nhóm được gia đình Hạnh–Đào cho phép có quyền truy cập.
- Tư cách thành viên gia tộc không tự động cấp quyền Clara.
- Không chia sẻ chéo dữ liệu Clara sang các không gian khác nếu chưa được cho phép.

---

# 6. Information Architecture — Cấu trúc thông tin sơ bộ

## 6.1. Public Layer

- Giới thiệu ngắn về Gia tộc Trần Trọng Thu.
- Điểm vào “Dành cho thành viên”.
- Không hiển thị nội dung nội bộ.

## 6.2. Member Layer

- Home / Chào mừng
- Gia phả
  - Vị trí của tôi
  - Hồ sơ người
  - Quan hệ
  - Nhánh gia đình
- Tư liệu dòng họ
  - Kho tư liệu
  - Tư liệu theo người
  - Tư liệu theo gia đình
  - Tư liệu theo sự kiện/địa điểm
  - Tag và liên kết
  - Lịch sử đóng góp
- MẠCH
  - Chủ đề
  - Bài viết
  - Gửi bài
  - Bình luận/thảo luận
  - Biên tập
- Lịch
- Tìm kiếm
- Khám phá các gia đình
  - Danh mục
  - Hồ sơ gia đình
  - Family Space
- Không gian cá nhân
  - Nhật ký
  - Sổ nghiên cứu
  - Kho lưu trữ
- Clara (route/space riêng, authorization độc lập)

Cấu trúc chi tiết của Global Navigation, thứ tự module và các màn hình con vẫn cần đối chiếu Product Baseline/Vibecode Lab.

---

# 7. Interaction Model

## 7.1. Đề xuất và phê duyệt

Các loại dữ liệu chính danh và liên kết cần xác minh sử dụng mô hình:

`Đề xuất → Tiếp nhận → Thẩm định → Phê duyệt → Cập nhật chính thức`

Các hành động cộng đồng như bình luận MẠCH không cần đưa qua cùng workflow phê duyệt trước; áp dụng hậu kiểm theo TP-013.

## 7.2. Các loại hành động

| Hành động | Quy tắc |
|---|---|
| Xem | Theo quyền truy cập |
| Tải tư liệu | Theo quyền đóng góp và quyền riêng tư |
| Chọn phạm vi chia sẻ | Người đăng chủ động, trong ranh giới quyền của người liên quan |
| Bình luận MẠCH | Hiển thị trực tiếp, hậu kiểm |
| Bình luận tư liệu | Theo quyền và quy tắc cộng đồng |
| Gắn tag | Đề xuất và xác nhận |
| Liên kết tư liệu | Đề xuất và xác nhận khi ảnh hưởng dữ liệu chính thức |
| Sửa dữ kiện gia phả | Không sửa trực tiếp; gửi đề xuất |
| Phê duyệt dữ kiện | Theo cơ cấu quản trị |
| Chia sẻ nội dung cá nhân | Chủ sở hữu quyết định |
| Truy cập Clara | Theo allowlist/ủy quyền độc lập |

## 7.3. Tagging Model — định hướng

| Loại | Mục đích | Tham chiếu |
|---|---|---|
| Person Tag | Nhận diện người trong ảnh/tư liệu và liên kết hồ sơ | FamilySearch + Facebook |
| Topic Tag | Chủ đề của tư liệu | FamilySearch |
| Event/Place Tag | Liên kết sự kiện/địa điểm | `PROPOSED` |
| Collection/Album | Tập hợp tư liệu theo ngữ cảnh | Tham chiếu FamilySearch |

Không được dùng tag để thay thế quan hệ phả hệ chính thức.

---

# 8. Permission Model — Nguyên tắc phân quyền

## 8.1. Ranh giới đã được duyệt

| Không gian | Quyền truy cập |
|---|---|
| Gia phả | Theo tư cách thành viên và quan hệ gia đình |
| Tư liệu dòng họ | Theo quyền chia sẻ của người đóng góp và quyền riêng tư của người liên quan |
| MẠCH | Thành viên cộng đồng đọc toàn bộ; quyền viết/biên tập theo vai trò |
| Family Space | Theo tư cách thành viên của từng gia đình |
| Không gian cá nhân | Mặc định riêng tư; chủ sở hữu quyết định chia sẻ |
| Clara | Không gian độc lập, chỉ nhóm được gia đình Hạnh–Đào cho phép |

## 8.2. Vai trò khái niệm

Các vai trò dưới đây tổng hợp từ quyết định Tuấn; ma trận quyền cụ thể vẫn cần thiết kế.

| Vai trò | Trách nhiệm/quyền khái niệm |
|---|---|
| Thành viên | Xem nội dung theo quyền; đóng góp; gửi đề xuất |
| Người đóng góp tư liệu | Tải lên và chọn phạm vi chia sẻ |
| Người liên quan trong tư liệu | Quyền riêng tư; yêu cầu giới hạn/gỡ |
| Người phụ trách gia đình/nhánh | Hỗ trợ xác minh và tiếp nhận đề xuất trong phạm vi nhánh |
| Ban biên tập MẠCH | Biên tập, duy trì tiêu chuẩn và xử lý nội dung |
| Contributor/Editor được phân quyền | Đăng trực tiếp trong phạm vi chuyên mục/lĩnh vực được giao |
| Quản trị viên nền tảng | Quản trị vận hành theo quyền được giao |
| Người quản trị nền tảng tối cao | Quyền quyết định chính thức theo mô hình quản trị tạm thời |
| Nhóm được Clara cho phép | Truy cập Clara theo ủy quyền riêng |

## 8.3. Security principles

- Deny by default đối với không gian riêng tư.
- Authorization phía server/API, không chỉ dựa vào frontend.
- Least privilege.
- Tách xác thực tài khoản khỏi xác minh tư cách thành viên.
- Tách vai trò huyết thống khỏi quyền biên tập/quản trị.
- Tách quyền chia sẻ của người đăng khỏi quyền riêng tư của người xuất hiện.
- Clara có policy riêng.
- Audit log cho hành động nhạy cảm.
- Có cơ chế thu hồi quyền, xử lý yêu cầu gỡ và account recovery.
- Không để Global Search làm rò rỉ dữ liệu qua snippet, metadata hoặc kết quả gợi ý.

**Lưu ý:** Đây là nguyên tắc sản phẩm/bảo mật. Chưa phải policy ReBAC/ABAC hoặc ma trận authorization đã triển khai.

---

# 9. Editorial & Community Principles

## 9.1. MẠCH

- Không gian tri thức được hình thành từ cộng đồng gia đình.
- Không giới hạn lĩnh vực.
- Có điểm neo phân loại chủ đề; hình thức nội dung là chiều bổ trợ.
- Thành viên được đọc toàn bộ nội dung MẠCH.
- Quyền viết và biên tập theo vai trò.
- Mô hình biên tập kết hợp.
- Bình luận hiển thị trực tiếp, quản trị hậu kiểm.
- Khuyến khích bất đồng có lý lẽ và trách nhiệm.
- “Lập ngôn” gắn với “lập thân”: trọng lời nói và chịu trách nhiệm.
- Tuyến nghiên cứu/khảo cứu chuyên sâu của Tuấn về văn hóa dòng họ, lịch sử chung và lịch sử gia tộc được giữ lại; triển khai theo giai đoạn sau khi khung sản phẩm hoàn chỉnh.

## 9.2. Documentary & Knowledge Integrity

- Phân biệt dữ kiện, ký ức, nhận định, giả thuyết và câu chuyện.
- Một câu chuyện không tự động trở thành dữ kiện chính thức.
- Mọi dữ kiện quan trọng nên có nguồn hoặc giải thích lý do.
- Giữ lịch sử thay đổi và bất đồng.
- Không xóa dấu vết nhận thức chỉ vì dữ kiện chính thức đã được cập nhật.
- Không biến điều chưa biết thành kết luận chắc chắn.

## 9.3. Community Conduct

- Thành viên có thể bất đồng, phản biện và chất vấn.
- Không kiểm duyệt trước mọi bình luận MẠCH.
- Có quy tắc ứng xử, báo cáo và hậu kiểm.
- Tự do phát biểu đi cùng trách nhiệm cá nhân.
- Không biến sự thận trọng thành sợ phát biểu.

---

# 10. Decision Register — Tổng hợp quyết định

| ID | Quyết định | Trạng thái |
|---|---|---|
| DEC-01 | Public entry tối giản, ưu tiên thành viên | `DECIDED` |
| DEC-02 | Onboarding kết hợp xác minh trực tiếp và liên kết tài khoản | `DECIDED — direction`; detail `OPEN` |
| DEC-03 | Dữ liệu gia phả chính danh chỉ đổi qua đề xuất/phê duyệt | `DECIDED` |
| DEC-04 | Quản trị trung tâm và xác minh cấp nhánh | `DECIDED — provisional` |
| DEC-05 | Kế thừa quản trị theo chỉ định, ưu tiên nguyên tắc đích tôn | `DECIDED — provisional` |
| DEC-06 | Home là không gian đời sống thành viên, không chỉ account dashboard | `DECIDED` |
| DEC-07 | Lời chào theo ngữ cảnh, không giả danh tiền nhân cụ thể | `DECIDED` |
| DEC-08 | Định vị giá trị về nguồn cội, ký ức, tri thức và tiếp nối | `DECIDED — direction` |
| DEC-09 | Ba hình thức đóng góp: kho tư liệu, MẠCH, đề xuất dữ kiện | `DECIDED` |
| DEC-10 | MẠCH dùng Hybrid Editorial Model | `DECIDED` |
| DEC-11 | Đối tượng chính gồm thành viên và người thân các gia đình liên quan | `DECIDED` |
| DEC-12 | MẠCH là không gian tri thức rộng, không giới hạn lĩnh vực | `DECIDED` |
| DEC-13 | Phân loại đa chiều có điểm neo chủ đề | `DECIDED — provisional` |
| DEC-14 | Thành viên đọc toàn bộ MẠCH | `DECIDED` |
| DEC-15 | Bình luận MẠCH hiển thị trực tiếp, hậu kiểm | `DECIDED` |
| DEC-16 | Quyền tài phán thuộc hậu duệ; thế hệ sau có quyền tự quyết | `DECIDED — principle`; mechanism `OPEN` |
| DEC-17 | MẠCH giữ giá trị cốt lõi, hình thức xuất bản thay đổi theo web | `DECIDED` |
| DEC-18 | Gia phả lấy cá nhân làm điểm xuất phát | `DECIDED` |
| DEC-19 | Hồ sơ người đầy đủ, phân lớp, tham chiếu FamilySearch | `DECIDED` |
| DEC-20 | Tư liệu là đối tượng độc lập, liên kết đa đối tượng | `DECIDED` |
| DEC-21 | Thành viên đề xuất tag, người quản lý xác nhận | `DECIDED` |
| DEC-22 | Người xuất hiện có quyền đồng thuận và yêu cầu giới hạn/gỡ | `DECIDED — principle` |
| DEC-23 | Người đăng chủ động chọn phạm vi chia sẻ | `DECIDED — principle` |
| DEC-24 | Tương tác tư liệu gồm xem, bình luận, cảm xúc, chia sẻ và đề xuất bổ sung | `DECIDED` |
| DEC-25 | Lưu toàn bộ lịch sử đóng góp/thay đổi | `DECIDED` |
| DEC-26 | Bảo toàn bất đồng, người có thẩm quyền quyết định trạng thái chính thức | `DECIDED` |
| DEC-27 | Thông tin chưa xác minh có thể hiển thị với trạng thái rõ | `DECIDED` |
| DEC-28 | Lịch gồm các nhóm sự kiện; giá trị là được nhắc đến/được nhớ đến | `DECIDED` |
| DEC-29 | Global Search trên toàn nền tảng | `DECIDED` |
| DEC-30 | Khám phá gia đình gồm directory, profile, family space | `DECIDED` |
| DEC-31 | Không gian cá nhân gồm journal, research notes, archive | `DECIDED` |
| DEC-32 | Ranh giới quyền truy cập giữa các không gian | `DECIDED` |

---

# 11. Open Questions & Risk Register

Các mục dưới đây không phải quyết định bị bỏ sót; đây là những việc có thể để sau hoặc cần kiểm chứng trước khi thiết kế/triển khai.

## 11.1. Open Questions

| ID | Câu hỏi | Vì sao chưa chốt |
|---|---|---|
| OQ-01 | Quy trình invitation, activation, Google Sign-In và phương thức thay thế chi tiết | Cần thiết kế flow và kiểm tra khả năng hiện hữu |
| OQ-02 | Ma trận quyền theo quan hệ gia đình và hồ sơ người sống/người đã mất | Cần quy tắc cụ thể, không suy ra chỉ từ vai trò |
| OQ-03 | Quy tắc kế nhiệm người quản trị nền tảng | Tuấn chủ động để ngỏ cơ chế dài hạn |
| OQ-04 | Taxonomy chủ đề MẠCH | Chưa cần chốt trước khi có nội dung thực tế |
| OQ-05 | Quy chuẩn chi tiết cho tuyến nghiên cứu/khảo cứu MẠCH | Ưu tiên khung sản phẩm trước |
| OQ-06 | Các mức chia sẻ và ngoại lệ của tư liệu | Cần UX và privacy policy chi tiết |
| OQ-07 | Đồng thuận đối với trẻ vị thành niên, người đã mất và trường hợp tranh chấp | Chưa được phỏng vấn sâu |
| OQ-08 | Quy trình gỡ/giới hạn tư liệu và thời hạn xử lý | Cần policy vận hành |
| OQ-09 | Ai là “người quản lý tư liệu” và cách phân quyền xác nhận tag | Chưa có ma trận vai trò chi tiết |
| OQ-10 | Cơ chế xác minh và mức độ bằng chứng cho dữ kiện phả hệ | Cần editorial/data governance |
| OQ-11 | Search ranking, filter, typo tolerance và quyền truy cập ở index | Cần UX/technical discovery |
| OQ-12 | Cấu trúc chi tiết Family Space | Chưa cần khóa trước khi review baseline |
| OQ-13 | Quyền sở hữu, export, backup và chuyển giao tài sản số dài hạn | Cần governance/technical review |
| OQ-14 | Chi tiết hoạt động và quyền riêng tư của Clara | Không mở rộng trong phạm vi hiện tại |
| OQ-15 | Cách thế hệ sau thay đổi định hướng sản phẩm mà vẫn duy trì tính liên tục | Câu hỏi thế hệ, chủ động để mở |

## 11.2. Risks

| ID | Rủi ro | Hệ quả | Hướng kiểm soát cần nghiên cứu |
|---|---|---|---|
| R-01 | Quyền giao diện không khớp quyền API/database | Rò rỉ dữ liệu | Server-side authorization tests |
| R-02 | Tư cách thành viên bị đồng nhất với Google authentication | Người không thuộc cộng đồng có thể được liên kết sai | Identity linking và admin verification |
| R-03 | Người đăng chia sẻ nội dung có người sống mà thiếu đồng thuận | Xâm phạm riêng tư | Consent, request restriction/removal |
| R-04 | Tag sai tạo liên kết sai giữa người và tư liệu | Sai lệch ký ức/gia phả | Proposal/review/audit |
| R-05 | Global Search lộ nội dung không được phép | Rò rỉ metadata hoặc nội dung | Permission-aware indexing/query |
| R-06 | Dữ kiện chính thức bị sửa mà mất lịch sử | Mất khả năng truy nguyên | Revision history/restore |
| R-07 | Người có quyền quản trị đồng thời kiểm soát biên tập không có kiểm soát chéo | Tập trung quyền lực | Separation of duties, audit |
| R-08 | Family Space trùng lặp MẠCH | Phân mảnh nội dung | Ranh giới theo mục đích |
| R-09 | MẠCH bị mở rộng thành mạng xã hội đại trà | Mất điểm neo văn hóa/tri thức | Editorial/community principles |
| R-10 | Xây mới module đã tồn tại | Phá baseline, lãng phí | Inspect before modify |
| R-11 | Tài liệu quyết định và runtime lệch nhau | AGY triển khai sai | Baseline audit + traceability |
| R-12 | Dữ liệu lịch sử thiếu nguồn bị hiển thị như sự thật chắc chắn | Sai lệch lịch sử | Epistemic status/source provenance |

---

# 12. Success Criteria — Tiêu chí đánh giá trải nghiệm

Đây là tiêu chí định tính để review; chưa phải KPI đã được Tuấn phê duyệt.

1. Thành viên mới có thể hiểu cách vào và liên kết đúng hồ sơ của mình.
2. Thành viên tìm được vị trí của mình trong gia phả mà không cần hiểu toàn cây.
3. Thành viên hiểu được quan hệ và mức độ chắc chắn của dữ kiện.
4. Tư liệu có thể được liên kết với nhiều người/sự kiện/nội dung mà không tạo bản sao tùy tiện.
5. Người đóng góp và người liên quan hiểu được quyền chia sẻ/quyền riêng tư.
6. Đóng góp của cộng đồng có thể truy nguyên.
7. Bất đồng không làm mất bằng chứng hoặc lịch sử nhận thức.
8. MẠCH cho phép đối thoại có trách nhiệm và duy trì chất lượng.
9. Lịch khiến thành viên và người thân được nhắc đến, được nhớ đến.
10. Tìm kiếm giúp khám phá chéo các miền nội dung nhưng không vượt quyền.
11. Family Space và không gian cá nhân có ranh giới rõ.
12. Clara không bị truy cập chéo.
13. Các module hiện hữu được bảo toàn; chỉ thay đổi sau khi có evidence và phê duyệt.

---

# 13. AGY Handoff Plan — Chưa phải lệnh triển khai

**Trạng thái:** `PLANNED — NOT AUTHORIZED`  
Không viết prompt triển khai cho đến khi Tuấn duyệt bản tổng hợp này.

Theo Agent Prompt & Reporting Format Standard, workload phải chia thành batch có checkpoint; không tạo mega-prompt. Mặc định read-only trước khi có lệnh modify.

## Batch 0 — Baseline & Traceability Audit
**Mục tiêu:** Đối chiếu đặc tả với Product Baseline và Vibecode Lab hiện tại.

- Inspect/read-only.
- Xác định module/route/screen đã tồn tại.
- Đối chiếu Home, Gia phả, Tư liệu, MẠCH, Lịch, Search, Family Space, Personal Space, Clara.
- Ghi nhận `DOCUMENTED / CONFIGURED / OBSERVED / TESTED / PROVEN / PARTIAL / FAILED / BLOCKED / UNKNOWN`.
- Không sửa code, database, config hoặc Production.
- Output: báo cáo `.md` và traceability matrix TP → current implementation → gap → evidence.
- Checkpoint: Tuấn review kết quả trước Batch 1.

## Batch 1 — Experience Architecture & Journey Mapping
**Mục tiêu:** Chuyển khung sản phẩm thành luồng người dùng và cấu trúc màn hình.

- Xây user flows và sitemap chi tiết.
- Map touchpoints với screen/route hiện hữu.
- Xác định trạng thái empty/loading/error/permission denied.
- Không sửa code.
- Output: UX architecture spec `.md`, flow diagrams ở dạng Mermaid nếu phù hợp.
- Checkpoint: Tuấn duyệt trước khi chuyển UI design.

## Batch 2 — Permission & Privacy Model
**Mục tiêu:** Chuyển TP-020/021/030 thành policy có thể kiểm thử.

- Ma trận actor × resource × action.
- Quan hệ gia đình và phạm vi dữ liệu.
- Consent/restriction/removal flows.
- Search/index permission boundaries.
- Clara isolation.
- Output: permission matrix, policy cases, negative test cases `.md`.
- Checkpoint: Tuấn duyệt nguyên tắc trước khi implementation planning.

## Batch 3 — Genealogy & Records Model
**Mục tiêu:** Đặc tả hồ sơ người, dữ kiện, nguồn, trạng thái xác minh và đề xuất thay đổi.

- Person profile information architecture.
- Relationship representation.
- Evidence/source model.
- Epistemic status.
- Proposal/review/approval/history.
- Output: domain/interaction spec `.md`.
- Checkpoint: Tuấn duyệt.

## Batch 4 — Media & Contribution Model
**Mục tiêu:** Đặc tả kho tư liệu và cộng tác.

- Asset object and multi-link relationships.
- Person/topic/event/place tags.
- Tag proposal/review.
- Share scopes.
- Consent and removal.
- Contribution/revision history.
- Output: media contribution spec `.md`.
- Checkpoint: Tuấn duyệt.

## Batch 5 — MẠCH & Family Spaces
**Mục tiêu:** Đặc tả MẠCH, biên tập, bình luận và Family Space.

- Hybrid editorial flows.
- Topic anchor and content formats.
- Contributor/editor roles.
- Post-publication moderation.
- Family directory/profile/space boundaries.
- Output: community/editorial experience spec `.md`.
- Checkpoint: Tuấn duyệt.

## Batch 6 — Search, Calendar & Personal Space
**Mục tiêu:** Đối chiếu module Lịch hiện hữu; đặc tả Search và không gian cá nhân.

- Review existing Calendar; preserve baseline.
- Global Search UX and permission-aware results.
- Personal Journal/Research Notes/Archive.
- Output: module specs `.md`.
- Checkpoint: Tuấn duyệt.

## Batch 7 — Implementation Planning
Chỉ thực hiện sau khi các đặc tả liên quan được Tuấn duyệt:
- Chia work packages kỹ thuật.
- Dependency map.
- Acceptance criteria.
- Test plan.
- Rollback/verification plan.
- Không tự deploy Production.
- Mỗi batch triển khai phải có review và nghiệm thu tại Vibecode Lab.

---

# 14. Source & Reference Notes

## 14.1. Nguồn quyết định chính

- Các câu trả lời và quyết định trực tiếp của Tuấn trong phiên phỏng vấn TP-001–TP-030.
- Các bối cảnh sản phẩm và workflow đã có trong project handoff.
- `AGENT_PROMPT_FORMAT_STANDARD.md` — quy định format prompt, evidence, reporting, read-only default và phân rã workload.

## 14.2. Tham chiếu sản phẩm bên ngoài

FamilySearch được dùng làm nguồn tham chiếu cho:
- Cấu trúc Person Page.
- Memories và liên kết tư liệu với hồ sơ cá nhân.
- Person Tags.
- Sources và source provenance.
- Latest Changes, reason statements, restore và collaboration.

Facebook được dùng làm nguồn tham chiếu cho:
- Trải nghiệm tag xã hội.
- Người đăng chọn phạm vi chia sẻ.
- Cơ chế tương tác và quyền riêng tư quanh nội dung.

**Lưu ý:** Đây là tham chiếu về pattern trải nghiệm, không phải yêu cầu sao chép nguyên trạng hoặc khẳng định mọi tính năng tham chiếu đều phù hợp với sản phẩm.

---

# 15. Những việc chưa làm trong phiên này

- Chưa truy cập và audit Production hoặc Vercel deployment.
- Chưa mở/kiểm tra Vibecode Lab.
- Chưa kiểm tra code, database, API, authentication hoặc authorization.
- Chưa xác minh trạng thái thực tế của module Lịch.
- Chưa tạo wireframe/prototype.
- Chưa thay đổi bất kỳ file/code/config/database nào trong repository.
- Chưa tạo prompt triển khai cho AGY.
- Chưa ghi tài liệu này vào Obsidian hoặc canonical Source of Truth.

---

# 16. Acceptance & Next Step

## Tuấn cần review

1. Product identity và mục đích tổng thể.
2. Mô hình các không gian.
3. Các quyết định TP-001–TP-030.
4. User journeys.
5. Information architecture.
6. Permission boundaries.
7. Open questions và risk register.
8. Batch plan cho AGY.

## Sau khi Tuấn duyệt

- Sửa tài liệu theo feedback.
- Đóng phiên bản Product Experience Specification.
- Chốt Batch 0 read-only audit.
- Chỉ sau đó mới viết prompt cho AGY theo từng batch.

**Tài liệu này chưa cấp quyền cho AGY thực thi bất kỳ thay đổi nào.**

---

# APPENDIX A — SESSION HANDOFF CAPSULE

Dùng phần này để mở phiên chat tiếp theo mà không phải kể lại toàn bộ:

- Sản phẩm: Gia tộc Trần Trọng Thu — `giatoctrantrongthu.com`.
- Product Owner/final authority: Tuấn.
- Strategic assistant: Emarald.
- Execution agent: AGY.
- Phỏng vấn đã đạt ngưỡng hoàn thành tại TP-030.
- Bản tổng hợp hiện tại: `PRODUCT_EXPERIENCE_SPECIFICATION_DISCOVERY_HANDOFF_v0.1.md`.
- Trạng thái: Draft, chờ Tuấn review; chưa được triển khai.
- TP-001–TP-030 đã được tổng hợp trong tài liệu.
- Các quyết định quan trọng:
  - Public entry tối giản; ưu tiên thành viên.
  - Onboarding cần admin verification và liên kết tài khoản; chi tiết còn mở.
  - Gia phả lấy cá nhân làm điểm xuất phát.
  - Person profile đầy đủ, tham chiếu FamilySearch.
  - Tư liệu là object độc lập, liên kết đa đối tượng.
  - Tagging học hỏi Facebook + FamilySearch; đề xuất tag cần xác nhận.
  - Người đăng chọn phạm vi chia sẻ, nhưng quyền riêng tư người liên quan vẫn được bảo vệ.
  - Lưu lịch sử đóng góp/thay đổi.
  - Bảo toàn bất đồng; phân biệt trạng thái tri thức.
  - Lịch là nơi thành viên được nhắc đến và được nhớ đến; module đã có, cần preserve/inspect.
  - Global Search toàn nền tảng.
  - Family Directory + Family Profile + Family Space.
  - Personal Journal + Research Notes + Personal Archive.
  - MẠCH là không gian tri thức cộng đồng; giữ tuyến nghiên cứu/khảo cứu chuyên sâu nhưng ưu tiên khung sản phẩm trước.
  - Clara là không gian độc lập, access riêng.
- Ranh giới truy cập TP-030 đã được Tuấn duyệt.
- Bước kế tiếp: Tuấn review bản tổng hợp. Nếu duyệt, thực hiện Batch 0 read-only audit trước; chưa viết prompt triển khai.
- Mọi prompt cho AGY phải tuân thủ `AGENT_PROMPT_FORMAT_STANDARD.md`: tiếng Việt, một code block duy nhất, không nested block, scope rõ, evidence levels, read-only mặc định, chia batch và checkpoint, không tự modify/commit/deploy.

**END OF HANDOFF**
