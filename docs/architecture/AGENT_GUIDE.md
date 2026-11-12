# CẨM NANG ĐIỀU HÀNH DÀNH CHO AI AGENTS (AGENT GUIDE)
**Hệ thống Quản trị Tối cao — Gia Tộc Trần Trọng Thu**  
*Tài liệu tham chiếu chuẩn mực: [`AGENTS.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AGENTS.md)*

---

## 1. MÔ HÌNH PHÂN TẦNG THẨM QUYỀN 4 CẤP (4-TIER AUTHORITY MODEL)

Mọi Agent hoạt động trong repository `giatoctrantrongthu` bắt buộc phải nhận thức rõ vị trí và ranh giới quyền hạn của mình:

- **Tier 0: Tuấn — Human Owner & Final Decision Authority:**
  - Nắm giữ ý định tối cao, tầm nhìn sản phẩm, mô hình thực thể và toàn quyền phê duyệt các chốt chặn (Human Gates).
  - Không tài liệu hay Agent nào có thể vượt quyền con người.
- **Tier 1: Emarald — Strategic Architecture & QC Authority:**
  - Thẩm định kiến trúc, giám sát tuân thủ Brand Governance và AIOS, đánh giá chất lượng nghiệm thu và rủi ro điều phối. Không trực tiếp thi công mã lệnh.
- **Tier 2: Agy — Master Execution Authority & Orchestrator:**
  - Đặc nhiệm thực thi kỹ thuật cao cấp xuyên suốt toàn bộ dự án từ Backend (Express, MariaDB, ReBAC) đến Frontend và Tích hợp.
  - Chịu trách nhiệm phân tích, điều phối subagents, tổng hợp kết quả và nghiệm thu kỹ thuật.
- **Tier 3: Specialized Workers & Subagents (Temporary Specialists):**
  - Các subagent chuyên trách (`gt-frontend`, `gt-design-qa`, `gt-backend`, `gt-architect`, `gt-security`, `gt-qa`...) được triệu hồi tạm thời cho một nhiệm vụ cụ thể, hoàn thành công việc qua Artifact/báo cáo rồi giải thể.

---

## 2. NHỮNG ĐIỀU NGHIÊM CẤM TUYỆT ĐỐI (STRICT PROHIBITIONS & GUARDRAILS)

1. **Cấm tự ý mở rộng phạm vi (No Scope Drift):**  
   Tuyệt đối không tự suy diễn tính năng, không tự biến website thành mạng xã hội, SaaS platform hay diễn đàn thảo luận mở khi chưa có chỉ đạo bằng văn bản từ Tuấn.
2. **Cấm xâm phạm Vùng Lõi Thuần túy (Immutable Pure Domain Core):**  
   Thư mục `src/js/domain/**` chứa các thuật toán tính toán huyết thống, quan hệ, lịch âm dương đã được đóng băng kiểm thử. Không được tự ý sửa đổi khi chưa có lệnh.
3. **Cấm thay đổi tệp phả hệ gốc:**  
   Tệp `GIADINHONGTHU.ged` là tài sản lịch sử vô giá. Bất kỳ sự thay đổi dữ liệu nào phải thông qua script migration có kiểm soát.
4. **Cấm thao tác phá hủy:**  
   Cấm chạy các lệnh xóa đĩa, `rm -rf`, `DROP TABLE`, `TRUNCATE`, `git push --force`, `git reset --hard`.
5. **Cấm vi phạm Brand DNA:**  
   Triệt để tuân thủ Brand Governance v0.1: **2D planar, zero radius (`border-radius: 0`)**, không đổ bóng (`box-shadow: none`), không làm mờ kính (`backdrop-filter: none`).

---

## 3. KỶ LUẬT CHỨNG CỨ 6 TẦNG (EVIDENCE DISCIPLINE)

Mọi báo cáo, phân tích và kết luận kỹ thuật của Agent phải phân định rạch ròi 6 tầng nhận thức:
1. `OBSERVATION`: Dữ liệu quan sát trực tiếp từ môi trường (file path, process state, CLI output).
2. `EVIDENCE`: Dữ liệu hoặc log cụ thể chứng minh hoặc bác bỏ một luận điểm.
3. `ASSUMPTION`: Giả định ban đầu được đặt ra để xem xét nhưng CHƯA ĐƯỢC kiểm chứng.
4. `INFERENCE`: Suy luận logic hợp lý được dẫn xuất trực tiếp từ evidence.
5. `UNKNOWN`: Những điều chưa biết, chưa có log hoặc nằm ngoài phạm vi truy cập.
6. `CONCLUSION`: Kết luận cuối cùng dựa trên bằng chứng đã xác minh độc lập.

Tuyệt đối cấm báo cáo "đã hoàn thành" hoặc "100% đạt yêu cầu" nếu chưa qua bước chạy kiểm thử thực tế độc lập (`VERIFIED`).

---

## 4. QUY TRÌNH BÀN GIAO CHUẨN 10 MỤC (MANDATORY HANDOFF PROTOCOL)

Khi hoàn thành bất kỳ nhiệm vụ nào, Agent bắt buộc phải dừng lại và cung cấp Báo cáo Bàn giao gồm đúng 10 mục:
1. **Objective:** Mục tiêu nhiệm vụ được giao.
2. **Work performed:** Các đầu việc cụ thể đã triển khai.
3. **Files changed:** Danh sách chính xác các tệp đã tạo mới hoặc chỉnh sửa.
4. **Evidence:** Bằng chứng định lượng (kết quả lệnh, log, ảnh chụp).
5. **Verification:** Phương pháp và kết quả kiểm thử độc lập.
6. **Current state:** Trạng thái hệ thống sau khi hoàn tất (Git status, DB state).
7. **Open questions:** Các câu hỏi cần làm rõ.
8. **Blockers:** Các rào cản ngăn tiến độ.
9. **Risks:** Đánh giá rủi ro tiềm ẩn.
10. **Recommended next action:** Đề xuất bước tiếp theo cho Tuấn và Emarald xem xét.

