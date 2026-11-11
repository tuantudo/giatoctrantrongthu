# 12 TARGET PROFILES

## 1. Executive Summary
Báo cáo này loại bỏ hoàn toàn phương pháp "Phán đoán qua tên thư mục" (Name-based Inference) để chuyển sang lập hồ sơ dữ liệu (Profiling) dựa trên Bằng chứng vật lý (Physical Evidence) từ NAS. 
Đã lập profile thành công cho 4 vùng nhạy cảm (`FAMILYSEARCH`, `03_CORE`, `ChiLinh`, `_DEPRECATED`) bằng cách kiểm tra trực tiếp cấu trúc con và siêu dữ liệu (metadata), từ đó đưa ra quyết định vòng đời chính xác thay vì đốt cháy giai đoạn.

## 2. FAMILYSEARCH Profile
- **File count:** 1 file
- **Subdirectory structure:** `PUBLISHED/2026-SNAPSHOT-ANCESTORS`
- **File type distribution:** `.txt`
- **Naming patterns:** `README.txt`
- **Evidence:** 
  - *OBSERVED:* Thư mục gần như trống rỗng, chỉ chứa 1 file README và cấu trúc chờ sẵn cho năm 2026.
  - *INFERENCE:* Đây không phải là Raw Data đang rò rỉ vào ATLAS. Đây là một thư mục được tạo sẵn (skeleton) cho dự án Gia Phả tương lai.
- **T-DOS Context:** Thư mục này đang chờ dữ liệu (Clean Data) nạp vào, không phải là kho rác.

## 3. 03_CORE Profile
- **Subdirectory structure:** Chứa thư mục con `PERSONAL`.
- **Evidence:**
  - *OBSERVED:* Đây không phải là nơi đổ đống dữ liệu. Nó được tổ chức có chủ ý với thư mục `PERSONAL`.
  - *INFERENCE:* Đây có vẻ là một Active Workspace (khu vực làm việc) mà Tuấn tự lập ra bên trong `TUAN_FORGE` để chứa các file cá nhân quan trọng, thay vì tuân theo luồng xử lý nạp/xả của T-DOS. 

## 4. ChiLinh Profile
- **File count:** Hàng loạt file PDF lớn.
- **Subdirectory structure:** `Coaching on Data Analytics (Dr. Khai Tran)-20250228`, `Corporate Finance`, `Material- Leadership`, `Philosophy`, `GOOGLE SCHOLAR`.
- **File type distribution:** `.pdf` (rất nhiều tài liệu học thuật).
- **Naming patterns:** `Problem Solving in Organization.pdf`, `BRM - Unit guide 2025.pdf`, `2016 - Hague, Market Research in Practice 3rd.pdf`.
- **Evidence:**
  - *OBSERVED:* Toàn bộ nội dung là tài liệu học thuật, nghiên cứu, giáo trình đại học/thạc sĩ (MBA).
  - *INFERENCE:* `ChiLinh` TUYỆT ĐỐI KHÔNG phải là một mớ rác cần phân loại (`02_SORT`). Đây là một **Active Study/Project Workspace** (Không gian học tập/nghiên cứu). Việc đề xuất đẩy nó vào `02_SORT` ở Report 10 là sai lầm nghiêm trọng.

## 5. _DEPRECATED Profile
- **Subdirectory structure:** `$RECYCLE.BIN`, `System Volume Information`, `vinaamazing-hinhanh`.
- **Evidence:**
  - *OBSERVED:* Chứa các thư mục rác hệ thống đặc trưng của Windows (`$RECYCLE.BIN`, `System Volume Information`).
  - *INFERENCE:* Đây chính xác là một **Raw Drive Dump** (bản sao lưu nguyên xi từ một ổ cứng/USB cũ chạy Windows). 
  - Nó được đặt tên là `_DEPRECATED` có lẽ vì Tuấn không còn dùng ổ cứng đó nữa. Đây KHÔNG phải là khu vực cách ly mã độc (Quarantine). Đây là một bản Backup thô (Raw Archive).

## 6. Comparative Evidence Matrix

| Zone | Raw Evidence | Processed Evidence | Active Workspace | Archive Evidence | Duplicate Evidence | Provenance | Confidence |
|---|---|---|---|---|---|---|---|
| `FAMILYSEARCH` | Không | Cấu trúc rỗng chờ sẵn | Không | Không | Không | Tự tạo (Skel) | High |
| `03_CORE` | Không | Có (`PERSONAL`) | Có | Không | Chưa rõ | Tuấn tạo | Medium |
| `ChiLinh` | Không | Có (Đã chia môn học) | Có (Study/MBA) | Không | Có (.DS_Store) | Tải từ web/trường | High |
| `_DEPRECATED` | Có (Drive Dump) | Không | Không | Có (Legacy Backup) | Khả năng cao | Ổ cứng Windows cũ | High |

## 7. Human Decision Inputs

**1. FAMILYSEARCH:**
- *Đã biết:* Là thư mục khung (skeleton) chờ sẵn dữ liệu 2026.
- *Câu hỏi Human cần trả lời:* Anh có muốn giữ khung này ở root `TUAN_ATLAS` hay nên move nó vào đúng Domain (`TUAN_ATLAS/Assets/Family`) để tuân thủ rule "ATLAS root không chứa data"?

**2. 03_CORE:**
- *Đã biết:* Chứa thư mục `PERSONAL`.
- *Câu hỏi Human cần trả lời:* Dữ liệu cá nhân bên trong này đã đủ "sạch" để chuyển thẳng vào `TUAN_ATLAS/Assets/Personal` chưa, hay anh vẫn đang dùng nó làm Workspace hằng ngày?

**3. ChiLinh:**
- *Đã biết:* Đây là tài liệu học tập/nghiên cứu (MBA).
- *Câu hỏi Human cần trả lời:* Nên đóng gói thư mục này thành `TUAN_ATLAS/Assets/Study/ChiLinh` (nếu đã học xong), hay chuyển nó về máy Mac làm Active Workspace?

**4. _DEPRECATED:**
- *Đã biết:* Là bản copy từ một ổ cứng Windows cũ.
- *Câu hỏi Human cần trả lời:* Anh muốn giữ lại bản copy thô này (đưa vào `TUAN_ATLAS/Archive/Legacy_Drives`), hay cho nó qua `TUAN_FORGE/01_INBOX` để lọc lấy ảnh `vinaamazing-hinhanh` và vứt bỏ file rác Windows?

## 8. Recommended Next Step
- Trình bày 4 câu hỏi trên cho Tuấn.
- Chờ Tuấn đưa ra phán quyết vòng đời (Lifecycle Verdict) cho từng vùng dựa trên Evidence đã cung cấp, thay vì phán đoán mù mờ.

---
`STOP — HUMAN GATE`
