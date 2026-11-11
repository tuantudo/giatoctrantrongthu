# HƯỚNG DẪN ĐÓNG GÓP & PHÁT TRIỂN (CONTRIBUTING GUIDE)
**Dự án: CÂY GIA PHẢ — GIATỘC TRẦN TRỌNG THU**

> **Dành cho:** Toàn bộ Lập trình viên con cháu dòng họ và các AI Agent tham gia dự án.  
> **Nguyên tắc tối thượng:** Dự án này lưu trữ di sản văn hóa, tâm linh và đời tư của một dòng họ có thật. Mọi dòng mã và thao tác dữ liệu đều phải tuân thủ đạo đức gia tộc và kỷ luật kỹ thuật cao nhất.

---

## 1. HỆ THỐNG THẨM QUYỀN & QUẢN TRỊ (GOVERNANCE HIERARCHY)

Trước khi thực hiện bất kỳ hành động nào, bạn BẮT BUỘC phải đọc và hiểu rõ:
1. [`AGENTS.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AGENTS.md): Bản hiến pháp quản trị tối cao của dự án.
2. [`USER.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/USER.md): Chỉ thị và ý định sản phẩm của Tuấn (Human Final Authority).
3. [`docs/CANONICAL_DOCUMENT_REGISTRY.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/CANONICAL_DOCUMENT_REGISTRY.md): Sổ tay tra cứu tài liệu quy chuẩn duy nhất cho từng phân hệ.

---

## 2. QUY TRÌNH THỰC HIỆN THAY ĐỔI (8-STEP WORKFLOW)

Mọi đóng góp (dù là sửa 1 dòng CSS hay viết tính năng mới) đều phải tuân thủ quy trình tại [`docs/CHANGE_GOVERNANCE.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/CHANGE_GOVERNANCE.md):

```text
PROPOSE → SCOPE → EVIDENCE → APPROVE → IMPLEMENT → TEST → DOCUMENT → VERIFY
```

- **Chỉ sửa tài liệu (Doc-only):** Được phép tự chủ nếu không làm sai lệch Product Scope.
- **Sửa Frontend/CSS:** Làm việc trong Vibecode Lab (`lab.html`), kiểm thử Playwright Browser QA 4 viewports trước khi trình duyệt.
- **Sửa Backend/API:** Phải chạy đối soát hợp đồng API (`api-contract-validation`).
- **Sửa CSDL / An ninh / Triển khai:** **BẮT BUỘC DỪNG LẠI** và xin phê duyệt Human Gate từ Tuấn.

---

## 3. CÁC NGUYÊN TẮC CẤM KỴ (NON-NEGOTIABLE PROHIBITIONS)

- ❌ **KHÔNG** commit hoặc đẩy trực tiếp lên branch `main` mà không qua review.
- ❌ **KHÔNG** tự ý chạy các lệnh phá hủy: `npm run db:reset`, `rm -rf`, `DROP TABLE`.
- ❌ **KHÔNG** làm lộ bí mật hoặc thông tin đời tư (PII) của người đang sống vào source code, logs hoặc tài liệu báo cáo.
- ❌ **KHÔNG** tự ý định nghĩa lại mô hình thực thể gia phả hoặc xóa bỏ các ranh giới bảo vệ quyền riêng tư (như Thư Clara).

---

## 4. BẮT ĐẦU NHANH (QUICK START)

1. **Khởi chạy môi trường thiết kế Vibecode Lab:**
   ```bash
   node scripts/serve_lab.mjs
   ```
   Mở trình duyệt tại: `http://localhost:8888/lab.html`.

2. **Chạy kiểm tra cơ sở dữ liệu:**
   ```bash
   npm run db:verify
   ```

3. **Tra cứu tài liệu khi có thắc mắc:**
   Mở [`docs/HELP.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/HELP.md).

