# 11 TARGET VALIDATION

## 1. Executive Summary
- **Mục tiêu:** Kiểm duyệt lại toàn bộ các đề xuất (Proposed Targets) trong Report #10 để đảm bảo chúng tuân thủ tuyệt đối quy trình Lifecycle của T-DOS và không gây rủi ro mất dữ liệu, vỡ cấu hình đồng bộ, hoặc đốt cháy giai đoạn (skip stage).
- **Phát hiện chính:** Đa số các đề xuất trong Report #10 mắc phải lỗi "Skip Lifecycle" (Nhảy cóc giai đoạn). Việc gán nhãn thư mục chỉ dựa vào tên (Name-based inference) thiếu tính xác đáng. Có nguy cơ cao phá vỡ hệ sinh thái đồng bộ (Synology Drive) đang diễn ra tại thư mục `homes`.

## 2. Target Validation Matrix

| Current | Proposed Target | T-DOS Stage | Evidence Supporting Target | Evidence Missing | Lifecycle Risk | Verdict |
|---|---|---|---|---|---|---|
| `TUAN_ATLAS/FAMILYSEARCH` | `FORGE/03_AUDIT` | Skip | OBSERVED (Nằm sai chỗ ở ATLAS) | Không có evidence chứng minh dữ liệu này đã đi qua cổng nạp INBOX và SORT. | Skip stage `01_INBOX` & `02_SORT`. | NOT VALIDATED |
| `TUAN_FORGE/03_CORE` | `CLEAN` / `ATLAS` | Skip | Tên thư mục chứa chữ "CORE" (Inference) | Không có evidence cho thấy file bên trong đã được làm sạch, xóa duplicate hay chuẩn hóa tên. | Đẩy dữ liệu thô vào Clean Library. | NOT VALIDATED |
| `TUAN_FORGE/ChiLinh` | `FORGE/02_SORT` | Sort | OBSERVED (Cấu trúc nhóm theo dự án) | Không rõ đây là Storage tĩnh hay Workspace đang active (liên tục có file mới tạo). | Gãy cấu trúc Project Workspace nếu đang active. | UNKNOWN |
| `TUAN_FORGE/_DEPRECATED` | `06_QUARANTINE` | Quarantine | Tên thư mục mang nghĩa "bỏ đi" (Inference) | Không có evidence đây là file lỗi/độc hại. Deprecated có thể chỉ là dữ liệu hết vòng đời (Archive). | Nhầm lẫn giữa Data rác và Data cũ (Archive). | NOT VALIDATED |
| `homes/.../FLASHDRIVE-*` | `FORGE/01_INBOX` | Inbox | OBSERVED (Chứa bản sao lưu từ ổ cứng ngoài) | Chưa biết có đang bị ràng buộc bởi Synology Drive Sync task nào không. | Gãy kết nối Sync của người dùng. | VALIDATED WITH CONDITION |
| `homes/.../MAC_SYNC_WORKSPACE` | KHÔNG ĐỀ XUẤT MOVE | Workspace | Nằm trong vùng `homes` được index và sync | Chưa xác định tần suất read/write mtime gần đây nhất. | Đóng băng tiến trình làm việc nếu move. | UNKNOWN |

## 3. Lifecycle Violations Found
Quá trình kiểm duyệt phát hiện các đề xuất trong Report #10 đang vi phạm nguyên tắc T-DOS:
- **Skip Stage (Đốt cháy giai đoạn):** Việc đề xuất đưa `FAMILYSEARCH` thẳng vào `03_AUDIT` vi phạm nguyên tắc "Mọi dữ liệu bắt đầu ở INBOX". Dữ liệu này cần được trả về `01_INBOX` (hoặc `02_SORT` nếu cấu trúc con đã chia thư mục) để rà soát lại từ đầu.
- **Name-based Fallacy (Suy luận dựa trên tên):** Mặc định `03_CORE` là hàng sạch (CLEAN) chỉ vì nó tên là CORE. Mặc định `_DEPRECATED` là Quarantine. Theo T-DOS: Quarantine dành cho file lỗi, có vấn đề metadata/an toàn. File cũ/bỏ đi phải đi vào `ATLAS/Archive` sau khi đã clean, hoặc ném vào `05_DUP` / `TRASH` nếu là rác.

## 4. Data Safety Risks
- **Active Sync Breakage (Vỡ đồng bộ):** Thư mục `homes/tuandzain` đang bị kẹt `Re-indexing needed` ở Phase 2.5, cho thấy nó đang được quản lý bởi Synology Drive. Nếu tự ý Move `FLASHDRIVE-*` hay `MAC_SYNC_WORKSPACE` sang `/volume1/TUAN_FORGE`, mọi kết nối đồng bộ từ máy Mac của Tuấn sẽ bị đứt gãy ngay lập tức.
- **Hidden Dependencies:** Có thể các thư mục như `ChiLinh` đang được chia sẻ link (Shared Link) cho đối tác. Đổi đường dẫn sẽ làm chết link.

## 5. Human Decisions Required
Agent không thể tự quyết định các vấn đề sau nếu thiếu Human Gate:
1. `FAMILYSEARCH`: Tuấn muốn ném nó về hẳn `01_INBOX` làm lại từ đầu, hay đưa vào `02_SORT` vì Tuấn tự tin nó đã được phân loại sơ bộ?
2. `03_CORE`: Đây thực chất là dữ liệu gì? (Dữ liệu gốc, dữ liệu sạch, hay chỉ là một đống lộn xộn Tuấn thấy quan trọng?).
3. `ChiLinh`: Đây là dự án đã đóng (Archive) hay đang chạy (Active Workspace)?
4. `_DEPRECATED`: Tuấn muốn lưu trữ lịch sử (Archive) hay cách ly hoàn toàn (Quarantine)?
5. `homes/tuandzain`: Cấu hình Synology Drive của Tuấn hiện đang Sync chính xác những folder con nào trong `homes` với máy Mac?

## 6. Recommended Execution Order
*Trình tự thực thi an toàn (Chỉ đề xuất, KHÔNG EXECUTE):*
- **Bước 1:** Trả các thư mục sai luồng trong `TUAN_FORGE` (`ChiLinh`, `_DEPRECATED`, `03_CORE`) về lại `01_INBOX` để chạy theo đúng 6 bước của T-DOS. Trừ khi Tuấn xác nhận chúng là Active Workspace.
- **Bước 2:** Di dời `TUAN_ATLAS/FAMILYSEARCH` về `TUAN_FORGE/01_INBOX`.
- **Bước 3:** (Sau khi Tuấn config lại Synology Drive Sync) Mới bắt đầu move các bản Backup Dump từ `homes` sang `TUAN_FORGE/01_INBOX`.

---
`STOP — HUMAN GATE`
