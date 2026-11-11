# BÁO CÁO PHỤC HỒI & ĐIỀU PHỐI TRIỂN KHAI HOMEPAGE PUBLIC
## (PUBLIC HOMEPAGE IMPLEMENTATION RECOVERY REPORT)
### DỰ ÁN CÂY GIA PHẢ / GIATỘC TRẦN TRỌNG THU

**Mã tài liệu:** `AUDIT/PUBLIC_HOMEPAGE_IMPLEMENTATION_RECOVERY.md`  
**Chỉ thị kích hoạt:** `# AGY — RESTORE AND COORDINATE PUBLIC HOMEPAGE IMPLEMENTATION`  
**Human Final Authority:** Tuấn  
**Coordination & Execution Owner:** AGY  
**Frontend Implementation Owner:** Cline / AGY  
**Thời điểm thực hiện:** 2026-11-02 17:05 (ICT)  
**Trạng thái Máy chủ Local:** `RUNNING` trên `http://localhost:3000` (PID Task: `task-2687`)

---

## 1. NGUỒN TÀI LIỆU QUY CHUẨN ĐÃ ĐỌC (CANONICAL SOURCES READ)

Toàn bộ quá trình phục hồi và điều phối được căn cứ trực tiếp trên 6 nguồn tài liệu quy chuẩn hiện hành trong repository:

1. [`docs/architecture/PUBLIC_COMMUNICATION_ARCHITECTURE_v1.0.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/architecture/PUBLIC_COMMUNICATION_ARCHITECTURE_v1.0.md) `[PROVEN]`:
   - Xác lập bản chất PUBLIC là không gian nghiên cứu & đối thoại hướng ra xã hội, lấy di sản dòng họ làm điểm xuất phát.
   - Xác định 6 khu vực trải nghiệm trang chủ và thứ bậc 6 CTA (trong đó CTA vào Không gian Thành viên có mức ưu tiên thấp nhất).
   - 4 trạng thái nhận thức và ranh giới đạo đức 3 vai trò.
2. [`AUDIT/MASTER_COMPLETION_PLAN.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/MASTER_COMPLETION_PLAN.md) (Canonical v2.0) `[PROVEN]`:
   - Lấy website sống làm baseline bất biến; phân định rõ Phase 3 (Vibecode Lab) và Phase 4 (Tích hợp thực tế).
3. [`AUDIT/FRONTEND_COMPLETION_PLAN.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/FRONTEND_COMPLETION_PLAN.md) (Canonical v2.0) `[PROVEN]`:
   - Ranh giới component vNEXT, bảo tồn publication shell, quy chuẩn kiểm thử 4 độ phân giải.
4. [`AUDIT/CHANGELOG_AND_SUPERSESSION_MAP.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/CHANGELOG_AND_SUPERSESSION_MAP.md) `[PROVEN]`:
   - Lịch sử đối soát và loại bỏ các tác vụ rác, dead artifacts từ các chu kỳ trước.
5. [`docs/CANONICAL_DOCUMENT_REGISTRY.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/CANONICAL_DOCUMENT_REGISTRY.md) `[PROVEN]`:
   - Sổ tay quản trị quy định duy nhất một Single Source of Truth cho từng miền tri thức.
6. [`docs/AGENT_GOVERNANCE.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/AGENT_GOVERNANCE.md) `[PROVEN]`:
   - Quy chuẩn điều phối hành vi giữa AGY và Cline, quy tắc pre-flight checklist và handoff 10 mục.

---

## 2. KIỂM TRA ADOBE XD REFERENCE & TRẠNG THÁI SỬ DỤNG

Đã tiến hành rà soát pháp y toàn diện trên toàn bộ kho mã nguồn, lịch sử task, commit log và hệ thống tệp cục bộ:

```text
========================================================================================
DANH MỤC TỆP ADOBE XD TẠI THƯ MỤC ASSETS/XD/
========================================================================================
Tên tệp (.xd)                       Kích thước      Thời điểm tạo   Tên Prototype / Artboard chính
----------------------------------------------------------------------------------------
Hand-drawn_UI_Kit_Behance.xd        2.0 MB          02/11 15:51     Freehand-Wireframe-UI-Kit (28 artboards)
Impekable_AdobeXD_DashboardUIKit_v2 3.0 MB          02/11 15:51     Adobe Dashboard_vn_v2 (01 Home, Analytics)
anchorLinks.xd                      4.2 MB          02/11 15:51     Anchor Links Tutorial (7 artboards)
states-kit.xd                       6.9 MB          02/11 15:51     Component States Kit (14 artboards)
xd-design-systems-semantic-ui-kit-2 3.3 MB          02/11 15:51     Semantic UI Kit for XD (23 artboards)
xd-resources-auto-animate-ui.xd     28.1 MB         02/11 15:51     Auto-animate Tutorial (76 artboards)
xd-resources-vault-security-ui.xd   9.2 MB          02/11 15:51     Vault Security Mobile UI (26 artboards)
========================================================================================
```

