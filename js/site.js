/**
 * Shared site utilities (nav helpers, future shell enhancements).
 * Pages keep static header/footer from partials; this only adds light behaviors.
 */
(function () {
  "use strict";

  var EMBED_KEY = "mz-embed";

  function isEmbed() {
    try {
      var q = new URLSearchParams(window.location.search);
      if (q.get("embed") === "1") return true;
      if (window.sessionStorage.getItem(EMBED_KEY) === "1") return true;
    } catch (e) {}
    return false;
  }

  function applyEmbed() {
    if (!isEmbed()) return;
    document.documentElement.classList.add("is-embed");
    try {
      window.sessionStorage.setItem(EMBED_KEY, "1");
    } catch (e) {}
  }

  function bindUserMenu() {
    var menu = document.querySelector(".header-user-menu");
    if (!menu) return;

    var trigger = menu.querySelector(".header-user-menu__trigger");
    var panel = menu.querySelector(".header-user-menu__panel");
    if (!trigger || !panel) return;

    function closeUserMenu() {
      panel.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
    }

    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      panel.hidden = !panel.hidden;
      trigger.setAttribute("aria-expanded", panel.hidden ? "false" : "true");
    });

    document.addEventListener("click", function (e) {
      if (!menu.contains(e.target)) closeUserMenu();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeUserMenu();
    });
  }

  applyEmbed();
  document.documentElement.classList.add("js");
  bindUserMenu();

  document.addEventListener("keydown", function (e) {
    if (e.key === "Tab") {
      document.documentElement.classList.add("user-is-tabbing");
    }
  });
})();
