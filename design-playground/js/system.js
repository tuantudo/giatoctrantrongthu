/* DESIGN-001 REVISION: system tools + reading tools (vanilla, Dreamweaver-friendly).
   - Back-to-top (functional)
   - Chatbot entry (prototype interaction only, no backend)
   - Reading tools on story view: A-/A+ (functional), Share/Bookmark/Comment (prototype),
     Print (functional browser print).
   No production code, no backend writes. */
(function () {
  "use strict";

  function $(id) { return document.getElementById(id); }

  /* ---------- System tools ---------- */
  function bindSystemTools() {
    var backTop = $("backTop");
    if (backTop) {
      backTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      window.addEventListener("scroll", function () {
        var show = (window.pageYOffset || document.documentElement.scrollTop) > 400;
        backTop.hidden = !show;
      }, { passive: true });
      backTop.hidden = true;
    }
    var chatFab = $("chatFab");
    var chatPanel = $("chatPanel");
    if (chatFab && chatPanel) {
      chatFab.addEventListener("click", function () {
        chatPanel.hidden = !chatPanel.hidden;
      });
      var close = $("chatClose");
      if (close) close.addEventListener("click", function () { chatPanel.hidden = true; });
    }
  }

  /* ---------- Toast ---------- */
  var toastTimer = null;
  function toast(msg) {
    var el = $("toast");
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.hidden = true; }, 2600);
  }

  /* ---------- Reading tools (story view) ---------- */
  function bindReadingTools() {
    var fontMinus = $("fontMinus");
    var fontPlus = $("fontPlus");
    var bodyBox = $("storyBodyBox");
    var step = 0;
    function applyFont() {
      if (!bodyBox) return;
      bodyBox.classList.remove("fs-1", "fs-2", "fs-m1");
      if (step === 1) bodyBox.classList.add("fs-1");
      if (step === 2) bodyBox.classList.add("fs-2");
      if (step === -1) bodyBox.classList.add("fs-m1");
    }
    if (fontMinus) fontMinus.addEventListener("click", function () {
      step = Math.max(-1, step - 1); applyFont();
      toast(fontClassLabel(step));
    });
    if (fontPlus) fontPlus.addEventListener("click", function () {
      step = Math.min(2, step + 1); applyFont();
      toast(fontClassLabel(step));
    });
    var shareBtn = $("shareBtn");
    if (shareBtn) shareBtn.addEventListener("click", function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(location.href).then(function () {
          toast("Đã sao chép liên kết (prototype — backend share chưa triển khai).");
        }, function () {
          toast("Chia sẻ — prototype: backend chưa triển khai.");
        });
      } else {
        toast("Chia sẻ — prototype: backend chưa triển khai.");
      }
    });
    var bookmarkBtn = $("bookmarkBtn");
    if (bookmarkBtn) bookmarkBtn.addEventListener("click", function () {
      var on = bookmarkBtn.getAttribute("aria-pressed") === "true";
      bookmarkBtn.setAttribute("aria-pressed", String(!on));
      bookmarkBtn.classList.toggle("is-on", !on);
      toast(on ? "Đã bỏ đánh dấu (prototype)" : "Đã đánh dấu (prototype — lưu local chưa triển khai)");
    });
    var commentBtn = $("commentBtn");
    if (commentBtn) commentBtn.addEventListener("click", function () {
      toast("Bình luận — prototype: backend comment chưa triển khai.");
    });
    var printBtn = $("printBtn");
    if (printBtn) printBtn.addEventListener("click", function () {
      if (window.print) { try { window.print(); } catch (e) {} }
    });
  }

  function fontClassLabel(step) {
    if (step === 1) return "Cỡ chữ: nhỡ (A+) — prototype";
    if (step === 2) return "Cỡ chữ: lớn (A++) — prototype";
    if (step === -1) return "Cỡ chữ: nhỏ (A−) — prototype";
    return "Cỡ chữ: mặc định — prototype";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      bindSystemTools(); bindReadingTools();
    });
  } else { bindSystemTools(); bindReadingTools(); }
})();