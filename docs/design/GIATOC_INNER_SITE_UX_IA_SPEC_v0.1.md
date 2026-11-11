# GIATỘC INNER SITE UX/IA SPECIFICATION v0.1

## 1. Problem Diagnosis
Phiên bản Inner Site (Member Space) hiện tại đang vướng lỗi kinh điển của hệ thống giai đoạn đầu: **Phơi bày mô hình kiến trúc (Architecture Model) ra giao diện người dùng (User Interface).** 
Trang `/me` hiển thị các thông tin như Account, Person, Identity Mapping, Raw IDs, trạng thái Database (SQLite, MariaDB) và cấu trúc Permission. Kết quả là nó trông giống một Developer Dashboard hoặc Admin Panel của một hệ thống SaaS, thay vì một "Không gian sống của thành viên gia tộc".

## 2. Inner Site Mental Model
Thiết kế Inner Site xoay quanh 6 câu hỏi cốt lõi của người dùng:
1. **Tôi đang ở đâu?** -> Không gian riêng tư của Gia Tộc Trần Trọng Thu.
2. **Tôi là ai trong gia tộc?** -> Tên thành viên (Person) + Quyền hạn ngầm định (không hiển thị mã quyền hệ thống).
3. **Tôi có thể làm gì ở đây?** -> Đọc MẠCH, đọc Thư Clara, xem Gia phả, sinh hoạt trong Không gian gia đình.
4. **Tôi muốn đi đâu tiếp?** -> Hệ thống điều hướng (Global & Local Nav) rõ ràng.
5. **Tôi đang xem nội dung cá nhân, nội bộ hay dữ liệu gia phả?** -> Phân định bằng Cấu trúc trang (Editorial vs Archival/Genealogy).
6. **Trạng thái dữ liệu trống?** -> "Chưa có thông tin" thay vì "Null" hoặc "No DB connection".

## 3. Global IA
Cấu trúc Inner Site tách bạch rõ **Tài khoản cá nhân (Account)** và **Không gian chung của gia tộc (Family Spaces)**.
- **Member Home:** `/me`
- **Editorial Spaces:** `/me/mach`, `/me/clara`
- **Archival/Genealogy Spaces:** `/me/tree`, `/me/tree/person/:id`
- **Collaborative Spaces:** `/me/family-spaces`
- **Utility/Account:** `/me/change-password`, `/logout`

## 4. Global Navigation
- **Header:** Giữ nét tương đồng với Public Home (Masthead nhỏ hơn hoặc Logo text serif) nhưng bổ sung hệ thống điều hướng (Global Nav).
- **Primary Navigation (Global):**
  - MẠCH
  - Thư gửi Clara
  - Gia phả
  - Không gian gia đình
  - Tài khoản (Dropdown: Hồ sơ của tôi, Đổi mật khẩu, Đăng xuất)
- **Wayfinding:** Luôn có breadcrumb hoặc nút "Trở về" ở các trang cấp 2 (ví dụ: `Gia phả / Nguyễn Văn A`).

## 5. `/me` IA (Member Home)
Không còn là trang hiển thị Identity Mapping. Nó là **MEMBER HOME**.
- **Welcome Block:** Lời chào + Tên Person (Ví dụ: *Chào anh, Trần Quốc Tuấn*).
- **Hồ sơ của tôi:** Nút truy cập nhanh vào `/me/tree/person/:my-id`.
- **Dashboard Navigation (Các Cánh Cửa):**
  - **MẠCH:** "Những suy nghĩ và câu chuyện mà gia tộc cùng nhau gìn giữ."
  - **Thư gửi Clara:** "Những điều được viết riêng cho một người, một thế hệ."
  - **Cây phả đồ:** "Các nhân vật và quan hệ trong gia phả."
  - **Không gian gia đình:** "Không gian để các thành viên cùng lưu giữ và trao đổi."

## 6. `/me/mach`
- **Purpose:** Không gian Editorial nội bộ.
- **Layout:** Giống một tạp chí nội bộ (Publication Rhythm).
- **Content:** Danh sách bài viết mới, nổi bật.
- **Empty State:** "Hiện chưa có bài viết nào trên MẠCH."

## 7. `/me/clara`
- **Purpose:** Không gian Intimate / Private.
- **Layout:** Tối giản, tập trung vào text (Reading experience). Khoảng trắng lớn, typography sâu lắng.
- **Relationship:** Tách biệt hoàn toàn khỏi MẠCH. Không phải là một chuyên mục của báo, mà là một ngăn kéo thư.
- **Empty State:** "Ngăn thư hiện đang trống."

## 8. `/me/tree`
- **Purpose:** Cấu trúc phả hệ (Genealogy Construct).
- **Layout:** Dense/Archival. Cho phép hiển thị nhiều thông tin, danh sách, tìm kiếm, lọc.
- **Data:** Không phơi bày raw ID.
- **Empty State:** "Cây phả đồ đang được cập nhật."

## 9. `/me/tree/person/:id`
- **Purpose:** Hồ sơ nhân vật.
- **Layout:** Dense. Bao gồm thông tin cơ bản, Quan hệ (Relationships), Tư liệu (Evidence/Media), Ký ức (Memories).
- **Relationship:** Có nút "Đề xuất thay đổi" (Submission) thay vì "Edit record".

