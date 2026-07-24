(function () {
  var pad = function (n) {
    return n < 10 ? "0" + n : String(n);
  };

  var render = function (el, remainMs) {
    var label = el.querySelector("[data-countdown-label]");
    var dayEl = el.querySelector('[data-unit="d"]');
    var hourEl = el.querySelector('[data-unit="h"]');
    var minEl = el.querySelector('[data-unit="m"]');
    var secEl = el.querySelector('[data-unit="s"]');

    if (remainMs <= 0) {
      el.classList.add("is-ended");
      if (label) label.textContent = "已结束";
      if (dayEl) dayEl.textContent = "00";
      if (hourEl) hourEl.textContent = "00";
      if (minEl) minEl.textContent = "00";
      if (secEl) secEl.textContent = "00";
      el.setAttribute("aria-label", "限时优惠已结束");
      return false;
    }

    el.classList.remove("is-ended");
    if (label) label.textContent = "距结束";

    var totalSec = Math.floor(remainMs / 1000);
    var days = Math.floor(totalSec / 86400);
    var hours = Math.floor((totalSec % 86400) / 3600);
    var mins = Math.floor((totalSec % 3600) / 60);
    var secs = totalSec % 60;

    if (dayEl) dayEl.textContent = pad(days);
    if (hourEl) hourEl.textContent = pad(hours);
    if (minEl) minEl.textContent = pad(mins);
    if (secEl) secEl.textContent = pad(secs);

    el.setAttribute(
      "aria-label",
      "限时优惠倒计时 " + days + "天 " + pad(hours) + "时 " + pad(mins) + "分 " + pad(secs) + "秒"
    );
    return true;
  };

  var nodes = Array.prototype.slice.call(
    document.querySelectorAll("[data-countdown-end]")
  );
  if (!nodes.length) return;

  var tick = function () {
    var now = Date.now();
    var active = false;
    nodes.forEach(function (el, index) {
      var endAttr = el.getAttribute("data-countdown-end");
      var endMs = endAttr ? Date.parse(endAttr) : NaN;

      // 未配置结束时间时：默认距今 1~3 天，按卡片错开
      if (!Number.isFinite(endMs)) {
        endMs = now + (24 + index * 3) * 3600 * 1000;
        el.setAttribute("data-countdown-end", new Date(endMs).toISOString());
      }

      if (render(el, endMs - now)) active = true;
    });
    return active;
  };

  tick();
  var timer = window.setInterval(function () {
    if (!tick()) window.clearInterval(timer);
  }, 1000);
})();
