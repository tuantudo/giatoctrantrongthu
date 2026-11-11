# GIATỘC BRAND & CREATIVE SOURCE OF TRUTH (SoT)

## 1. MỤC ĐÍCH
Thư mục `brand/` là **Bộ máy Quản trị Thương hiệu và Sáng tạo (Brand, Creative & Visual Governance Layer)** của toàn bộ dự án CÂY GIA PHẢ / GIA TỘC TRẦN TRỌNG THU.

Bộ tài liệu này định nghĩa Bản ngã thương hiệu (Identity), Câu chuyện (Narrative), và Ngôn ngữ Thiết kế (Visual Language) cho toàn hệ thống.

## 2. HỆ THỐNG PHÂN CẤP THẨM QUYỀN (DOMAIN AUTHORITY HIERARCHY)
Dự án được quản trị dựa trên các **Domain Authority** độc lập. Tài liệu Brand KHÔNG được quyền phủ quyết Architecture hoặc Database. Nếu có xung đột, sự phân giải phải đi lên Human Authority.

```text
HUMAN AUTHORITY (Tuấn - Final Decision)
       │
       ├── BRAND / CREATIVE AUTHORITY
       │       └── Thư mục: brand/ (Nơi chứa Identity, Visual Strategy, Design Tokens)
       │
       ├── PRODUCT / UX / IA AUTHORITY
       │       └── Thư mục: docs/design/ (Nơi chứa UX/IA Spec, UX Stability Contract)
       │
       ├── ARCHITECTURE & ENGINEERING AUTHORITY
       │       └── Thư mục: docs/architecture/ (Nơi chứa Implementation Baseline, Tech Stack)
       │
       ├── DATA / GENEALOGY AUTHORITY
       │       └── Data Governance / Ontology / MariaDB (Quyền lực tối cao về Dữ liệu)
       │
       └── IMPLEMENTATION
               └── Thư mục: src/ (Mã nguồn thực thi)
```

**[QUY TẮC TUYỆT ĐỐI DÀNH CHO AGENT]:**
- Bạn **KHÔNG** được dùng Visual Rule (từ `brand/`) để thay đổi Ontology Dữ liệu.
- Bạn **KHÔNG** được dùng Data Architecture để ép buộc trải nghiệm người dùng (UX/IA).
- Bạn **KHÔNG** được tự ý thay đổi Quyết định của Human.
- Khi hai tài liệu mâu thuẫn giữa các Domain -> **STOP** và yêu cầu Human Decision.

## 3. CẤU TRÚC TÀI LIỆU (BRAND AUTHORITY MAP)
Khi một agent hoặc developer tham gia vào dự án, liên quan đến Design/UI/Creative, bạn **PHẢI** đọc theo thứ tự sau (tài liệu số nhỏ có thẩm quyền phủ quyết tài liệu số lớn trong cùng Domain):

1. **[01_BRAND_CONSTITUTION.md](./01_BRAND_CONSTITUTION.md):** Bản ngã thương hiệu. GIATỘC là gì? Không phải là gì? Ranh giới các không gian.
2. **[02_BRAND_NARRATIVE.md](./02_BRAND_NARRATIVE.md):** Câu chuyện thương hiệu. Gia tộc muốn kể gì về chính mình và nói gì với thế giới?
3. **[03_CREATIVE_STRATEGY.md](./03_CREATIVE_STRATEGY.md):** Chiến lược sáng tạo. Định hướng cảm xúc và chiến thuật cốt lõi.
4. **[04_VISUAL_STRATEGY.md](./04_VISUAL_STRATEGY.md):** Chiến lược thị giác. Cảm giác tổng thể (Composition, Weight, Typography behavior).
5. **[05_DESIGN_LANGUAGE.md](./05_DESIGN_LANGUAGE.md):** Ngữ pháp thiết kế. Luật layout, typography, phân định Surface Registers.
6. **[briefs/](./briefs/):** Creative Briefs cho từng Surface cụ thể.
7. **[BRAND_GOVERNANCE_v0.1.md](./BRAND_GOVERNANCE_v0.1.md):** Design System Tokens & Components (CSS Variables, Values, Radius = 0, v.v.).

*(Để xem cấu trúc trang chi tiết, tham chiếu chéo sang `docs/design/GIATOC_INNER_SITE_UX_IA_SPEC_v0.1.md` và `docs/design/GIATOC_UX_STABILITY_CONTRACT_v0.4.md`)*

## 4. QUY TẮC ĐỌC HIỂU TÌNH TRẠNG (DOCUMENT STATUS)
Trong các file tại thư mục này, mọi quyết định được gắn nhãn trạng thái (Status) rõ ràng:
- `[APPROVED]`: Đã được Human (Tuấn) phê duyệt. Bắt buộc tuân thủ.
- `[PROPOSED]`: Agy hoặc Agent khác đề xuất, chờ Human duyệt.
- `[WORKING HYPOTHESIS]`: Giả thuyết đang sử dụng tạm thời để không block tiến độ.
- `[OPEN QUESTION]`: Vấn đề cần Human quyết định.
- `[SUPERSEDED]`: Quyết định cũ đã bị thay thế.
