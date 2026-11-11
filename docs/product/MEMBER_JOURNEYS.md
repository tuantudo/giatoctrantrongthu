# BẢN ĐẶC TẢ HÀNH TRÌNH THÀNH VIÊN (MEMBER JOURNEYS SPECIFICATION)
## Thiết Kế Trải Nghiệm Tương Tác Gia Tộc Trần Trọng Thu — v1.0

**Thẩm quyền phê duyệt:** Tuấn (Human Final Authority / Product Owner)  
**Kiến trúc & QC:** Emarald (Strategic Architecture & QC Authority)  
**Phụ trách:** AGENT 01 (Product & Journey Design Specialist)  
**Ngày ban hành:** 2026-11-11  

---

## 1. TỔNG QUAN CÁC NHÓM NGƯỜI DÙNG & MỤC TIÊU CỐT LÕI

Hệ thống số của Gia tộc Trần Trọng Thu phục vụ nhiều thế hệ trong dòng họ — từ các bậc cao niên, các cô chú bác đến thế hệ con cháu thanh niên. Trọng tâm của thiết kế trải nghiệm là **sự ấm áp, tôn kính, dễ hiểu, không đòi hỏi kiến thức công nghệ**, và loại bỏ hoàn toàn các ngõ cụt (`Dead-ends`).

Bảy hành trình người dùng trọng tâm:
- **Hành trình A:** Khách truy cập chưa có tài khoản (Cánh cửa trang trọng).
- **Hành trình B:** Thành viên đã được xác minh nhưng chưa kích hoạt tài khoản (Chào đón & Trao quyền).
- **Hành trình C:** Thành viên đã có tài khoản nhưng chưa đăng nhập (Cửa vào tiện lợi).
- **Hành trình D:** Thành viên đang sử dụng hệ thống thường nhật (Khám phá & Gắn kết).
- **Hành trình E:** Thành viên quên mật khẩu hoặc mất quyền truy cập (Hỗ trợ thân tình).
- **Hành trình F:** Thành viên cần trợ giúp / Giải đáp thắc mắc (Kênh tương tác trực tiếp).
- **Hành trình G:** Thành viên muốn đóng góp di ảnh, tư liệu, hồi ức (Bồi đắp di sản).

---

## 2. CHI TIẾT 7 HÀNH TRÌNH NGƯỜI DÙNG

### HÀNH TRÌNH A: Khách truy cập chưa có tài khoản

> **Ngữ cảnh:** Người thân họ hàng xa hoặc bà con thân thuộc tình cờ biết đến trang web hoặc được gửi liên kết trang chủ `giatoctrantrongthu.com`.

- **Entry Point:** `https://giatoctrantrongthu.com/` (Trang chủ công khai).
- **User Goal:** Tìm hiểu xem đây là trang web của gia đình nào, có phải dòng họ của mình không, và làm cách nào để tham gia nếu mình là con cháu trong họ.
- **Các bước thực hiện:**
  1. Người dùng đọc lời tựa trang trọng, xem hình ảnh cội nguồn dòng họ tại trang chủ.
  2. Thấy nút bấm trang trọng: `[Dành Cho Thành Viên →]`.
  3. Bấm vào nút và được chuyển đến trang Cổng Thành Viên (`/login`).
  4. Tại trang `/login`, người dùng thấy hướng dẫn rõ ràng: *"Nếu bạn là con cháu trong gia tộc nhưng chưa có tài khoản, hãy liên hệ Ban Quản Trị hoặc Người phụ trách gia đình để được tạo hồ sơ."* kèm nút bấm `[Hướng dẫn tham gia & liên hệ]`.
- **Giao diện tương ứng:**
  * `index.html` (Trang chủ công khai).
  * `/login` (Cổng đăng nhập thành viên).
  * `/help` (Trung tâm hướng dẫn & kết nối).
