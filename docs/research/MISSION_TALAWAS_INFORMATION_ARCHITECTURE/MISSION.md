# MISSION CHUNG: TALAWAS INFORMATION ARCHITECTURE & PUBLISHING SYSTEM RESEARCH

## PROJECT:
Giatoc — di sản tinh thần của gia tộc được số hoá trên không gian số.

## MISSION OBJECTIVE:
Reverse-engineer talawas.org như một case study về Information Architecture, Content Model, Publishing System, Archive và User Experience.

Mục tiêu KHÔNG phải sao chép talawas.
Mục tiêu là tìm hiểu bằng chứng cho thấy một hệ thống xuất bản có nhiều loại nội dung, tác giả, chuyên mục, series, publication, archive và nhiều giai đoạn phát triển đã tổ chức, liên kết và duy trì nội dung như thế nào; sau đó cung cấp dữ liệu nghiên cứu để thiết kế kiến trúc Giatoc mà không bị chi phối bởi các giả định hiện tại.

## NGUYÊN TẮC NGHIÊN CỨU:
1. Phân biệt tuyệt đối:
    * OBSERVED: quan sát trực tiếp được.
    * EVIDENCE: bằng chứng có thể truy nguyên.
    * INFERENCE: suy luận từ bằng chứng.
    * HYPOTHESIS: giả thuyết chưa được chứng minh.
2. Không được suy diễn công nghệ nội bộ nếu website không cung cấp đủ bằng chứng.
3. Không đánh giá talawas theo tiêu chí “tốt/xấu”, “đẹp/xấu”, “hiện đại/lạc hậu”.
4. Không thiết kế lại Giatoc trong quá trình khảo sát.
5. Không dùng kiến trúc Giatoc hiện tại để ép cách hiểu talawas.
6. Không giả định rằng:
    * mỗi nội dung = một webpage;
    * mỗi series = một landing page;
    * SPA là kiến trúc mặc định;
    * web là nơi lưu trữ canonical;
    * publication và archive là cùng một khái niệm.
7. Khi không biết, ghi rõ KHÔNG BIẾT / CHƯA CÓ BẰNG CHỨNG.

## SCOPE CHUNG:
**A. INFORMATION ARCHITECTURE**
* homepage, navigation, category, tag, author, series / loạt bài, issue / số, publication, book / chapter, archive, search, index, related content, cross-linking

**B. CONTENT MODEL**
Xác định các content object có thể quan sát được và các metadata/relationship của chúng.

**C. PUBLISHING MODEL**
Nghiên cứu cách talawas tổ chức các hình thức: diễn đàn, blog, tạp chí, tủ sách, talawas chủ nhật, archive, các collection/series khác nếu có bằng chứng.

**D. TEMPORAL EVOLUTION**
Nghiên cứu các giai đoạn: 2001–2003, 2003–2005, 2005–2008, 2009–2010, trạng thái archive sau khi ngừng hoạt động.
Không chỉ mô tả thay đổi giao diện; phải tìm xem ontology, publication model, URL, archive và content organization thay đổi thế nào.

**E. ARCHIVAL / PRESERVATION**
* URL persistence, archive structure, old/new systems, preservation of old content, relationship giữa active publication và archive, dấu hiệu của migration hoặc coexistence nếu quan sát được.

**F. GOVERNANCE / EDITORIAL MODEL**
Chỉ nghiên cứu những gì có bằng chứng: ban biên tập, tác giả, blogger, khách mời, quyền đăng, quyền duyệt, editorial workflow, technical administration, publication responsibility.

**G. USER EXPERIENCE**
Khảo sát: discovery, navigation, reading, author discovery, series discovery, archive discovery, related content, information density, continuity giữa các publication.

**H. TECHNICAL ARCHAEOLOGY**
Khảo sát những gì có thể quan sát: URL pattern, query parameters, endpoint naming, HTML structure, pagination, search/filter behavior, assets, PDF/document publication, dấu hiệu của database-backed rendering, legacy systems, static/archive behavior.

## DELIVERABLE:
Mỗi agent phải tạo MỘT báo cáo riêng trong: `docs/research/MISSION_TALAWAS_INFORMATION_ARCHITECTURE/`
- `AGY_REPORT.md` (AGY: Information Architecture / Content Model / Editorial & Publishing Research Lead)
- `OPENCODE_REPORT.md` (OpenCode: Technical Archaeology / Web Structure / URL / Rendering / Archive Mechanics)
- `CLINE_REPORT.md` (Cline: Experience Architecture / Navigation / Discovery / Reading / Visual Information Architecture)

Báo cáo phải có:
1. Executive Summary
2. Scope
3. Sources / Evidence
4. Observations
5. Reconstructed Model
6. Uncertainties
7. Important Patterns
8. Implications / Lessons
9. Questions Remaining
10. Evidence Index

## QUY TẮC PHỐI HỢP:
* Tôn trọng ranh giới file báo cáo (không agent nào sửa file của agent khác).
* Không biến research thành implementation.
* Final principle: Hỏi "Talawas đã giải quyết bằng cấu trúc nào?" chứ không phải "Làm sao copy?".
