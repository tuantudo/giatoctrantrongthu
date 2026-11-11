# CURRENT ARCHITECTURE

## 1. Mục Tiêu Kiến Trúc
Kiến trúc này phân tách rạch ròi các mối quan tâm (separation of concerns) giữa việc lưu trữ vật lý, quản trị vòng đời, truy xuất chỉ mục, và cấu trúc dữ liệu thực thể. Điều này giúp ngăn chặn sự chồng chéo chức năng (Ví dụ: Dùng filesystem để làm database, hoặc bắt T-DOS quản lý file hệ thống).

## 2. Các Tầng Kiến Trúc (Architecture Layers)

Mô hình phân tầng dưới đây hiện đang ở trạng thái **[ESTABLISHED]** (Một phần) và **[PROPOSED]** (Một phần):

### Layer A: Physical Storage (NAS Filesystem)
- **Vai trò:** Nơi chứa các bit và byte vật lý. 
- **Status:** ESTABLISHED.
- **Quy tắc:** Không mang ngữ nghĩa kinh doanh, chỉ có thư mục và file.

### Layer B: Data Lifecycle (T-DOS)
- **Vai trò:** Bộ quy tắc (Governance) để làm sạch dữ liệu. Luồng: `INPUT → FORGE → AUDIT → CLEAN → ATLAS`.
- **Status:** ESTABLISHED.
- **Quy tắc:** Chỉ áp dụng cho **Static Assets** (Dữ liệu tĩnh, tài sản lưu trữ). Miễn trừ cho Active Workspace và System Data.

### Layer C: Native Data Management (Synology)
- **Vai trò:** Lập chỉ mục (Indexing), tìm kiếm (Universal Search), nhận diện khuôn mặt (Synology Photos).
- **Status:** ESTABLISHED.
- **Quy tắc:** Tận dụng tối đa native engine, không "phát minh lại bánh xe" bằng AIOS tools tự chế trừ khi API bị đóng.

### Layer D: Canonical Data (Database)
- **Vai trò:** Quản lý thực thể (Entity) như Person, Event, Media.
- **Status:** PROPOSED.
- **Quy tắc:** ID thực thể (Entity ID) phải hoàn toàn tách biệt và độc lập với File Path trên NAS.

### Layer E: Application (GiaToc Website)
- **Vai trò:** Lớp trình diễn (Presentation) cho người dùng cuối.
- **Status:** ESTABLISHED.

### Layer F: Development & Active Workspace
- **Vai trò:** Môi trường làm việc liên tục thay đổi (Code, Git, Sync folders).
- **Status:** ESTABLISHED.
- **Quy tắc:** Nằm ngoài sự kiểm soát cứng nhắc của T-DOS FORGE/ATLAS.

### Layer G: AIOS Execution (Agents)
- **Vai trò:** Thực thi các nhiệm vụ (Missions) dựa trên năng lực (Capabilities).
- **Status:** ESTABLISHED (Mô hình mới).
- **Quy tắc:** Hoạt động dựa trên Mission và Capability, không gắn chết Identity/Role vào một Runtime/Model cố định.

### Layer H: Human Governance
- **Vai trò:** Nguồn ra quyết định tối cao (Tuấn).
- **Status:** ESTABLISHED.

## 3. Core Principles
- **Mission-Driven Execution:** AIOS chạy theo Mission, Mission định nghĩa Role, Role yêu cầu Capability, Runtime chỉ là nơi cung cấp Capability.
- **Evidence-Based:** Mọi thay đổi kiến trúc phải dựa trên Bằng chứng vật lý (Evidence), không dựa trên suy đoán (Inference).
- **Separation of Entity and Storage:** Database không phải là ổ cứng, Ổ cứng không phải là Database.
