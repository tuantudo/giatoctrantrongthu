# QUY TRÌNH QUẢN TRỊ THAY ĐỔI (CHANGE GOVERNANCE WORKFLOW)
**Hệ thống Quản trị Tri thức — CÂY GIA PHẢ / GIATỘC TRẦN TRỌNG THU**

> **Trạng thái:** CANONICAL / ACTIVE  
> **Chủ quản:** AGY (Execution Coordinator)  
> **Thẩm định:** Emarald (Analysis Authority)  
> **Phê duyệt:** Tuấn (Human Final Authority)  
> **Phiên bản:** v1.0 (02/11/2026)  
> **Nguyên tắc cốt lõi:** *Không có thay đổi mã nguồn hoặc dữ liệu nào được phép thực hiện mà không có đề xuất, phạm vi rõ ràng, bằng chứng định lượng, và sự phê duyệt theo đúng thẩm quyền.*

---

## 1. QUY TRÌNH 8 BƯỚC TIÊU CHUẨN (STANDARD 8-STEP CHANGE LIFECYCLE)

Mọi thay đổi trong hệ thống bắt buộc phải đi qua chuỗi quy trình khép kín sau:

```text
 1. PROPOSE  ───>  2. SCOPE  ───>  3. EVIDENCE  ───>  4. APPROVE
(Đề xuất)        (Xác định)        (Bằng chứng)       (Phê duyệt)
                                                           │
                                                           ▼
 8. VERIFY   <─── 7. DOCUMENT <─── 6. TEST     <───  5. IMPLEMENT
(Hậu kiểm)       (Tài liệu hóa)    (Kiểm thử)         (Thực thi)
```

1. **PROPOSE (Đề xuất):** Nêu rõ mục tiêu kinh doanh hoặc yêu cầu kỹ thuật cần giải quyết, tham chiếu đến một Task cụ thể trong `AUDIT/MASTER_COMPLETION_PLAN.md`.
2. **SCOPE (Xác định phạm vi):** Liệt kê chính xác danh sách các tệp dự kiến sẽ chỉnh sửa, giới hạn chặt chẽ trên bề mặt được phân quyền (Surface Governance).
3. **EVIDENCE (Bằng chứng tiền đề):** Thu thập dữ liệu hiện trạng (baseline metrics, checksum, screenshot hoặc logs) trước khi sửa đổi.
4. **APPROVE (Phê duyệt):** Xác định cấp độ thay đổi. Nếu thuộc nhóm yêu cầu Human Gate, **BẮT BUỘC DỪNG LẠI** và xin phê duyệt từ Tuấn.
5. **IMPLEMENT (Thực thi):** Triển khai mã nguồn hoặc cấu hình tối thiểu cần thiết để đạt mục tiêu, tuân thủ nghiêm ngặt quy tắc bảo tồn tài liệu và chú thích code.
6. **TEST (Kiểm thử độc lập):** Chạy bộ kiểm thử tương ứng (Unit test, Browser QA, Security Scanner, hoặc Database integrity check).
7. **DOCUMENT (Tài liệu hóa):** Cập nhật đồng bộ các tài liệu Canonical liên quan theo quy định tại `docs/CANONICAL_DOCUMENT_REGISTRY.md`.
8. **VERIFY (Hậu kiểm):** Đối soát lại toàn bộ trạng thái Git (`git status`), đảm bảo không có tác dụng phụ hoặc file rác phát sinh, lập Biên bản bàn giao chuẩn 10 mục.

---

## 2. PHÂN CẤP THAY ĐỔI & THẨM QUYỀN (CHANGE CLASSIFICATION MATRIX)

