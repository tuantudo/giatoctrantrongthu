/* DESIGN-001 renderer A: stories + sidebar (vanilla JS). */
(function () {
  "use strict";
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
  function renderStories(stories) {
    var lead = stories[0];
    if (lead) {
      document.getElementById("leadTitle").textContent = lead.title || "";
      document.getElementById("leadDek").textContent = lead.dek || "";
      document.getElementById("leadMeta").textContent =
        (lead.series || "MACH") + " · " + fmtD(lead.date);
      var img = document.getElementById("leadImg");
      if (img && lead.cover) { img.src = lead.cover; }
    }
    var html = "";
    stories.slice(1, 5).forEach(function (a, i) {
      html += '<a class="mach-row" href="#/mach/bai-viet/' + esc(a.slug) + '">' +
        '<span class="mach-num">0' + (i + 2) + '</span>' +
        '<span><span class="mach-title">' + esc(a.title) + '</span>' +
        '<span class="mach-dek" style="display:block">' + esc(a.dek || "") + '</span>' +
        '<span class="mach-meta" style="display:block">' +
        esc(a.series || "MACH") + " · " + esc(fmtD(a.date)) +
        '</span></span></a>';
    });
    document.getElementById("machList").innerHTML = html;
  }
  function renderSidebar(items) {
    var html = "";
    items.forEach(function (e) {
      html += '<div class="side-item"><span class="d">' + esc(e.d) + '</span>' +
        '<span>' + esc(e.t) + '</span></div>';
    });
    document.getElementById("sideList").innerHTML = html;
  }
  window.__d001a = { renderStories: renderStories, renderSidebar: renderSidebar };
})();
