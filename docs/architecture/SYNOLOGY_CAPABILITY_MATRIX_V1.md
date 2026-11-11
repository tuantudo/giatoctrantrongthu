# SYNOLOGY CAPABILITY MATRIX V1

**STATUS:** SYNTHESIS ONLY
*(Lưu ý: Báo cáo này là bản tổng hợp nhận thức kiến trúc, không phải đặc tả triển khai API (API implementation specification).*

## Phần 1 — Executive Summary
Báo cáo hợp nhất dữ liệu từ hai nguồn:
1. **Nghiên cứu tài liệu chính thức** (Synology Developer Guides, Tech Specs, KB).
2. **Khám phá thực tế (Read-Only)** trên NAS của Tuấn (DSM 7.4.1-90080).

Sự phân biệt quan trọng nhất là giữa những gì **NAS có thể làm** (Native Product) và những gì **Synology hỗ trợ bên thứ 3 làm** (Official Interface). Rất nhiều tính năng cốt lõi (như Universal Search, Photos, Storage, Package, Task Scheduler) không có giao diện lập trình công khai, buộc AIOS phải xác định ranh giới rõ ràng: hoặc không xây lại (NATIVE-AUTHORITY), hoặc dùng interface ngầm định (ADAPTER-CANDIDATE) khi có Human Gate.

---

## Phần 2 — Capability Matrix

### 1. Storage
- **Capability:** Quản lý Drive, Volume, Storage Pool, SSD Cache, Shared Folders.
- **Native Product:** Storage Manager, Control Panel.
- **Native GUI:** Có.
- **NAS Evidence:** Lệnh `df -Th`, `mount` và các API `SYNO.Core.Storage.*`.
- **Official Synology Interface:** Một phần CLI (DiskStation CLI Guide).
- **Official API:** Không có.
- **Official CLI:** `synoshare` (chia sẻ folder info).
- **Observed/Internal API:** `SYNO.Core.Storage.*`, `SYNO.Core.Share.*`.
- **Auth Model:** Root (CLI), GUI session admin (API).
- **Read:** Khả thi qua CLI/Internal API.
- **Write:** Khả thi qua GUI/Internal API.
- **Tested on Tuấn NAS:** Có (Discovery via SSH).
- **Evidence Status:** OBSERVED (Internal) / DOCUMENTED (CLI).
- **AIOS Role:** NATIVE-AUTHORITY (AIOS không quản lý pool/volume).
- **Notes / Limitations:** Không có API quản lý storage pool chính thức.
- **Unknown:** Định dạng chi tiết API cấp phát storage qua REST.

### 2. File Management
- **Capability:** Quản lý file (List, Move, Copy, Delete, Permission check, MD5).
- **Native Product:** File Station.
- **Native GUI:** Có (File Station Web).
- **NAS Evidence:** Endpoint `SYNO.FileStation.*` v1-3 (Info, List, CheckPermission, CopyMove, BackgroundTask).
- **Official Synology Interface:** File Station API Guide.
- **Official API:** `SYNO.FileStation.*`.
- **Official CLI:** Không có.
- **Observed/Internal API:** (Đều là Official).
- **Auth Model:** `SYNO.API.Auth` (`_sid`).
- **Read:** API `List`, `Info`, `CheckPermission`.
- **Write:** API `CopyMove`, `Upload`, `Delete`, `CreateFolder`.
- **Tested on Tuấn NAS:** Có (Discovery + Execution path test).
- **Evidence Status:** DOCUMENTED / TESTED.
- **AIOS Role:** OFFICIAL-INTEGRATION.
- **Notes / Limitations:** Yêu cầu polling với `BackgroundTask` cho tiến trình nặng (như `CopyMove`).
- **Unknown:** Khả năng dùng OAuth access token (không có tài liệu, mặc định là không).

### 3. Search / Indexing
- **Capability:** Đánh chỉ mục toàn cục file, app, nội dung.
- **Native Product:** Universal Search.
- **Native GUI:** Có.
- **NAS Evidence:** App đang chạy và endpoint `SYNO.Finder.*`.
- **Official Synology Interface:** Không.
- **Official API:** Không.
- **Official CLI:** Không.
- **Observed/Internal API:** `SYNO.Finder.*`.
- **Auth Model:** Theo GUI session của user.
- **Read:** Search nội dung.
- **Write:** Trigger index.
- **Tested on Tuấn NAS:** OBSERVED.
- **Evidence Status:** OBSERVED / COMMUNITY-NON-OFFICIAL.
- **AIOS Role:** ADAPTER-CANDIDATE (Có giá trị lớn cho AI, nhưng thiếu public API).
- **Notes / Limitations:** Bắt buộc cài Universal Search để chạy Drive. Không có endpoint search chính thức cho lập trình ngoài.
- **Unknown:** API payload, khả năng search từ xa an toàn.

### 4. Photos / Media
- **Capability:** Quản lý ảnh, timeline, face recognition, album, sharing.
- **Native Product:** Synology Photos.
- **Native GUI:** Có.
- **NAS Evidence:** Endpoint `SYNO.Foto.*`.
- **Official Synology Interface:** Không.
- **Official API:** Không.
- **Official CLI:** Không.
- **Observed/Internal API:** `SYNO.Foto.*`.
- **Auth Model:** Theo GUI session.
- **Read:** List ảnh, album.
- **Write:** Upload, tag, share.
- **Tested on Tuấn NAS:** OBSERVED.
- **Evidence Status:** OBSERVED / COMMUNITY-NON-OFFICIAL.
- **AIOS Role:** NATIVE-AUTHORITY (Giao diện web/mobile làm tốt nhất).
- **Notes / Limitations:** Nhận diện khuôn mặt tùy NAS model. Mọi API là internal.
- **Unknown:** Cách an toàn để upload ảnh tự động giữ đúng metadata timeline mà không qua giao diện gốc.

### 5. Drive / Sync
- **Capability:** Đồng bộ, chia sẻ, versioning (Intelliversioning), admin console.
- **Native Product:** Synology Drive Server.
- **Native GUI:** Có.
- **NAS Evidence:** Endpoint `SYNO.SynologyDrive.*`.
- **Official Synology Interface:** Synology Office Suite API (GATED).
- **Official API:** Office Suite API (Cần account Synology và form đăng ký).
- **Official CLI:** Không.
- **Observed/Internal API:** `SYNO.SynologyDrive.*`.
- **Auth Model:** UNKNOWN (Đối với Office Suite API).
- **Read:** Files, labels, webhooks.
- **Write:** Upload, config sharing.
- **Tested on Tuấn NAS:** OBSERVED.
- **Evidence Status:** GATED-OFFICIAL (Tech Spec) / OBSERVED (Internal API).
- **AIOS Role:** NATIVE-AUTHORITY (Synology tự xử lý versioning/sync).
- **Notes / Limitations:** Không thể truy cập API docs chính thức công khai. Team Folders không hỗ trợ mounted folder.
- **Unknown:** Loại token và endpoint thực tế của Office Suite API.

### 6. Identity / Permission
- **Capability:** Quản lý local user, group, ACL, LDAP, domain, SSO.
- **Native Product:** DSM Identity, SSO Server, Directory Server.
- **Native GUI:** Có.
- **NAS Evidence:** `SYNO.Core.User.*`, `SYNO.Core.Group.*`.
- **Official Synology Interface:** DiskStation CLI Guide (Một phần).
- **Official API:** Không cho User/Group CRUD. (SSO Server có SDK).
- **Official CLI:** `synouser`, `synogroup`, `synowin`.
- **Observed/Internal API:** `SYNO.Core.User`, `SYNO.Core.Group`.
- **Auth Model:** Root (CLI), Session admin (API).
- **Read:** User/group list.
- **Write:** Add/modify user/group.
- **Tested on Tuấn NAS:** OBSERVED.
- **Evidence Status:** DOCUMENTED (CLI) / OBSERVED (API).
- **AIOS Role:** NATIVE-AUTHORITY (Phân quyền nên thực hiện qua NAS GUI/CLI).
- **Notes / Limitations:** Cấp quyền app bằng bitmap. Không có public API quản lý permission per-folder.
- **Unknown:** Cấu trúc JSON API nội bộ cho CRUD user.

### 7. Authentication
- **Capability:** Xác thực phiên làm việc, 2FA, FIDO2, Approve sign-in.
- **Native Product:** DSM Secure SignIn.
- **Native GUI:** Có.
- **NAS Evidence:** `SYNO.API.Auth` (v1-7).
- **Official Synology Interface:** DSM Login Web API Guide.
- **Official API:** `SYNO.API.Auth` (method: login, logout, token).
- **Official CLI:** Không.
- **Observed/Internal API:** (Official đã cover).
- **Auth Model:** Truyền `account`, `passwd`, trả về `sid`/cookie và `synotoken`.
- **Read:** Session state.
- **Write:** Login, Logout.
- **Tested on Tuấn NAS:** TESTED (Discovery).
- **Evidence Status:** DOCUMENTED / TESTED.
- **AIOS Role:** OFFICIAL-INTEGRATION (Lớp cửa ngõ bắt buộc của AIOS vào NAS).
- **Notes / Limitations:** Chặn bằng IP (lỗi 150), chặn login trùng (lỗi 107), chặn headless nếu có 2FA (403/406).
- **Unknown:** Không có.

### 8. OAuth
- **Capability:** Ủy quyền không cần password (dành cho third-party app).
- **Native Product:** OAuth Service.
- **Native GUI:** Có (App độc lập).
- **NAS Evidence:** App đang ở trạng thái TẮT (`status: stop`). `SYNO.OAUTH.*` tồn tại.
- **Official Synology Interface:** Release Notes, Tech Specs. (Thiếu API/Dev Guide).
- **Official API:** Không công khai (Internal `SYNO.OAUTH.Client/Scope/Token`).
- **Official CLI:** Không.
- **Observed/Internal API:** `SYNO.OAUTH.*`.
- **Auth Model:** OAuth 2.0 (Dynamic Client Registration, Approve sign-in).
- **Read:** Token list, logs.
- **Write:** Revoke, authorize.
- **Tested on Tuấn NAS:** TESTED (App status = stop).
- **Evidence Status:** DOCUMENTED (Spec) / OBSERVED (Internal API).
- **AIOS Role:** ADAPTER-CANDIDATE (Tiềm năng để cấp quyền cho AIOS nếu có scope phù hợp).
- **Notes / Limitations:** Specs xác nhận OAuth Service chủ yếu dùng cho Alexa/Audio Station và Synology Chat. KHÔNG có bằng chứng nó apply cho File Station.
- **Unknown:** Mapping từ scopes sang NAS capability. File Station có chấp nhận token này không.

### 9. Backup / Recovery
- **Capability:** Backup LUN, file, config (Hyper Backup, ABB, Snapshot).
- **Native Product:** Hyper Backup, Active Backup for Business, Snapshot Replication.
- **Native GUI:** Có.
- **NAS Evidence:** Các `SYNO.Backup.*` (community research).
- **Official Synology Interface:** Không.
- **Official API:** Không.
- **Official CLI:** Không.
- **Observed/Internal API:** `SYNO.Backup.*`, `SYNO.Snap.*`.
- **Auth Model:** Admin GUI session / Agent-based.
- **Read:** Status, logs.
- **Write:** Trigger backup, restore.
- **Tested on Tuấn NAS:** NOT-TESTED.
- **Evidence Status:** COMMUNITY-NON-OFFICIAL / DOCUMENTED (Product Spec).
- **AIOS Role:** NATIVE-AUTHORITY.
- **Notes / Limitations:** Tối đa 65.535 version, WORM bị mất khi backup folder. AIOS không nên tự implement logic backup.
- **Unknown:** Các lệnh CLI ẩn hoặc API nội bộ.

### 10. Task / Automation
- **Capability:** Chạy script/tác vụ định kỳ.
- **Native Product:** Task Scheduler.
- **Native GUI:** Có.
- **NAS Evidence:** Control Panel.
- **Official Synology Interface:** Không.
- **Official API:** Không.
- **Official CLI:** Không.
- **Observed/Internal API:** `SYNO.Core.TaskScheduler.*`.
- **Auth Model:** Admin GUI session.
- **Read:** List tasks.
- **Write:** Create/trigger tasks.
- **Tested on Tuấn NAS:** NOT-TESTED.
- **Evidence Status:** COMMUNITY-NON-OFFICIAL / DOCUMENTED (Product Feature).
- **AIOS Role:** ADAPTER-CANDIDATE (Để AIOS đăng ký automation job vào NAS).
- **Notes / Limitations:** Không có public API, phải mô phỏng giao thức của DSM Web UI.
- **Unknown:** JSON payload cần thiết để tạo task qua API.

### 11. Package / Application
- **Capability:** Cài đặt, gỡ, bật/tắt NAS Packages.
- **Native Product:** Package Center.
- **Native GUI:** Có.
- **NAS Evidence:** `/usr/syno/bin/synopkg`.
- **Official Synology Interface:** 3rd-Party Package Developer Guide.
- **Official API:** Không có API quản lý package.
- **Official CLI:** Không (chỉ cộng đồng dùng).
- **Observed/Internal API:** `SYNO.Core.Package.*`.
- **Auth Model:** Session admin (cookie).
- **Read:** List packages.
- **Write:** Install, stop, start, uninstall.
- **Tested on Tuấn NAS:** TESTED (`synopkg status OAuthService`).
- **Evidence Status:** DOCUMENTED (Dev Guide) / TESTED (CLI).
- **AIOS Role:** NATIVE-AUTHORITY (Việc cấp phát ứng dụng thuộc về Package Center).
- **Notes / Limitations:** Không có cơ chế official để CI/CD package tự động.
- **Unknown:** Endpoints thực tế để update/install tự động.

### 12. Network
- **Capability:** Cấu hình IP, router, firewall, VPN.
- **Native Product:** Control Panel, VPN Server.
- **Native GUI:** Có.
- **NAS Evidence:** Các endpoint `SYNO.Core.Network.*`, `SYNO.VPNServer.*`.
- **Official Synology Interface:** DiskStation CLI Guide (`synonet`).
- **Official API:** Không.
- **Official CLI:** `synonet`.
- **Observed/Internal API:** `SYNO.Core.Network.*`.
- **Auth Model:** Root / Admin.
- **Read:** IP config.
- **Write:** Thay đổi interface.
- **Tested on Tuấn NAS:** OBSERVED.
- **Evidence Status:** DOCUMENTED (CLI) / OBSERVED (API).
- **AIOS Role:** NATIVE-AUTHORITY.
- **Notes / Limitations:** 
- **Unknown:** Cách cấu hình firewall an toàn qua API.

### 13. Security
- **Capability:** Security Advisor, firewall, auto-block, chứng chỉ số.
- **Native Product:** Security Advisor, Control Panel.
- **Native GUI:** Có.
- **NAS Evidence:** `SYNO.SecurityAdvisor.*`.
- **Official Synology Interface:** Không.
- **Official API:** Không.
- **Official CLI:** Không.
- **Observed/Internal API:** `SYNO.SecurityAdvisor.*`.
- **Auth Model:** Admin.
- **Read:** Scan results, logs.
- **Write:** Cấu hình rules.
- **Tested on Tuấn NAS:** OBSERVED.
- **Evidence Status:** OBSERVED.
- **AIOS Role:** NATIVE-AUTHORITY.
- **Notes / Limitations:** AIOS có thể lấy log để cảnh báo nhưng không nên tự viết rule block IP.
- **Unknown:** Chi tiết JSON alert từ Security Advisor.

### 14. Monitoring / Logs
- **Capability:** Xem log hệ thống, tài nguyên (CPU, RAM).
- **Native Product:** Log Center, Resource Monitor.
- **Native GUI:** Có.
- **NAS Evidence:** `SYNO.LogCenter.*`, `SYNO.ResourceMonitor.*`.
- **Official Synology Interface:** SNMP MIB Guide.
- **Official API:** Không. (SNMP chỉ dành cho network monitoring).
- **Official CLI:** Không.
- **Observed/Internal API:** `SYNO.LogCenter.*`.
- **Auth Model:** Admin.
- **Read:** Log, metric.
- **Write:** Cấu hình log rotation.
- **Tested on Tuấn NAS:** OBSERVED.
- **Evidence Status:** DOCUMENTED (SNMP) / OBSERVED (API).
- **AIOS Role:** ADAPTER-CANDIDATE (AIOS cần telemetry).
- **Notes / Limitations:** LogCenter export được, SNMP dùng để lấy metrics chuẩn.
- **Unknown:** Real-time push events (webhook) cho file actions (chỉ Synology Drive có).

### 15. API / Developer Surface
- **Capability:** Khám phá module, API list.
- **Native Product:** Web API.
- **Native GUI:** Không.
- **NAS Evidence:** `SYNO.API.Info`.
- **Official Synology Interface:** DSM Login Web API Guide.
- **Official API:** `SYNO.API.Info`.
- **Official CLI:** Không.
- **Observed/Internal API:** (Là Official).
- **Auth Model:** Không yêu cầu auth (cho method query metadata).
- **Read:** API list, max/min version, path.
- **Write:** Không.
- **Tested on Tuấn NAS:** TESTED.
- **Evidence Status:** DOCUMENTED / TESTED.
- **AIOS Role:** OFFICIAL-INTEGRATION (Lớp Discovery cốt lõi).
- **Notes / Limitations:** Là nền tảng để biết các API khác nằm ở `entry.cgi` hay `auth.cgi`.
- **Unknown:** Không.

### 16. AI / DSM Agent
- **Capability:** Tích hợp AI (ví dụ: Semantic Search trong DSM 7.2.2+ qua Synology Application Service, AI Console / DCR của OAuth Service).
- **Native Product:** Synology Universal Search, Synology Photos (Face/Object Recognition).
- **Native GUI:** Có.
- **NAS Evidence:** Không có API endpoint rõ ràng cho AI Agent chung. Có thể tích hợp qua Dynamic Client Registration của OAuth Service.
- **Official Synology Interface:** Không.
- **Official API:** Không.
- **Official CLI:** Không.
- **Observed/Internal API:** Không rõ rệt.
- **Auth Model:** Tích hợp theo service.
- **Read:** Search.
- **Write:** Không.
- **Tested on Tuấn NAS:** NOT-TESTED.
- **Evidence Status:** DOCUMENTED (Feature/Spec).
- **AIOS Role:** AIOS-OWNED (AIOS đứng bên ngoài làm Agent Orchestrator, không dựa vào native AI của NAS).
- **Notes / Limitations:** Các tính năng AI native trên NAS phụ thuộc rất lớn vào model của NAS và package (Synology Application Service). Không public interface.
- **Unknown:** Cách tương tác với AI Console qua OAuth DCR.

### 17. Other
- **Capability:** Notification, Download Station, Audio/Video Station.
- **Native Product:** Control Panel (Push Notification), Multimedia packages.
- **Native GUI:** Có.
- **NAS Evidence:** `SYNO.Core.Notification.*`, `SYNO.DownloadStation2.*`.
- **Official Synology Interface:** Download Station Web API, Audio Station API.
- **Official API:** Có (Cho Download/Audio).
- **Official CLI:** Không.
- **Observed/Internal API:** Notification APIs.
- **Auth Model:** Session / Admin.
- **Read:** Status, items.
- **Write:** Add task, notify.
- **Tested on Tuấn NAS:** OBSERVED.
- **Evidence Status:** DOCUMENTED (Multimeida) / OBSERVED (Notification).
- **AIOS Role:** ADAPTER-CANDIDATE.
- **Notes / Limitations:** 
- **Unknown:** 

---

## Phần 3 — Official Integration Surface
Chỉ có **DSM Web API (SYNO.API.Auth / SYNO.API.Info)** và **File Station API** là các bề mặt tích hợp (Integration Surface) hoàn toàn chính thức, có developer guide công khai, và đã được TESTED trên NAS. Bất kỳ script hoặc Agent (AIOS) nào thao tác với file trên NAS đều phải đi qua con đường này để đảm bảo tính an toàn và tương thích.

## Phần 4 — Native Synology Authority
*(Những gì AIOS KHÔNG NÊN xây lại)*
- **Data Protection & Storage**: Quản lý volume, RAID, backup LUN, versioning (Hyper Backup, Drive).
- **Identity & Access Management (IAM)**: Gán quyền Linux ACL / Synology Extended ACL, quản trị User/Group (SSO, Directory Server).
- **Media & Sync Processing**: Index ảnh, sync đa thiết bị (Synology Photos, Synology Drive).

## Phần 5 — Internal / Observed Surface
*(Những gì NAS có nhưng chưa được Synology công bố public developer API)*
- **Universal Search** (`SYNO.Finder.*`): Rất quan trọng để tìm kiếm nội dung nhanh chóng nhưng buộc phải reverse-engineer payload GUI nếu muốn gọi bằng API.
- **OAuth Service** (`SYNO.OAUTH.*`): Đang cài nhưng bị TẮT. Dù bật, cũng chưa có bằng chứng cho phép dùng token này thay thế `SYNO.API.Auth` cho File Station.
- **Task Scheduler & Package Management**: Giao diện nội bộ cực kỳ rủi ro nếu tự ý thay đổi qua internal API.

## Phần 6 — AIOS Boundary
*(AIOS nên đứng ở đâu)*
AIOS đóng vai trò **Cross-Service Orchestrator** và **Intent Interpreter**. AIOS không trực tiếp quản lý data byte, mà chỉ đạo Synology làm việc đó thông qua OFFICIAL-INTEGRATION (File Station API). AIOS nằm hoàn toàn ở lớp lập kế hoạch, quyết định (DECISION LOG), và xác minh kết quả. Mọi ranh giới thao tác hệ thống (System level, Storage level) là ngoài giới hạn của AIOS (AIOS-OWNED logic, nhưng Synology-executed actions).

## Phần 7 — Security / Authorization Boundary
- AIOS không lưu giữ mật khẩu dài hạn. Kịch bản yêu cầu mật khẩu qua interactive prompt trên CLI/Terminal của user vào lúc runtime.
- Mọi session của AIOS (khi dùng `SYNO.API.Auth`) được định danh bằng user account của Tuấn (tuandzain - administrator). Nghĩa là AIOS có toàn quyền của user này. Để thu hẹp (Least Privilege), lý thuyết cần tạo một user riêng (Service Account) chỉ có quyền File Station (0x02) và quyền thư mục cụ thể. Nhưng vì yêu cầu "KHÔNG tạo account mới", ranh giới an ninh phụ thuộc 100% vào AIOS Governance (Kernel rules) từ chối các lệnh xóa/phá hoại.

## Phần 8 — Unknowns
- Việc OAuth access token có được File Station API chấp nhận hay không vẫn là điểm mù thiết kế lớn nhất.
- Office Suite API bị gate. Cần account Synology để đọc doc.

## Phần 9 — Recommended Next Discovery
(READ-ONLY)
Nếu sau này có nhu cầu kiểm chứng OAuth, Human cần vào DSM Web UI -> Bật Package "OAuth Service". Sau đó AIOS có thể được giao nhiệm vụ khám phá (read-only) các scope được hỗ trợ bằng cách query `/webapi/entry.cgi?api=SYNO.OAUTH.Scope` (vì nó tồn tại trên NAS theo kết quả test).

---

# DECISION GATE

**1. Synology đã có những capability nào đủ mạnh để AIOS chỉ cần orchestrate?**
Lưu trữ (Storage/RAID), Đồng bộ và Phiên bản (Drive), Tìm kiếm toàn cục (Universal Search), Phân quyền truy cập (ACL/User/Group). AIOS không cần (và không nên) xây dựng các logic này.

**2. Official integration surface hiện có những gì?**
`SYNO.API.Auth`, `SYNO.API.Info`, `SYNO.FileStation.*` (toàn bộ 19 API quản lý file), CLI quản lý user/network (`synouser`, `synonet`, `synoshare`). Hỗ trợ đầy đủ cho việc xác thực, đọc, ghi, copy, move file qua HTTP.

**3. Những capability nào chỉ có internal/community interface?**
Universal Search, quản lý Photos, Task Scheduler, Package Management, Storage/Volume, và OAuth Service (chưa công bố docs). Việc sử dụng các API này có rủi ro thay đổi payload không báo trước giữa các bản cập nhật DSM.

**4. Khoảng trống nào thực sự thuộc về AIOS?**
AIOS đảm nhận "Ý thức dữ liệu" (Data Semantic / Provenance / Ontology) — hiểu file đó là gì (T-DOS Inbox hay GiaToc record) và quyết định đường đi của file. Synology chỉ là một "dumb nhưng safe execution layer" dưới góc nhìn quy trình nghiệp vụ (Business Logic). AIOS cũng giữ vai trò orchestrate quy trình nhiều bước có Human-in-the-loop (ví dụ: xin quyền trước khi move).

**5. Bước discovery READ-ONLY tiếp theo nên là gì?**
Nếu không có nhu cầu khẩn thiết về tích hợp third-party apps không cần password, **KHÔNG CẦN** discovery thêm.
Nếu Human quyết định thử nghiệm kiến trúc không-dùng-password dài hạn cho Agent: bật OAuth Service trên GUI và giao AIOS quét `SYNO.OAUTH.Scope` list.
