# V0 VISUAL FORENSIC REVIEW v0.7

## 1. Executive Summary
Bài toán hiện tại không phải là thiếu sót về Typeface hay Style, mà là sự suy giảm nghiêm trọng về **Composition** và **Visual Weight**. Khi các quy tắc Semantic khắt khe của V1 tước đi lớp thông tin (MẠCH, Ký ức, Gia phả), nó đã vô tình phá vỡ luôn Ngữ pháp Thị giác (Design Grammar) khiến V0 trông bề thế. Report này sẽ bóc tách các nguyên lý thiết kế của V0 và đề xuất cách chuyển giao chúng sang V1 mà không vi phạm Semantic Architecture.

## 2. Runtime Evidence
- **V0 Reference:** `prototype/design-001-public/index.html` và `prototype.css`. Phân tích DOM và CSS structure.
- **V1 Target:** `localhost:3000` (sau khi đã cập nhật Serif và Type Scale).

## 3. V0 Composition Map
```text
┌─────────────────────────────────────────────────────────────┐
│ A. UTILITY STRIP (Quiet, Meta-information, Tools)           │
├─────────────────────────────────────────────────────────────┤
│ B. MASTHEAD (Huge SVG Logo - Absolute Focal Point)          │
├─────────────────────────────────────────────────────────────┤
│ C. STICKY PUB NAV (Solid boundaries, anchoring the page)    │
├─────────────────────────────────────────────────────────────┤
│ D. INTRODUCTION (Center aligned, H1 + Draft Copy + Stats)   │
├─────────────────────────────────────────────────────────────┤
│ E. CHOOSE YOUR PATH (2-Column Grid: Public vs Member)       │
│    [ Bordered Cards, high contrast CTA ]                    │
├─────────────────────────────────────────────────────────────┤
│ F. CURATED CONTENT (MẠCH, Memories, Archives)               │
│    [ Dense, multi-column editorial grid ]                   │
├─────────────────────────────────────────────────────────────┤
│ G. COLOPHON (Footer)                                        │
└─────────────────────────────────────────────────────────────┘
```

## 4. V0 Information Architecture
V0 có một IA nặng về "Trưng bày" (Exhibition): Nó phơi bày các luồng thông tin sâu của hệ thống ra ngoài trang chủ để lôi kéo người dùng.

## 5. Visual Hierarchy
V0 dẫn mắt người dùng theo đường chữ Z hoàn hảo:
1. Từ trên xuống giữa: **Logo Đồ hoạ (Masthead)** (Lớn nhất).
2. Xuyên qua thanh Nav đậm đặc.
3. Chạm vào **H1 (Gia Tộc TTT là ai?)**.
4. Rẽ làm 2 luồng ở khối **Choose Your Path**.
5. Rơi vào vùng Content đậm đặc bên dưới.

## 6. Focal Point Analysis
- **Focal Point #1: Masthead SVG.** Không phải H1, mà chính graphic logo mới là điểm neo mắt.
- **Focal Point #2: 2 Cột Path.** Sự tương phản giữa nút "Tư cách thành viên" (Nền đen chữ trắng) và link "Khám phá" tạo ra một điểm dừng (pause) bắt buộc phải suy nghĩ.
- **Focal Point #3: Cụm Curated Content.**

## 7. Spatial Rhythm
- V0 sử dụng pattern: `Compression (Header)` → `Expansion (Masthead)` → `Compression (Nav)` → `Expansion (Intro)` → `Split (Paths)` → `Grid (Content)`.
- Nhịp điệu này tạo ra cảm giác "cấu trúc không gian của một tòa nhà" (Institutional Space). V1 hiện tại chỉ là `Expansion` từ đầu đến cuối.

## 8. Visual Weight
V0 phân bổ trọng lượng rất thông minh: Nặng ở trên cùng (Masthead), nặng ở giữa (Paths), và chia đều độ đặc (density) ở dưới. V1 trống hoác ở mọi nơi, làm chữ bị trôi (floating).

## 9. Grouping / Proximity
V0 dùng **Đường viền (Borders)** và **Khung lưới (Grid)** để gom nhóm. Khối "Choose Your Path" dùng 2 hộp viền mỏng cạnh nhau để ngầm định sự tương phản (Public vs Private).

## 10. Alignment System
V0 có Center Axis (Masthead, Intro) và Split Axis (Paths, Content Grid). Sự chuyển đổi linh hoạt giữa Căn giữa và Căn hai cột làm trang không bị nhàm chán. V1 chỉ căn giữa đơn điệu.

## 11. Typography
V0 dùng hàm `clamp(34px, 4.6vw, 56px)` cho H1 và `-0.01em` letter-spacing, kết hợp với các thẻ Meta chữ Sans-serif nhỏ `12px/13px` in hoa, tạo ra sự tương phản cực mạnh giữa Heading cổ điển và Meta hiện đại.

