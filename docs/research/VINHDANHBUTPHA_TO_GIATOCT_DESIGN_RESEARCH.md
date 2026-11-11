# VINHDANHBUTPHA → GIATỘC DESIGN RESEARCH

## A. What VINHDANHBUTPHA actually contains
Dự án `VINHDANHBUTPHA` không chỉ là một repo code, mà là một hệ thống thiết kế tổng thể (Design System & Operating Model) bao gồm:
1. **Source of Truth (SoT):** Thư mục `00_Source_Of_Truth/` chứa bộ tài liệu 6 bước (Creative Brief → Creative Strategy → Narrative Framework → Visual Strategy → Art Direction → Decision Mapping).
2. **Master Design:** `05_Master_Design/VINHDANHBUTPHA.ai` chứa file gốc khổng lồ (~153MB).
3. **Publication Engine:** Một hệ thống tự động sinh tài liệu diễn giải Artwork (Artwork Documentation) bằng cách parse các file Markdown và render HTML overlay lên trên file xuất.
4. **Landing Page Experiment:** Một dự án Web (Vite + React + Tailwind 4) tại `Landing_Page_Experiment/` để hiện thực hóa các artwork này thành UI tương tác.
5. **AI Integration Tools:** Các file `.scpt` (AppleScript), Python script, và AI dump file dùng để kết nối giữa phần mềm thiết kế truyền thống (Illustrator) và AI (Cline/Agents).

## B. Landing Page Analysis
**Implementation:** Nằm tại `Landing_Page_Experiment/`.
- **Architecture:** Single-page React application không sử dụng router hay backend phức tạp (`src/App.jsx` dài ~460 dòng).
- **Styling:** Sử dụng Tailwind CSS v4 (qua `@tailwindcss/postcss`) với việc khai báo design token trực tiếp qua `@theme` trong `src/index.css`.
- **Layout & Visual Hierarchy:**
  - **Hero Zone:** Parallax đa tầng sử dụng `gsap` (tôn trọng `prefers-reduced-motion`), chiếm tỷ lệ động theo màn hình. Overlay CTA "Đăng ký tham gia" cố định ở Header với hiệu ứng backdrop-blur.
  - **Information Architecture:** Dẫn dắt người dùng theo mạch: Hook (Hero/Giải thưởng lớn) → Cơ chế lũy tiến (Eligibility) → Đặc quyền/Thưởng sớm (EarlyBird) → Thông tin bộ sản phẩm (Products) → Form tương tác (Modal).
  - **Component Structure:** Các section được thiết kế là các React Component dạng functional, nhận props là dữ liệu cấu hình (`keyVisualImg`, `onOpenModal`), tách biệt hoàn toàn state và content (`src/data/campaign.js`, `src/data/contacts.js`).
- **Performance & Responsiveness:** Kích thước component dùng đơn vị tương đối (vd: `w-[160%] sm:w-[140%] md:w-[120%]`). Quản lý hình ảnh tĩnh trực tiếp qua folder `public/assets/` với đường dẫn tuyệt đối, dễ dàng thay thế asset.

## C. AI Design Workflow
VINHDANHBUTPHA đã thiết lập một workflow cực kỳ thông minh để "mở mắt" cho AI:
1. **Input Serialization (AI Vision Bypass):** AI gặp khó khăn trong việc hiểu file đồ họa vector. Dự án đã dùng `run_ai.scpt` (AppleScript) để dump toàn bộ dữ liệu từ Adobe Illustrator (tọa độ, layer bounds, text content, phân cấp layer) ra một text file `ai_dump.txt`. 
2. **Epistemic Schema (Contextual Tracing):** Sử dụng `METHOD_STANDARD.md` bắt buộc mọi quyết định layout của AI phải được trace ngược về chiến lược (Vertical Reasoning). Các tags như `[FACT]`, `[INFERENCE]`, `[PROPOSAL]`, `[TRACED]` được dùng để đánh dấu độ tin cậy của thông tin (thông qua `fix_adapter.py`).
3. **Separation of Concerns:** Dữ liệu cứng (copywriter) được nhốt vào `data/campaign.js`, layout logic nhốt vào `App.jsx`. Điều này cho phép AI sinh/update component mà không làm nát nội dung.
4. **Code Generation & Review:** AI được cấp quyền build ra các bản POC (`poc_image2code.html`, `sandbox_taste.html`) để review và đối chiếu liên tục với SoT trước khi đưa vào React/Vite.

## D. Reusable Design Patterns
- **Tailwind v4 `@theme` block:** Khai báo token cực kỳ sạch sẽ trực tiếp trong CSS (`--color-gold`, `--color-pbcm-dark`), loại bỏ `tailwind.config.js`.
- **Absolute Static Asset Mapping:** Đặt asset ở `public/` và tham chiếu URL tuyệt đối. Có kèm file `ASSET_MANIFEST.md` để AI không tự bịa tên ảnh.
- **Micro-interactions (GSAP):** Các hiệu ứng nổi lên (fade-in-up), parallax trên Hero, và scroll cues (chuột nhún nhảy) tạo cảm giác premium nhưng không phức tạp.
- **Separation of Configuration:** Tách data thành module tĩnh (`campaign.js`, `contacts.js`) để UI Component trở thành pure functions.