- **Trạng thái hệ thống:** Khách vãng lai (`Anonymous / Public Scope`).
- **Success State:** Người dùng nắm rõ thông tin cội nguồn, biết mình thuộc dòng họ Trần Trọng Thu và biết cách thức liên hệ người thân để nhận tài khoản.
- **Error State & Recovery Path:**
  * Nếu người dùng cố tình đoán mật khẩu để đăng nhập: Hệ thống hiển thị thông báo nhẹ nhàng: *"Thông tin đăng nhập chưa đúng. Nếu chưa có tài khoản, xin vui lòng bấm Hướng dẫn tham gia bên dưới."*
- **Điểm can thiệp của Quản lý Gia đình:** Nhận thông tin từ người thân (qua Zalo/Điện thoại), tra cứu phả hệ xem người đó thuộc chi nhánh nào để chuẩn bị tạo tài khoản.

---

### HÀNH TRÌNH B: Thành viên đã được xác minh nhưng chưa kích hoạt tài khoản

> **Ngữ cảnh:** Người quản trị gia tộc đã tạo sẵn hồ sơ gắn liền với vị trí của người đó trên cây gia phả. Người thân được gửi một liên kết kích hoạt hoặc mật khẩu tạm thời.

- **Entry Point:** Đường dẫn kích hoạt dạng `https://giatoctrantrongthu.com/login` (hoặc `/activate?user=...`).
- **User Goal:** Đăng nhập lần đầu bằng mật khẩu tạm thời do gia đình cung cấp và tự đặt mật khẩu riêng của mình để bảo vệ tài khoản.
- **Các bước thực hiện:**
  1. Người thân mở trang `/login`, nhập Tên đăng nhập và Mật khẩu tạm thời được cấp.
  2. Bấm `[Đăng nhập]`.
  3. Hệ thống nhận diện tài khoản ở trạng thái `PROVISIONED` và tự động điều hướng sang `/me/change-password`.
  4. Giao diện hiển thị lời chào nồng ấm: *"Chào mừng bạn đến với Không gian Gia Tộc! Đây là lần đầu tiên bạn đăng nhập. Xin vui lòng đặt một mật khẩu riêng để bảo vệ tài khoản của bạn."*
  5. Người thân nhập Mật khẩu hiện tại (mật khẩu tạm) và Mật khẩu mới (2 lần, tối thiểu 8 ký tự).
  6. Bấm `[Đổi mật khẩu và kích hoạt]`.
  7. Hệ thống cập nhật tài khoản sang trạng thái `ACTIVE`, kích hoạt phiên làm việc đầy đủ và chuyển hướng thẳng vào `/me` (Không gian cá nhân).
- **Giao diện tương ứng:**
  * `/login` (Trang đăng nhập).
  * `/me/change-password` (Trang kích hoạt & đặt mật khẩu lần đầu).
  * `/me` (Không gian thành viên).
- **Trạng thái hệ thống:** `PROVISIONED` ➔ `ACTIVE`.
- **Success State:** Tài khoản được kích hoạt hoàn toàn, gắn liền với nhân vật trong phả hệ, người thân vào thẳng trang cá nhân thấy rõ tên mình và phụ mẫu.
- **Error State & Recovery Path:**
  * *Mật khẩu mới ngắn hơn 8 ký tự:* Báo lỗi rõ ràng ngay tại ô nhập: *"Mật khẩu cần ít nhất 8 ký tự để bảo đảm an toàn."*
  * *Hai lần nhập mật khẩu mới không khớp:* Báo lỗi: *"Mật khẩu xác nhận chưa khớp với mật khẩu mới. Xin vui lòng kiểm tra lại."*
- **Điểm can thiệp của Quản lý Gia đình:** Cấp mật khẩu tạm ban đầu qua kênh gia đình riêng tư; hỗ trợ nếu người lớn tuổi gặp khó khăn khi gõ phím.

---

### HÀNH TRÌNH C: Thành viên đã có tài khoản, chưa đăng nhập

> **Ngữ cảnh:** Thành viên quay trở lại trang web sau một thời gian hoặc trên một thiết bị mới (điện thoại mới, máy tính bảng).