## 10. `/me/family-spaces`
- **Purpose:** Danh sách các không gian gia đình nhỏ (Collaborative).
- **Layout:** Danh sách (List) các không gian mà user là thành viên.
- **State:** Nếu backend chưa có tính năng này, hiển thị trạng thái "Không gian đang được xây dựng" một cách trang nhã, không fake UI.

## 11. `/me/change-password`
- **Purpose:** Account Settings.
- **Boundary:** Tách biệt hoàn toàn khỏi Person Profile. Chỉ xử lý technical auth (Password, 2FA, Email).
- **Layout:** Form chuẩn, functional.

## 12. `/login` & `/logout`
- **`/login`:** Gate. Form tối giản, ngôn ngữ trang trọng. "Đăng nhập Không gian Gia tộc".
- **`/logout`:** Xử lý clean session và điều hướng về Public Home (`/`).

## 13. State Model
- **Loading:** Thanh loading mảnh, tinh tế (Editorial feel), không dùng Spinner to tướng của Material Design.
- **Empty:** Sử dụng Typography và đường kẻ ngang (giống `gi-voice__absence`), tuyệt đối không dùng Box nét đứt (Dashed box).
- **Not Authorized/Unavailable:** "Bạn không có quyền truy cập không gian này" (Trang nhã, không dùng mã lỗi HTTP 403).
- **Error:** Thông báo tĩnh lặng, hướng dẫn tải lại trang. Không dump stack trace.
- **Dependency Missing:** Ẩn. Nếu không lấy được data, rơi vào trạng thái Empty hoặc Error.

## 14. Content Visibility Rules
- **Public vs Inner:** Public chỉ thấy vỏ (Shell) và Voice. Inner thấy toàn bộ MẠCH, Clara, Tree.
- **Person vs Account:** Identity được mix ẩn ở backend. Frontend chỉ hiển thị tên Person. Account chỉ dùng để đổi mật khẩu.

## 15. User-facing Terminology
| Thuật ngữ Technical | Thuật ngữ User-facing |
| :--- | :--- |
| Account | Tài khoản |
| Person | Hồ sơ nhân vật / Tôi trong gia phả |
| FamilySpace | Không gian gia đình |
| Genealogy Construct | Cây phả đồ |
| Evidence | Tư liệu / Nguồn |
| Submission | Đề xuất thay đổi |

## 16. Technical terminology that MUST remain hidden
Tuyệt đối KHÔNG hiển thị các từ sau trên UI:
- Identity Mapping
- Authority
- Audit Event
- SoT / MariaDB / SQLite / Database
- UUID / Raw IDs (chỉ ẩn dưới data-attribute hoặc URL hash)
- Backend Dependency / API Status
- Permission Model / RBAC

## 17. Inner Site Visual/Composition Principles
- **No SaaS Dashboard:** Không dùng Card Grid vô nghĩa, không bo góc (radius), không đổ bóng (shadows).
- **Typography-driven:** Dùng Serif làm chủ đạo. Phân cấp bằng Font-size và Border (đường kẻ ngang).
- **Information Density:** Cho phép `/me/tree` hiển thị dày đặc (dense) như một cuốn từ điển/gia phả thực thụ, nhưng `/me/clara` phải rất thoáng (sparse) như một bức thư.

## 18. Route → Purpose → Primary Action → Data Dependency matrix
| Route | Purpose | Primary Action | Dependency (Backend) |
| :--- | :--- | :--- | :--- |
| `/me` | Member Home | Định hướng (Navigate) | Auth, Identity Mapping |
| `/me/mach` | Editorial | Đọc bài viết | MẠCH API |
| `/me/clara` | Intimate Letters | Đọc thư | Clara API |
| `/me/tree` | Archival / Tree | Tìm kiếm người | Genealogy API |
| `/me/tree/person/:id`| Person Profile | Xem chi tiết / Đề xuất sửa | Genealogy API |
| `/me/family-spaces` | Collaboration | Chọn không gian | Family Space API |
| `/me/change-password`| Security | Cập nhật mật khẩu | Auth API |

## 19. Cline Implementation Contract
- **Cline KHÔNG ĐƯỢC:** Tự thiết kế UI bằng component mới, không được dùng CSS bo góc/shadow. Không được bê dữ liệu Raw Data dump ra màn hình.
- **Cline PHẢI:** 
  1. Tuân thủ `GIATOC_INNER_SITE_UX_IA_SPEC_v0.1.md`.
  2. Bóc tách các thành phần technical ra khỏi file `me.js`.
  3. Sử dụng các component tĩnh lặng (Editorial borders, Serif fonts) từ `BRAND_GOVERNANCE_v0.1.md`.
  4. Nếu thiếu API, render UI Empty State tĩnh lặng.

## 20. Open Questions requiring Tuấn decision
1. **[OPEN QUESTION — HUMAN DECISION REQUIRED]:** `/me/mach` và `/me/clara` có nên được hiển thị nội dung trực tiếp trên `/me` (như một feed tổng hợp) hay `/me` chỉ thuần túy là các Khối điều hướng (Links) dẫn vào các không gian đó?
2. **[OPEN QUESTION — HUMAN DECISION REQUIRED]:** Tính năng "Đề xuất thay đổi" ở Hồ sơ nhân vật sẽ hoạt động dưới dạng gửi Form tĩnh (nhận qua Email/Admin) hay cần một hệ thống quản lý Request trong tương lai? (Để Cline render đúng UI Form hay chỉ là text mô tả).
