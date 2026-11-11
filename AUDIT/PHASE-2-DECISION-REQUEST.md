# PHIẾU YÊU CẦU PHÊ DUYỆT & ĐỀ XUẤT THỰC THI (PHASE 2 - CHECKPOINT)
**Dự án:** Cây Gia Phả — Gia Tộc Trần Trọng Thụ  
**Kính gửi:** Tuấn — Product Owner / Human Final Authority  
**Thẩm tra kiến trúc:** Emarald — Strategic Architecture & Quality Authority  
**Đơn vị đề xuất:** AGY — Chief Orchestrator & Integration Authority  
**Thời điểm lập:** 06/11/2026  
**Chế độ:** CHECKPOINT STOP (Tuyệt đối dừng lại, không tự ý sửa code trước khi có phê duyệt)

---

## 1. ĐỀ XUẤT HẠNG MỤC THỰC THI ĐẦU TIÊN (FIRST IMPLEMENTATION CANDIDATE)

AGY đề xuất chọn hạng mục **PYTHON TEST RECONCILIATION** làm ứng viên triển khai đầu tiên ngay sau Checkpoint này vì hội tụ 3 yếu tố:
- **Rủi ro kỹ thuật: CỰC THẤP (ZERO IMPACT TO RUNTIME).** Chỉ chỉnh sửa duy nhất 1 tệp kiểm thử `tests/test_markdown_acceptance.py`. Không đụng vào CSDL, không đổi code sản phẩm, không ảnh hưởng dữ liệu.
- **Giá trị thực tế: RẤT CAO.** Khôi phục trạng thái **100% GREEN TESTS** cho toàn bộ repository (cả Node.js và Python), giải quyết dứt điểm nợ kỹ thuật tồn đọng lớn nhất của bộ test chấp nhận.
- **Tính chuẩn mực: BẢO VỆ CHÍNH SÁCH BẢO MẬT P0.** Khẳng định bằng code kiểm thử rằng `data/mach.json` cấm tiệt bài viết Clara, chấm dứt mâu thuẫn kiến trúc kéo dài từ tháng 9/2026.

---

## 2. MINH ĐỊNH BẢN CHẤT DỮ LIỆU & Ý NGHĨA CÁC CON SỐ (12, 19, 8)

Hệ thống cam kết không sửa test một cách cơ hội để "cho qua". Bản chất của các con số đã được đối soát pháp y 100%:

```text
       05/09/2026 (Commit 0f06af5)                         Sau Tái Cấu Trúc P0 Clara Containment
┌───────────────────────────────────────┐            ┌───────────────────────────────────────────────┐
│     data/mach.json CŨ (GỘP CHUNG)     │            │             data/mach.json (CÔNG KHAI)        │
│   • 12 bài MẠCH công khai             │  ──────►   │   • ĐÚNG 12 bài MẠCH                          │
│   • 7 thư Clara riêng tư              │            │   • 0 bài Clara (Chống rò rỉ dữ liệu)         │
│   ════════════════════════════════    │            └───────────────────────────────────────────────┘
│   TỔNG CỘNG: 19 bài                   │                                    +
└───────────────────────────────────────┘            ┌───────────────────────────────────────────────┐
                   │                                 │          data/private/clara.json (BẢO MẬT)    │
                   ▼                                 │   • ĐÚNG 8 thư Clara hoàn chỉnh               │
┌───────────────────────────────────────┐            │   • Chỉ tài khoản nhánh A-HD mới được đọc     │
│  tests/test_markdown_acceptance.py    │            └───────────────────────────────────────────────┘
│  • Viết ngày 06/09/2026               │                                    │
│  • Assert cứng: len == 19 (LỖI THỜI!) │                                    ▼
│  • Đòi hỏi clara-001 nằm trong mach!  │            Kiểm thử cũ BỊ LỖI THỜI vì vi phạm chính sách P0!
└───────────────────────────────────────┘
```

1. **Con số 19:** Là tổng số bài gộp chung trong 1 file tạm thời tại commit `0f06af5` (12 MẠCH + 7 Clara). Con số này đã bị khai tử về mặt kiến trúc khi áp dụng P0 Clara Containment.
2. **Con số 12:** Là số lượng bài viết chuẩn mực, duy nhất của ấn bản MẠCH Issue 01 công khai (`content/mach/issue-01/`).
3. **Con số 8:** Là số lượng thư Clara riêng tư hoàn chỉnh hiện có trên đĩa (`content/private/clara/`), đã được Bác Tuấn mở rộng từ 7 lên 8 thư.

---

## 3. KẾ HOẠCH TRIỂN KHAI CHI TIẾT (IMPLEMENTATION PLAN)

