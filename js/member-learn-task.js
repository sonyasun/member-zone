/**
 * 会员专区侧栏 · 7 天学习任务三态（与个人中心 learn-task.js 独立维护）
 *
 * idle      — 默认未开始
 * active    — 点击「开始任务」
 * completed — 独立金色卡片固定展示在主卡片下方
 *
 * 临近到期：active 态且剩余 ≤7 天且未完成 7 天时，在学习进度卡片顶部显示提醒
 * 领取奖励弹窗见 js/learn-task-reward-modal.js + partials/learn-task-reward-modal.html
 *
 * 演示：?memberLt=active  ?memberLtDaysLeft=5  ?memberLtDone=3
 */
(function () {
  "use strict";

  var mainCard = document.querySelector(".member-lt[data-member-lt-main]");
  if (!mainCard) return;

  var STATES = ["idle", "active"];
  var MS_DAY = 86400000;
  var EXPIRY_THRESHOLD = 7;

  function setState(state) {
    if (STATES.indexOf(state) === -1) return;
    mainCard.setAttribute("data-state", state);
    updateExpiryAlerts();
  }

  function startOfDay(date) {
    var d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function resolveExpiresAt() {
    var params = new URLSearchParams(window.location.search);
    var daysLeftParam = params.get("memberLtDaysLeft");

    if (daysLeftParam !== null) {
      var offset = parseInt(daysLeftParam, 10);
      if (!isNaN(offset)) {
        var fromParam = startOfDay(new Date());
        fromParam.setDate(fromParam.getDate() + offset);
        return fromParam;
      }
    }

    var attr = mainCard.getAttribute("data-expires-at");
    if (attr) {
      return startOfDay(new Date(attr + "T00:00:00"));
    }

    var demo = startOfDay(new Date());
    demo.setDate(demo.getDate() + EXPIRY_THRESHOLD);
    return demo;
  }

  function getRequiredDays() {
    var required = parseInt(mainCard.getAttribute("data-member-lt-required-days") || "7", 10);
    return isNaN(required) ? 7 : required;
  }

  function getCompletedDays() {
    var params = new URLSearchParams(window.location.search);
    var doneParam = params.get("memberLtDone");

    if (doneParam !== null) {
      var fromParam = parseInt(doneParam, 10);
      if (!isNaN(fromParam)) return fromParam;
    }

    var panel = mainCard.querySelector(".member-lt__panel--active");
    if (!panel) return 0;

    var countNode = panel.querySelector(".member-lt__week-summary b");
    if (!countNode) return 0;

    var count = parseInt(countNode.textContent, 10);
    return isNaN(count) ? 0 : count;
  }

  function getDaysLeft(expiresAt) {
    var today = startOfDay(new Date());
    var expiry = startOfDay(expiresAt);
    return Math.round((expiry - today) / MS_DAY);
  }

  function formatExpiryDate(date) {
    return date.getMonth() + 1 + " 月 " + date.getDate() + " 日";
  }

  function updateExpiryAlerts() {
    var state = mainCard.getAttribute("data-state") || "idle";
    var expiresAt = resolveExpiresAt();
    var daysLeft = getDaysLeft(expiresAt);
    var completed = getCompletedDays();
    var required = getRequiredDays();
    var remain = Math.max(0, required - completed);
    var show =
      state === "active" && completed < required && daysLeft >= 0 && daysLeft <= EXPIRY_THRESHOLD;

    mainCard.querySelectorAll("[data-member-lt-expiry-alert]").forEach(function (alert) {
      if (!show) {
        alert.hidden = true;
        return;
      }

      alert.hidden = false;

      var dateNode = alert.querySelector("[data-member-lt-expiry-date]");
      if (dateNode) dateNode.textContent = formatExpiryDate(expiresAt);

      var remainNode = alert.querySelector("[data-member-lt-expiry-remain]");
      if (remainNode) remainNode.textContent = String(remain);

      alert.setAttribute(
        "aria-label",
        "活动到期提醒，活动将于 " +
          formatExpiryDate(expiresAt) +
          " 到期，还差 " +
          remain +
          " 天任务"
      );
    });
  }

  function initState() {
    try {
      var demo = new URLSearchParams(window.location.search).get("memberLt");
      if (STATES.indexOf(demo) !== -1) {
        setState(demo);
        return;
      }
    } catch (e) {}

    setState("idle");
  }

  initState();

  document.addEventListener("member-lt:activate", function () {
    setState("active");
  });
})();
