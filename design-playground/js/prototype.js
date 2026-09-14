/* DESIGN-001 REVISION: data layer + home renderers (vanilla, Dreamweaver-friendly).
   REAL snapshot data; no fakes. Renders curated content, not a database dump. */
(function () {
  "use strict";

  var SNAPSHOT_STORIES = [
    { slug: "01-gioi-thieu", title: "Giới Thiệu: MẠCH được bắt đầu như thế nào?",
      deck: "Dòng họ trong đời sống đương đại đang đứng trước một sự chuyển dịch âm thầm nhưng sâu sắc.",
      date: "03/07/2026", series: "Tập san MẠCH (Số 01)" },
    { slug: "02-cay-gia-pha-va-mach", title: "Cây Gia Phả & Mạch",
      deck: "Cây gia phả lưu lại cấu trúc và vị trí. MẠCH lưu lại những gì xảy ra giữa những vị trí ấy.",
      date: "03/07/2026", series: "Tập san MẠCH (Số 01)" },
    { slug: "03-khi-su-gan-gui-khong-con-tu-nhien", title: "Khi Sự Gần Gũi Không Còn TỰ NHIÊN",
      deck: "Có những người lớn lên trong việc đi vài căn nhà là tới nhà họ hàng.",
      date: "03/07/2026", series: "Tập san MẠCH (Số 01)" },
    { slug: "04-tu-he-tu-tuong-den-dao-ly-doi-song", title: "Từ Hệ Tư Tưởng Đến Đạo Lý Đời SỐNG",
      deck: "Những triết lý lớn khi đi vào nếp nhà thường co lại thành vài câu giản dị.",
      date: "03/07/2026", series: "Tập san MẠCH (Số 01)" },
    { slug: "05-nhung-khe-uoc-vo-hinh-cua-dong-ho", title: "Những Khế Ước Vô Hình Của Dòng Họ",
      deck: "Có những trách nhiệm trong họ không bao giờ được viết thành văn.",
      date: "03/07/2026", series: "Tập san MẠCH (Số 01)" }
  ];

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

  function mapStories() {
    var D = window.__D001_DATA;
    var src;
    if (D && D.stories) {
      src = D.stories.map(function (s) {
        return { slug: s.slug, title: s.title,
          dek: s.dek || s.deck || s.deckLead || "",
          date: fmtD(s.date || s.publishedAt), series: s.series || "MẠCH" };
      });
    } else {
      src = SNAPSHOT_STORIES;
    }
    return src;
  }

  function storyLink(s) {
    return "#/mach/bai-viet/" + encodeURIComponent(s.slug);
  }

  /* Home curated grid: 1 lead + 2 curated — không phải catalogue */
  function renderHomeCurated() {
    var el = document.getElementById("machCuratedGrid");
    if (!el) return;
    var stories = mapStories();
    if (!stories.length) { el.innerHTML = "<p>Chưa có dữ liệu snapshot.</p>"; return; }
    var lead = stories[0];
    var html = '<a class="curated-card curated-lead" href="' + esc(storyLink(lead)) + '">' +
      '<p class="lead-kicker">' + esc(lead.series || "MẠCH") + '</p>' +
      '<h3 class="curated-title">' + esc(lead.title) + '</h3>' +
      '<p class="curated-dek">' + esc(lead.dek) + '</p>' +
      '<p class="curated-meta">' + esc(fmtD(lead.date)) + '</p></a>';
    stories.slice(1, 3).forEach(function (a) {
      html += '<a class="curated-card" href="' + esc(storyLink(a)) + '">' +
        '<h3 class="curated-title">' + esc(a.title) + '</h3>' +
        '<p class="curated-dek">' + esc(a.dek) + '</p>' +
        '<p class="curated-meta">' + esc(a.series || "MẠCH") + " · " + esc(fmtD(a.date)) + '</p></a>';
    });
    el.innerHTML = html;
  }

  function renderMemory(mem) {
    var t = document.getElementById("memTitle");
    var b = document.getElementById("memByline");
    var x = document.getElementById("memText");
    if (t) t.textContent = mem.title || "";
    if (b) b.textContent = "Ghi chép về: " + (mem.person || "");
    if (x) x.textContent = mem.text || "";
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

  function renderMemAndStats() {
    var D = window.__D001_DATA;
    if (D) {
      if (D.mem) renderMemory(D.mem);
      if (D.stats) renderStats(D.stats);
    }
  }

  function boot() {
    renderHomeCurated();
    renderMemAndStats();
    var now = new Date();
    var dd = ("0" + now.getDate()).slice(-2);
    var mm = ("0" + (now.getMonth() + 1)).slice(-2);
    var el = document.getElementById("utilDate");
    if (el) el.textContent = dd + "/" + mm + "/" + now.getFullYear() +
      " · Ấn phẩm của dòng họ";
    /* Live upgrade path: replace snapshot with exact mach.json when network allows */
    if (window.fetch) {
      fetch("https://api.giatoctrantrongthu.com/api/mach.json")
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (mach) {
          if (!mach || !(mach.stories || mach.articles || []).length) return;
          var all = mach.stories || mach.articles;
          window.__D001_DATA = window.__D001_DATA || {};
          window.__D001_DATA.stories = all.slice(0, 5);
          renderHomeCurated();
        }).catch(function () {});
    }
  }

  window.__d001 = { stories: null, storyLink: storyLink,
    esc: esc, fmtD: fmtD, mapStories: mapStories,
    renderHomeCurated: renderHomeCurated };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }
})();