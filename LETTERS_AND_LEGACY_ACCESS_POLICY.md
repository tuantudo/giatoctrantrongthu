# CHÍNH SÁCH TIẾP CẬN & PHÂN QUYỀN: THƯ GỬI NHAU
## LETTERS & LEGACY ACCESS CONTROL POLICY

**Thẩm quyền phê duyệt:** Tuấn (Human Final Authority / Product Owner)  
**Kiến trúc & QC:** Emarald (Strategic Architecture Authority)  
**Phụ trách:** AGENT 05 (Governance & Authorization Specialist)  
**Ngày ban hành:** 2026-11-11  

---

## 1. NGUYÊN TẮC PHÂN ĐỊNH THẨM QUYỀN (CORE POLICY PRINCIPLES)

1. **Tách biệt Thẩm quyền Quản trị Kỹ thuật và Quyền Đọc Thư:**
   - Quản trị viên hệ thống (`admin_users`) chỉ có quyền sao lưu, khôi phục hạ tầng kỹ thuật; **TUYỆT ĐỐI KHÔNG CÓ QUYỀN** mở đọc các lá thư riêng tư giữa hai cá nhân (`DIRECT_ONLY`).
2. **Quyền Đương sự của Tác giả & Người nhận:**
   - Tác giả (`Author`) luôn có toàn quyền xem lại các lá thư mình đã viết.
   - Người nhận đích danh (`Recipient`) luôn có quyền đọc thư gửi cho mình.
3. **Quyền của Người được Nhắc đến (`Mentioned Person`):**
   - Người được nhắc tên trong thư có quyền tiếp cận nếu bức thư thuộc phạm vi Nhánh (`BRANCH_ONLY`) hoặc Toàn gia tộc (`FAMILY_WIDE`). Với thư riêng tư cá nhân (`DIRECT_ONLY`), quyền tiếp cận của người được nhắc đến phụ thuộc vào sự cho phép rõ ràng từ tác giả.
4. **Trách nhiệm Quản lý Di sản (Family Stewardship):**
   - Người trông nom gia tộc (Family Steward) có trách nhiệm bảo tồn toàn vẹn dữ liệu và mở niêm phong các lá thư gửi thế hệ tương lai khi đến kỳ hạn (`Time Capsule Unlock`).
5. **Bảo tồn Ranh giới Clara P0:**
   - Thư gửi Clara tiếp tục giữ nguyên chính sách `BRANCH_RESTRICTED_P0`. Chỉ người có thẩm quyền đại diện chi nhánh hoặc con cháu trực hệ của cụ Hạnh – Đào mới được tiếp cận.

---

## 2. MA TRẬN PHÂN QUYỀN TRUY CẬP (ACCESS CONTROL MATRIX)

| Phạm Vi Thư (`access_scope`) | Tác Giả (`Author`) | Người Nhận (`Recipient`) | Người Được Nhắc Đến (`Mentioned`) | Thành Viên Khác Trong Họ | Quản Trị Hệ Thống (`Admin`) | Người Trông Nom Gia Tộc (`Steward`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **`DIRECT_ONLY`** (Thư riêng 2 người) | `READ/MANAGE` | `READ` | `DENIED` (Trừ khi tác giả cho phép) | `DENIED` | `DENIED` (Cấm xem nội dung) | `DENIED` (Tôn trọng riêng tư) |
| **`BRANCH_ONLY`** (Thư chi nhánh) | `READ/MANAGE` | `READ` (Cùng nhánh) | `READ` (Nếu cùng nhánh) | `DENIED` (Nhánh khác) | `DENIED` | `READ` (Để quản lý di sản) |
| **`FAMILY_WIDE`** (Thư toàn gia tộc) | `READ/MANAGE` | `READ` (Mọi người) | `READ` | `READ` | `READ` | `READ/CURATE` |
| **`TIME_CAPSULE`** (Gửi tương lai) | `READ/MANAGE` | `SEALED` (Chờ mở) | `SEALED` (Chờ mở) | `SEALED` (Chờ mở) | `DENIED` | `MANAGE/UNLOCK` (Đúng mốc) |
| **`RESTRICTED_P0`** (Thư Clara) | `READ` (@I18@) | `READ` (@I170@) | `READ` (Nhánh Clara) | `DENIED` (Zero-Hint 404) | `DENIED` | `READ` (Tuấn - Người đại diện) |

---

## 3. CƠ CHẾ KIỂM TRA QUYỀN Ở TẦNG BACKEND (BACKEND ENFORCEMENT)

Mọi yêu cầu xem chi tiết một bức thư (`GET /api/member/letters/:id`) phải chạy qua hàm kiểm định nghiêm ngặt:

```javascript
function canReadLetter(letter, userContext) {
  const { accountId, personId, branchRootId, role } = userContext;

  // 1. Tác giả luôn có quyền đọc
  if (letter.author_person_id === personId || letter.author_account_id === accountId) {
    return true;
  }

  // 2. Thư Clara P0: Tuân theo logic isClaraEligible hiện hành
  if (letter.access_scope === 'RESTRICTED_P0' || letter.collection_id === 'CLARA_LETTERS_V1') {
    return isClaraEligible(userContext);
  }

  // 3. Thư gửi toàn gia tộc (FAMILY_WIDE)
  if (letter.access_scope === 'FAMILY_WIDE') {
    return true;
  }

  // 4. Thư gửi cá nhân (DIRECT_ONLY)
  if (letter.access_scope === 'DIRECT_ONLY') {
    return letter.recipient_person_id === personId;
  }

  // 5. Thư gửi nhánh gia đình (BRANCH_ONLY)
  if (letter.access_scope === 'BRANCH_ONLY') {
    return isMemberOfBranch(personId, letter.recipient_branch_id);
  }

  // 6. Thư niêm phong gửi tương lai (TIME_CAPSULE)
  if (letter.access_scope === 'TIME_CAPSULE') {
    if (letter.unlock_at && new Date(letter.unlock_at) <= new Date()) {
      return true; // Đã đến ngày mở khóa
    }
    return false; // Còn niêm phong
  }

  return false;
}
```