| Cấp Độ Thay Đổi | Bề Mặt Tác Động (Surface) | Tác Nhân Thực Hiện | Thẩm Quyền Phê Duyệt | Bắt Buộc Human Gate? |
| :--- | :--- | :--- | :--- | :---: |
| **1. Documentation-Only** | `docs/`, `AUDIT/`, `.agents/skills/`, `README.md` | AGY / Emarald | Emarald xem xét | **KHÔNG** (Tự chủ nếu không đổi Product Scope) |
| **2. Frontend UI / CSS / Markup** | `src/css/`, `src/js/ui/`, `lab.html`, `design-playground/` | Cline / AGY | AGY nghiệm thu Browser QA | **KHÔNG** trong Lab; **CÓ (GATE-03)** khi đưa ra `index.html` chính thức |
| **3. Backend & API Contract** | `server/index.js`, `server/member.js`, `server/auth.js` | AGY Only | Emarald kiểm tra API Contract | **CÓ (GATE-01B)** nếu liên quan đến an ninh |
| **4. Database Schema & Data** | `server/family_archive.db`, `server/db_*.js`, `schema_update.sql` | AGY Only | **Tuấn (Human Authority)** | **BẮT BUỘC (GATE-02)** |
| **5. Security & Privacy Model** | ReBAC policies, Whitelist middleware, Thư Clara, Secrets | AGY Only | **Tuấn & Emarald** | **BẮT BUỘC (GATE-01B & GATE-04)** |
| **6. Infrastructure & Deployment** | `vercel.json`, Synology NAS, Docker, Domains, DNS | AGY Only | **Tuấn (Human Authority)** | **BẮT BUỘC (GATE-06)** |
| **7. Domain Meaning & Ontology** | Khái niệm dòng họ, mô hình thực thể MẠCH/Clara, quan hệ xã hội | Tuấn quyết định | **Tuấn (Bất khả xâm phạm)** | **BẮT BUỘC TUYỆT ĐỐI** |

---

## 3. CÁC CHỐT CHẶN PHÊ DUYỆT BẮT BUỘC (HUMAN APPROVAL GATES REGISTRY)

Khi thực thi công việc chạm vào bất kỳ ranh giới nào dưới đây, Agent **BẮT BUỘC DỪNG LẠI**, xuất trình diff hoặc bằng chứng, và chờ lệnh bằng văn bản từ Tuấn:

- **GATE-01A:** Phê duyệt Kế hoạch Tổng thể Master Completion Plan v2.0 *(ĐÃ HOÀN TẤT)*.
- **GATE-01B:** Phê duyệt từng Diff mã nguồn vá 8 lỗ hổng an ninh (CF-01 đến CF-07) trước khi gộp vào branch chính.
- **GATE-02:** Phê duyệt kết quả kiểm thử phục hồi (Restore Test) từ 3 bản sao lưu CSDL vật lý trước khi nạp lại dữ liệu (Reseed).
- **GATE-03:** Phê duyệt nghiệm thu UI System vNEXT và kết quả kiểm thử Playwright Browser QA 4 viewports (375, 768, 1024, 1440px) trong Vibecode Lab trước khi đẩy ra `index.html`.
- **GATE-04:** Phê duyệt chính sách phân quyền ReBAC và ma trận phân định Nhận diện vs Tiết lộ (Recognition vs Disclosure).
- **GATE-05:** Phê duyệt kết quả kiểm thử tích hợp E2E trên môi trường Staging.
- **GATE-06:** Quyết định kích hoạt phiên bản chính thức V1.0, đồng bộ NAS và kích hoạt Production Deployment.
- **TRƯỜNG HỢP KHẨN CẤP / BẤT CỨ LÚC NÀO:**
  - Sửa đổi lịch sử Git (`git push --force`, `git reset --hard`, BFG Repo-Cleaner).
  - Lệnh xóa tệp hoặc cấu trúc CSDL (`rm -rf`, `DROP TABLE`, `TRUNCATE`).
  - Xoay vòng secrets hoặc thay đổi mật khẩu quản trị.

---
*Quy chuẩn quản trị thay đổi là cam kết danh dự kỹ thuật của AGY và toàn bộ đội ngũ phát triển nhằm đảm bảo tính bền vững và an toàn tuyệt đối cho di sản số gia tộc.*

