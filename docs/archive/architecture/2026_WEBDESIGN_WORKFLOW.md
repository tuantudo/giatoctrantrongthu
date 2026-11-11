# 2026 WEBDESIGN WORKFLOW

Bản đồ quy trình phát triển và kiểm soát chất lượng (Webdesign Workflow 2026) cho dự án Gia Tộc Trần Trọng Thu.
*(Cập nhật Tooling Decision: Adobe Dreamweaver chính thức thay thế Figma trong vai trò Design/Prototype Surface chính của Owner).*

---

## 0. SƠ ĐỒ QUY TRÌNH (KÈM VÒNG LẶP & TOOLING MỚI)

Quy trình thiết kế không phải là một đường thẳng. Nó bao gồm hai vòng lặp chính: **Design Loop** (vòng lặp nháp và duyệt thiết kế) và **Delivery Loop** (vòng lặp triển khai và nghiệm thu thực tế).

```text
                  TUẤN
           Product / Editorial
             / Visual Owner
                    │
                    ▼
          ┌──────────────────┐
          │ 01. INTENT       │
          └────────┬─────────┘
                   ▼
          ┌──────────────────┐
          │ 02. DESIGN       │
          └────────┬─────────┘
                   ▼
          ┌──────────────────┐
          │ 03. PROTOTYPE    │◄─────────────────────────────┐
          │ (bởi Cline)      │                              │
          └────────┬─────────┘                              │
                   ▼                                        │ (DESIGN LOOP)
          ┌───────────────────────────┐                     │
          │ 04. OWNER VISUAL REVIEW   │                     │
          │ (Dreamweaver / Browser)   │                     │
          └────────┬──────────────────┘                     │
                   ▼                                        │
          ┌───────────────────────────┐                     │
          │ OpenCode Tech Review      │                     │
          │ + AGY Governance QA       │                     │
          └──────┬───────────────┬────┘                     │
           NO ↙                  ↘ YES                      │
            ↓                      ↓                        │
      ┌────────┐         ┌─────────────────┐                │
      │ ITERATE├─────────┤05. DESIGN SYSTEM│────────────────┘
      └────────┘         └───────┬─────────┘
                                 ▼
          ┌────────────────────────────┐
          │ 06. IMPLEMENTATION         │◄────────┐
          │ (Cline → Production)       │         │
          └──────────────┬─────────────┘         │
                         ▼                       │
          ┌────────────────────────────┐         │
          │ 07. REAL DATA               │         │
          └──────────────┬─────────────┘         │ (DELIVERY LOOP)
                         ▼                       │
          ┌────────────────────────────┐         │
          │ 08. QA / FORENSIC           │         │
          │ (AGY)                      │         │
          └──────────────┬─────────────┘         │
                         ▼                       │
          ┌────────────────────────────┐         │
          │ 09. OWNER ACCEPTANCE        │         │
          └──────┬───────────────┬─────┘         │
            NO ↙                 ↘ YES           │
             ↓                     ↓             │
         ┌───────┐             ┌──────┐          │
         │  FIX  ├─────────────┤ SHIP │──────────┘
         └───────┘             └──────┘
```

---

## 1. 2026 WEBDESIGN WORKFLOW — OPERATIONAL RULES

**A.** Production KHÔNG phải design playground.
**B.** Prototype phải tồn tại trước khi thay đổi production đối với những thay đổi visual / UX / layout / interaction đáng kể.
**C.** Prototype có thể được tạo bằng code.
**D.** Adobe Dreamweaver là công cụ visual/code prototype chính; Browser là nơi kiểm tra responsive behavior thực.
**E.** Dreamweaver thay thế Figma làm design surface, nhưng Dreamweaver không thay thế Cline (Engineering) hay AGY (Governance).
**F.** Photoshop / Illustrator hợp lệ cho art direction, image treatment, asset creation; không bắt buộc dùng để "cắt website".
**G.** AI coding agent có thể tạo prototype nhanh, nhưng không có quyền tự quyết định visual acceptance.
**H.** Tuấn là Product/Editorial/Visual Owner và là người duy nhất quyết định visual/semantic acceptance.
**I.** Cline là implementation agent; không tự thay đổi product intent hoặc semantic direction.
**J.** AGY là governance/QA/forensic agent; không tự quyết định design đẹp hay đúng semantic.
**K.** Source code, prototype, deployed runtime và owner acceptance là các evidence layers khác nhau.
**L.** HTTP 200 không đồng nghĩa feature acceptance.
**M.** Agent tự báo PASS không phải Owner acceptance.
**N.** Không dùng Fake data để làm prototype trông hoàn thiện nếu đang test data-driven behavior. Có thể dùng Representative data, nhưng phải đánh dấu rõ nếu không phải Real data.

---

## 2. QUICK START — KHI TUẤN MUỐN THIẾT KẾ MỘT FEATURE MỚI

