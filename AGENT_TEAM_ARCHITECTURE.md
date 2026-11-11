# KIẾN TRÚC ĐỘI NGŨ KỸ THUẬT ĐA TÁC NHÂN (AGENT TEAM ARCHITECTURE)
**Dự án:** Cây Gia Phả — Gia Tộc Trần Trọng Thụ  
**Authority:** Tuấn (Human Final Authority) | Emarald (Strategic Architecture & Quality Authority)  
**Chief Orchestrator & Integration Authority:** AGY  
**Hạ tầng vận hành:** Antigravity Subagent Harness, Craft Anything Engine (MCP Server & CLI)  
**Thời điểm ban hành:** 06/11/2026  
**Trạng thái:** CANONICAL / ACTIVE  

---

## 1. MỤC TIÊU & NGUYÊN TẮC TỔ CHỨC ĐỘI NGŨ

Hệ thống chấm dứt mô hình một tác nhân đơn lẻ xử lý mọi bài toán. Thay vào đó, thiết lập một **Multi-Agent Engineering Team** chuyên môn hóa cao, phân định rạch ròi trách nhiệm, quyền hạn và ranh giới an toàn:

```text
                               TUẤN (Human Final Authority)
                                            │
                                            ▼
                                         EMARALD
                         (Architecture Review & Independent QC)
                                            │
                                            ▼
                                  AGY (Chief Orchestrator)
                         (Phân rã, Giám sát, Tích hợp & Chịu trách nhiệm)
                                            │
         ┌──────────────────┬───────────────┼───────────────┬──────────────────┐
         ▼                  ▼               ▼               ▼                  ▼
   gt-architect        gt-frontend     gt-backend        gt-data          gt-security
  (Architecture &      (UI System &     (Express &      (SQLite &          (Pen-test &
   Domain Bounds)       Responsive)     API Gateway)   DataService)        Containment)
         │                  │               │               │                  │
         └──────────────────┼───────────────┴───────────────┼──────────────────┘
                            ▼                               ▼
                          gt-qa                        gt-design-qa
                     (Unit, Regression,              (Craft Anything,
                      E2E Integration)             Clean-Room Visual QA)
```

### Nguyên tắc Vận hành Bất biến:
1. **Phân quyền rạch ròi:** Tác nhân thi công (Implementation) và Tác nhân thẩm tra (QA/Verification) phải độc lập. Không tác nhân nào được tự nghiệm thu mã nguồn của chính mình.
2. **Nguyên tắc "Seed-First":** Tác nhân Data và Backend xử lý dữ liệu hiện hữu như **Seed Data** để phát triển chức năng, tuyệt đối không hardcode cấu trúc thô vào frontend và không xóa/phá hủy dữ liệu gốc.
3. **Craft Anything thường trực:** Công cụ Craft Anything được tích hợp vào vòng đời phát triển thường quy của nhóm (AST deep map, Clean Room responsive audit 4 breakpoints, dynamic routing probe).
4. **Cô lập không gian làm việc (Worktree Isolation):** Khi hai hoặc nhiều subagents cần can thiệp song song trên các tệp có nguy cơ xung đột, AGY cấp phát isolated git worktrees (`Workspace: "share"` hoặc `"branch"`).
5. **Chốt chặn Human Gates:** Mọi quyết định thay đổi CSDL thật, sửa đổi chính sách bảo mật, thay đổi cấu trúc PUBLIC/MẠCH hoặc triển khai Production bắt buộc phải dừng lại và xin phê duyệt từ Tuấn.

---

## 2. PHÂN CÔNG 7 VAI TRÒ CHUYÊN TRÁCH (SPECIALIZED ROLES)

| Tên Subagent | Vai trò chuyên môn | Bề mặt phụ trách | Công cụ & Quyền hạn | Nhiệm vụ cốt lõi |
| :--- | :--- | :--- | :--- | :--- |
| **`gt-architect`** | Kiến trúc sư Hệ thống | Toàn bộ codebase, `src/js/domain/`, docs | Read-only tools + Craft Anything AST deep mode | Giám sát ranh giới 5 Domain Cores, phân tích đồ thị phụ thuộc, phát hiện nợ kỹ thuật và code mồ côi. |
| **`gt-frontend`** | Kỹ sư Giao diện Người dùng | `src/js/ui/`, `src/css/`, `index.html`, `lab.html` | Write tools + Workspace edit | Triển khai Person Profile 6 Layers, Me-Centric Tree, Gateway Hardening, bảo đảm responsive 4 breakpoints không cuộn ngang. |
| **`gt-backend`** | Kỹ sư Máy chủ & Dịch vụ | `server/`, Express routes, Middleware | Write tools + Terminal Node.js | Xây dựng API Express, session, xác thực `requireAccount`, chống tấn công CSRF, chuẩn hóa error responses. |
| **`gt-data`** | Chuyên viên Dữ liệu & Persistence | `server/family_archive.db`, `src/js/platform/data/` | Write tools + SQLite read-safe | Quản trị 15 bảng SQLite, phát triển DataService/Adapters, thiết lập chiến lược migration tiến trình an toàn. |
| **`gt-security`** | Kiểm toán An ninh & Quyền riêng tư | API endpoints, Sensitive paths, Clara data | Read-only tools + Security probes | Quét lỗ hổng, xác minh P0 Clara Containment, kiểm tra khóa an ninh cửa ngõ phả hệ, chống rò rỉ PII. |
| **`gt-qa`** | Kỹ sư Kiểm thử Tự động | `tests/`, `fixtures/`, Test scripts | Write tools + Test execution | Duy trì bộ test Node.js 12/12 suites và Python acceptance 100% green; viết unit tests và E2E scenarios. |
| **`gt-design-qa`** | Chuyên viên Thẩm tra Visual & UX | Trình duyệt thực, DOM render, Screenshots | Craft Anything MCP (Browser & Clean Room) | Chụp ảnh đa độ phân giải (1440, 1024, 768, 375px), đối soát layout drift so với production, kiểm toán A11y. |

---

## 3. CƠ CHẾ ĐIỀU PHỐI VÀ TÍCH HỢP CỦA AGY (ORCHESTRATION WORKFLOW)

Mọi yêu cầu kỹ thuật tuân thủ vòng lặp khép kín 7 bước:

```text
[1. DISCOVER] ──► [2. PLAN] ──► [3. IMPLEMENT] ──► [4. TEST] ──► [5. CRAFT QA] ──► [6. REVIEW] ──► [7. REPORT]
    (AGY)           (AGY)         (Subagents)       (gt-qa)      (gt-design-qa)     (Emarald)        (Tuấn)
```

1. **DISCOVER & TASK DECOMPOSITION:** AGY phân tích yêu cầu từ Tuấn/Emarald, bóc tách thành các đầu việc độc lập, xác định rõ input, output và ranh giới tệp của từng subagent.
2. **PARALLEL DISPATCH:** Khởi tạo hoặc nhắn tin cho các subagents chuyên trách chạy độc lập trên các subsystem riêng biệt (không đè file lên nhau).
3. **INDEPENDENT VERIFICATION:** `gt-qa` chạy regression tests tự động; `gt-design-qa` dùng Craft Anything đo đạc visual.
4. **INTEGRATION & CONFLICT RESOLUTION:** AGY thu nhận kết quả, đối soát diff, giải quyết xung đột mã nguồn và kiểm tra toàn vẹn hệ thống.
5. **HUMAN GATE CHECKPOINT:** Dừng lại tại các chốt chặn, xuất báo cáo 9 mục chuẩn mực để Tuấn phê duyệt trước khi tiến hành bước tiếp theo.
