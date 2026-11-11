---
name: repository-audit
description: >-
  Quy trình khảo sát pháp y repository ở chế độ STRICT READ-ONLY.
  Dùng khi bắt đầu phiên làm việc mới hoặc cần kiểm tra hiện trạng mã nguồn,
  git working tree, cấu trúc tệp, phát hiện bí mật rò rỉ mà không gây ra bất kỳ tác dụng phụ nào.
---

# KỸ NĂNG: REPOSITORY AUDIT (STRICT READ-ONLY)

## 1. Điều Kiện Kích Hoạt (Trigger)
- Bắt đầu một session làm việc mới để nắm bắt hiện trạng.
- Trước khi thực hiện bất kỳ thay đổi nào liên quan đến an ninh, tái cấu trúc hoặc dọn dẹp file.
- Khi được yêu cầu đối soát số lượng file thay đổi, commit git, hoặc kiểm tra rò rỉ dữ liệu.

## 2. Phạm Vi & Phân Quyền (Scope & Ownership)
- **Chủ sở hữu:** AGY (Backend Owner) hoặc Auditor được phân công.
- **Chế độ:** BẮT BUỘC `STRICT READ-ONLY`.
- **Cấm:** Không sửa code, không xóa file, không commit, không đổi branch, không chạy lệnh ghi vào DB.

## 3. Quy Trình Thực Hiện (Procedure)
1. **Kiểm tra trạng thái Git:**
   ```bash
   git status --short --untracked-files=all
   git log -n 5 --oneline
   ```
   Ghi nhận số lượng file Modified (`M`), Deleted (`D`), Untracked (`??`).
2. **Khảo sát cấu trúc tệp:**
   Sử dụng Python hoặc `find` để kiểm tra các file nghiệp vụ, file dữ liệu phả hệ (`*.ged`, `*.json`), file cấu hình (`.env*`, `vercel.json`).
3. **Quét phát hiện bí mật & Thông tin nhạy cảm:**
   Kiểm tra sự tồn tại của mật khẩu plaintext, Google Apps Script webhook URL, session secrets.
4. **Đối chiếu với Master Completion Plan:**
   So sánh các phát hiện với [`AUDIT/MASTER_COMPLETION_PLAN.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/MASTER_COMPLETION_PLAN.md).

## 4. Ranh Giới Nghiêm Ngặt (Strict Boundaries)
- Không in mật khẩu, credentials, hay dữ liệu PII của gia đình ra màn hình hoặc file báo cáo.
- Không tự ý stage (`git add`) hay reset (`git checkout / git restore`) bất kỳ thay đổi nào.

## 5. Tiêu Chí Nghiệm Thu (Completion Criteria)
- Biên bản audit rõ ràng, có số liệu thống kê định lượng cụ thể.
- Xác nhận số lượng mục git status trước và sau khi audit không thay đổi.