## E. Reusable AI Instructions
- **Hệ thống Tags Nhận thức (Epistemic Tags):** `[FACT]` (Sự thật hiển nhiên/DB có), `[INFERENCE]` (Suy luận của AI), `[PROPOSAL]` (Đề xuất thiết kế).
- **AI Dump Strategy:** Nếu cần AI hiểu một thiết kế có sẵn, hãy parse nó ra dạng TOML/JSON/TXT tree (như `ai_dump.txt`), đừng ép AI "nhìn" ảnh.
- **Checklist-Driven Handoff:** Yêu cầu AI điền vào `HANDOFF_AUDIT.md` và `HANDOFF_CHECKLIST.md` để đảm bảo không xóa nhầm file hay phá vỡ architecture trước khi bàn giao.

## F. Patterns NOT suitable for Giatộc
- **Single-page "Mega Component" (`App.jsx` 460 dòng):** Giatộc cần trang có chiều sâu (Cây gia phả, Hồ sơ người, Timeline, Ký ức). Không thể nhồi tất cả vào một file.
- **GSAP Parallax cường độ cao:** Giatộc là Digital Institution / Family Archive. Cần sự trang trọng, ổn định và tĩnh lặng (Institutional design). Không cần hiệu ứng marketing bay bổng hay xe tải 3D dội vào mắt.
- **Hard-coded Data (`contacts.js`):** Giatộc đã có API và Local SQLite Database. Không nên dùng tĩnh kiểu này.

## G. Translation to Giatộc
1. **Design System:** Giatộc sẽ áp dụng Tailwind 4 (`@theme`), giữ nguyên bảng màu Institutional (Đỏ bã trầu, Vàng hoàng gia, Xanh navy) nhưng cấu trúc lại thật sạch sẽ giống VINHDANHBUTPHA.
2. **Epistemic Discipline trong UI:** Khi hiển thị một Claims/Timeline Event không chắc chắn trong Gia phả, có thể áp dụng các badge UI như `[INFERENCE]`, `[EVIDENCE NEEDED]` để người xem biết đây chưa phải FACT.
3. **Asset Management:** Bắt buộc áp dụng `ASSET_MANIFEST.md` hoặc một kho tương tự để quản lý ảnh (avatar, tư liệu cổ) thay vì để lộn xộn.

## H. Proposed GIATỘC UI SYSTEM v0.1
### 1. Kiến trúc tổng quan
- **Framework:** Vanilla JS / Lightweight Vite (Tùy định hướng phase sau) + Tailwind CSS v4.
- **Data Fetching:** Fetch API từ SQLite / Express Backend (đã có từ MVP).

### 2. Design Tokens (Institutional Theme)
```css
@theme {
  --color-heritage-red: #8B0000;    /* Đỏ trầm - huyết thống */
  --color-heritage-gold: #D4AF37;   /* Vàng đồng - tôn nghiêm */
  --color-paper-light: #F9F7F1;     /* Nền giả giấy/gia phả cổ */
  --color-ink-dark: #2C2C2C;        /* Chữ viết đen xám */
  
  --font-serif: 'Playfair Display', serif; /* Tiêu đề, Tên người */
  --font-sans: 'Inter', sans-serif;        /* Thông tin số liệu, nút bấm */
}
```

### 3. Core Components (Proposed)
- **Person Card:** Hiển thị Tên (Serif), Tuổi, Vai vế. 
- **Lineage Tree Node:** Thể hiện mắt xích, đường nối gia phả rõ ràng (có thể học hỏi sự phân tầng phân vùng rõ nét của VINHDANHBUTPHA Information Zone).
- **Epistemic Badge:** Badge nhỏ bên cạnh các sự kiện lịch sử ghi rõ "Chính sử", "Dã sử" hoặc "Khuyết danh".
- **Institution Header:** Thanh điều hướng trang trọng, có phân biệt trạng thái Public Visitor (Chỉ xem MẠCH) vs Authenticated Member (Xem toàn bộ gia phả).

## I. Open Questions
1. **Frontend Framework:** Việc giữ nguyên Vanilla JS (như static version cũ) hay chuyển sang React/Vite cho frontend của Giatộc? Nếu chuyển, liệu có đi ngược với triết lý "Simple/Institutional" ban đầu?
2. **Mobile Architecture:** VINHDANHBUTPHA dùng Flexbox/Responsive rất tốt cho landing page. Với sơ đồ gia phả (Lineage Tree) phức tạp, việc adapt lên mobile sẽ sử dụng drag-to-pan hay list view?
3. **Role/Visibility in UI:** Cách tốt nhất để render UI báo hiệu cho Member biết họ đang xem thông tin "Private" (chỉ thành viên mới thấy) so với nội dung "Public" (chia sẻ ra ngoài) là gì?

## J. Evidence / source traceability
- **Landing Page Architecture:** Trích xuất từ `Landing_Page_Experiment/docs/ARCHITECTURE.md` và `src/App.jsx`.
- **AI Workflow & Epistemic Tags:** Suy luận từ file `run_ai.scpt`, `ai_dump.txt`, `fix_adapter.py` và `00_Source_Of_Truth/Decision_Mapping.md` tại thư mục root của VINHDANHBUTPHA.
- **Deployment & Handoff Checklist:** Bằng chứng từ `Landing_Page_Experiment/docs/HANDOFF_AUDIT.md`.