### 3.1 Tệp tin duy nhất thay đổi:
- [`tests/test_markdown_acceptance.py`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/tests/test_markdown_acceptance.py) (Chỉ sửa class `TestCompiledMach` từ dòng 136 đến dòng 160).

### 3.2 Nội dung thay đổi cụ thể:
1. **Sửa assertion tổng số bài MẠCH:**  
   Đổi từ `self.assertEqual(len(articles), 19)` thành `self.assertEqual(len(articles), 12, "Expected exactly 12 compiled public MẠCH articles")`.
2. **Bổ sung assertion giám sát P0 Clara Containment:**  
   Thêm vòng lặp kiểm tra: nếu bất kỳ bài viết nào trong `data/mach.json` có slug bắt đầu bằng `clara` hoặc `seriesSlug == "thu-gui-clara"` thì test lập tức báo lỗi nghiêm trọng.
3. **Bổ sung kiểm thử độc lập cho 8 thư Clara:**  
   Nếu môi trường có file `data/private/clara.json`, nạp và kiểm tra đủ 8 bài, xác minh sự tồn tại của `clara-001` và chữ ký `"Bác Tuấn"`.
4. **Kiểm tra rò rỉ cú pháp Markdown thô:**  
   Giữ nguyên kiểm tra toàn bộ `blocks` của cả MẠCH và Clara để bảo đảm không bị leak ký tự `#`, `*`, `[` ra màn hình.

### 3.3 Quy trình kiểm thử nghiệm thu sau khi sửa:
```bash
# 1. Chạy test Python acceptance:
python3 tests/test_markdown_acceptance.py
# Kỳ vọng: 6/6 tests PASS (Ran 6 tests in ~0.05s, OK)

# 2. Chạy test an ninh cách ly Clara:
node scripts/verify_clara_containment.mjs
# Kỳ vọng: PASS (12 public articles, 0 leaks)

# 3. Chạy toàn bộ 12 test suites của Node.js:
npm test
# Kỳ vọng: 12/12 suites PASS (100%)
```

### 3.4 Chiến lược hoàn nguyên (Rollback Strategy):
Nếu phát sinh bất kỳ điều gì không như kỳ vọng, chỉ cần hoàn nguyên 1 lệnh duy nhất:
```bash
git checkout tests/test_markdown_acceptance.py
```
Hệ thống sẽ quay về nguyên trạng 100% trong vòng 1 giây mà không để lại bất kỳ tàn dư nào.

---

## 4. BA QUYẾT ĐỊNH KÍNH TRÌNH TUẤN PHÊ DUYỆT

AGY kính trình Tuấn xem xét và cho ý kiến quyết định về 3 nội dung:

### QUYẾT ĐỊNH 1: Phê duyệt sửa bài test Python `tests/test_markdown_acceptance.py`
- [ ] **CHẤP THUẬN (APPROVED):** Cho phép AGY tiến hành cập nhật file test theo đúng phương án trên, đưa toàn bộ repo về trạng thái 100% Green Tests.
- [ ] **TỪ CHỐI / ĐIỀU CHỈNH:** Yêu cầu phương án khác.

### QUYẾT ĐỊNH 2: Quyết định kiến trúc `DEC-A03` (Lưu trữ Trang Chủ & Thẻ Mời)
- [ ] **PHƯƠNG ÁN 1 (ĐỀ XUẤT):** Tạo bảng `cms_documents` trong CSDL SQLite `server/family_archive.db` để lưu trữ chuỗi chữ Trang chủ và Thẻ Mời, mở đường xây dựng `mod-public-cms` trong Admin Control Center v2.1.
- [ ] **PHƯƠNG ÁN 2:** Tiếp tục lưu trữ dưới dạng file cấu hình JSON trong Git repo.
- [ ] **GIỮ NGUYÊN TRẠNG THÁI OPEN:** Chưa chốt lúc này, tiếp tục hardcode trong `public-home.js`.

### QUYẾT ĐỊNH 3: Phê duyệt dọn dẹp hai file di sản mồ côi (`CLEAN-01`)
- [ ] **CHẤP THUẬN (APPROVED):** Dựa trên bằng chứng AST của Craft Anything (0 cạnh phụ thuộc), cho phép dời `src/js/member-app.js` và `src/js/app-v2.js` vào `archive/legacy-frontend/` để làm sạch mã nguồn.
- [ ] **GIỮ LẠI:** Tạm thời chưa di chuyển.

---

> [!CAUTION]
> **AGY ĐÃ DỪNG LẠI TẠI CHECKPOINT NÀY.**  
> Tuyệt đối không có bất kỳ lệnh sửa code, can thiệp CSDL hay commit nào được thực hiện. AGY sẵn sàng thi công ngay khi nhận được phê duyệt của Tuấn.

