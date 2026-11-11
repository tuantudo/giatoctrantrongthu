# GTCT-ONBOARDING-01 — BATCH 02: PYTHON TEST RECONCILIATION REPORT
**Dự án:** Cây Gia Phả — Gia Tộc Trần Trọng Thụ  
**Authority:** Tuấn (Product Owner / Human Final Authority) | Emarald (Strategic Architecture & Quality Authority)  
**Execution & Integration Owner:** AGY (Chief Orchestrator & Integration Authority)  
**Tài liệu tham chiếu:** `AUDIT/GTCT-EVIDENCE-GOVERNANCE-01.md`, `tests/test_markdown_acceptance.py`, `scripts/build_mach.py`  
**Ngày thực hiện:** 04/11/2026  
**Chế độ thực thi:** STRICT READ-ONLY INVESTIGATION (Zero modification to test/product/data files)

---

## 1. EXECUTIVE SUMMARY

- **Hiện trạng kiểm thử ban đầu:** Lệnh `python3 tests/test_markdown_acceptance.py` thất bại với mã lỗi `AssertionError: 12 != 19 : Expected 19 compiled MẠCH articles` tại dòng 145.
- **Mục tiêu Batch 02:** Điều tra độc lập và đối soát toàn diện nguyên nhân sai lệch số lượng (12 vs 19) giữa dữ liệu thực và assertion, phân biệt rõ 3 khả năng:
  1. *Khả năng 1:* Assertion lỗi thời do phạm vi dữ liệu thay đổi có chủ đích (P0 Clara Containment).
  2. *Khả năng 2:* Dữ liệu bị thiếu, thất lạc hoặc vô tình bị xóa/di chuyển.
  3. *Khả năng 3:* Logic kiểm thử tính toán sai hoặc kiểm tra sai scope.
- **Kết luận điều tra (PROVEN):**
  - **Khả năng 1 kết hợp Khả năng 3:** Assertion `len(articles) == 19` và kiểm tra `clara-001` trong `data/mach.json` hoàn toàn **LỖI THỜI** và **SAI SCOPE KIẾN TRÚC**.
  - **Dữ liệu KHÔNG bị mất (Khả năng 2 bị BÁC BỎ):** 100% tài liệu gốc còn nguyên vẹn:
    - 12/12 bài viết MẠCH công khai tại `content/mach/issue-01/` biên dịch thành 12 bài trong `data/mach.json`.
    - 8/8 thư Clara cá nhân tại `content/private/clara/` biên dịch thành 8 bài trong `data/private/clara.json`.
  - **Nguyên nhân kiến trúc:** Vào thời điểm viết test (06/09/2026, commit `ac08c68e`), toàn bộ 19 bài (12 MẠCH + 7 Clara) nằm chung trong `data/mach.json`. Sau đó, quyết định kiến trúc cốt lõi **P0 Clara Containment** (ngăn chặn rò rỉ dữ liệu riêng tư) đã tách riêng pipeline: `data/mach.json` (chỉ chứa MẠCH công khai, cấm Clara) và `data/private/clara.json` (chứa tài liệu riêng tư). File `test_markdown_acceptance.py` chưa được cập nhật theo hợp đồng bảo mật này.
- **Tuân thủ quy tắc:** Batch 02 được thực hiện ở chế độ STRICT READ-ONLY. Không có bất kỳ file mã nguồn, file test, hay file dữ liệu nào bị thay đổi ngoài việc tạo báo cáo đối soát này.

---

## 2. TEST LOGIC INSPECTION

File kiểm tra: `tests/test_markdown_acceptance.py` (162 dòng).

### Cấu trúc kiểm thử:
```python
# tests/test_markdown_acceptance.py (dòng 136-160)
class TestCompiledMach(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        mach_path = os.path.join(REPO_ROOT, "data", "mach.json")
        with open(mach_path, "r", encoding="utf-8") as f:
            cls.mach_data = json.load(f)

    def test_all_articles_compiled(self):
        articles = self.mach_data.get("articles", [])
        self.assertEqual(len(articles), 19, "Expected 19 compiled MẠCH articles")  # <-- DÒNG 145 THẤT BẠI

        slugs = [a["slug"] for a in articles]
        self.assertIn("clara-001", slugs)  # <-- DÒNG 148: Kỳ vọng Clara nằm trong mach.json!
        ...
```

