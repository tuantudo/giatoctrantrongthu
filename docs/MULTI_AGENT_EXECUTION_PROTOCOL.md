# GIAO THỨC ĐIỀU HÀNH ĐA TÁC NHÂN (MULTI-AGENT EXECUTION PROTOCOL)
**Dự án:** Cây Gia Phả — Gia Tộc Trần Trọng Thụ  
**Authority:** Tuấn (Human Final Authority) | Emarald (Quality Authority)  
**Chief Orchestrator & Integration Authority:** AGY  
**Cập nhật:** 06/11/2026 | **Trạng thái:** CANONICAL / ACTIVE  

---

## 1. NGUYÊN TẮC PHỐI HỢP & PHÒNG NGỪA XUNG ĐỘT (CONFLICT PREVENTION)

Để đảm bảo hiệu quả làm việc nhóm không gây xung đột mã nguồn hoặc ghi đè dữ liệu:
1. **Phân vùng bề mặt tệp nghiêm ngặt (File Surface Partitioning):**
   - Mỗi subagent chỉ được phép thao tác trên đúng phân vùng thư mục đã được chỉ định (Ví dụ: `gt-frontend` chỉ sửa `src/js/ui/` và `src/css/`; `gt-backend` chỉ sửa `server/`).
   - Tuyệt đối cấm hai subagents cùng sửa một tệp tin trong cùng một thời điểm.
2. **Cô lập không gian làm việc (Worktree Isolation):**
   - Khi có các nhiệm vụ song song có nguy cơ xung đột hoặc phụ thuộc phức tạp, AGY khởi tạo subagent với cờ `Workspace: "branch"` hoặc `"share"` để cô lập working tree.
3. **Quy tắc Kiểm tra Chéo Độc lập (Independent Cross-Verification):**
   - Tác nhân viết mã (`gt-frontend`, `gt-backend`, `gt-data`) không có quyền tự đánh dấu hoàn tất.
   - Bắt buộc phải có xác nhận độc lập từ `gt-qa` (chạy 100% green tests) và `gt-design-qa` (đo đạc visual layout qua Craft Anything).

---

## 2. QUY TRÌNH THỰC THI 7 BƯỚC (7-STAGE EXECUTION LIFECYCLE)

```text
  [1. YÊU CẦU TỪ TUẤN / EMARALD]
                │
                ▼
  [2. AGY PHÂN RÃ BATCH & GIAO VIỆC] ──► Tạo Task Briefing cụ thể cho Subagent
                │
                ▼
  [3. THỰC THI CHUYÊN MÔN SONG SONG] ──► gt-frontend (UI), gt-backend (API), gt-data (DB)
                │
                ▼
  [4. KIỂM THỬ TỰ ĐỘNG ĐỘC LẬP]     ──► gt-qa (npm test & python acceptance tests)
                │
                ▼
  [5. THẨM TRA VISUAL & SECURITY]    ──► gt-design-qa (Craft Anything) & gt-security
                │
                ▼
  [6. TÍCH HỢP & KIỂM TRA ĐỒNG BỘ]   ──► AGY giải quyết diff, kiểm tra full-stack
                │
                ▼
  [7. BÁO CÁO BÀN GIAO & DỪNG TẠI CHECKPOINT] ──► Trình Tuấn & Emarald xem xét
```

---

## 3. TIÊU CHUẨN BÁO CÁO BÀN GIAO 9 MỤC CHO MỖI BATCH (MANDATORY 9-POINT REPORT)

Sau mỗi Implementation Batch, báo cáo trình lên Tuấn và Emarald bắt buộc phải gồm đúng 9 mục:

1. **Vấn đề ban đầu (Initial Problem):** Mô tả chính xác lỗi, lỗ hổng hoặc tính năng cần giải quyết.
2. **Nguyên nhân được xác minh (Verified Cause):** Phân tích nguồn gốc vấn đề dựa trên bằng chứng kỹ thuật.
3. **Các file và thành phần bị ảnh hưởng (Affected Files & Components):** Danh sách chính xác các tệp thay đổi.
4. **Thay đổi đã thực hiện (Changes Made):** Mô tả tóm tắt giải pháp kỹ thuật và diff mã nguồn.
5. **Kết quả kiểm thử (Test Results):** Số lượng tests đã chạy, thời gian thực thi, trạng thái 100% PASS.
6. **Bằng chứng Craft Anything (Craft Anything Evidence):** Bằng chứng đo đạc layout, đồ thị AST hoặc probe an ninh (`ev_...`).
7. **Rủi ro còn lại (Remaining Risks):** Đánh giá các điểm cần lưu ý hoặc giới hạn kỹ thuật.
8. **Phương án hoàn nguyên (Rollback Method):** Lệnh git hoặc phương án phục hồi tức thì nếu phát sinh sự cố.
9. **Công việc tiếp theo (Next Steps):** Đề xuất bước đi kế tiếp cho Tuấn và Emarald xem xét.

---

## 4. CHỐT CHẶN BẮT BUỘC DỪNG (STRICT CHECKPOINT STOP RULES)

AGY và toàn bộ đội ngũ kỹ thuật **BẮT BUỘC DỪNG LẠI** tại Checkpoint và xin phê duyệt chính thức từ Tuấn trước khi thực hiện:
- Thay đổi cấu trúc hoặc schema của Cơ sở dữ liệu thật (`server/family_archive.db`).
- Sửa đổi chính sách bảo mật, ranh giới quyền riêng tư hoặc phân quyền ReBAC.
- Chuyển đổi hoặc di chuyển dữ liệu phả hệ thật (`GIADINHONGTHU.ged`).
- Thay đổi kiến trúc Trang nhất đối ngoại và Tạp chí MẠCH.
- Bất kỳ thao tác deploy Production, đồng bộ NAS hoặc push lên nhánh chính `origin/main`.

