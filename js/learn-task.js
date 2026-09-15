/**
 * 个人中心 · 7 天学习任务三态切换（仅 UI）
 * 会员专区侧栏卡片见 js/member-learn-task.js + css/src/25-page-member.css
 * 领取奖励弹窗见 js/learn-task-reward-modal.js + partials/learn-task-reward-modal.html
 *
 * idle     — 默认，未开始（CSS 无 JS 也会展示）
 * active   — 点击「开始任务」
 * completed — 独立卡片固定展示在默认态下方
 *
 * 临近到期：活动有效期 1 个月内，**active 态**且剩余 ≤7 天且未完成 7 天时，在课程卡片上方显示提醒
 * 演示：?learnTaskDaysLeft=5  ?learnTaskDone=3
 */
(function () {
  "use strict";

  var section = document.querySelector(".learn-task[data-learn-task-main]");
  if (!section) return;

  var STATES = ["idle", "active"];
  var LEGACY_KEY = "mz-learn-task-state";
  var MS_DAY = 86400000;
  var EXPIRY_THRESHOLD = 7;

  function setState(state) {
    if (STATES.indexOf(state) === -1) return;
    section.setAttribute("data-state", state);
    updateExpiryAlerts();
  }

  function startOfDay(date) {
    var d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function resolveExpiresAt() {
    var params = new URLSearchParams(window.location.search);
    var daysLeftParam = params.get("learnTaskDaysLeft");

    if (daysLeftParam !== null) {
      var offset = parseInt(daysLeftParam, 10);
      if (!isNaN(offset)) {
        var fromParam = startOfDay(new Date());
        fromParam.setDate(fromParam.getDate() + offset);
        return fromParam;
      }
    }

    var attr = section.getAttribute("data-expires-at");
    if (attr) {
      return startOfDay(new Date(attr + "T00:00:00"));
    }

    var demo = startOfDay(new Date());
    demo.setDate(demo.getDate() + EXPIRY_THRESHOLD);
    return demo;
  }

  function getRequiredDays() {
    var required = parseInt(section.getAttribute("data-learn-task-required-days") || "7", 10);
    return isNaN(required) ? 7 : required;
  }

  function getCompletedDays() {
    var params = new URLSearchParams(window.location.search);
    var doneParam = params.get("learnTaskDone");

    if (doneParam !== null) {
      var fromParam = parseInt(doneParam, 10);
      if (!isNaN(fromParam)) return fromParam;
    }

    var state = section.getAttribute("data-state") || "idle";
    var panel = section.querySelector(
      state === "active" ? ".learn-task__panel--active" : ".learn-task__panel--idle"
    );
    if (!panel) return 0;

    var countNode = panel.querySelector(".learn-task__week-summary b");
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
    var state = section.getAttribute("data-state") || "idle";
    var expiresAt = resolveExpiresAt();
    var daysLeft = getDaysLeft(expiresAt);
    var completed = getCompletedDays();
    var required = getRequiredDays();
    var remain = Math.max(0, required - completed);
    var show =
      state === "active" && completed < required && daysLeft >= 0 && daysLeft <= EXPIRY_THRESHOLD;

    section.querySelectorAll("[data-learn-task-expiry-alert]").forEach(function (alert) {
      if (!show) {
        alert.hidden = true;
        return;
      }

      alert.hidden = false;

      var dateNode = alert.querySelector("[data-learn-task-expiry-date]");
      if (dateNode) dateNode.textContent = formatExpiryDate(expiresAt);

      var remainNode = alert.querySelector("[data-learn-task-expiry-remain]");
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
      localStorage.removeItem(LEGACY_KEY);
    } catch (e) {}

    try {
      var demo = new URLSearchParams(window.location.search).get("learnTask");
      if (STATES.indexOf(demo) !== -1) {
        setState(demo);
        return;
      }
    } catch (e2) {}

    setState("idle");
  }

  initState();

  document.addEventListener("learn-task:activate", function () {
    setState("active");
  });
})();