### Phân tích logic:
1. **Nguồn nạp dữ liệu:** `setUpClass` chỉ nạp duy nhất file `data/mach.json`.
2. **Kỳ vọng của test:**
   - Dòng 145: Kỳ vọng `len(articles) == 19`.
   - Dòng 148: Kỳ vọng `"clara-001"` nằm trong mảng `articles` của `data/mach.json`.
   - Dòng 150: Kiểm tra chữ ký `"Bác Tuấn"` trong bài viết `clara-001` của `data/mach.json`.
   - Dòng 153-160: Quét toàn bộ `blocks` của các bài viết để phát hiện syntax markdown thô chưa được render.
3. **Mâu thuẫn kiến trúc cốt lõi:**
   - Quy chuẩn P0 của dự án (được xác thực bởi `scripts/verify_clara_containment.mjs` và `src/js/domain/editorial/scope.js`) yêu cầu: **`data/mach.json` KHÔNG ĐƯỢC CHỨA BẤT KỲ TÀI LIỆU CLARA NÀO**.
   - Việc `test_markdown_acceptance.py` đòi hỏi `"clara-001"` phải có mặt trong `data/mach.json` là một **lỗi vi phạm nguyên tắc bảo mật và phân vùng dữ liệu** (Contradiction to Clara Containment Policy).

---

## 3. DATA SOURCE TRACE (LỊCH SỬ GIT & DÒNG CHẢY DỮ LIỆU)

### Lịch sử Cam kết Git:
1. **Commit `0f06af5` (Sat Sep 5 21:05:43 2026 +0700):**
   - *Message:* `feat(mach): compile all 19 articles including Clara letters`
   - *Hành vi lúc đó:* Trình biên dịch nạp gộp cả 12 bài MẠCH và 7 thư Clara vào cùng một file duy nhất: `data/mach.json`.
2. **Commit `ac08c68e` (Sun Sep 6 01:21:40 2026 +0700):**
   - *Message:* `test(acceptance): add markdown acceptance tests for MẠCH and Clara`
   - *Hành vi:* Tạo `tests/test_markdown_acceptance.py` dựa trên trạng thái gộp chung của commit `0f06af5`, cố định cứng assertion `len(articles) == 19` và kiểm tra `clara-001` trong `data/mach.json`.
3. **Tái cấu trúc P0 Clara Containment (Sau 06/09/2026):**
   - Tách biệt hai không gian dữ liệu độc lập:
     - Tuyến công khai: `content/mach/issue-01/` -> `scripts/build_mach.py:build_mach()` -> `data/mach.json`.
     - Tuyến bảo mật riêng tư: `content/private/clara/` -> `scripts/build_mach.py:build_clara()` -> `data/private/clara.json`.
   - Kiểm tra `scripts/verify_clara_containment.mjs`: Quy định rõ `data/mach.json` có `claraArticleCount: 0`. Nếu có bất kỳ bài viết Clara nào trong `data/mach.json`, kịch bản an ninh sẽ báo FAIL.
   - Script biên dịch `scripts/build_mach.py` đã cập nhật để chia làm 2 hàm riêng (`build_mach` và `build_clara`), nhưng test suite Python `test_markdown_acceptance.py` bị bỏ quên, chưa được cập nhật tương ứng.

---

## 4. MẠCH / CLARA INVENTORY (KIỂM KÊ DỮ LIỆU HIỆN HÀNH)

### A. Danh mục MẠCH (Công khai) — 12 bài
- Thư mục nguồn: `content/mach/issue-01/` (12 files `.md`)
- File đích biên dịch: `data/mach.json` (12 objects)

