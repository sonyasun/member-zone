/**
 * 开始 7 天学习任务弹窗（个人中心 / 会员专区共用）
 * HTML: partials/learn-task-start-modal.html
 * 触发：data-learn-task-start-open / data-learn-task-start-close / data-learn-task-start-go
 */
(function () {
  "use strict";

  var modal = document.getElementById("learn-task-start-modal");
  if (!modal) return;

  var trigger = null;

  function openModal(nextTrigger) {
    trigger = nextTrigger || null;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    var primary = modal.querySelector("[data-learn-task-start-go]");
    if (primary) primary.focus();
  }

  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = "";
    if (trigger && typeof trigger.focus === "function") {
      trigger.focus();
    }
    trigger = null;
  }

  function activateFromTrigger() {
    if (!trigger) return;
    if (trigger.closest(".learn-task")) {
      document.dispatchEvent(new CustomEvent("learn-task:activate"));
      return;
    }
    if (trigger.closest(".member-lt")) {
      document.dispatchEvent(new CustomEvent("member-lt:activate"));
    }
  }

  document.addEventListener("click", function (e) {
    var openBtn = e.target.closest("[data-learn-task-start-open]");
    if (openBtn) {
      e.preventDefault();
      openModal(openBtn);
      return;
    }

    if (e.target.closest("[data-learn-task-start-close]")) {
      e.preventDefault();
      closeModal();
      return;
    }

    var goBtn = e.target.closest("[data-learn-task-start-go]");
    if (goBtn) {
      e.preventDefault();
      activateFromTrigger();
      closeModal();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });
})();