### Phân loại trạng thái tiếp cận XD:
1. **Đã tìm thấy XD (`OBSERVED`):** Tìm thấy thư mục `assets/XD/` chứa 7 tệp `.xd` nêu trên, xuất hiện vào lúc 15:51 ngày 02/11/2026.
2. **Đã mở và đọc XD (`PROVEN`):** AGY đã giải nén tệp manifest và cấu trúc đồ họa `graphicContent.agc` bên trong các tệp `.xd` này bằng script tự động.
3. **Đã trích xuất được yêu cầu thiết kế cho Gia Tộc (`FAILED`):** Toàn bộ 7 tệp `.xd` trên là các bộ UI Kit mẫu thương mại và tutorial kỹ thuật của Adobe từ năm 2019/2023 (như giao diện bán hàng thương mại điện tử "Bags & Packages", "Electronics", "Sales Report", hoặc form đăng nhập mẫu của Behance). **Không có bất kỳ artboard nào chứa nội dung hay thiết kế của Gia Tộc Trần Trọng Thu**.
4. **Cline đã sử dụng XD làm căn cứ triển khai (`FAILED`):** Quét toàn bộ `transcript.jsonl` (hơn 2.900 bước) và lịch sử Git xác nhận **Cline chưa từng mở, đọc, trích xuất hay tham chiếu tới bất kỳ tệp nào trong `assets/XD/`**.
5. **Tài liệu XD thiết kế riêng cho Gia Tộc (`BLOCKED`):** Nếu Tuấn đã tạo một file XD riêng cho website Gia Tộc trên Adobe Cloud (`xd.adobe.com/view/...`) hoặc ngoài thư mục repo, hiện tại file này **CHƯA ĐƯỢC CHIA SẺ VÀO WORKSPACE**. AGY không tự tiện lấy các mẫu bán hàng SaaS trong 7 file XD kia để thay thế thẩm mỹ di sản của Gia Tộc.

---

## 3. TRUY XUẤT NHIỆM VỤ CLINE TRƯỚC ĐÓ (TASK HISTORY)

Đối chiếu giữa những gì Cline được giao và những gì Cline đã thực thi:

- **Các file Cline đã đọc:** `brand/BRAND_GOVERNANCE_v0.1.md`, `brand/05_DESIGN_LANGUAGE.md`, `docs/design/DESIGN_SPEC_PUBLIC_HOME_v0.4.md`.
- **Các file Cline đã tạo/sửa:**
  - Thu hẹp `index.html` thành vỏ bọc 14 dòng (`<div id="gi-app"></div>`).
  - Viết module `src/js/ui/public-home.js` dựa trên concept cũ v0.4 ("The Dichotomy": Threshold $\rightarrow$ Câu văn tĩnh lặng $\rightarrow$ Cửa vào `/login`).
  - Tạo cấu trúc `src/js/ui/shell.js` nhưng lại cài đặt `mark: !isPublicHome` và `hideText: isPublicHome`, dẫn đến việc **làm biến mất hoàn toàn logo dòng họ trên trang chủ**.
  - Sau đó, bổ sung 6 khối text thô (`<p>`) ở cuối trang mà không có layout, không có thẻ card, và không có các CTA phân cấp.
- **Những gì Cline tự tuyên bố hoàn thành:**
  - Trong `AUDIT/FRONTEND_PROGRESS_AUDIT.md`, Cline báo cáo: *"FE-01: IMPLEMENTED"*, *"FE-04: VERIFIED (360 VERIFIED)"*.
- **Thực tế đối soát độc lập của AGY (`PROVEN`):**
  - Giao diện Homepage do Cline để lại có chất lượng chưa đạt yêu cầu: Mất logo masthead, nút Đăng nhập chiếm trọn tầm nhìn trung tâm (sai lệch nghiêm trọng với Communication Architecture), 6 khu vực truyền thông chỉ là các dòng text sơ sài chưa được thiết kế.

---

## 4. BẢNG ĐỐI CHIẾU YÊU CẦU & BẰNG CHỨNG (REQUIREMENTS & EVIDENCE MATRIX)