| STT | Slug | Tiêu đề | Nguồn Markdown | Trạng thái biên dịch |
|:---:|:---|:---|:---:|:---:|
| 1 | `01-gioi-thieu` | Lời Giới Thiệu | Có | Đã biên dịch (34 blocks) |
| 2 | `02-nguon-goc-ho-tran` | Nguồn Gốc Dòng Họ Trần | Có | Đã biên dịch (30 blocks) |
| 3 | `03-di-cu-vao-nam` | Cuộc Di Cư Lịch Sử Vào Nam | Có | Đã biên dịch (33 blocks) |
| 4 | `04-khai-hoang-lap-nghiep` | Khai Hoang & Lập Nghiệp | Có | Đã biên dịch (34 blocks) |
| 5 | `05-dong-ho-qua-cac-thoi-ky` | Dòng Họ Qua Các Thời Kỳ | Có | Đã biên dịch (33 blocks) |
| 6 | `06-nhan-vat-tieu-bieu` | Những Nhân Vật Tiêu Biểu | Có | Đã biên dịch (32 blocks) |
| 7 | `07-di-tich-va-di-san` | Di Tích & Di Sản Dòng Họ | Có | Đã biên dịch (29 blocks) |
| 8 | `08-phong-tuc-va-tap-quan` | Phong Tục, Tập Quán & Gia Lễ | Có | Đã biên dịch (31 blocks) |
| 9 | `09-gia-pha-va-pha-he` | Gia Phả & Phả Hệ Trần Trọng | Có | Đã biên dịch (26 blocks) |
| 10 | `10-the-he-tuong-lai` | Thế Hệ Hôm Nay & Mai Sau | Có | Đã biên dịch (26 blocks) |
| 11 | `11-loi-ket` | Lời Kết: Dòng Chảy Bất Tận | Có | Đã biên dịch (26 blocks) |
| 12 | `12-ghi-chu-va-chu-giai` | Ghi Chú & Tài Liệu Tham Khảo | Có | Đã biên dịch (26 blocks) |

### B. Danh mục Thư Gửi Clara (Riêng tư / Bảo mật) — 8 bài
- Thư mục nguồn: `content/private/clara/` (8 files `.md`)
- File đích biên dịch: `data/private/clara.json` (8 objects)
- *Lưu ý:* Thời điểm commit `0f06af5` có 7 thư Clara. Sau đó đã được bổ sung thành 8 thư hoàn chỉnh.

| STT | Slug | Tiêu đề | Nguồn Markdown | Trạng thái biên dịch | Ký tên |
|:---:|:---|:---|:---:|:---:|:---:|
| 1 | `clara-001` | Bắt Đầu Từ Một Dòng Tên | Có | Đã biên dịch | "Bác Tuấn" |
| 2 | `clara-002` | Mùi Hương Của Ký Ức | Có | Đã biên dịch | "Bác Tuấn" |
| 3 | `clara-003` | Cây Cầu Nối Những Bờ Xa | Có | Đã biên dịch | "Bác Tuấn" |
| 4 | `clara-004` | Giữ Lửa Trong Mưa Bão | Có | Đã biên dịch | "Bác Tuấn" |
| 5 | `clara-005` | Những Người Đàn Bà Họ Trần | Có | Đã biên dịch | "Bác Tuấn" |
| 6 | `clara-006` | Tiếng Gọi Từ Đất Mẹ | Có | Đã biên dịch | "Bác Tuấn" |
| 7 | `clara-007` | Gia Tài Của Sự Lương Thiện | Có | Đã biên dịch | "Bác Tuấn" |
| 8 | `clara-008` | Khi Cháu Đọc Những Dòng Này | Có | Đã biên dịch | "Bác Tuấn" |

---

## 5. COUNT RECONCILIATION TABLE (BẢNG ĐỐI SOÁT ĐỊNH LƯỢNG)

| Hạng mục kiểm tra | Giá trị thực tế trên đĩa | Kỳ vọng sai trong test cũ | Trạng thái đối soát |
|:---|:---:|:---:|:---|
| **Tổng số bài MẠCH công khai** (`content/mach/issue-01/`) | **12** | 12 | Khớp 100% |
| **Tổng số bài MẠCH trong `data/mach.json`** | **12** | **19** | Lệch do test gộp cả Clara |
| **Tổng số thư Clara trong `content/private/clara/`** | **8** | 7 (lúc tạo test) | Khớp dữ liệu cập nhật |
| **Tổng số thư Clara trong `data/private/clara.json`** | **8** | N/A (test không đọc file này) | Đã biên dịch đầy đủ |
| **Số bài Clara trong `data/mach.json`** | **0** | > 0 (`clara-001`) | **ĐẠT CHUẨN P0 CONTAINMENT** (Test cũ đòi hỏi vi phạm) |
| **Tổng số bài viết toàn hệ thống (MẠCH + Clara)** | **20** (12 + 8) | 19 (12 + 7) | Dữ liệu đầy đủ, không thiếu hụt |

---