## 12. Contrast System
Contrast lớn nhất ở V0 là **Mật độ (Density)**: Phía trên thưa thớt, phía dưới dày đặc (Editorial Grid).

## 13. Publication / Institutional Character
V0 chắc chắn sử dụng **Publication Grammar** (Ngữ pháp của Tạp chí/Báo giấy):
- Có Masthead như Măng-sét báo.
- Có Utility Strip như dòng ngày tháng phát hành.
- Có Sticky Nav như mục lục.
- Có các đường viền nét ba (`3px double`) đặc trưng của in ấn.

## 14. Responsive Composition
Trên mobile, V0 fallback về 1 cột nhưng vẫn giữ được thứ tự: Masthead -> H1 -> Path 1 -> Path 2, không bị gãy nhịp.

## 15. V1 Comparison
| V1 (Current) | Root Cause of Failure |
|---|---|
| Mất Masthead | H1 text không đủ sức nặng thay thế Logo Graphic. |
| Navigation trống | `[ Home ] [ Login ]` trơ trọi làm mất ranh giới Kiến trúc (Gate). |
| Bố cục 1 cột (Sequential) | Gom Tiếng nói, Về gia tộc, Người trong nhà thành 1 cột dọc làm mất đi sự tương phản (Tòa nhà mất đi 2 lối rẽ). |
| Mất Content Grid | Semantic Rule cấm rò rỉ data, làm trang thâm hụt Visual Density nghiêm trọng. |

## 16. V0 → V1 Design Principle Transfer Matrix

| V0 Principle | Evidence in V0 | V1 Status | Classification |
|---|---|---|---|
| Graphic Anchor | `masthead-logo` SVG | Thay bằng H1 text | **SHOULD TRANSFORM** |
| Split Hierarchy | `paths` (2 cột) | 1 cột dọc | **MUST PRESERVE** |
| Publication Rhythm| `double border`, `util-strip` | Trống trơn | **SHOULD TRANSFORM** |
| Discovery/Member | `path-public` vs `path-member` | Stacked list | **MUST PRESERVE** |
| Content Density | Curated MẠCH grid | Không có | **MUST NOT RESTORE** |

## 17. Semantic Safety Analysis
- **Masthead Graphic:** Đưa Graphic Logo trở lại làm Focal Point là AN TOÀN về Semantic (nó không lộ data).
- **Split Hierarchy:** Chuyển `Tiếng nói của gia tộc` (Public) và `Người trong gia tộc` (Member) thành bố cục 2 cột song song là AN TOÀN (Nó phản ánh đúng tính chất "Ngã rẽ ở Cổng").
- **Publication Rhythm:** Thêm các đường viền phân tách (rulers) để đóng khung Header là AN TOÀN (Giúp trang vững chãi hơn mà không thêm item).

## 18. Root Causes of V1 Visual Regression
V1 "không đẹp" là vì: **Sự tuyến tính (Linearity)**.
Tất cả mọi thứ bị ném vào giữa màn hình, căn giữa từ trên xuống dưới. V1 giống một cái Landing Page đơn giản hoặc trang tài liệu Word, thay vì một **Thiết chế Văn hóa (Cultural Institution)** cần sự bề thế, phân nhánh (Split paths) và nền tảng thị giác đồ họa (Masthead).

## 19. MUST PRESERVE
- **Split Composition (Bố cục chia luồng):** Phải tách bạch phần Dành cho Public (Tiếng nói) và Phần Cửa vào (Member Gate) bằng tương phản không gian (Grid 2 cột), không phải xếp dọc.

## 20. SHOULD TRANSFORM
- **Masthead:** Thay vì dùng H1 text vô hồn làm tiêu điểm, hãy dùng chính SVG Logo vắt ngang để tạo trọng lượng tuyệt đối, biến H1 thành Typography hỗ trợ bên dưới.
- **Header Rhythm:** Header của V1 cần các đường nét phân định (Borders) mạnh mẽ hơn để tạo cảm giác "Cổng", dù nó chỉ có 2 nút.

## 21. MUST NOT RESTORE
- Toàn bộ khối Curated Content (MẠCH, Gia phả).
- Các tab Navigation công khai.

## 22. Human Decisions Required
1. Có đồng ý biến cụm Logo Đồ họa (SVG) thành Masthead khổng lồ thay vì chỉ nằm ẩn trong Header nhỏ không?
2. Có đồng ý chuyển `Tiếng nói của gia tộc` và `Người trong gia tộc` thành bố cục 2 Cột Đối Xứng (Split Gate) thay vì xếp dọc không?

## 23. Final Verdict
- V0 DESIGN GRAMMAR: **UNDERSTOOD**
- V1 VISUAL CONTINUITY: **LOST**
- ROOT CAUSE IDENTIFIED: **YES** (V1 thiếu Graphic Anchor và Split Composition).
- TRANSFERABLE DESIGN PRINCIPLES IDENTIFIED: **YES** (Phục dựng Masthead + Split Layout).

**STOP AND WAIT FOR HUMAN REVIEW.**
