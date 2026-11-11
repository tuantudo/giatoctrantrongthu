/**
 * src/js/mirror.js
 * Controller for Local Mirror of Production Baseline (DESIGN-001 Revision)
 * Adheres strictly to Tuấn's Product Intent:
 * 1. Homepage '#/' is the only outward social interface.
 * 2. Hash routes '#/mach', '#/gia-pha', '#/lich', '#/tim-kiem' are MEMBER GATEWAYS.
 *    Unverified visitors see verification instructions, NOT internal content!
 * 3. Verified members can access the internal views.
 */

(function () {
  "use strict";

  // Data Layer (Local Mirror Data from local snapshots)
  window.__MIRROR_DATA = {
    stories: [],
    mem: null,
    stats: { individuals: 228, families: 0, memories: 2 },
    calendarEvents: [],
    isVerifiedMember: false
  };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function fmtD(iso) {
    try {
      var d = new Date(iso);
      if (isNaN(d)) return iso || "";
      return ("0" + d.getDate()).slice(-2) + "/" +
        ("0" + (d.getMonth() + 1)).slice(-2) + "/" + d.getFullYear();
    } catch (e) { return iso || ""; }
  }

  function setText(id, val) {
    var el = document.getElementById(id);
    if (el && val != null && val !== "") el.textContent = val;
  }

  function renderStats(stats) {
    setText("statInd", stats.individuals);
    setText("statFam", stats.families);
    setText("statMem", stats.memories);
    setText("gpStatInd", stats.individuals);
    setText("gpStatFam", stats.families);
    setText("gpStatMem", stats.memories);
  }

  // Check Local Member Session
  function checkSession() {
    // Check if test persona is set in localStorage
    var persona = localStorage.getItem('giatoc_mock_persona') || 'ANONYMOUS';
    var isMember = (persona === 'A-HD' || persona === 'A-OB' || persona === 'ACTIVE');
    window.__MIRROR_DATA.isVerifiedMember = isMember;

    var memberStatusEl = document.getElementById("mirrorMemberStatus");
    if (memberStatusEl) {
      if (isMember) {
        memberStatusEl.innerHTML = '<span class="status-badge member">Thành viên: ' + esc(persona) + '</span> ' +
          '<button type="button" id="btnToggleAuth" class="btn-toggle-auth">Đăng xuất</button>';
      } else {
        memberStatusEl.innerHTML = '<span class="status-badge guest">Khách vãng lai</span> ' +
          '<button type="button" id="btnToggleAuth" class="btn-toggle-auth">Thử nghiệm Đăng nhập</button>';
      }
      var btn = document.getElementById("btnToggleAuth");
      if (btn) {
        btn.onclick = function () {
          if (window.__MIRROR_DATA.isVerifiedMember) {
            localStorage.setItem('giatoc_mock_persona', 'ANONYMOUS');
          } else {
            localStorage.setItem('giatoc_mock_persona', 'A-HD');
          }
          checkSession();
          route();
        };
      }
    }
  }

  // Load safe local data
  function loadLocalData() {
    // Default safe snapshot stats
    renderStats(window.__MIRROR_DATA.stats);

    // Default Memory
    window.__MIRROR_DATA.mem = {
      title: "Lời tiền nhân truyền lại",
      person: "Cụ Khởi Tổ",
      text: "Giữ lấy nếp nhà, lấy chữ hiếu thuận làm đầu, con cháu các đời đoàn kết đùm bọc lẫn nhau..."
    };
    var t = document.getElementById("memTitle");
    var b = document.getElementById("memByline");
    var x = document.getElementById("memText");
    if (t) t.textContent = window.__MIRROR_DATA.mem.title;
    if (b) b.textContent = "Ghi chép về: " + window.__MIRROR_DATA.mem.person;
    if (x) x.textContent = window.__MIRROR_DATA.mem.text;
  }

  // Gateway Verification Screen Builder
  function buildGatewayNotice(spaceName, spaceDescription) {
    return '<div class="gateway-box">' +
      '<div class="gateway-icon">🏛️</div>' +
      '<p class="section-label">CỔNG XÁC MINH TƯ CÁCH THÀNH VIÊN</p>' +
      '<h2 class="gateway-title">Không gian ' + esc(spaceName) + '</h2>' +
      '<p class="gateway-desc">' + esc(spaceDescription) + '</p>' +
      '<div class="gateway-rule-box">' +
        '<p><strong>Lưu ý bảo vệ di sản & quyền riêng tư:</strong></p>' +
        '<p>Đây là không gian nội bộ dành riêng cho người trong dòng họ Trần Trọng Thu. Khách vãng lai và người chưa xác thực tư cách thành viên không được truy cập dữ liệu gia đình.</p>' +
      '</div>' +
      '<div class="gateway-actions">' +
        '<a href="#/tu-cach-thanh-vien" class="btn-gateway-primary">Xác minh tư cách thành viên →</a>' +
        '<a href="/lab.html" class="btn-gateway-secondary">Mở Vibecode Lab Review</a>' +
        '<a href="#/" class="btn-gateway-link">← Quay về Trang nhất</a>' +
      '</div>' +
    '</div>';
  }

  // Router
  function route() {
    var hash = window.location.hash.replace(/^#\//, "") || "";
    var parts = hash.split("/");
    var root = parts[0];

    var known = {
      "": "home",
      "gia-pha": "gia-pha",
      "mach": "mach",
      "tu-lieu": "tu-lieu",
      "lich": "lich",
      "tim-kiem": "tim-kiem",
      "tu-cach-thanh-vien": "tu-cach-thanh-vien",
      "thanh-vien": "thanh-vien",
      "cai-dat": "cai-dat"
    };

    var viewId = known[root];
    if (!viewId) viewId = "home";

    // Hide all views
    document.querySelectorAll("[data-view]").forEach(function (el) {
      el.hidden = true;
    });

    var target = document.querySelector('[data-view="' + viewId + '"]');
    var isMember = window.__MIRROR_DATA.isVerifiedMember;

    // Gateways Enforcement (Product Intent 2.3)
    // Routes: mach, gia-pha, lich, tim-kiem require membership verification!
    var isGatewayRoute = (viewId === "mach" || viewId === "gia-pha" || viewId === "lich" || viewId === "tim-kiem");

    if (isGatewayRoute && !isMember) {
      // Show Gateway Verification Notice, DO NOT render internal content
      var gatewayContainer = document.getElementById("gatewayContainer");
      if (!gatewayContainer) {
        gatewayContainer = document.createElement("div");
        gatewayContainer.id = "gatewayContainer";
        target.parentNode.insertBefore(gatewayContainer, target);
      }
      gatewayContainer.hidden = false;

      var spaceMeta = {
        "mach": { name: "Khảo Cứu Tư Tưởng MẠCH", desc: "Không gian tư tưởng, khảo sát, ghi nhận và đối thoại về lịch sử văn hóa dòng họ Trần Trọng Thu." },
        "gia-pha": { name: "Phả Hệ & Quan Hệ Gia Đình", desc: "Hệ thống phả hệ chi tiết, cây phả đồ đa thế hệ và danh bạ nhân thân dòng họ." },
        "lich": { name: "Lịch Gia Tộc & Giỗ Chạp", desc: "Các mốc sự kiện ngày giỗ, ngày sinh, ngày kỵ và dấu mốc truyền thống của gia tộc." },
        "tim-kiem": { name: "Tra Cứu Dữ Liệu Gia Tộc", desc: "Công cụ tìm kiếm thông tin nhân vật, bài viết và tư liệu nội bộ." }
      };

      var meta = spaceMeta[viewId] || { name: "Nội Bộ", desc: "Không gian nội bộ gia tộc." };
      gatewayContainer.innerHTML = buildGatewayNotice(meta.name, meta.desc);
      target.hidden = true;
    } else {
      // Either Home, Tu-Cach-Thanh-Vien, or Authenticated Member
      var gatewayBox = document.getElementById("gatewayContainer");
      if (gatewayBox) gatewayBox.hidden = true;

      if (target) {
        target.hidden = false;
      } else {
        var fallback = document.querySelector('[data-view="home"]');
        if (fallback) fallback.hidden = false;
      }
    }

    window.scrollTo(0, 0);

    // Highlight active nav tab
    document.querySelectorAll(".pub-nav a").forEach(function (el) {
      el.removeAttribute("aria-current");
    });
    var activeLink = document.querySelector('.pub-nav a[href="#/' + (root ? root : "") + '"]');
    if (activeLink) activeLink.setAttribute("aria-current", "page");
  }

  function boot() {
    var now = new Date();
    var dd = ("0" + now.getDate()).slice(-2);
    var mm = ("0" + (now.getMonth() + 1)).slice(-2);
    var el = document.getElementById("utilDate");
    if (el) el.textContent = dd + "/" + mm + "/" + now.getFullYear() + " · Ấn phẩm của dòng họ";

    loadLocalData();
    checkSession();
    window.addEventListener("hashchange", route);
    route();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