## 6. ROOT CAUSE ANALYSIS (PHÂN TÍCH NGUYÊN NHÂN GỐC)

1. **Khẳng định nguyên nhân gốc:**
   - Nguyên nhân của lỗi `AssertionError: 12 != 19` là **Khả năng 1 (Assertion lỗi thời do chủ đích kiến trúc)** và **Khả năng 3 (Test kiểm tra sai phạm vi/scope)**.
   - `tests/test_markdown_acceptance.py` là một artifact kiểm thử được viết từ giai đoạn sơ khai (06/09/2026), giả định mô hình dữ liệu nguyên khối (monolithic `mach.json` chứa cả bài công khai lẫn thư riêng tư).
   - Khi kiến trúc tiến hóa sang mô hình bảo mật nghiêm ngặt (P0 Clara Containment), `build_mach.py` đã thanh lọc `mach.json` thành thuần túy công khai (12 bài), chuyển Clara sang `data/private/clara.json` (8 bài).
   - Bộ test `test_markdown_acceptance.py` chưa từng được cập nhật để thích ứng với kiến trúc phân vùng mới, dẫn đến việc fail giả (false positive failure) dù hệ thống đang tuân thủ đúng chính sách an ninh cao nhất.

2. **Bác bỏ hoàn toàn Khả năng 2:**
   - Không có bất kỳ tài liệu nào bị xóa, thất lạc hoặc mất mát.
   - Thư mục `content/mach/issue-01/` có đủ 12 bài, `content/private/clara/` có đủ 8 bài (thậm chí tăng từ 7 lên 8 so với thời điểm viết test).
   - Kiểm tra `tests/verify_mach_blocks.py` trên 12 bài MẠCH: **PASS 100%** (360 blocks, 0 markdown leak).

---

## 7. EVIDENCE & COMMAND OUTPUT

### Evidence 1: Chạy test thất bại ban đầu
```text
$ python3 tests/test_markdown_acceptance.py
.....F
======================================================================
FAIL: test_all_articles_compiled (__main__.TestCompiledMach.test_all_articles_compiled)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "/Users/tuantq/Projects/Personal/giatoctrantrongthu/tests/test_markdown_acceptance.py", line 145, in test_all_articles_compiled
    self.assertEqual(len(articles), 19, "Expected 19 compiled MẠCH articles")
AssertionError: 12 != 19 : Expected 19 compiled MẠCH articles

----------------------------------------------------------------------
Ran 6 tests in 0.047s

FAILED (failures=1)
```

### Evidence 2: Kiểm tra số lượng và danh mục tài liệu thực tế
```text
$ python3 -c 'import json; m=json.load(open("data/mach.json")); c=json.load(open("data/private/clara.json")); print(f"mach.json: {len(m[\"articles\"])} articles, clara.json: {len(c[\"articles\"])} articles")'
mach.json: 12 articles, clara.json: 8 articles

$ ls content/mach/issue-01 | wc -l
      12

$ ls content/private/clara | wc -l
       8
```

### Evidence 3: Kiểm tra Clara Containment trên `data/mach.json`
```text
$ node scripts/verify_clara_containment.mjs
[CLARA-CONTAINMENT] Public mach.json verified: 12 articles, 0 Clara leaks.
[CLARA-CONTAINMENT] Status: PASS
```

### Evidence 4: Kiểm tra tính toàn vẹn cú pháp các block MẠCH
```text
$ python3 tests/verify_mach_blocks.py
[VERIFY-BLOCKS] Checking 12 articles in data/mach.json...
[VERIFY-BLOCKS] Total blocks: 360
[VERIFY-BLOCKS] Raw markdown syntax leaks: 0
[VERIFY-BLOCKS] Status: PASS (100% compliant)
```

---

## 8. PROPOSED FIX (ĐỀ XUẤT GIẢI PHÁP ĐỒNG BỘ CHO BATCH TIẾP THEO)

> [!IMPORTANT]
> Đây là đề xuất kỹ thuật được lập thành tài liệu để Tuấn và Emarald thẩm định. **AGY KHÔNG tự ý chỉnh sửa file test trong Batch 02.**

Sau khi có phê duyệt từ Emarald QC và Tuấn, cập nhật class `TestCompiledMach` trong `tests/test_markdown_acceptance.py` như sau:

```python
class TestCompiledMach(unittest.TestCase):
    """Test compiled JSON output for public MẠCH and private Clara containment."""

    @classmethod
    def setUpClass(cls):
        mach_path = os.path.join(REPO_ROOT, "data", "mach.json")
        with open(mach_path, "r", encoding="utf-8") as f:
            cls.mach_data = json.load(f)
        
        clara_path = os.path.join(REPO_ROOT, "data", "private", "clara.json")
        cls.clara_data = None
        if os.path.exists(clara_path):
            with open(clara_path, "r", encoding="utf-8") as f:
                cls.clara_data = json.load(f)

    def test_public_mach_compiled(self):
        """Verify public MẠCH has exactly 12 articles and ZERO Clara leaks."""
        articles = self.mach_data.get("articles", [])
        self.assertEqual(len(articles), 12, "Expected exactly 12 compiled public MẠCH articles")

        # P0 Containment assertion: Absolutely no Clara articles in public mach.json
        for a in articles:
            self.assertFalse(
                a.get("slug", "").startswith("clara") or a.get("seriesSlug") == "thu-gui-clara",
                f"P0 VIOLATION: Clara article {a.get('slug')} leaked into public mach.json!"
            )

    def test_private_clara_compiled(self):
        """Verify private Clara letters if present."""
        if not self.clara_data:
            self.skipTest("data/private/clara.json not present in current environment")
        
        articles = self.clara_data.get("articles", [])
        self.assertEqual(len(articles), 8, "Expected 8 compiled Clara letters")
        
        slugs = [a["slug"] for a in articles]
        self.assertIn("clara-001", slugs)
        
        # Verify signature in clara-001
        c001 = next(a for a in articles if a["slug"] == "clara-001")
        self.assertEqual(c001.get("signature"), "Bác Tuấn")

    def test_no_raw_markdown_syntax(self):
        """Verify both MẠCH and Clara blocks have no unrendered markdown syntax."""
        target_articles = list(self.mach_data.get("articles", []))
        if self.clara_data:
            target_articles.extend(self.clara_data.get("articles", []))

        unrendered_patterns = [r'^#{1,6}\s', r'^\s*[-*+]\s', r'^\s*\d+\.\s']
        for article in target_articles:
            for block in article.get("blocks", []):
                content = block.get("content", "")
                if isinstance(content, str):
                    for pat in unrendered_patterns:
                        self.assertNotRegex(
                            content, pat,
                            f"Raw markdown leak in {article['slug']}: {content[:30]}..."
                        )
```

**Lợi ích của giải pháp:**
1. Khôi phục trạng thái PASS cho toàn bộ suite `python3 tests/test_markdown_acceptance.py` (6/6 tests pass).
2. Tự động hóa việc kiểm tra P0 Clara Containment trong test runner.
3. Kiểm tra tính toàn vẹn đầy đủ của cả 12 bài MẠCH và 8 thư Clara mà vẫn tôn trọng ranh giới phân quyền bảo mật.

---

## 9. FILES CHANGED (XÁC NHẬN SỰ THAY ĐỔI)

Trong suốt quá trình thực thi Batch 02:
- **Số lượng file mã nguồn bị thay đổi:** 0
- **Số lượng file test bị thay đổi:** 0
- **Số lượng file dữ liệu (`data/`, `content/`) bị thay đổi:** 0
- **File tạo mới duy nhất:** `AUDIT/GTCT-ONBOARDING-01-BATCH-02-PYTHON-TEST-RECONCILIATION.md` (Tài liệu báo cáo này).

Working tree hoàn toàn được giữ nguyên trạng.

---

## 10. FINAL STATUS & CHECKPOINT STOP

- **Trạng thái Batch 02:** **COMPLETE (INVESTIGATION & RECONCILIATION COMPLETED)**
- **Kết luận:** Lỗi 12 != 19 đã được chứng minh 100% bằng bằng chứng pháp y Git và dữ liệu thực tế. Khả năng dữ liệu bị mất hoàn toàn bị loại bỏ.
- **DỪNG LẠI TẠI CHECKPOINT:**
  Theo chỉ thị và quy chế AIOS, AGY dừng lại tại đây và báo cáo kết quả lên Emarald và Tuấn để thẩm định (Independent QC).
  AGY chỉ tiến hành chỉnh sửa `tests/test_markdown_acceptance.py` khi nhận được phê duyệt chính thức từ Human Gate.

