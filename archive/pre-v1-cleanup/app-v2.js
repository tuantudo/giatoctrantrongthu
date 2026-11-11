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
        var peopleKeys = Object.keys(data.people || {});
        var famsKeys = Object.keys(data.families || data.fams || {});
        var memories = Array.isArray(data.memories) ? data.memories : [];
        if (!memories.length) {
          peopleKeys.forEach(k => {
            if (data.people[k].memory) memories.push({name: data.people[k].name, mem: data.people[k].memory});
          });
        }
        
        window.__D001_DATA.stats = {
          individuals: data.stats ? data.stats.individuals : peopleKeys.length,
          families: data.stats ? data.stats.families : famsKeys.length,
          memories: data.stats ? data.stats.memories : memories.length
        };
        
        if (memories.length > 0) {
           var m = memories[0];
           window.__D001_DATA.mem = {
             title: m.title || (m.mem && m.mem.title) || "Ký ức gia đình",
             person: m.person || m.name || "",
             text: m.text || (m.mem && m.mem.story) || m.description || ""
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

  // ========================================================
  // DEVELOPMENT ACCESS ADAPTER & THREE EXPERIENCE SPACES
  // ========================================================
  window.__DEV_PERSONA = localStorage.getItem('giatoc_dev_persona') || 'public';
  window.__LINEAGE_PEOPLE = [];

  function updatePersonaUI() {
    var p = window.__DEV_PERSONA;
    document.querySelectorAll('.persona-pill').forEach(function(btn) {
      if (btn.getAttribute('data-persona') === p) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    var badge = document.getElementById('currentSpaceBadge');
    var navFam = document.getElementById('navFamilySpace');
    if (badge) {
      badge.className = 'space-badge ' + p;
      if (p === 'public') {
        badge.textContent = 'SPACE 01: PUBLIC';
        if (navFam) navFam.hidden = true;
      } else if (p === 'member') {
        badge.textContent = 'SPACE 02: LINEAGE / MEMBER';
        if (navFam) navFam.hidden = false;
      } else if (p === 'individual') {
        badge.textContent = 'SPACE 03: MYSELF';
        if (navFam) navFam.hidden = false;
      } else if (p === 'family') {
        badge.textContent = 'SPACE 03: FAMILY CONTEXT';
        if (navFam) navFam.hidden = false;
      }
    }
  }

  window.__switchPersona = function(newPersona) {
    window.__DEV_PERSONA = newPersona;
    localStorage.setItem('giatoc_dev_persona', newPersona);
    updatePersonaUI();
    toast("Đã chuyển sang: " + newPersona.toUpperCase());
    
    // Re-render current view with new context
    route();
  };

  function initPersonaSwitcher() {
    updatePersonaUI();
    document.querySelectorAll('.persona-pill').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var targetPersona = this.getAttribute('data-persona');
        if (targetPersona) window.__switchPersona(targetPersona);
      });
    });
  }

  function renderGiaPha() {
    var gate = document.getElementById('gpPublicGate');
    var memberBox = document.getElementById('gpMemberContent');
    var isMember = window.__DEV_PERSONA !== 'public';

    if (gate) gate.hidden = isMember;
    if (memberBox) memberBox.hidden = !isMember;

    if (isMember) {
      fetch(API_BASE + "/api/spaces/member?persona=" + encodeURIComponent(window.__DEV_PERSONA))
        .then(function(r) { return r.ok ? r.json() : null; })
        .then(function(data) {
          if (!data || !data.people) return;
          var peopleList = Object.keys(data.people).map(function(k) { return data.people[k]; });
          window.__LINEAGE_PEOPLE = peopleList;
          renderPeopleGrid(peopleList);
        })
        .catch(console.error);

      // Bind search filter
      var sInp = document.getElementById('memberSearchInput');
      var bSel = document.getElementById('memberBranchSelect');
      if (sInp) {
        sInp.oninput = function() { filterPeople(); };
      }
      if (bSel) {
        bSel.onchange = function() { filterPeople(); };
      }
    }
  }

  function filterPeople() {
    var sInp = document.getElementById('memberSearchInput');
    var bSel = document.getElementById('memberBranchSelect');
    var q = (sInp ? sInp.value : "").toLowerCase().trim();
    var branch = bSel ? bSel.value : "";

    var filtered = window.__LINEAGE_PEOPLE.filter(function(p) {
      var matchName = !q || (p.name && p.name.toLowerCase().includes(q));
      var matchBranch = !branch || (p.branch && p.branch.includes(branch));
      return matchName && matchBranch;
    });
    renderPeopleGrid(filtered);
  }

  function renderPeopleGrid(list) {
    var grid = document.getElementById('memberPeopleGrid');
    if (!grid) return;
    if (!list.length) {
      grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:20px;color:var(--ink-soft);">Không tìm thấy nhân vật phù hợp.</p>';
      return;
    }
    var html = '';
    list.slice(0, 36).forEach(function(p) {
      var gen = p.generation ? 'Thế hệ ' + p.generation : 'Gia phả';
      var branch = p.branch ? ' · Chi ' + p.branch : '';
      var dates = (p.birth || p.birthYear || '') + (p.death || p.deathYear ? ' - ' + (p.death || p.deathYear) : '');
      html += '<div class="person-item-card">' +
        '<div class="person-item-name">' + esc(p.name) + '</div>' +
        '<div class="person-item-meta">' + esc(gen + branch) + '</div>' +
        (dates ? '<div class="person-item-meta" style="font-size:11.5px;opacity:0.8;">' + esc(dates) + '</div>' : '') +
        '</div>';
    });
    grid.innerHTML = html;
  }

  function renderSpace03() {
    var p = window.__DEV_PERSONA;
    var container = document.querySelector('.space03-container');
    if (!container) return;

    fetch(API_BASE + "/api/spaces/personal?persona=" + encodeURIComponent(p) + "&personId=@I1@")
      .then(function(r) { return r.ok ? r.json() : null; })
      .then(function(data) {
        if (!data) return;

        // LAYER 01: MYSELF
        var l01 = data.layer01_myself;
        var el01 = document.getElementById('layer01Content');
        if (el01 && l01) {
          el01.innerHTML = '<div class="person-hero-card">' +
            '<div class="person-hero-avatar">❦</div>' +
            '<div class="person-hero-info">' +
              '<h4>' + esc(l01.name) + '</h4>' +
              '<div class="person-hero-meta">' + esc(l01.birth) + ' — ' + esc(l01.death) + ' · Chi ' + esc(l01.branch) + ' · Thế hệ ' + esc(l01.generation) + '</div>' +
              '<p class="person-hero-bio">' + esc(l01.bio) + '</p>' +
            '</div></div>';
        }

        // LAYER 02: CLOSE FAMILY
        var l02 = data.layer02_close_family;
        var el02 = document.getElementById('layer02Content');
        if (el02 && l02) {
          var html02 = '<div class="family-grid">';
          (l02.parents || []).forEach(function(m) {
            html02 += '<div class="family-card"><span class="family-card-rel">' + esc(m.relation) + '</span><div class="family-card-name">' + esc(m.name) + '</div><div class="family-card-dates">' + esc(m.birth || '') + '</div></div>';
          });
          (l02.spouses || []).forEach(function(m) {
            html02 += '<div class="family-card" style="border-left:3px solid #b45309;"><span class="family-card-rel">' + esc(m.relation) + '</span><div class="family-card-name">' + esc(m.name) + '</div><div class="family-card-dates">' + esc(m.birth || '') + '</div></div>';
          });
          (l02.children || []).forEach(function(m) {
            html02 += '<div class="family-card"><span class="family-card-rel">' + esc(m.relation) + '</span><div class="family-card-name">' + esc(m.name) + '</div><div class="family-card-dates">Đời thứ 2</div></div>';
          });
          (l02.siblings || []).forEach(function(m) {
            html02 += '<div class="family-card"><span class="family-card-rel">' + esc(m.relation) + '</span><div class="family-card-name">' + esc(m.name) + '</div></div>';
          });
          html02 += '</div>';
          el02.innerHTML = html02;
        }

        // LAYER 03: EXTENDED SIBLING FAMILIES
        var l03 = data.layer03_extended_sibling_families;
        var el03 = document.getElementById('layer03Content');
        if (el03 && l03) {
          var html03 = '<div class="family-grid">';
          (l03.families || []).forEach(function(fam) {
            if (fam.inLaw) {
              html03 += '<div class="family-card"><span class="family-card-rel">' + esc(fam.inLaw.relation) + '</span><div class="family-card-name">' + esc(fam.inLaw.name) + '</div></div>';
            }
            (fam.nephewsNieces || []).forEach(function(c) {
              html03 += '<div class="family-card"><span class="family-card-rel">' + esc(c.relation) + '</span><div class="family-card-name">' + esc(c.name) + '</div></div>';
            });
          });
          html03 += '</div>';
          el03.innerHTML = html03;
        }

        // SPECIAL PRIVATE SPACE: CLARA
        var sp = data.specialPrivateSpace;
        var claraEl = document.getElementById('claraBoxContent');
        if (claraEl && sp) {
          if (sp.letterCount && sp.letters) {
            var cHtml = '<p style="margin-bottom:14px;font-size:14px;color:#5b21b6;">' + esc(sp.description) + '</p><div class="clara-letters-grid">';
            sp.letters.forEach(function(letItem) {
              cHtml += '<div class="clara-letter-card">' +
                '<h4>' + esc(letItem.title) + '</h4>' +
                '<div class="clara-letter-date">' + esc(letItem.date || '') + '</div>' +
                '<div class="clara-letter-preview">' + esc(letItem.preview) + '</div>' +
                '</div>';
            });
            cHtml += '</div>';
            claraEl.innerHTML = cHtml;
          } else {
            claraEl.innerHTML = '<div style="background:#f5f3ff;padding:16px;border-radius:4px;color:#6b21a8;font-size:14px;">' +
              '<strong>Không gian bảo mật:</strong> ' + esc(sp.note || 'Yêu cầu ngữ cảnh gia đình phù hợp để tiếp cận.') +
              '<div style="margin-top:10px;"><button type="button" class="persona-pill" onclick="window.__switchPersona(\'family\')" style="background:#6d28d9;color:#fff;">Chuyển sang Persona Gia Đình để mở khóa →</button></div>' +
              '</div>';
          }
        }
      })
      .catch(console.error);
  }

  function route() {
    var hash = window.location.hash.replace(/^#\//, "") || "";
    var parts = hash.split("/");
    var root = parts[0];
    
    var known = { "": "home", "gia-pha": "gia-pha", "mach": "mach",
      "tu-lieu": "tu-lieu", "lich": "lich", "tim-kiem": "tim-kiem",
      "tu-cach-thanh-vien": "tu-cach-thanh-vien", "thanh-vien": "thanh-vien", "cai-dat": "cai-dat",
      "khong-gian-gia-dinh": "khong-gian-gia-dinh" };
    
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
      } else if (viewId === "gia-pha") {
          renderGiaPha();
      } else if (viewId === "khong-gian-gia-dinh") {
          renderSpace03();
      }
    } else {
      var fallback = document.querySelector('[data-view="home"]');
      if (fallback) fallback.hidden = false;
    }
    window.scrollTo(0, 0);
    
    document.querySelectorAll(".editorial-nav-links a, .ed-more a, .path-links a, .pub-nav a").forEach(function(el) {
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

    initPersonaSwitcher();
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
