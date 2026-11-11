<map version="1.0.1">
<!-- Editable Mindmap (.mm) - Open in XMind, Freeplane, FreeMind, MindNode, or Draw.io (Arrange > Insert > Advanced > From FreeMind) -->
<node ID="ROOT" TEXT="GIA TỘC TRẦN TRỌNG THU — CURRENT WEBSITE SITEMAP (AS-IS AUDIT 2026-11-07)">

  <node ID="SPACE_PUBLIC" POSITION="right" TEXT="1. PUBLIC SPACE (Không gian Đối ngoại &amp; Cổng vào)" COLOR="#1E3A8A">
    <node ID="PUB_HOME" TEXT="[PAGE | STATIC+JS | PUBLIC | CONFLICT: DOUBLE-SHELL] GET / (index.html + src/js/ui/boot-public.js + public-home.js)" COLOR="#B91C1C">
      <node ID="PUB_SHELL_1" TEXT="[CONFLICT: DUPLICATE SHELL #1] Static D001 Outer Chrome (index.html:12-83) — .gi-util-strip + .gi-masthead + #pubNav + .gi-colophon + unbound #backTop/#chatFab"/>
      <node ID="PUB_SHELL_2" TEXT="[CONFLICT: DUPLICATE SHELL #2] Mounted UI vNEXT Shell (boot-public.js:38 -&gt; shell.js:90) — InstitutionHeader + GlobalNav(PUBLIC_NAV) + Footer"/>
      <node ID="PUB_SECTIONS" TEXT="[IN-PAGE ANCHORS — KHÔNG PHẢI PAGE] 6 Khu vực nội dung trong public-home.js:22-292">
        <node ID="SEC_01" TEXT="#dinh-vi — 01. Định vị Không gian (public-home.js:30)"/>
        <node ID="SEC_02" TEXT="#van-de — 02. Câu hỏi Nghiên cứu &amp; Khảo sát (public-home.js:86)"/>
        <node ID="SEC_03" TEXT="#noi-dung — 03. Công bố Khảo cứu &amp; Ghi nhận (public-home.js:134)"/>
        <node ID="SEC_04" TEXT="[CONFLICT: HASH COLLISION] #mach — 04. MẠCH Showcase (public-home.js:167) — Bấm link #mach bị boot-public.js:45 nuốt vào Gateway!"/>
        <node ID="SEC_05" TEXT="#nguon-goc — 05. Nguồn gốc &amp; Phương pháp (public-home.js:205)"/>
        <node ID="SEC_06" TEXT="#doi-thoai — 06. Đối thoại &amp; Cổng Thành viên (public-home.js:244)"/>
      </node>
      <node ID="PUB_GATEWAYS" TEXT="[SPA_VIEW | PUBLIC GATEWAY CARDS] 9 Hash Routes khóa bằng renderInvitationGateway (boot-public.js:20-28 + gateway.js:103-183)">
        <node ID="GW_1" TEXT="#/mach &amp; #mach — Cửa ngõ MẠCH (gateway.js:25) [CONFLICT với section #mach]"/>
        <node ID="GW_2" TEXT="#/tu-lieu — Cửa ngõ Tư liệu (gateway.js:33)"/>
        <node ID="GW_3" TEXT="#/gia-pha — Cửa ngõ Gia phả (gateway.js:41)"/>
        <node ID="GW_4" TEXT="#/gia-pha/ky-uc — Cửa ngõ Ký ức Gia tộc (gateway.js:49)"/>
        <node ID="GW_5" TEXT="#/lich — Cửa ngõ Lịch Dòng họ (gateway.js:57)"/>
        <node ID="GW_6" TEXT="#/tim-kiem — Cửa ngõ Tìm kiếm (gateway.js:65)"/>
        <node ID="GW_7" TEXT="#/tu-cach-thanh-vien — Cửa ngõ Tư cách Thành viên (gateway.js:73)"/>
        <node ID="GW_8" TEXT="#/thanh-vien — Cửa ngõ Không gian Thành viên (gateway.js:81)"/>
        <node ID="GW_9" TEXT="#/ve-du-an — Cửa ngõ Về Dự án (gateway.js:89)"/>
      </node>
      <node ID="PUB_DEAD" TEXT="[BROKEN DEAD LINK] #/cai-dat (index.html:28) — Không có trong GATEWAY_ROUTES và không có DOM ID"/>
    </node>
  </node>

  <node ID="SPACE_AUTH" POSITION="right" TEXT="2. AUTH &amp; ACCOUNT ONBOARDING GATE (Cổng Xác thực)" COLOR="#065F46">
    <node ID="AUTH_LOGIN" TEXT="[PAGE | DYNAMIC INLINE HTML | PUBLIC] GET /login (?force_auto=1) — Cổng Thành Viên (server/member.js:28-126)"/>
    <node ID="AUTH_CHGPW" TEXT="[PAGE | DYNAMIC INLINE HTML | AUTH: PROVISIONED ONLY] GET /me/change-password (server/member.js:187-253) [CONFLICT: ACTIVE member bấm từ MEMBER_NAV bị redirect 302 ngược về /me]"/>
    <node ID="AUTH_LOGOUT" TEXT="[REDIRECT | PUBLIC/MEMBER] GET /logout -&gt; 302 / (server/member.js:428-435)"/>
    <node ID="AUTH_ADMIN_LOGIN" TEXT="[PAGE | STATIC HTML | PUBLIC] GET /admin/login.html — Admin Control Room Login (admin/login.html + admin/js/login.js)"/>
  </node>

  <node ID="SPACE_MEMBER" POSITION="right" TEXT="3. MEMBER INNER SITE — /me/* (Không gian Thành viên Xác thực — requireAccount)" COLOR="#7C2D12">
    <node ID="MEM_HOME" TEXT="[PAGE | AUTH: MEMBER | IMPLEMENTED] GET /me — Không gian của tôi / Sảnh chờ nội bộ (server/member_dashboard.html + boot-dashboard.js + dashboard.js)">
      <node ID="MEM_TREE" TEXT="[PAGE | AUTH: MEMBER | IMPLEMENTED] GET /me/tree (?focus=:id) — Cây phả đồ 3 tầng &amp; Danh bạ (server/member_tree.html + boot-tree.js + tree.js)">
        <node ID="MEM_PERSON" TEXT="[PAGE | DYNAMIC :id | AUTH: MEMBER | IMPLEMENTED] GET /me/tree/person/:id — Hồ sơ nhân vật 6 tầng (server/member_person.html + boot-person.js + person.js)"/>
      </node>
      <node ID="MEM_MACH" TEXT="[PAGE + IN-MEMORY SPA_VIEW | AUTH: MEMBER | IMPLEMENTED] GET /me/mach — Chuyên san MẠCH nội bộ (server/member_mach.html + boot-discourse.js + discourse.js)">
        <node ID="MEM_MACH_READER" TEXT="[IN-MEMORY VIEW — KHÔNG CÓ URL RIÊNG] Article Reader (editorial.js) — Bấm Back trình duyệt sẽ thoát hẳn khỏi /me/mach"/>
      </node>
      <node ID="MEM_GALLERY" TEXT="[PAGE | AUTH: MEMBER | MISSING FROM MEMBER_NAV] GET /me/gallery (?personId=&amp;kind=) — Kho tư liệu ảnh 185 di ảnh (server/member_gallery.html + boot-gallery.js + gallery.js)"/>
      <node ID="MEM_EVENTS" TEXT="[PAGE | AUTH: MEMBER | MISSING FROM MEMBER_NAV] GET /me/events — Lịch giỗ &amp; Niên biểu âm dương (server/member_events.html + boot-events.js + events.js)"/>
      <node ID="MEM_SPACES" TEXT="[PAGE | AUTH: MEMBER | PLACEHOLDER / DISCONNECTED BACKEND] GET /me/family-spaces — Không gian gia đình (server/member_spaces.html + spaces.js — Hiện NOT_AVAILABLE dù /api/spaces/* đã mount)"/>
      <node ID="MEM_CLARA" TEXT="[PAGE | AUTH: RESTRICTED ALLOWLIST | CONFLICT: AUTH &amp; NAV LEAK] GET /me/clara — Thư gửi Clara (server/member_clara.html + discourse.js)" COLOR="#991B1B">
        <node ID="CLARA_BUG_1" TEXT="[CONFLICT] Hiển thị công khai trên MEMBER_NAV cho mọi thành viên (vi phạm Zero-Hint)"/>
        <node ID="CLARA_BUG_2" TEXT="[BROKEN AUTH] POST /api/member/login không lưu username/role/personId vào session -&gt; tuantq đăng nhập qua /login bị 403 trên /api/member/clara.json!"/>
      </node>
      <node ID="MEM_MISSING_SEARCH" TEXT="[INTENDED BUT MISSING] Global Permission-Aware Search (/me/tim-kiem hoặc Global Search UI + /api/search — Quy định trong PRODUCT_EXPERIENCE_SPECIFICATION_v1.0.md)"/>
      <node ID="MEM_MISSING_PERSONAL" TEXT="[INTENDED BUT MISSING] Sổ tay Cá nhân cô lập (Personal Space UI — Đã có đặc tả Spec v1.0 &amp; /api/spaces/personal nhưng chưa có UI route)"/>
    </node>
  </node>

  <node ID="SPACE_ADMIN" POSITION="left" TEXT="4. ADMIN CONTROL PLANE — /admin/* (Trung tâm Quản trị — admin_users)" COLOR="#4C1D95">
    <node ID="ADM_SHELL" TEXT="[PAGE | STATIC SHELL + CLIENT AUTH CHECK] GET /admin (/admin/index.html + admin/js/admin.js)">
      <node ID="ADM_DASH" TEXT="[SPA_VIEW | AUTH: ADMIN] #/dashboard — Tổng quan thống kê (admin.js:68)"/>
      <node ID="ADM_PEOPLE" TEXT="[SPA_VIEW | AUTH: ADMIN] #/people &amp; #/people/:id — Quản lý nhân vật &amp; cạnh quan hệ (admin.js:72)"/>
      <node ID="ADM_STORIES" TEXT="[SPA_VIEW | AUTH: ADMIN] #/stories &amp; #/stories/:id — Biên tập bài viết MẠCH (admin.js:76)"/>
      <node ID="ADM_EVENTS" TEXT="[SPA_VIEW | AUTH: ADMIN] #/events &amp; #/events/:uid (+ typo #/eventsgiat) — Quản lý sự kiện lịch (admin.js:84)"/>
      <node ID="ADM_DB" TEXT="[SPA_VIEW | AUTH: OWNER] #/database — Sơ đồ &amp; kiểm tra bảng CSDL (admin.js:739)"/>
      <node ID="ADM_USERS" TEXT="[SPA_VIEW | AUTH: OWNER] #/users — Quản lý tài khoản admin_users (admin.js:632)"/>
      <node ID="ADM_INBOX" TEXT="[SPA_VIEW | PLACEHOLDER / MISSING IMPL] #/inbox — Inbox đóng góp chờ duyệt (admin/index.html:24 -&gt; báo Chưa có sẵn)"/>
      <node ID="ADM_ARCHIVE" TEXT="[SPA_VIEW | PLACEHOLDER / MISSING IMPL] #/archive — Di sản / Tư liệu ảnh (admin/index.html:30 -&gt; báo Chưa có sẵn)"/>
      <node ID="ADM_MISSING_V21" TEXT="[INTENDED IN ADMIN SPEC v2.1 BUT MISSING] #/genealogy (Proposals/Disputes), #/media, #/content/public (chờ DEC-A03), #/community (accounts + identity_mappings + Clara allowlist), #/lab, #/system/backup"/>
    </node>
  </node>

  <node ID="SPACE_STUDIO_ORPHAN" POSITION="left" TEXT="5. STUDIO / LAB / MIRROR &amp; ORPHAN SURFACES (Môi trường Thiết kế &amp; Tệp Mồ côi)" COLOR="#374151">
    <node ID="LAB_HOST" TEXT="[PAGE | PUBLIC MOCK STUDIO] GET /lab.html (lab.html + src/js/ui/lab.js — cổng 3000 &amp; cổng 8888)">
      <node ID="LAB_VIEWS" TEXT="[9 LAB SPA_VIEWS] #view=public | dashboard | tree | person(&amp;id=) | mach | clara | spaces | gallery | events [CONFLICT: Interceptor lab.js:1412 thiếu /me/gallery &amp; /me/events]"/>
    </node>
    <node ID="MIRROR_HOST" TEXT="[ORPHAN ON EXPRESS 404 / ACTIVE ON STATIC] mirror.html + src/js/mirror.js — Production Baseline Mirror (#/, #/gia-pha, #/mach, #/lich, #/ve-du-an + 2 dead routes #/thanh-vien, #/cai-dat)"/>
    <node ID="ORPHAN_BASELINE" TEXT="[ORPHAN 404] server/member_baseline.html + src/js/member-app.js (Legacy V0 SPA 14 routes — Không còn route nào gọi)"/>
    <node ID="ORPHAN_APPV2" TEXT="[ORPHAN JS] src/js/app-v2.js (Legacy V2 router gọi /api/spaces/* — index.html không còn nạp)"/>
    <node ID="ORPHAN_PROTOS" TEXT="[ORPHAN 404 ON EXPRESS] prototype/index.html, prototype/design-001-public/index.html (broken asset paths), design-playground/index.html, chatbot-demo.html, chatbot-app/ (Next.js riêng), archive/legacy_frontend/index.html"/>
  </node>

  <node ID="NON_PAGE_LAYERS" POSITION="left" TEXT="6. NON-PAGE LAYERS (Phân tách nghiêm ngặt: KHÔNG PHẢI PAGE)" COLOR="#6B7280">
    <node ID="LAYER_COMP" TEXT="[COMPONENT] Drawers, Modals &amp; Lightboxes: Proposal Drawer (person.js), Gallery/Person Lightbox, Lab Navigator Modal, Lab Persona Switcher (#gi-lab-switcher), Unbound #chatPanel (index.html)"/>
    <node ID="LAYER_FEAT" TEXT="[FEATURE] Pedigree/List Switcher (/me/tree), Gallery Multi-Filter (/me/gallery), Solar-Lunar 2-Way Converter &amp; Year Selector (/me/events), Lab Inline Text Editor &amp; State Simulator"/>
    <node ID="LAYER_API" TEXT="[API — 27 ENDPOINTS] /api/auth/* (4), /api/admin/* (9), /api/member/* (5 — proposals là stub RAM), /api/genealogy|mach|media|person_media.json (4), /api/calendars/:filename (1 — PUBLIC chưa khóa auth), /api/spaces/* (4 — ORPHAN không UI active nào gọi)"/>
  </node>

</node>
</map>