- **Entry Point:** `https://giatoctrantrongthu.com/login` hoặc truy cập trực tiếp một trang riêng tư (ví dụ `/me`, `/me/tree`, `/me/gallery`).
- **User Goal:** Đăng nhập an toàn, nhanh chóng và quay lại đúng trang mình muốn xem.
- **Các bước thực hiện:**
  1. Người dùng vào `/login` (nếu truy cập trang riêng tư, hệ thống lưu tham số `?next=/me/tree` và chuyển tới `/login`).
  2. Người dùng nhập Tên đăng nhập và Mật khẩu cá nhân.
  3. Bấm `[Đăng nhập]`.
  4. Hệ thống xác thực và tự động đưa người dùng đến trang đích đã yêu cầu (`safeNext`).
- **Giao diện tương ứng:** `/login` ➔ `/me` (hoặc trang được chỉ định).
- **Trạng thái hệ thống:** `Authenticated Member Session`.
- **Success State:** Đăng nhập thành công, menu thành viên xuất hiện đầy đủ các mục: Cây phả đồ, Kho tư liệu ảnh, Lịch giỗ & Niên biểu, MẠCH tri thức.
- **Error State & Recovery Path:**
  * *Nhập sai mật khẩu:* Hiển thị thông báo: *"Mật khẩu chưa đúng. Xin thử lại hoặc bấm [Quên mật khẩu] nếu bạn không nhớ."*
  * *Tài khoản bị khóa (`DISABLED`):* Thông báo: *"Tài khoản tạm thời đang được tạm khóa để bảo vệ. Xin vui lòng liên hệ Người phụ trách gia đình để được hỗ trợ mở khóa."*

---

### HÀNH TRÌNH D: Thành viên đang sử dụng hệ thống thường nhật

> **Ngữ cảnh:** Thành viên đã đăng nhập và đang sinh hoạt, tìm hiểu trong không gian dòng tộc.

- **Entry Point:** `/me` (Không gian của tôi).
- **User Goal:**
  * Xem cội nguồn huyết thống của mình trên cây phả đồ 3 đời (`/me/tree`).
  * Xem ảnh xưa của ông bà, cha mẹ trong kho di ảnh (`/me/gallery`).
  * Nhớ ngày giỗ, ngày kỷ niệm sắp tới của gia đình (`/me/events`).
  * Đọc các bài viết, hồi ký dòng họ trong phân hệ MẠCH (`/me/mach`).
  * Quản lý thông tin tài khoản và đổi mật khẩu khi cần (`/me/account`, `/me/change-password`).
- **Các bước thực hiện:**
  1. Duyệt qua thanh điều hướng thành viên (`MemberNav`) hoặc các thẻ chức năng lớn trên trang `/me`.
  2. Bấm vào bất kỳ mục nào để khám phá ngay mà không gặp bất kỳ rào cản kỹ thuật nào.
  3. Xem rõ mình thuộc nhánh nào, quan hệ huyết thống với Cố Thu ra sao thông qua Breadcrumb dòng họ.
- **Giao diện tương ứng:** `/me`, `/me/tree`, `/me/gallery`, `/me/events`, `/me/mach`, `/me/account`.
- **Trạng thái hệ thống:** Hoạt động bình thường, ghi nhận quyền truy cập chuẩn mực theo ReBAC.
- **Success State:** Người thân tìm thấy tư liệu thân tộc nhanh chóng, xúc động khi thấy di ảnh và câu chuyện của người thân, nắm rõ ngày giỗ sắp tới.

---

### HÀNH TRÌNH E: Thành viên quên mật khẩu hoặc mất quyền truy cập

> **Ngữ cảnh:** Thành viên (đặc biệt là người lớn tuổi) lâu ngày không vào trang web và quên mất mật khẩu của mình.

