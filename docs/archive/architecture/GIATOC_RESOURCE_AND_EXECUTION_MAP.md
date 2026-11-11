# GIATOC RESOURCE & EXECUTION MAP
*Bản đồ Nguồn lực và Cấu trúc Thực thi dự án Giatoc*
*Ngày: 2026-09-15*
*Trạng thái: CANONICAL RESOURCE MAP (Updated with Execution Surface & Lifecycle)*

---

## 1. EXECUTIVE SUMMARY
Tài liệu này xác định kiến trúc thực thi (Execution Architecture) cho dự án Giatoc. Dựa trên AIOS V2, dự án là một Governance/Execution Container. Tài liệu làm rõ "WHO / WITH WHAT / UNDER WHICH ROLE / VERIFIED BY WHOM?". 

Bản cập nhật này đính chính một hiểu lầm nghiêm trọng về kiến trúc: **AIOS không chỉ quản lý Runtime, mà quản lý Execution Surface.** Nó phân tách rạch ròi giữa Native Runtime (OpenCode, AGY) và Host/Extension (VS Code / Cline). Đồng thời, tài liệu loại bỏ việc tự động gán nhãn `[VERIFIED]` cho các tài nguyên chỉ mới được định nghĩa (AIOS_DEFINED) mà chưa được gán chính thức cho dự án (PROJECT_ASSIGNED).

---

## 2. KHÁI NIỆM EXECUTION SURFACE & RESOURCE LIFECYCLE

### 2.1 Execution Surface
Security/governance boundary phải trả lời: *"Thực thể nào có thể hành động, thông qua đâu, trên phạm vi tài nguyên nào, với capability nào?"*
AIOS quản lý **Execution Surface**, bao gồm sự phân lớp:
- **Host:** Nền tảng chứa (ví dụ: VS Code).
- **Extension / Integration:** Tiện ích được host (ví dụ: Cline).
- **Native Runtime:** Môi trường thực thi độc lập (ví dụ: OpenCode, AGY CLI).
- **Agent:** Định danh thực thể.
- **Capability:** Quyền hạn cụ thể.

### 2.2 Resource Lifecycle
Tài nguyên không được mặc định là "có" chỉ vì AIOS đã quy định. Trạng thái vòng đời chuẩn:
1. **AIOS_DEFINED:** Chỉ tồn tại trong governance/schema/registry design.
2. **EXISTS:** Resource thực sự tồn tại trên hệ thống.
3. **AVAILABLE:** Có thể được sử dụng trong môi trường hiện tại.
4. **PROJECT_ASSIGNED:** Đã được cấp cho một project cụ thể (cần machine-readable evidence).
5. **PROJECT_READY:** Đã đủ điều kiện để thực thi nhiệm vụ trong project.

*(Nguyên tắc: AIOS định nghĩa resource ở cấp hệ thống ≠ Giatoc đã có resource đó).*

---

## 3. RESOURCE INVENTORY (EXISTING REALITY VS REQUIRED)

Dưới đây là kiểm kê nguồn lực dựa trên Existing Reality (Thực tế tồn tại) và Required Provisioning (Yêu cầu cấp phát).

### 3.1 Hosts & Native Runtimes
- **VS Code (Host):** `[EXISTS]`, `[AVAILABLE]`.
- **OpenCode Runtime (Native Runtime):** `[EXISTS]`, `[AVAILABLE]`. Đã bị chặn bởi `authorize_canonical` của AIOS.
- **AGY CLI (Native Runtime):** `[EXISTS]`, `[AVAILABLE]`.
- **Cline (IDE Extension / Integration):** `[EXISTS]`, `[AVAILABLE]`. *(Cline không phải là Native Runtime)*.

### 3.2 Agents
- **AIOS-AGENT-OC (OpenCode):** `[AVAILABLE]`. (Chưa có Project Assignment thực tế).
- **AIOS-AGENT-AGY (AGY):** `[AVAILABLE]`. 
- **AIOS-AGENT-CLINE (Cline):** `[AVAILABLE]`. 

### 3.3 Models
- **Gemini (Google):** `[AVAILABLE]` qua AGY.
- **NVIDIA NIM (Nemotron / Llama):** `[AVAILABLE]` qua OpenCode.
- **Anthropic Claude:** `[AVAILABLE]` qua Cline (IDE Extension).

### 3.4 Skills & Tools (Capabilities)
- **Skills (figma-*, knowledge-ingestion, agy-customizations):** `[EXISTS]`.
- **Tools/MCP (filesystem, serena, github, git, playwright):** `[EXISTS]`.
- **Trạng thái đối với Giatoc:** Đều đang là `[AIOS_DEFINED]` hoặc `[EXISTS]` ở mức toàn cục. Chưa được `[PROJECT_ASSIGNED]` cụ thể cho Giatoc Mission.

---

## 4. ADMISSION MODEL & EXECUTION SURFACE MATRIX

Mọi bề mặt thực thi (Execution Surface) muốn vào Giatoc đều phải qua Admission Pipeline:
`IDENTIFY → CAPABILITY AUDIT → TRUST/ENFORCEMENT ASSESSMENT → REGISTER → PROJECT ASSIGNMENT → PROJECT READINESS → EXECUTION`

### Bảng Đánh Giá Execution Surface (Existing Reality)

