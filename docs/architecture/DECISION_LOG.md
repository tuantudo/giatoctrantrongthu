# DECISION LOG

Danh sách này lưu trữ các Quyết định Kiến trúc (Architectural Decisions) đã được phê duyệt (ACCEPTED) hoặc đang chờ (PROPOSED/OPEN).

---

### D-001: T-DOS Scope Exemption
- **DATE:** 2026-09-20 (Khởi tạo đề xuất)
- **DECISION:** T-DOS là cơ chế Governance cho Dữ liệu Tĩnh (Static Assets). Các vùng Active Workspace (Code, Sync Folder) và System/Application Data (Photos, .npm) được miễn trừ khỏi luồng bắt buộc `FORGE -> ATLAS`.
- **RATIONALE:** Ép dữ liệu liên tục thay đổi (mutate) vào luồng lưu trữ sẽ gây vỡ kiến trúc và cản trở công việc hàng ngày.
- **EVIDENCE:** Sự tồn tại hợp lý của `MAC_SYNC_WORKSPACE` và `family-api` tại `homes`.
- **STATUS:** PROPOSED (Chờ Human Authority phê duyệt).
- **REVERSIBILITY:** Medium.
- **OPEN QUESTION:** Vùng Active Workspace sẽ được gọi tên là gì? (Ví dụ: `TUAN_WORKSPACE`).

---

### D-002: Native Capability Priority
- **DATE:** 2026-09-20
- **DECISION:** Tận dụng tối đa năng lực sẵn có (Native capabilities) của Synology (Universal Search, Photos) trước khi xây dựng Custom Capability (như tự build SQLite indexer).
- **RATIONALE:** Tránh phát minh lại bánh xe, tiết kiệm tài nguyên tính toán (CPU/RAM) cho NAS ARM.
- **EVIDENCE:** Universal Search đã thiết lập và chạy ngầm rất mạnh mẽ.
- **STATUS:** ACCEPTED.
- **REVERSIBILITY:** High.

---

### D-003: Entity ID Independence
- **DATE:** 2026-09-20
- **DECISION:** Trong GiaToc Database, Thực thể (Entity) là độc lập. Canonical Data không được hard-code File path của Filesystem vào Entity ID.
- **RATIONALE:** Storage Path có thể đổi, nhưng Entity thì bất biến.
- **EVIDENCE:** Suy luận từ các chuẩn mực thiết kế Database (Best Practice).
- **STATUS:** PROPOSED.
- **REVERSIBILITY:** Low (Sẽ rất tốn kém nếu sửa đổi sau khi Database đã thành hình).

---

### D-004: Capability-First AIOS Model
- **DATE:** 2026-09-20
- **DECISION:** Đổi mô hình AIOS. Mission xác định Role. Role xác định Required Capabilities. Runtime chỉ là Substrate cung cấp Capability có thể tháo lắp.
- **RATIONALE:** Tránh sự phụ thuộc cứng nhắc vào một công cụ cụ thể (như OpenCode hay Cline). Dễ dàng chuyển đổi mô hình (Model) khi cần thiết.
- **EVIDENCE:** Yêu cầu trực tiếp từ Human Authority.
- **STATUS:** ACCEPTED.
- **REVERSIBILITY:** Low.

---

### D-005: Archive is History, Not Working Memory
- **DATE:** 2026-09-20
- **DECISION:** Mọi Audit Report lịch sử (NAS Audit 01-17, etc.) được đưa vào Archive. Chúng đóng vai trò Evidence, không phải Working Docs. Agent không đọc Archive trừ khi cần truy vết chứng cứ.
- **RATIONALE:** Giảm Cognitive Load, tăng độ minh bạch của hệ thống.
- **EVIDENCE:** Chỉ thị hệ thống (Mission rules).
- **STATUS:** ACCEPTED.
- **REVERSIBILITY:** High.
