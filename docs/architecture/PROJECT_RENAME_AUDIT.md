# Project Rename Audit

## 1. Current Identity
[THỰC TẾ]
- Local Workspace: `/Users/tuantq/Projects/Personal/family-calendar`
- GitHub Repository: `tuantudo/family-calendar`
- Các tài liệu và scripts cấu hình hardcoded tham chiếu đến `family-calendar`.

## 2. Target Identity
[THỰC TẾ]
- Local Workspace: `/Users/tuantq/Projects/Personal/giatoctrantrongthu`
- GitHub Repository: `tuantudo/giatoctrantrongthu`
- Production Domain: `giatoctrantrongthu.com` (Giữ nguyên)

## 3. Impact Audit

### GitHub
[THỰC TẾ] Remote `origin` trỏ tới `git@github.com:tuantudo/family-calendar.git`. Rename GitHub repository không làm gãy redirect, nhưng bắt buộc phải update local remote để đồng bộ.

### Local Workspace
[THỰC TẾ] Nằm tại thư mục `family-calendar`. Một số python/shell script có chứa absolute path trỏ tới thư mục này. 

### Vercel
[THỰC TẾ] Tệp `.vercel/project.json` chỉ ra Project ID được liên kết có tên là `gionghotrantrongthu`. Việc rename GitHub repo không làm đứt gãy tự động Vercel (vì Vercel track theo repo ID/webhook). Tuy nhiên, tên Vercel project đang chưa đồng nhất với target identity.

### Cloudflare / Production
[SUY LUẬN] Vercel đứng sau Cloudflare bằng CNAME. Rename source code repository không ảnh hưởng đến domain DNS resolving hiện tại.

### Documentation & Scripts
[THỰC TẾ] Grep phát hiện hàng loạt các tệp markdown (`AGENTS.md`, `ARCHITECTURE.md`), `package.json`, và các python script (`build_mach.py`) có chứa chuỗi `family-calendar`.

## 4. Rename Decision

**SAFE TO RENAME**

[SUY LUẬN] Rename an toàn vì không can thiệp vào production domain, không thay đổi runtime backend/database, và có quyền `gh` CLI để thực thi trực tiếp việc đổi tên repository.

## 5. Changes Executed

[THỰC TẾ] Đã thực thi các thay đổi sau:
1. **GitHub Repository:** Dùng CLI `gh repo rename giatoctrantrongthu --repo tuantudo/family-calendar -y`.
2. **Git Remote:** `git remote set-url origin git@github.com:tuantudo/giatoctrantrongthu.git`.
3. **Local Filesystem:** Dùng lệnh `mv` đổi tên thư mục cha từ `family-calendar` thành `giatoctrantrongthu`.
4. **Internal References:** Thay thế `family-calendar` -> `giatoctrantrongthu` ở các file thuộc project identity:
   - `package.json` (name, urls)
   - `README.md`
   - `AGENTS.md`
   - Tất cả các file `.md` trong thư mục `docs/`
   - `.opencode/agents/*.json`
   - `scripts/*.py`

## 6. References Intentionally Kept

[THỰC TẾ] Những file/folder KHÔNG ĐƯỢC CHẠM VÀO:
- Lịch sử Git (Commit history).
- `.vercel/project.json` (Giữ nguyên cấu trúc JSON hiện tại để không vô tình phá vỡ local dev link).
- Không tự build lại `.next` cache, chỉ xóa thư mục để tự sinh ra đường dẫn mới ở lần build kế tiếp.

## 7. Verification

[THỰC TẾ] Sau khi thực hiện:
1. `pwd` = `/Users/tuantq/Projects/Personal/giatoctrantrongthu`
2. `git remote -v` = `origin git@github.com:tuantudo/giatoctrantrongthu.git (fetch & push)`
3. `gh repo view tuantudo/giatoctrantrongthu` = Thành công (Hiển thị name `tuantudo/giatoctrantrongthu`).
4. Production `https://giatoctrantrongthu.com` = Vẫn hoạt động bình thường (không sập).
5. Git changes đã commit & push nhánh `main`.

## 8. Remaining Manual Actions

[ĐỀ XUẤT] Agent không có quyền truy cập trực tiếp Web UI của Vercel, Owner cần thực hiện tay bước sau nếu muốn sự đồng bộ 100%:
- Đăng nhập Vercel Dashboard.
- Vào project hiện tại (tên hiển thị đang là `gionghotrantrongthu`).
- Vào Settings -> General -> Project Name -> Sửa thành `giatoctrantrongthu` -> Save. (Lưu ý Vercel có thể sẽ thay đổi preview URL mặc định thành `giatoctrantrongthu.vercel.app`, hãy cẩn thận nếu đang hardcode `.vercel.app` ở đâu đó).