| Bề mặt thực thi | Type | Host | Trust Level | Enforcement | Status |
|---|---|---|---|---|---|
| **OpenCode** | Native Runtime | Hệ điều hành | Verified | Hard (authorize_canonical) | `[AVAILABLE]` |
| **AGY CLI** | Native Runtime | Hệ điều hành | Verified | Hard | `[AVAILABLE]` |
| **Cline** | IDE Extension | VS Code | Untrusted | Soft-only / Limited | `[PROPOSED POSTURE]` |

---

## 5. AGENT × ROLE MATRIX (GIATOC LOCAL)

Các Role dưới đây là **[PROPOSED]**. Việc đề xuất Role không đồng nghĩa với Active Assignment. Phải có machine-readable assignment thực tế từ AIOS thì mới chuyển sang `[PROJECT_ASSIGNED]`.

| Tên Role (Project-Local) | Agent Dự kiến | Trách nhiệm (Nhiệm vụ) | Trạng thái Role |
|---|---|---|---|
| **Heritage Architect** | AGY | Dịch ngữ nghĩa (Ontology) thành UI, IA. | `[PROPOSED]` |
| **Technical Lead** | OpenCode | Quản lý Node.js, MariaDB, DB Migration. | `[PROPOSED]` |
| **Independent Auditor** | Cline | Review code, đối chiếu Architecture vs Reality. | `[PROPOSED]` |
| **Final Authority** | Tuấn (Human) | Chốt Concept, Duyệt Thay đổi. | `[PROJECT_READY]` |

---

## 6. PHASE × RESOURCE MATRIX

Lộ trình triển khai áp dụng Risk-based Orchestration (Không cần multi-agent cho những task quá rủi ro thấp, tránh bureaucracy).

| Phase | Trách nhiệm cốt lõi | Agent Phụ trách (Role) | Model (Đề xuất) | Chốt Gate (Human) |
|---|---|---|---|---|
| **Phase 0: Meaning Lock** | Chốt Concept | AGY (Architect) | Gemini | Cần thiết |
| **Phase 1: Ontology & IA** | Thiết kế IA | AGY (Architect) | Gemini | Cần thiết |
| **Phase 2: Semantic UI** | Code UI tĩnh | AGY / OpenCode | Gemini / Llama | Cần thiết |
| **Phase 3: Production API**| Migration & Code Backend| OpenCode (Tech Lead) | Nemotron / Opus| Cline (Audit) → Human |
| **Phase 4: Restoration** | Cấu hình Hạ tầng | OpenCode (Tech Lead) | Nemotron | Cần thiết |
| **Phase 5: Continuity** | Lập quy trình đóng góp | AGY (Architect) | Gemini | Cần thiết |

---

## 7. ĐÍNH CHÍNH MASTER SYSTEM MAP (PRESERVATION)

Master System Map trước đây mắc sai lầm gộp chung Preservation với Operational Availability. Thực tế phân lớp như sau:
1. **DIGITAL PRESERVATION:** Dữ liệu vật lý (Data) trên ổ cứng NAS. `[VERIFIED]` an toàn.
2. **HERITAGE PRESERVATION:** Khả năng di sản tồn tại đúng ngữ nghĩa. `[PARTIAL]` (Đang sửa trong Phase 1/2).
3. **OPERATIONAL AVAILABILITY:** Khả năng API/Hệ thống vận hành. `[BLOCKED]` (Cloudflare HTTP 530, Node/DB chưa kết nối).

---

## 8. VERIFICATION & HANDOFF MAP

Nguyên tắc AIOS V2: **Evidence Before Truth.** (Người xây không tự cấp chứng chỉ, không tự đổi canonical state).

- **Thiết kế UI:** Agent A (Ví dụ: AGY Architect) tạo UI nháp → Artifact sinh ra.
- **Audit chéo:** Agent B (Ví dụ: Cline Auditor) rà soát so với GIATOC_PROJECT_MEMORANDUM → Evidence sinh ra.
- **Gatekeeper:** Human (Tuấn) duyệt quyết định kiến trúc → Trở thành Canonical Truth.
- **Thực thi sâu:** OpenCode dựa vào Truth để migrate DB/API (Có risk cao, cần Human terminal gate).

---

## 9. HUMAN DECISIONS REQUIRED
1. Cần thực hiện các lệnh Machine-readable Assignment (ví dụ: cấp quyền Agent-Role vào Giatoc) qua AIOS Policy để chuyển resource từ `AVAILABLE` sang `PROJECT_ASSIGNED`.
2. Chốt mô hình admission cụ thể của Cline (Ide Extension, Untrusted, Soft-only) vào registry để Cline được phép access codebase (dù chỉ read-only).

---

## 10. IMMEDIATE NEXT STEP

**[HÀNH ĐỘNG DUY NHẤT CẦN LÀM TIẾP THEO]**

**Chuyển đổi Resource Lifecycle từ AVAILABLE sang PROJECT_ASSIGNED cho Phase 1.**
*Cụ thể:* Human phải thiết lập (hoặc xác nhận) Assignment thực tế (AIOS Policy) cho AGY đóng vai trò Heritage Architect đối với dự án Giatoc, cấp cho AGY các quyền filesystem đủ để tạo/sửa UI prototype (chuẩn bị cho Semantic UI Translation). Không tự động assume AGY có full quyền trong Giatoc cho đến khi có Assignment.
