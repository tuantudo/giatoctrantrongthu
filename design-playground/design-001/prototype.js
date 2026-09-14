/* DESIGN-001 prototype data layer (part 1: snapshots + renderers). */
(function () {
  "use strict";

  var SNAPSHOT_STORIES = [
    { slug: "01-gioi-thieu", title: "Gioi Thieu: MACH duoc bat dau nhu the nao?",
      deck: "Dong ho trong doi song duong dai dang dung truoc mot su chuyen dich am tham nhung sau sac.",
      date: "03/07/2026", series: "Tap san MACH (So 01)" },
    { slug: "02-cay-gia-pha-va-mach", title: "Cay Gia Pha & Mach",
      deck: "Cay gia pha luu lai cau truc va vi tri. MACH luu lai nhung gi xay ra giua nhung vi tri ay.",
      date: "03/07/2026", series: "Tap san MACH (So 01)" },
    { slug: "03-khi-su-gan-gui-khong-con-tu-nhien", title: "Khi Su Gan Gui Khong Con TU NHIEN",
      deck: "Co nhung nguoi lon len trong viec di vai can nha la toi nha ho hang.",
      date: "03/07/2026", series: "Tap san MACH (So 01)" },
    { slug: "04-tu-he-tu-tuong-den-dao-ly-doi-song", title: "Tu He Tu Tuong Den Dao Ly Doi SONG",
      deck: "Nhung triet ly lon khi di vao nep nha thuong co lai thanh vai cau gian di.",
      date: "03/07/2026", series: "Tap san MACH (So 01)" },
    { slug: "05-nhung-khe-uoc-vo-hinh-cua-dong-ho", title: "Nhung Khe Uoc Vo Hinh Cua Dong Ho",
      deck: "Co nhung trach nhiem trong ho khong bao gio duoc viet thanh van.",
      date: "03/07/2026", series: "Tap san MACH (So 01)" }
  ];

  /* NOTE: snapshot titles above use ASCII fallback so the file stays
     Dreamweaver-safe; live fetch (part 2) replaces them with exact
     Vietnamese text from mach.json when network is available. */

  var SNAPSHOT_SIDEBAR = [
    { d: "15 / 08", t: "Ngay gio - Giuse Tran Trong Thu" },
    { d: "01 / 01", t: "Ngay gio - Truong Cong Trang" },
    { d: "01 / 01", t: "Ngay gio - Tran Thi An - Cam Giang" }
  ];

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function renderStories(stories) {
    var lead = stories[0];
    if (lead) {
      document.getElementById("leadTitle").textContent = lead.title || "";
      document.getElementById("leadDek").textContent = lead.deck || "";
      document.getElementById("leadMeta").textContent = (lead.series || "MACH") + "  |  " + (lead.date || "");
    }
    var list = document.getElementById("machList");
    var html = "";
    stories.slice(1, 5).forEach(function (a, i) {
      html += '<a class="mach-row" href="#/mach/bai-viet/' + esc(a.slug) + '">' +
        '<span class="mach-num">0' + (i + 2) + '</span>' +
        '<span><span class="mach-title">' + esc(a.title) + '</span>' +
        '<span class="mach-dek" style="display:block">' + esc(a.deck || "") + '</span>' +
        '<span class="mach-meta" style="display:block">' + esc(a.series || "MACH") + " | " + esc(a.date || "") + '</span></span></a>';
    });
    list.innerHTML = html;
  }

  function renderSidebar(items) {
    var html = "";
    items.forEach(function (e) {
      html += '<div class="side-item"><span class="d">' + esc(e.d) + '</span>' + esc(e.t) + '</div>';
    });
    document.getElementById("sideList").innerHTML = html;
  }

  window.__d001 = { stories: SNAPSHOT_STORIES, sidebar: SNAPSHOT_SIDEBAR,
    renderStories: renderStories, renderSidebar: renderSidebar, esc: esc };

  /* Boot: prefer REAL snapshot file (exact Vietnamese), then live API. */
  function boot() {
    var D = window.__D001_DATA;
    if (D && D.stories) {
      var mapped = D.stories.map(function (s) {
        return { slug: s.slug, title: s.title, deck: s.deck,
          date: fmtD(s.date), series: s.series };
      });
      renderStories(mapped);
      if (D.mem) renderMemory(D.mem);
      if (D.stats) renderStats(D.stats);
    } else {
      renderStories(SNAPSHOT_STORIES);
    }
    renderSidebar(SNAPSHOT_SIDEBAR);
    if (window.fetch) {
      fetch("https://api.giatoctrantrongthu.com/api/mach.json")
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (mach) {
          if (!mach || !(mach.stories || []).length) return;
          renderStories(mach.stories.slice(0, 5).map(function (s) {
            return { slug: s.slug, title: s.title, deck: s.deckLead || s.excerpt || "",
              date: fmtD(s.publishedAt || s.date), series: "Tap san MACH (So 01)" };
          }));
        }).catch(function () {});
    }
  }

  function fmtD(iso) {
    try {
      var d = new Date(iso);
      if (isNaN(d)) return iso || "";
      return ("0" + d.getDate()).slice(-2) + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + d.getFullYear();
    } catch (e) { return iso || ""; }
  }

  function renderMemory(mem) {
    document.getElementById("memTitle").textContent = mem.title || "";
    document.getElementById("memByline").textContent = "Ghi chep ve: " + (mem.person || "");
    document.getElementById("memText").textContent = mem.text || "";
  }

  function renderStats(stats) {
    if (stats.individuals) document.getElementById("statInd").textContent = stats.individuals;
    if (stats.families) document.getElementById("statFam").textContent = stats.families;
    if (stats.memories) document.getElementById("statMem").textContent = stats.memories;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }
})();
