/* DESIGN-001 REVISION router (vanilla, file:// safe).
   Views: home / gia-pha / mach / story / tu-lieu / lich / tim-kiem /
          tu-cach-thanh-vien / thanh-vien / cai-dat.
   No production code, no backend writes. */
(function () {
  "use strict";
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function route() {
    var h = (location.hash || "#/").replace(/^#/, "");
    var parts = h.split("/").filter(Boolean);
    var name = parts[0] || "home";
    var slug = decodeURIComponent(parts.slice(2).join("/") || parts[1] || "");
    if (name === "mach" && parts[1] === "bai-viet") { showStory(slug); return; }
    if (name === "mach" && parts[1] && parts[1] !== "bai-viet") { showStory(parts[1]); return; }
    var known = { "": "home", "gia-pha": "gia-pha", "mach": "mach",
      "tu-lieu": "tu-lieu", "lich": "lich", "tim-kiem": "tim-kiem",
      "tu-cach-thanh-vien": "tu-cach-thanh-vien", "thanh-vien": "thanh-vien",
      "cai-dat": "cai-dat" };
    show(known[name] || "home");
  }
  function show(name) {
    var views = document.querySelectorAll("[data-view]");
    views.forEach(function (v) { v.hidden = (v.getAttribute("data-view") !== name); });
    document.querySelectorAll(".pub-nav a[data-route]").forEach(function (a) {
      var r = a.getAttribute("data-route").replace(/^\//, "") || "home";
      var cur = (name === "home" && (r === "home" || r === "")) || r === name;
      if (cur) { a.setAttribute("aria-current", "page"); }
      else { a.removeAttribute("aria-current"); }
    });
    if (name === "mach") renderFullMach();
    if (name === "lich") renderFullCal();
    window.scrollTo(0, 0);
  }
  function stories() {
    var D = window.__D001_DATA;
    if (D && D.stories) return D.stories;
    if (window.__d001 && window.__d001.mapStories) return window.__d001.mapStories();
    return [];
  }
  function storyLink(s) {
    return "#/mach/bai-viet/" + encodeURIComponent(s.slug);
  }
  function renderFullMach() {
    var el = document.getElementById("machFullList");
    if (!el) return;
    var html = "";
    stories().forEach(function (a, i) {
      html += '<a class="mach-row" href="' + esc(storyLink(a)) + '">' +
        '<span class="mach-num">0' + (i + 1) + '</span>' +
        '<span><span class="mach-title">' + esc(a.title) + '</span>' +
        '<span class="mach-dek" style="display:block">' + esc(a.dek || a.deck || "") + '</span>' +
        '<span class="mach-meta" style="display:block">' +
        esc(a.series || "MACH") + " · " + esc(a.date || "") +
        '</span></span></a>';
    });
    el.innerHTML = html || "<p>Chua co du lieu snapshot.</p>";
  }
  function showStory(slug) {
    var found = null;
    stories().forEach(function (a) { if (a.slug === slug) found = a; });
    if (!found) found = stories()[0];
    if (!found) { show("mach"); return; }
    document.getElementById("storyKicker").textContent = found.series || "MACH";
    document.getElementById("storyTitle").textContent = found.title || "";
    document.getElementById("storyMeta").textContent = found.date || "";
    document.getElementById("storyBody").textContent = found.dek || found.deck || "";
    var views = document.querySelectorAll("[data-view]");
    views.forEach(function (v) { v.hidden = (v.getAttribute("data-view") !== "story"); });
    document.querySelectorAll(".pub-nav a[data-route]").forEach(function (a) {
      if (a.getAttribute("data-route") === "/mach") { a.setAttribute("aria-current", "page"); }
      else { a.removeAttribute("aria-current"); }
    });
    window.scrollTo(0, 0);
  }
  function renderFullCal() {
    var el = document.getElementById("calFullList");
    if (!el) return;
    var D = window.__D001_DATA, items = [];
    if (D && D.sidebar) items = D.sidebar;
    else if (window.__d001 && window.__d001.sidebar) items = window.__d001.sidebar;
    var html = "";
    items.forEach(function (e) {
      html += '<div class="side-item"><span class="d">' + esc(e.d) + '</span>' +
        '<span>' + esc(e.t) + '</span></div>';
    });
    el.innerHTML = html || "<p>Chua co du lieu lich snapshot.</p>";
  }
  function bindSearch() {
    var f = document.getElementById("protoSearch");
    if (!f || f.__bound) return; f.__bound = true;
    f.addEventListener("submit", function () {
      var q = (document.getElementById("protoQ").value || "").toLowerCase().trim();
      var box = document.getElementById("protoResults");
      if (!q) { box.innerHTML = "<p>Moi nhap tu khoa.</p>"; return; }
      var hits = [];
      stories().forEach(function (a) {
        var hay = ((a.title || "") + " " + (a.dek || a.deck || "")).toLowerCase();
        if (hay.indexOf(q) !== -1) hits.push({ kind: "MACH", title: a.title, href: storyLink(a) });
      });
      var D = window.__D001_DATA;
      if (D && D.mem) {
        var mh = ((D.mem.title || "") + " " + (D.mem.text || "")).toLowerCase();
        if (mh.indexOf(q) !== -1) hits.push({ kind: "Ky uc", title: D.mem.title, href: "#/" });
      }
      if (!hits.length) { box.innerHTML = "<p>Khong tim thay trong snapshot voi tu khoa nay.</p>"; return; }
      var html = "<p>Tim thay " + hits.length + " ket qua trong snapshot:</p>";
      hits.forEach(function (h) {
        html += '<div class="side-item"><span class="d">' + esc(h.kind) + '</span>' +
          '<span><a href="' + esc(h.href) + '">' + esc(h.title) + '</a></span></div>';
      });
      box.innerHTML = html;
    });
  }
  window.addEventListener("hashchange", route);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { bindSearch(); route(); });
  } else { bindSearch(); route(); }
})();
