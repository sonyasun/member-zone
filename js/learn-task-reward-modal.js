/**
 * 领取任务奖励弹窗（个人中心 / 会员专区共用）
 * HTML: partials/learn-task-reward-modal.html
 * 触发：data-learn-task-reward-open / data-learn-task-reward-close
 */
(function () {
  "use strict";

  var rewardModal = document.getElementById("learn-task-reward-modal");
  var rewardTrigger = null;

  function openRewardModal(trigger) {
    if (!rewardModal) return;
    rewardTrigger = trigger || null;
    rewardModal.hidden = false;
    document.body.style.overflow = "hidden";
    var closeBtn = rewardModal.querySelector(".learn-task-reward-modal__close");
    if (closeBtn) closeBtn.focus();
  }

  function closeRewardModal() {
    if (!rewardModal || rewardModal.hidden) return;
    rewardModal.hidden = true;
    document.body.style.overflow = "";
    if (rewardTrigger && typeof rewardTrigger.focus === "function") {
      rewardTrigger.focus();
    }
    rewardTrigger = null;
  }

  if (!rewardModal) return;

  document.addEventListener("click", function (e) {
    var openBtn = e.target.closest("[data-learn-task-reward-open]");
    if (openBtn) {
      e.preventDefault();
      openRewardModal(openBtn);
      return;
    }
    if (e.target.closest("[data-learn-task-reward-close]")) {
      closeRewardModal();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && rewardModal && !rewardModal.hidden) {
      closeRewardModal();
    }
  });
})();