1. **Tuấn** viết Intent.
2. **AGY** kiểm scope và constraints.
3. **Tuấn/AGY/Cline** chọn loại prototype phù hợp.
4. **Cline** dựng prototype trong Design Playground.
5. **Tuấn** mở prototype trực tiếp bằng Adobe Dreamweaver / Browser để review.
6. **OpenCode** thực hiện technical review (tìm rủi ro, responsive issue).
7. **AGY** kiểm tra Governance/QA.
8. **Nếu chưa đúng** → Iterate (Cline làm lại prototype).
9. **Tuấn** approve design direction.
10. Chuẩn hóa Design System (nếu cần).
11. **Cline** implement production code.
12. Tích hợp Real/Representative data tùy nhu cầu feature.
13. **AGY** forensic QA (Production).
14. **Tuấn** review production.
15. **Nếu fail** → Quay lại đúng stage để Fix.
16. **Nếu pass** → CLOSE / SHIP.

---

## 3. MÔ TẢ CHI TIẾT 9 STAGE

### 01. INTENT
- **Mục tiêu:** Trả lời "Ta muốn tạo gì?". Xác định scope, editorial intent, user journey.
- **Quyền quyết định:** Tuấn.
- **Output:** Design Brief / Intent. Không code nếu intent chưa rõ.

### 02. DESIGN
- **Mục tiêu:** Trả lời "Nó trông, cảm nhận và hành xử như thế nào?". Xác định visual direction, typography, hierarchy, brand constraints.
- **Quyền quyết định:** Tuấn. (Photoshop/Illustrator dùng ở khâu này).

### 03. PROTOTYPE
- **Mục tiêu:** Dựng bản mẫu (Visual/Code/Hybrid) trong Design Playground để test.
- **Lưu ý:** Prototype là nơi thử nghiệm, **Design Playground ≠ Production**. Người dựng là Cline.

### 04. VISUAL REVIEW (OWNER REVIEW CONTRACT)
- **Mục tiêu:** Tuấn mở Dreamweaver/Browser đánh giá trực tiếp. OpenCode/AGY chạy review song song.
- **Owner Review Contract:** Trả lời 7 câu hỏi:
  1. Có đúng Intent không?
  2. Có đúng editorial character không?
  3. Visual hierarchy có đúng không?
  4. Responsive behavior có hợp lý không?
  5. Interaction có đúng không?
  6. Brand coherence có đúng không?
  7. Có muốn ship direction này không?
- **Feedback Style:** Owner feedback có thể mang tính cảm quan ("masthead yếu", "mobile chật"). Agent tự dịch ra CSS/Code. Quyết định: APPROVE / REVISE / REJECT.

### 05. DESIGN SYSTEM
- **Mục tiêu:** Trả lời "Những quyết định đã được duyệt được chuẩn hóa thành hệ thống reusable như thế nào?".
- **Quy tắc:** *Approved Prototype ≠ Completed Design System*. Stage này chuyên trích xuất tokens, spacing, components từ bản mẫu đã duyệt vào hệ thống chung.

### 06. IMPLEMENTATION
- **Mục tiêu:** Cline chuyển design approved thành production code thật.
- **Cấm:** Không tự redesign ngoài scope, không tự đổi semantic intent.

### 07. REAL DATA INTEGRATION
- **Mục tiêu:** Nối API, DB, ICS, content.
- **Quy tắc Timing:** Real Data là một gate trước Production Acceptance, NHƯNG real/representative data có thể được đẩy lên sớm vào Prototype (Stage 03) nếu hình thái dữ liệu ảnh hưởng cấu trúc UI.

### 08. QA / FORENSIC
- **Mục tiêu:** Đánh giá kỹ thuật độc lập (Source, Build, Runtime, Cache, Regression).
- **Quyền:** AGY duyệt Technical/Runtime PASS, không duyệt Visual.

### 09. OWNER ACCEPTANCE
- **Mục tiêu:** Chốt chặn cuối cùng. Tuấn kiểm tra Production thật (Visual, Semantic, Responsive).
- **Quyết định:** Đóng task (Ship) hoặc từ chối (Fix).

---

## 4. ĐỊNH NGHĨA ROLE (VAI TRÒ)

| Role | Chức năng & Thẩm quyền | Giới hạn (Không được làm) |
|---|---|---|
| **TUẤN (Owner)** | Product Owner, Editorial Owner, Visual Owner. Nắm quyền Final Acceptance. Quyết định Intent, review prototype bằng Dreamweaver. | N/A |
| **DREAMWEAVER** | Visual/code design surface, Prototype playground, Live View, Code/Live split. Công cụ để Owner quan sát tương quan HTML/CSS. | **Không phải là 1 "Agent"**. Không thay thế Cline/AGY. Owner có thể vọc CSS trên này nhưng Code Production phải qua Cline. |
| **CLINE** | Implementation Agent / Builder. Xây prototype, chuyển approved design thành production. | Không có thẩm quyền visual acceptance. Không tự ý thay đổi product intent/semantic. |
| **OPENCODE** | Technical exploration, Second engineering opinion. Code/Design review, tìm technical risks, responsive/semantic issues. | Không có thẩm quyền visual/semantic acceptance. Không tự ý sửa production. |
| **AGY** | Architecture, Governance, QA, Forensic verification. Quản lý Evidence. | Không phải Art Director. Không có thẩm quyền visual acceptance. Không tự quyết định design đẹp/xấu. |