| Yêu Cầu (Requirement) | Nguồn Quy Chuẩn (Source) | Kết Quả Bắt Buộc (Required Outcome) | Bằng Chứng Hiện Tại (Current Evidence) | Trạng Thái (Status) | Hành Động Tiếp Theo (Next Action) |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **Bảo tồn Logo Ngang Masthead** | `BRAND_GOVERNANCE_v0.1.md` §3 | Hiển thị `assets/images/logoGiaToc_ngang.svg` đầu trang | Đã sửa `shell.js` và xác minh Playwright `logoPresent: true` | `PROVEN` | Duy trì CSS responsive. |
| **Bảo tồn Utility Strip & Sticky Nav** | `DESIGN-001 Revision` | Thanh tiện ích và thanh điều hướng bám dính đầy đủ | Header gắn 7 links điều hướng mượt mà | `PROVEN` | Giữ nguyên. |
| **Khu vực 01: Định Vị** | `PUBLIC Architecture` §6 | Nêu rõ Tuấn khởi xướng, lấy dòng họ làm điểm xuất phát | Đã render H1, Tag, Lead, Rationale, Method quote và 2 nút CTA | `PROVEN` | Đạt chuẩn. |
| **Khu vực 02: Vấn Đề Quan Tâm** | `PUBLIC Architecture` §6 | 4 câu hỏi nghiên cứu mở về gia đình Việt Nam | Đã render lưới 4 thẻ câu hỏi đánh số từ 01 đến 04 | `PROVEN` | Đạt chuẩn. |
| **Khu vực 03: Nội Dung Công Bố** | `PUBLIC Architecture` §6 | Phân định 5 loại hình văn bản, hiển thị bài viết mẫu | Đã render 6 pills phân loại và 3 bài viết kèm trích đoạn thật | `PROVEN` | Đạt chuẩn. |
| **Khu vực 04: Không Gian MẠCH** | `PUBLIC Architecture` §6 & §8 | Giới thiệu MẠCH có bản sắc xuất bản riêng, không là mục con | Banner MẠCH nền tối sang trọng, giới thiệu Tuyển tập 01 và CTA | `PROVEN` | Đạt chuẩn. |
| **Khu vực 05: Nguồn Gốc & Phương Pháp**| `PUBLIC Architecture` §6 & §9 | 4 trạng thái nhận thức, nguyên tắc đạo đức UNESCO | Đã render lưới 2 cột phương pháp và hộp đạo đức UNESCO | `PROVEN` | Đạt chuẩn. |
| **Khu vực 06: Đối Thoại & Đóng Góp**| `PUBLIC Architecture` §6 & §7 | 2 thẻ đóng góp/trao đổi và Cổng Thành Viên ở cuối | Đã render 2 action cards và Banner Cổng Thành Viên trang trọng | `PROVEN` | Đạt chuẩn. |
| **Phân cấp 6 CTA** | `PUBLIC Architecture` §7 | CTA 1-5 hướng ra nội dung; CTA 6 (Thành viên) ở mức thấp nhất | Không còn nút Login khổng lồ ở đầu; CTA thành viên đặt trang nhã ở chân trang | `PROVEN` | Đạt chuẩn. |
| **Thiết kế đối chiếu Adobe XD** | Chỉ thị của Tuấn | Khớp với artboard XD chỉ định | 7 file trong `assets/XD` là kit mẫu; chưa có XD riêng của dự án | `BLOCKED` | Chờ Tuấn cung cấp link/file XD chính thức nếu có. |

---

## 5. CÁC YÊU CẦU TRƯỚC ĐÂY BỊ BỎ SÓT

1. **Thông điệp phương pháp luận (Tầng 3):** Cline bỏ qua phương pháp tiếp cận từ cụ thể (một con người, một gia đình, một vật dụng, một ký ức) để chống sáo rỗng.
2. **Năm loại hình văn bản:** Cline chỉ ghi một dòng chữ `Nghiên cứu · Khảo sát...` mà không tạo thành cấu trúc phân loại trực quan cho người đọc.
3. **Đạo đức di sản UNESCO:** Ranh giới ba vai trò (Ai cung cấp — Ai được nhắc đến — Ai có quyền quyết định) hoàn toàn bị thiếu trong bản dựng trước.
4. **Hạ thấp độ ưu tiên của cổng thành viên:** Cline đặt cánh cửa thành viên chiếm toàn bộ nửa trang đầu, làm lu mờ hoàn toàn tính chất học thuật và đối thoại của PUBLIC.

---

## 6. CÁC THAY ĐỔI ĐÃ THỰC HIỆN TRONG ĐỢT PHỤC HỒI NÀY

AGY đã trực tiếp thực hiện việc chỉnh sửa và hoàn thiện Frontend để giải quyết triệt để các tồn tại:

1. **[`src/js/ui/shell.js`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/ui/shell.js):**
   - Khôi phục hiển thị Logo Ngang (`mark: true`, `hideText: true`) trên trang chủ.
   - Bổ sung thanh điều hướng công khai dẫn trực tiếp đến các mốc nội dung: `Trang chủ`, `Vấn đề quan tâm`, `Nội dung công bố`, `MẠCH`, `Phương pháp`, `Đối thoại`, `Thành viên →`.
2. **[`src/js/ui/boot-public.js`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/ui/boot-public.js):**
   - Nối lại `renderShell` để nạp đầy đủ Masthead, Asset Manifest, Typography stack và Footer chuẩn mực.
