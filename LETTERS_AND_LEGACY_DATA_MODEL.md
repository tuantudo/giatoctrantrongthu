# MÔ HÌNH DỮ LIỆU: THƯ GỬI NHAU (LETTERS & LEGACY DATA MODEL)
## Entity Relationship, Schema Definition & Storage Strategy

**Thẩm quyền phê duyệt:** Tuấn (Human Final Authority / Product Owner)  
**Kiến trúc & QC:** Emarald (Strategic Architecture Authority)  
**Phụ trách:** AGENT 00 (Architecture) & AGENT 03 (Data & Lifecycle)  
**Ngày ban hành:** 2026-11-11  

---

## 1. THỰC THỂ CỐT LÕI (CORE ENTITIES)

```text
                  ┌──────────────────────┐
                  │       accounts       │
                  └──────────┬───────────┘
                             │ (1:1 mapping)
                             ▼
                  ┌──────────────────────┐
                  │        people        │◄──────────────────┐
                  └──────────┬───────────┘                   │
                             │                               │
                ┌────────────┴────────────┐                  │
                │                         │                  │
                ▼ (author_person_id)      ▼ (recipient)      ▼ (mentioned)
      ┌──────────────────┐       ┌─────────────────┐ ┌───────────────┐
      │     letters      │◄──────┤letter_recipients│ │letter_mentions│
      └─────────┬────────┘       └─────────────────┘ └───────────────┘
                │
                ▼ (1:N)
      ┌──────────────────┐
      │letter_attachments│
      └──────────────────┘
```

1. **`letters` (Bản ghi Thư chính):**
   - Đại diện cho một bức thư di sản do thành viên soạn thảo hoặc được số hóa từ thư tay truyền đời.
2. **`letter_recipients` (Đối tượng Tiếp nhận):**
   - Cho phép một lá thư gửi tới một hoặc nhiều đối tượng: cá nhân cụ thể, một nhánh phả hệ, toàn gia tộc, hoặc thế hệ mai sau.
3. **`letter_mentions` (Người được nhắc đến):**
   - Liên kết các `person_id` có mặt trong câu chuyện để tự động phản ánh vào Hồ sơ 6 tầng của nhân vật đó.
4. **`letter_attachments` (Tài liệu đính kèm):**
   - Bản scan thư tay chữ Nho, thư viết tay thời chiến, ảnh kỷ vật gắn liền với bức thư.

---

## 2. ĐẶC TẢ CẤU TRÚC BẢNG (SCHEMA SPECIFICATION)

### 2.1. Bảng `letters`
```sql
CREATE TABLE IF NOT EXISTS letters (
    id VARCHAR(64) PRIMARY KEY,                  -- LTR_20261111_XXXX
    author_account_id VARCHAR(64) NOT NULL,      -- accounts.id người viết
    author_person_id VARCHAR(64) NOT NULL,       -- people.id người viết trên cây phả hệ
    title VARCHAR(255) NOT NULL,                 -- Tiêu đề bức thư
    subtitle VARCHAR(255),                       -- Lời tựa / ngữ cảnh
    body_markdown MEDIUMTEXT NOT NULL,           -- Toàn văn bức thư
    recipient_type VARCHAR(32) NOT NULL,         -- 'INDIVIDUAL', 'BRANCH', 'FAMILY', 'FUTURE', 'MEMORIAL'
    access_scope VARCHAR(32) NOT NULL,           -- 'DIRECT_ONLY', 'BRANCH_ONLY', 'FAMILY_WIDE', 'RESTRICTED_P0'
    legacy_intent VARCHAR(32) NOT NULL,          -- 'FAMILY_ARCHIVE', 'RECIPIENT_DISCRETION', 'TIME_CAPSULE'
    unlock_at TIMESTAMP NULL,                    -- Mốc mở khóa nếu là Thư gửi tương lai
    is_sealed BOOLEAN DEFAULT 0,                 -- Niêm phong (chỉ mở khi thỏa điều kiện)
    collection_id VARCHAR(64),                   -- Mã bộ sưu tập (ví dụ: 'CLARA_LETTERS_V1')
    status VARCHAR(32) DEFAULT 'PUBLISHED',      -- 'DRAFT', 'PUBLISHED', 'ARCHIVED'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_person_id) REFERENCES people(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2.2. Bảng `letter_recipients`
```sql
CREATE TABLE IF NOT EXISTS letter_recipients (
    id VARCHAR(64) PRIMARY KEY,
    letter_id VARCHAR(64) NOT NULL,
    recipient_type VARCHAR(32) NOT NULL,         -- 'PERSON', 'BRANCH', 'ALL_FAMILY'
    recipient_target_id VARCHAR(64) NOT NULL,    -- people.id (nếu PERSON) hoặc root_person_id (nếu BRANCH)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (letter_id) REFERENCES letters(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2.3. Bảng `letter_mentions`
```sql
CREATE TABLE IF NOT EXISTS letter_mentions (
    letter_id VARCHAR(64) NOT NULL,
    mentioned_person_id VARCHAR(64) NOT NULL,    -- people.id của người được nhắc tên
    context_note VARCHAR(255),                   -- Ví dụ: 'Thời thơ ấu tại Hải Phòng'
    PRIMARY KEY (letter_id, mentioned_person_id),
    FOREIGN KEY (letter_id) REFERENCES letters(id) ON DELETE CASCADE,
    FOREIGN KEY (mentioned_person_id) REFERENCES people(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 3. NGUYÊN TẮC TÍCH HỢP TƯ LIỆU CLARA
- Thư gửi Clara hiện đang lưu tại `server/data/private/clara.json`.
- Khi CSDL áp dụng mô hình `letters`, 8 lá thư Clara sẽ được định danh với:
  * `collection_id = 'CLARA_LETTERS_V1'`
  * `access_scope = 'RESTRICTED_P0'`
  * `author_person_id = '@I18@'` (Cụ Hạnh)
  * `recipient_type = 'INDIVIDUAL'` ➔ `recipient_target_id = '@I170@'` (Clara)
- Quyền truy cập vẫn tiếp tục được rào chắn bởi logic `isClaraEligible`, tuyệt đối không rò rỉ cho bất kỳ ai ngoài phạm vi được ủy quyền.

---

## 4. CHIẾN LƯỢC TRIỂN KHAI THEO PHÂN KỲ (PHASING STRATEGY)
1. **Giai đoạn Hiện tại (In-Memory / Fixture / Test Engine):**
   - Triển khai mock adapter và fixture dữ liệu trong `src/js/ui/letters.js` và `server/data/letters_fixture.json`.
   - Kiểm thử toàn diện logic hiển thị, lọc quyền, soạn thảo và lưu trữ cục bộ.
   - **Cam kết:** Không thực thi lệnh DDL `CREATE TABLE` trên Production MariaDB khi chưa qua Human Gate của Tuấn.
2. **Giai đoạn Migration:**
   - Trình DDL chính thức kèm kế hoạch Rollback để Tuấn phê duyệt áp dụng lên CSDL Production.