- **Entry Point:** Nút `[Quên mật khẩu?]` tại trang `/login` ➔ Dẫn tới `/help/recovery`.
- **User Goal:** Lấy lại quyền truy cập một cách thuận tiện, an toàn mà không phải trải qua các thủ tục kỹ thuật phức tạp (như nhận mã OTP qua SMS hay email vốn dễ bị thất lạc hoặc người lớn tuổi không rành).
- **Các bước thực hiện (Family Steward Assisted Recovery):**
  1. Người thân bấm `[Quên mật khẩu?]` tại màn hình đăng nhập.
  2. Trang `/help/recovery` hiển thị hướng dẫn thân tình:
     - *"Đừng lo lắng! Trong gia đình, sự kết nối trực tiếp luôn an toàn và thân thuộc nhất."*
     - Cung cấp nút liên hệ nhanh qua Zalo hoặc Số điện thoại của Người quản lý gia tộc (Tuấn / Trưởng ban điều hành).
     - Hướng dẫn người thân gửi tin nhắn: *"Tôi là [Tên], con/cháu của [Tên cha mẹ/nhánh], nhờ gia đình cấp lại mật khẩu giúp tôi."*
  3. Người quản lý gia đình xác minh danh tính qua giọng nói/kênh Zalo quen thuộc.
  4. Người quản lý vào trang Quản trị (`/admin/#/members`), bấm `[Đặt lại mật khẩu]` cho tài khoản đó, hệ thống sinh ra một mật khẩu tạm thời an toàn.
  5. Người quản lý gửi mật khẩu tạm này cho người thân.
  6. Người thân đăng nhập bằng mật khẩu tạm, hệ thống tự động đưa tới trang đặt mật khẩu mới như Hành trình B.
- **Giao diện tương ứng:** `/login` ➔ `/help/recovery` ➔ `/me/change-password`.
- **Trạng thái hệ thống:** `ACTIVE` ➔ Quản trị viên reset ➔ `PROVISIONED` ➔ Người dùng đặt mật khẩu mới ➔ `ACTIVE`.
- **Success State:** Khôi phục quyền truy cập thành công 100%, bảo mật tuyệt đối, không lộ dữ liệu ra dịch vụ viễn thông bên ngoài.

---

### HÀNH TRÌNH F: Thành viên cần hỗ trợ / Giải đáp thắc mắc

> **Ngữ cảnh:** Thành viên thấy thông tin phả hệ của chi nhánh mình có điểm chưa chính xác, hoặc có câu hỏi về ngày giỗ, hoặc muốn tìm hiểu cách sử dụng.

- **Entry Point:** Nút `[Trợ giúp & Hỗ trợ]` tại chân trang hoặc đường dẫn `/help` (công khai) hoặc `/me/help` (thành viên).
- **User Goal:** Đặt câu hỏi, gửi phản hồi hoặc đề nghị ban biên tập gia tộc hỗ trợ.
- **Các bước thực hiện:**
  1. Người thân truy cập trang Hỗ trợ.
  2. Đọc các câu hỏi thường gặp (FAQ) được viết bằng ngôn từ mộc mạc:
     - *"Làm sao để tìm thấy tên của mình trên cây phả đồ?"*
     - *"Tại sao có những bức ảnh tôi không xem được?"*
     - *"Làm thế nào để bổ sung ảnh cũ của ông bà?"*
  3. Nếu câu hỏi chưa có lời giải, người thân có thể điền vào biểu mẫu `[Gửi yêu cầu hỗ trợ]` (hoặc gọi điện / nhắn tin trực tiếp).
  4. Yêu cầu được lưu vào hệ thống để ban biên tập phản hồi.
- **Giao diện tương ứng:** `/help` / `/me/help`, `/me/support`.
- **Success State:** Người thân cảm thấy được lắng nghe, thắc mắc được giải đáp chu đáo.

---

### HÀNH TRÌNH G: Thành viên muốn đóng góp di ảnh, tư liệu, hồi ức

> **Ngữ cảnh:** Thành viên lưu giữ bức ảnh chụp gia đình xưa của ông bà, hoặc nhớ một câu chuyện xúc động về thời thơ ấu, muốn chia sẻ để lưu vào kho tàng chung của dòng họ.