---

## 5. KHI NÀO ĐƯỢC BỎ QUA PROTOTYPE? (BYPASS RULES)

Không biến quy trình thành tệ quan liêu. **Được bỏ qua prototype** nếu thay đổi thuộc:
- Sửa lỗi chính tả (Typo) / Thay chữ nội dung.
- Minor bug fix không ảnh hưởng visual/UX.
- Sửa Accessibility.
- Token correction đã có lệnh rõ ràng (Đổi mã màu đúng bảng hệ thống).
- Cấu hình mechanical implementation có spec kỹ thuật.

**BẮT BUỘC PHẢI CÓ PROTOTYPE** nếu thay đổi đụng tới: Layout, Visual hierarchy, Interaction, Responsive behavior, Component behavior.

---

## 6. DESIGN PLAYGROUND (PROPOSED)

**Thư mục đề xuất:** `/design-playground/`
Nơi đây được quyền: build, break, tweak, so sánh alternatives, test responsive.
Tuyệt đối KHÔNG biến nó thành production branch trá hình.

---

## 7. TOOLING ECOSYSTEM: DREAMWEAVER & ADOBE

**Adobe Dreamweaver (Primary Surface):**
Thay thế Figma trở thành tâm điểm của quá trình thiết kế và kiểm chứng giao diện. Cung cấp Live View, Code/Live split, và Responsive Viewport Inspection. Tuấn sử dụng trực tiếp để duyệt, tinh chỉnh nháp.

**Photoshop / Illustrator:**
Vẫn được sử dụng bình thường cho: visual concept, image treatment, archival imagery, artwork, texture, vector assets, logo. Nó là một Visual Reference (Evidence) độc lập.

**Figma (Historical Context):**
Figma không còn là công cụ bắt buộc. Các nhắc nhở về Figma trong tài liệu cũ chỉ còn tính lịch sử. Các quyết định kiến trúc/product sẽ không bị hủy bỏ chỉ vì thay đổi tool này.

---

## 8. DESIGN EVIDENCE LAYERS (CẬP NHẬT)

1. **Intent evidence:** Tài liệu yêu cầu.
2. **Design evidence:** Concept, rules.
3. **Prototype evidence:** Loại Prototype, URL/Path, và Viewport evidence.
4. **Owner review decision:** APPROVE / REVISE / REJECT (từ Dreamweaver/Browser).
5. **Data mode:** Đã test bằng Real, Representative, hay Placeholder data.
6. **Implementation evidence:** Commit hash.
7. **Deployment evidence:** URL, log.
8. **Runtime evidence:** Network, DOM.
9. **Regression evidence:** Check lân cận.
10. **Production owner acceptance.**

---

## 9. QUAN HỆ VỚI TÀI LIỆU KHÁC & CHANGE-001

- **PROJECT_CONTROL_SURFACE.md:** Tài liệu Quản trị cao nhất. Đã được update để ghi nhận OpenCode và Tooling Invariant (Dreamweaver).
- **2026_WEBDESIGN_WORKFLOW.md:** Hướng dẫn vận hành Thiết kế. Hai tài liệu bổ trợ, không mâu thuẫn.
- **CHANGE-001:** Quy trình thiết kế mới này không thay đổi trạng thái của CHANGE-001 (Vẫn đang OPEN/UNVERIFIED).

---

# DESIGN-001 — EDITORIAL HOMEPAGE PROTOTYPE

**Status:** READY TO START (Chờ Owner Visual Review sau khi dựng xong)

**Intent:** 
Tạo một prototype homepage độc lập để Tuấn nhìn thấy kết quả trước khi tiếp tục thay đổi production.

**Prototype Location:** 
`/design-playground/design-001-homepage/` (Dành riêng cho việc Tuấn mở trực tiếp file `index.html` vào Adobe Dreamweaver).

**Scope ban đầu:** 
Utility, Masthead, Navigation, Lead, MẠCH, Tư Liệu, Gia Phả, Lịch, Footer.

**Semantic direction:** 
Online publication / living archive của dòng họ. (Structural reference: Tia Sáng-style publication skeleton).

**Logo direction hiện tại:** 
Ưu tiên thử `logoGiaToc_ngang.svg` như single masthead asset trong prototype và đánh giá responsive behavior bằng layout thay vì tiếp tục swap asset nếu không cần.

**Required viewports:** 
1440, 1024, 768, 390.

**Data:** 
Ưu tiên Real hoặc Representative data nếu data shape ảnh hưởng visual evaluation.

**Owner Visual Review & Acceptance:** 
- Tuấn sẽ review prototype trực tiếp bằng Adobe Dreamweaver và browser.
- Prototype này KHÔNG ĐƯỢC deploy.
- Prototype này KHÔNG ĐƯỢC coi là production.
- Quyết định của Tuấn (APPROVE / REVISE / REJECT) tại bước này là cánh cổng bắt buộc trước khi Cline được phép code trên Production.
