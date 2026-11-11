var API_BASE = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") ? "" : "https://api.giatoctrantrongthu.com";
(function () {
  "use strict";

  // --- DATA LAYER ---
  window.__D001_DATA = {
    stories: [],
    mem: null,
    stats: { individuals: 0, families: 0, memories: 0 },
    calendarEvents: []
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
    var stories = window.__D001_DATA.homeStories || window.__D001_DATA.stories;
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

  
  function checkSession() {
    fetch(API_BASE + "/api/auth/me/identity")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && data.account) {
          // Update top utility link
          const memberEntry = document.querySelector('.member-entry');
          if (memberEntry) {
            memberEntry.textContent = 'Hồ sơ: ' + data.account.username + ' →';
            memberEntry.href = '/me';
          }
          
          // Update big CTA button in member section
          const pathCta = document.querySelector('a.path-cta[href="/login"]');
          if (pathCta) {
            pathCta.textContent = 'Vào Không gian của bạn →';
            pathCta.href = '/me';
          }
        }
      })
      .catch(e => console.log('Not logged in or error checking session'));
  }

  function fetchRealData() {
    // 1. Fetch MẠCH
    fetch(API_BASE + "/api/mach.json")
      .then(r => r.ok ? r.json() : null)
      .then(mach => {
        if (mach && (mach.stories || mach.articles)) {
          var all = mach.stories || mach.articles || [];
          window.__D001_DATA.stories = all; // Keep all for full list
          window.__D001_DATA.homeStories = all.slice(0, 5);
          renderHomeCurated();
        }
      }).catch(console.error);

    // 2. Fetch Genealogy
    fetch(API_BASE + "/api/genealogy.json")
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

    // 3. Fetch Calendar
    fetchCalendarData();
  }

  function fetchCalendarData() {
    var feeds = [
      { key: "birthdays", file: API_BASE + "/api/calendars/CAL_01_BIRTHDAYS.ics", class: "birth", icon: "", label: "Sinh nhật" },
      { key: "patrons", file: API_BASE + "/api/calendars/CAL_02_PATRON_FEASTS.ics", class: "patron", icon: "", label: "Bổn mạng" },
      { key: "memorials", file: API_BASE + "/api/calendars/CAL_03_MEMORIALS.ics", class: "mem", icon: "", label: "Ngày giỗ" },
      { key: "milestones", file: API_BASE + "/api/calendars/CAL_04_FAMILY_MILESTONES.ics", class: "event", icon: "", label: "Sự kiện" }
    ];

    var promises = feeds.map(function(f) {
      return fetch(f.file)
        .then(r => r.ok ? r.text() : "")
        .then(function(txt) {
          if (txt) {
            var events = IcsParser.parseFeed(txt, f);
            return events;
          }
          return [];
        })
        .catch(function() { return []; });
    });

    Promise.all(promises).then(function(results) {
      var allEvents = [].concat.apply([], results);
      // Sort by month/day
      allEvents.sort(function(a, b) { return (a.month - b.month) || (a.day - b.day); });
      window.__D001_DATA.calendarEvents = allEvents;
      renderCalendarList();
    });
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
  
  function renderCalendarList() {
    var el = document.getElementById("calFullList");
    if (!el) return;
    var events = window.__D001_DATA.calendarEvents;
    if (!events.length) {
      el.innerHTML = "<p>Đang tải lịch...</p>";
      return;
    }

    // Group by month
    var byMonth = {};
    events.forEach(function(e) {
      if (!byMonth[e.month]) byMonth[e.month] = [];
      byMonth[e.month].push(e);
    });

    var monthNames = ["", "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
      "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];

    var html = "";
    for (var m = 1; m <= 12; m++) {
      if (!byMonth[m] || !byMonth[m].length) continue;
      html += '<div class="cal-month"><h3>' + monthNames[m] + '</h3><ul class="cal-events">';
      byMonth[m].forEach(function(e) {
        var day = ("0" + e.day).slice(-2);
        var mm = ("0" + e.month).slice(-2);
        html += '<li class="cal-event cal-' + esc(e.chipCls || "") + '">' +
          '<span class="cal-date">' + day + '/' + mm + '</span>' +
          '<span class="cal-summary">' + esc(e.summary) + '</span>' +
          '<span class="cal-label">' + esc(e.label) + '</span>' +
          '</li>';
      });
      html += '</ul></div>';
    }
    el.innerHTML = html;
  }

  function renderMachList() {
    var el = document.getElementById("machFullList");
    if (!el) return;
    var stories = window.__D001_DATA.stories;
    if (!stories.length) {
      el.innerHTML = "<p>Chưa có dữ liệu MẠCH.</p>";
      return;
    }
    var html = "";
    stories.forEach(function (a) {
      html += '<a class="mach-item" href="' + esc(storyLink(a)) + '" style="display:block; margin-bottom:1rem; text-decoration:none; color:inherit;">' +
        '<h3 style="margin:0 0 5px 0;">' + esc(a.title) + '</h3>' +
        '<p style="margin:0; font-size:14px; opacity:0.8;">' + esc(a.dek || a.deck || a.deckLead || "") + '</p>' +
        '<small style="opacity:0.6;">' + esc(a.series || "MẠCH") + " · " + esc(fmtD(a.date || a.publishedAt)) + '</small></a>';
    });
    el.innerHTML = html;
  }

  function renderStory(slug) {
    var stories = window.__D001_DATA.stories;
    var story = stories.find(function(s) { return s.slug === slug; });
    
    var titleEl = document.getElementById("storyTitle");
    var kickerEl = document.getElementById("storyKicker");
    var metaEl = document.getElementById("storyMeta");
    var bodyEl = document.getElementById("storyBody");
    
    if (!story) {
        if (titleEl) titleEl.textContent = "Không tìm thấy bài viết";
        if (kickerEl) kickerEl.textContent = "LỖI";
        if (metaEl) metaEl.textContent = "";
        if (bodyEl) bodyEl.textContent = "Bài viết không tồn tại hoặc đã bị xóa.";
        return;
    }
    
    if (titleEl) titleEl.textContent = story.title || "";
    if (kickerEl) kickerEl.textContent = story.series || "MẠCH";
    var d = fmtD(story.date || story.publishedAt);
    if (metaEl) metaEl.textContent = d + (story.author ? " · " + story.author : "");
    if (bodyEl) {
        // If content is HTML, use innerHTML. Otherwise textContent.
        // Assuming real data has htmlContent or markdown converted. For now, textContent if plain.
        if (story.htmlContent) bodyEl.innerHTML = story.htmlContent;
        else if (story.body) bodyEl.textContent = story.body;
        else bodyEl.textContent = story.dek || "Đang cập nhật nội dung chi tiết...";
    }
  }

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
      
      // Trigger rendering if we are on a specific route that needs data dynamically
      if (viewId === "mach") {
          renderMachList();
      } else if (viewId === "story" && parts[2]) {
          renderStory(decodeURIComponent(parts[2]));
      } else if (viewId === "lich") {
          renderCalendarList();
      }
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
    checkSession();
    window.addEventListener("hashchange", route);
    route();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }

})();
