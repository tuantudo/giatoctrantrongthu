(function () {
  "use strict";

  // --- DATA LAYER ---
  window.__D001_DATA = {
    stories: [],
    mem: null,
    stats: { individuals: 0, families: 0, memories: 0 }
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

  function storyLink(s) {
    return "#/mach/bai-viet/" + encodeURIComponent(s.slug);
  }

  function renderHomeCurated() {
    var el = document.getElementById("machCuratedGrid");
    if (!el) return;
    var stories = window.__D001_DATA.stories;
    if (!stories.length) { el.innerHTML = "<p>Đang tải dữ liệu MẠCH...</p>"; return; }
    var lead = stories[0];
    var html = '<a class="curated-card curated-lead" href="' + esc(storyLink(lead)) + '">' +
      '<p class="lead-kicker">' + esc(lead.series || "MẠCH") + '</p>' +
      '<h3 class="curated-title">' + esc(lead.title) + '</h3>' +
      '<p class="curated-dek">' + esc(lead.dek || lead.deck || lead.deckLead) + '</p>' +
      '<p class="curated-meta">' + esc(fmtD(lead.date || lead.publishedAt)) + '</p></a>';
    stories.slice(1, 3).forEach(function (a) {
      html += '<a class="curated-card" href="' + esc(storyLink(a)) + '">' +
        '<h3 class="curated-title">' + esc(a.title) + '</h3>' +
        '<p class="curated-dek">' + esc(a.dek || a.deck || a.deckLead) + '</p>' +
        '<p class="curated-meta">' + esc(a.series || "MẠCH") + " · " + esc(fmtD(a.date || a.publishedAt)) + '</p></a>';
    });
    el.innerHTML = html;
  }

  function renderMemory(mem) {
    var t = document.getElementById("memTitle");
    var b = document.getElementById("memByline");
    var x = document.getElementById("memText");
    if (t) t.textContent = mem.title || "";
    if (b) b.textContent = "Ghi chép về: " + (mem.person || "");
    if (x) {
        var brief = mem.text || "";
        if (brief.length > 250) brief = brief.substring(0, 250) + "...";
        x.textContent = brief;
    }
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

  function fetchRealData() {
    // 1. Fetch MẠCH
    fetch("https://api.giatoctrantrongthu.com/api/mach.json")
      .then(r => r.ok ? r.json() : null)
      .then(mach => {
        if (mach && (mach.stories || mach.articles)) {
          var all = mach.stories || mach.articles || [];
          window.__D001_DATA.stories = all.slice(0, 5);
          renderHomeCurated();
        }
      }).catch(console.error);

    // 2. Fetch Genealogy
    fetch("https://api.giatoctrantrongthu.com/api/genealogy.json")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data || !data.people) return;
        var peopleKeys = Object.keys(data.people);
        var famsKeys = Object.keys(data.fams || {});
        var memories = [];
        peopleKeys.forEach(k => {
          if (data.people[k].memory) memories.push({name: data.people[k].name, mem: data.people[k].memory});
        });
        
        window.__D001_DATA.stats = {
          individuals: peopleKeys.length,
          families: famsKeys.length,
          memories: memories.length
        };
        
        if (memories.length > 0) {
           var m = memories[0];
           window.__D001_DATA.mem = {
             title: m.mem.title,
             person: m.name,
             text: m.mem.story
           };
        }
        
        renderStats(window.__D001_DATA.stats);
        if (window.__D001_DATA.mem) renderMemory(window.__D001_DATA.mem);
      }).catch(console.error);
  }

  // --- SYSTEM UTILS (from system.js) ---
  function toast(msg) {
    var t = document.getElementById("toast");
    if (!t) return;
    t.textContent = msg;
    t.hidden = false;
    setTimeout(function () { t.hidden = true; }, 2000);
  }

  function bindSystemTools() {
    var b2t = document.getElementById("btnB2T");
    if (b2t) {
      window.addEventListener("scroll", function () {
        b2t.hidden = (window.scrollY < 200);
      });
      b2t.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
    var chat = document.getElementById("btnChat");
    if (chat) chat.addEventListener("click", function () {
      toast("Trợ lý ảo — tính năng prototype chưa đấu nối backend.");
    });
    var btnMenu = document.getElementById("btnMenu");
    var navWrap = document.getElementById("navWrap");
    if (btnMenu && navWrap) {
      btnMenu.addEventListener("click", function () {
        navWrap.classList.toggle("nav-active");
      });
    }
  }

  // --- ROUTER (from router.js) ---
  function route() {
    var hash = window.location.hash.replace(/^#\//, "") || "";
    var parts = hash.split("/");
    var root = parts[0];
    
    var known = { "": "home", "gia-pha": "gia-pha", "mach": "mach",
      "tu-lieu": "tu-lieu", "lich": "lich", "tim-kiem": "tim-kiem",
      "tu-cach-thanh-vien": "tu-cach-thanh-vien", "thanh-vien": "thanh-vien", "cai-dat": "cai-dat" };
    
    var viewId = known[root];
    if (root === "mach" && parts[1] === "bai-viet" && parts[2]) viewId = "story";
    if (!viewId) viewId = "home";

    document.querySelectorAll("[data-view]").forEach(function(el) { el.hidden = true; });
    var target = document.querySelector('[data-view="' + viewId + '"]');
    if (target) {
      target.hidden = false;
    } else {
      var fallback = document.querySelector('[data-view="home"]');
      if (fallback) fallback.hidden = false;
    }
    window.scrollTo(0, 0);
    
    document.querySelectorAll(".editorial-nav-links a, .ed-more a, .path-links a").forEach(function(el) {
        el.classList.remove("active");
    });
    document.querySelectorAll('a[data-route="/' + root + '"]').forEach(function(el) {
        el.classList.add("active");
    });
  }

  function boot() {
    var now = new Date();
    var dd = ("0" + now.getDate()).slice(-2);
    var mm = ("0" + (now.getMonth() + 1)).slice(-2);
    var el = document.getElementById("utilDate");
    if (el) el.textContent = dd + "/" + mm + "/" + now.getFullYear() + " · Ấn phẩm của dòng họ";

    bindSystemTools();
    fetchRealData();
    window.addEventListener("hashchange", route);
    route();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }

})();