3. **[`src/js/ui/public-home.js`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/ui/public-home.js):**
   - Tái cấu trúc hoàn chỉnh **6 khu vực** theo đúng đặc tả `PUBLIC_COMMUNICATION_ARCHITECTURE_v1.0.md`.
   - Nạp trích đoạn dữ liệu thật từ ký ức Bà Sa (Teresa Phạm Thị Hưng), Cụ Giuse Trần Trọng Thu và thống kê 223 nhân vật / 68 gia đình.
4. **[`src/css/foundation/components.css`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/css/foundation/components.css):**
   - Bổ sung hơn 570 dòng CSS chuyên biệt cho 6 khu vực, tuân thủ bảng màu Crimson/Amber/Slate, font Cinzel/Playfair Display/Be Vietnam Pro, lưới thẻ responsive không bóng mờ, viền đôi trang trọng.

---

## 7. CÁC ĐIỂM XUNG ĐỘT CẦN TUẤN QUYẾT ĐỊNH

1. **Adobe XD Reference (`BLOCKED`):**
   - 7 tệp XD hiện có trong `assets/XD/` là template thương mại. Nếu Tuấn đã có bản vẽ XD riêng cho Gia Tộc Trần Trọng Thu, kính đề nghị Tuấn cung cấp đường dẫn hoặc tệp `.xd` để AGY đối chiếu pixel-perfect.
2. **Kênh tiếp nhận tư liệu cộng đồng (`UNKNOWN`):**
   - Hiện tại hai nút "Gửi tư liệu" và "Trao đổi" đang được gắn thông báo phản hồi (modal placeholder). Cần Tuấn chỉ định email hoặc form tiếp nhận chính thức.

---

## 8. KẾT QUẢ ĐIỀU PHỐI & KIỂM THỬ THỰC TẾ (BATCH 3 - QUALITY CONTROL)

Đã chạy kiểm thử tự động trên trình duyệt thực qua Playwright tại 4 kích thước màn hình tiêu chuẩn:

| Độ Phân Giải | Trạng Thái Cuộn Ngang (Horizontal Overflow) | Lỗi Console (Console Errors) | Asset Logo | Ảnh Chụp Bằng Chứng Nghiệm Thu (Screenshot) | SHA-256 Checksum |
| :---: | :---: | :---: | :---: | :--- | :--- |
| **1440 px** (Desktop) | **0 px (Không tràn)** | **0 errors** | **Loaded** | [`shots/qa_public_home_1440.png`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/shots/qa_public_home_1440.png) | `b143368b39d0bbcd95c57143b9dc6c49a9edec40f2c20a16c4559fa0a08dda50` |
| **1024 px** (Small Desktop) | **0 px (Không tràn)** | **0 errors** | **Loaded** | [`shots/qa_public_home_1024.png`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/shots/qa_public_home_1024.png) | `e7ba2e106eeddd51afa0441154b832b9a9a7188d4e098e167e1d352f543ee968` |
| **768 px** (Tablet) | **0 px (Không tràn)** | **0 errors** | **Loaded** | [`shots/qa_public_home_768.png`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/shots/qa_public_home_768.png) | `09050b8a1d84865c5cce5e0e0e082cf2b403ea6072f3f1c3bb5950efaa1b8b44` |
| **375 px** (Mobile) | **0 px (Không tràn)** | **0 errors** | **Loaded** | [`shots/qa_public_home_375.png`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/shots/qa_public_home_375.png) | `9f78e32a8fbf5a575caf32a7101692f3edde6666edea969215e49871a0fff7f0` |

---

## 9. TỔNG KẾT PHÂN LOẠI TRẠNG THÁI (STATUS INVENTORY)

- `PROVEN`: 6 khu vực trải nghiệm trên trang chủ hiển thị đúng kiến trúc, logo ngang hiển thị, không lỗi console, 4 ảnh chụp bằng chứng xác thực.
- `CONFIGURED`: Cấu trúc vNEXT modular (`src/js/ui/`, `src/css/foundation/`).
- `DOCUMENTED`: `PUBLIC_COMMUNICATION_ARCHITECTURE_v1.0.md` đăng ký tại Canonical Registry.
- `OBSERVED`: 7 tệp `.xd` tại `assets/XD/`.
- `FAILED`: Cline tham khảo XD trong nhiệm vụ trước đó (không có vết tích).
- `BLOCKED`: File Adobe XD thiết kế riêng cho Gia Tộc (chưa có trong workspace).
- `UNKNOWN`: Cơ chế backend tiếp nhận tư liệu đóng góp trực tuyến từ cộng đồng.

---
*Báo cáo được AGY lập và mở trực tiếp trong VS Code phục vụ Tuấn kiểm tra.*