- **Entry Point:** Nút `[Đóng góp tư liệu]` tại `/me/gallery`, `/me/contribute` hoặc nút `[Gợi ý đính chính]` tại hồ sơ nhân vật (`/me/tree/person/:id`).
- **User Goal:** Gửi hình ảnh, lời kể hoặc đính chính thông tin một cách dễ dàng, tự hào thấy đóng góp của mình được gia đình gìn giữ.
- **Các bước thực hiện:**
  1. Người thân chọn loại đóng góp:
     - Gợi ý bổ sung năm sinh/năm mất/quê quán cho một người trong họ.
     - Đóng góp ảnh kỷ niệm kèm chú thích (chụp năm nào, gồm những ai).
     - Ghi lại một câu chuyện ký ức, lời dặn của người xưa.
  2. Điền thông tin vào biểu mẫu đơn giản: Tên người/sự kiện, Nội dung, Nguồn gốc lời kể/chứng cứ.
  3. Bấm `[Gửi tới Ban Biên Tập Gia Tộc]`.
  4. Hệ thống ghi nhận vào Hộp Thư Đề Xuất (`proposals`) với mã số theo dõi (ví dụ: `PROP_173...`).
  5. Màn hình hiển thị lời cảm ơn chân thành: *"Cảm ơn tấm lòng của bạn! Đề xuất đã được chuyển đến Ban Quản Trị gia tộc để đối chiếu và đưa vào kho lưu trữ chung."*
  6. Người thân có thể bấm vào `[Xem trạng thái đóng góp của tôi]` (`/me/requests`) để biết đề xuất của mình đang ở giai đoạn nào: *Chờ tiếp nhận*, *Đã đối chiếu & đưa vào phả hệ*, hoặc *Gia đình đã phản hồi*.
- **Giao diện tương ứng:**
  * `/me/contribute` (Trung tâm đóng góp tư liệu).
  * `/me/requests` (Trang theo dõi các yêu cầu và đóng góp đã gửi).
  * `/admin/#/inbox` (Giao diện Quản trị viên duyệt và phản hồi).
- **Trạng thái hệ thống:** `proposals.status = 'PENDING'` ➔ Quản trị viên duyệt ➔ `APPROVED` (tự động cập nhật vào phả hệ) hoặc `REJECTED` (có ghi chú giải thích).
- **Success State:** Đóng góp được ghi nhận trang trọng, người thân theo dõi được tiến trình xử lý minh bạch.

---

## 3. MA TRẬN TỔNG HỢP 7 HÀNH TRÌNH

| Hành trình | Đối tượng | Điểm bắt đầu (Entry) | Điểm kết thúc (Success) | Trạng thái Tài khoản | Vai trò can thiệp của Quản lý Gia đình |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **A** | Khách vãng lai | Trang chủ `/` | Hiểu nguồn cội, biết cách liên hệ | Khách (`Anonymous`) | Tiếp nhận yêu cầu tham gia qua Zalo/Phone |
| **B** | Thành viên mới | Nhận link/mật khẩu tạm | Kích hoạt xong, đổi pass, vào `/me` | `PROVISIONED` ➔ `ACTIVE` | Cấp mật khẩu tạm ban đầu, hỗ trợ gõ |
| **C** | Thành viên cũ | `/login` | Đăng nhập thành công vào `/me` | `ACTIVE` | Không cần can thiệp |
| **D** | Đang sử dụng | `/me` | Xem phả đồ, ảnh, lịch giỗ, MẠCH | `ACTIVE` | Cập nhật định kỳ nội dung dòng họ |
| **E** | Quên mật khẩu | `/login` ➔ `/help/recovery` | Đặt lại mật khẩu mới an toàn | `ACTIVE` ➔ Reset ➔ `ACTIVE` | Xác minh người thân & reset mật khẩu trong Admin |
| **F** | Cần hỗ trợ | `/help` hoặc `/me/help` | Đọc FAQ hoặc gửi câu hỏi hỗ trợ | Mọi trạng thái | Giải đáp thắc mắc, hướng dẫn sử dụng |
| **G** | Đóng góp tư liệu | `/me/contribute` | Đóng góp thành công, theo dõi tại `/me/requests` | `ACTIVE` | Thẩm định tư liệu, phê duyệt vào CSDL chính |

