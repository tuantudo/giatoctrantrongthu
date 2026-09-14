/* DESIGN-001 renderer B: memory + stats + boot + font utility. */
(function () {
  "use strict";
  function boot() {
    var D = window.__D001_DATA;
    var R = window.__d001a;
    if (D && R) {
      if (D.stories) R.renderStories(D.stories);
      if (D.sidebar) R.renderSidebar(D.sidebar);
      if (D.mem) {
        document.getElementById("memTitle").textContent = D.mem.title || "";
        document.getElementById("memByline").textContent =
          "Ghi chep ve: " + (D.mem.person || "");
        document.getElementById("memText").textContent = D.mem.excerpt || "";
      }
      if (D.stats) {
        if (D.stats.individuals) document.getElementById("statInd").textContent = D.stats.individuals;
        if (D.stats.families) document.getElementById("statFam").textContent = D.stats.families;
        if (D.stats.memories) document.getElementById("statMem").textContent = D.stats.memories;
      }
    }
    var now = new Date();
    var dd = ("0" + now.getDate()).slice(-2);
    var mm = ("0" + (now.getMonth() + 1)).slice(-2);
    var el = document.getElementById("utilDate");
    if (el) el.textContent = dd + "/" + mm + "/" + now.getFullYear() + " · An pham cua dong ho";
    var minus = document.getElementById("fontMinus");
    var plus = document.getElementById("fontPlus");
    var level = 0;
    var apply = function () {
      document.body.classList.remove("font-minus-1", "font-plus-1", "font-plus-2");
      if (level === -1) document.body.classList.add("font-minus-1");
      if (level === 1) document.body.classList.add("font-plus-1");
      if (level === 2) document.body.classList.add("font-plus-2");
    };
    if (minus) minus.addEventListener("click", function () {
      level = Math.max(-1, level - 1); apply();
    });
    if (plus) plus.addEventListener("click", function () {
      level = Math.min(2, level + 1); apply();
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }
})();
