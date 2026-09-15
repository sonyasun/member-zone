(function () {
  "use strict";

  var pad = function (n) {
    return n < 10 ? "0" + n : String(n);
  };

  var el = document.querySelector("[data-ai-exam-countdown]");
  if (el) {
    var endAttr = el.getAttribute("data-countdown-end");
    var endMs = endAttr ? Date.parse(endAttr) : NaN;

    if (Number.isFinite(endMs)) {
      var units = {
        d: el.querySelector('[data-unit="d"]'),
        h: el.querySelector('[data-unit="h"]'),
        m: el.querySelector('[data-unit="m"]'),
        s: el.querySelector('[data-unit="s"]'),
      };

      var tick = function () {
        var remainMs = endMs - Date.now();
        if (remainMs <= 0) {
          el.classList.add("is-ended");
          if (units.d) units.d.textContent = "00";
          if (units.h) units.h.textContent = "00";
          if (units.m) units.m.textContent = "00";
          if (units.s) units.s.textContent = "00";
          el.setAttribute("aria-label", "模考窗口已结束");
          return false;
        }

        el.classList.remove("is-ended");
        var totalSec = Math.floor(remainMs / 1000);
        var days = Math.floor(totalSec / 86400);
        var hours = Math.floor((totalSec % 86400) / 3600);
        var mins = Math.floor((totalSec % 3600) / 60);
        var secs = totalSec % 60;

        if (units.d) units.d.textContent = pad(days);
        if (units.h) units.h.textContent = pad(hours);
        if (units.m) units.m.textContent = pad(mins);
        if (units.s) units.s.textContent = pad(secs);

        el.setAttribute(
          "aria-label",
          "模考窗口倒计时 " + days + "天 " + pad(hours) + "时 " + pad(mins) + "分 " + pad(secs) + "秒"
        );
        return true;
      };

      if (tick()) {
        var timer = window.setInterval(function () {
          if (!tick()) window.clearInterval(timer);
        }, 1000);
      }
    }
  }
})();

(function () {
  "use strict";

  var CARD_DISPLAY = {
    manage: { state: "ready", attempts: 1, bestScore: 98 },
    pricing: { state: "need-share", attempts: 1, bestScore: 85 },
    civil: { state: "fresh", attempts: 0, bestScore: 0 },
    install: { state: "fresh", attempts: 0, bestScore: 0 },
  };

  var getDisplayEntry = function (subjectKey) {
    return CARD_DISPLAY[subjectKey] || CARD_DISPLAY.civil;
  };

  var takeUrl = function (subjectKey, query) {
    return "ai-exam-take.html?subject=" + encodeURIComponent(subjectKey) + (query ? "&" + query : "");
  };

  var SUBJECT_META = "60单选+20多选 · 150分钟";

  var SUBJECTS = {
    manage: "工程管理",
    pricing: "工程计价",
    civil: "土建计量",
    install: "安装计量",
  };

  var beatPercent = function (score) {
    if (score < 60) return (40 + score * 0.5).toFixed(1);
    return Math.min(99.9, (score - 60) * 0.82 + 65.2).toFixed(1);
  };

  var SHEET_SAMPLES = [
    {
      num: 3,
      type: "单选题",
      userAnswer: "A",
      correctAnswer: "A",
      correct: true,
      text: "你的作答 A，正确。建设单位管理费属于工程建设其他费用。",
    },
    {
      num: 12,
      type: "单选题",
      userAnswer: "C",
      correctAnswer: "A",
      correct: false,
      text: "你的作答 C，正确答案 A。建议回看「工程建设其他费用」相关章节。",
    },
    {
      num: 24,
      type: "单选题",
      userAnswer: "B",
      correctAnswer: "B",
      correct: true,
      text: "你的作答 B，正确。",
    },
    {
      num: 61,
      type: "多选题",
      userAnswer: "B、C",
      correctAnswer: "B、D",
      correct: false,
      text: "你的作答 B、C，正确答案 B、D。",
    },
    {
      num: 72,
      type: "多选题",
      userAnswer: "A、C、E",
      correctAnswer: "A、C、E",
      correct: true,
      text: "你的作答 A、C、E，全部正确。",
    },
  ];

  var renderSheetRecords = function (recordsEl) {
    if (!recordsEl) return;
    recordsEl.innerHTML = SHEET_SAMPLES.map(function (item) {
      return (
        '<li class="ai-exam-take-record__item">' +
        '<div class="ai-exam-take-record__item-head">' +
        '<h3 class="ai-exam-take-record__item-title">第 ' +
        item.num +
        " 题 · " +
        item.type +
        "</h3>" +
        '<span class="ai-exam-take-record__item-tag ' +
        (item.correct ? "is-correct" : "is-wrong") +
        '">' +
        (item.correct ? "答对" : "答错") +
        "</span>" +
        "</div>" +
        '<p class="ai-exam-take-record__item-answer">你的作答：<b>' +
        item.userAnswer +
        "</b> · 正确答案：" +
        item.correctAnswer +
        "</p>" +
        '<p class="ai-exam-take-record__item-text">' +
        item.text +
        "</p>" +
        "</li>"
      );
    }).join("");
  };

  var createSheetModal = function () {
    var modal = document.getElementById("ai-exam-sheet-modal");
    if (!modal) return null;

    var summaryEl = modal.querySelector("[data-ai-exam-sheet-summary]");
    var recordsEl = modal.querySelector("[data-ai-exam-sheet-records]");

    var closeModal = function () {
      modal.classList.remove("is-open");
      document.body.classList.remove("is-ai-exam-sheet-open");
      window.setTimeout(function () {
        modal.hidden = true;
      }, 220);
    };

    var openModal = function (subjectKey, score) {
      var subjectName = SUBJECTS[subjectKey] || SUBJECTS.manage;
      var sheetScore = score || 83;

      if (summaryEl) {
        summaryEl.textContent =
          subjectName +
          " · 最近一次交卷 · 得分 " +
          sheetScore +
          " 分 · 抽检 5 题作答记录（完整 80 题见 AI 报告）";
      }

      renderSheetRecords(recordsEl);

      modal.hidden = false;
      window.requestAnimationFrame(function () {
        modal.classList.add("is-open");
      });
      document.body.classList.add("is-ai-exam-sheet-open");
    };

    modal.querySelectorAll("[data-ai-exam-sheet-close]").forEach(function (node) {
      node.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !modal.hidden) closeModal();
    });

    return { openModal: openModal, closeModal: closeModal };
  };

  var createExamModal = function (sheetModal) {
    var modal = document.getElementById("ai-exam-submit-modal");
    if (!modal) return null;

    var activeSubjectKey = null;
    var shareHead = modal.querySelector("[data-ai-exam-modal-share-head]");
    var shareHeading = modal.querySelector("[data-ai-exam-share-heading]");
    var scoreEl = modal.querySelector("[data-ai-exam-submit-score]");
    var metaEl = modal.querySelector("[data-ai-exam-submit-meta]");
    var rankTag = modal.querySelector("[data-ai-exam-modal-rank-tag]");
    var quoteEl = modal.querySelector("[data-ai-exam-modal-quote]");
    var linksEl = modal.querySelector("[data-ai-exam-modal-links]");
    var openSheetBtn = modal.querySelector("[data-ai-exam-open-sheet]");
    var shareBtn = modal.querySelector("[data-ai-exam-submit-share]");
    var shareLabel = modal.querySelector("[data-ai-exam-submit-share-label]");
    var dialog = modal.querySelector(".ai-exam-submit-modal__dialog");

    var resetShareBtn = function () {
      if (!shareBtn || !shareLabel) return;
      shareBtn.classList.remove("is-done");
      shareBtn.disabled = false;
      shareLabel.textContent = "分享获取下一次模考机会";
    };

    var closeModal = function () {
      modal.classList.remove("is-open");
      document.body.classList.remove("is-ai-exam-submit-open");
      window.setTimeout(function () {
        modal.hidden = true;
      }, 220);
    };

    var animateScore = function (target) {
      if (!scoreEl) return;
      var startMs = performance.now();
      var duration = 680;
      var tick = function (now) {
        var t = Math.min((now - startMs) / duration, 1);
        var eased = 1 - Math.pow(1 - t, 3);
        scoreEl.textContent = String(Math.round(target * eased));
        if (t < 1) window.requestAnimationFrame(tick);
      };
      scoreEl.textContent = "0";
      window.requestAnimationFrame(tick);
    };

    var setMode = function (mode) {
      modal.setAttribute("data-mode", mode);
      var isShare = mode === "share";

      if (shareHead) shareHead.hidden = !isShare;
      if (rankTag) rankTag.hidden = isShare;
      if (quoteEl) quoteEl.hidden = !isShare;
      if (linksEl) linksEl.hidden = isShare;

      if (dialog) {
        dialog.setAttribute("aria-labelledby", isShare ? "ai-exam-modal-heading" : "ai-exam-submit-modal-title");
      }
    };

    var openModal = function (opts) {
      var subjectKey = opts.subjectKey;
      var subjectName = SUBJECTS[subjectKey] || SUBJECTS.manage;
      var score = opts.score;
      activeSubjectKey = subjectKey;
      resetShareBtn();
      setMode(opts.mode);

      if (opts.mode === "share") {
        if (shareHeading) {
          shareHeading.textContent = "获取「" + subjectName + "」下一次模考机会";
        }
        if (metaEl) {
          metaEl.textContent = subjectName + " · 击败 " + beatPercent(score) + "% 考生";
        }
        if (scoreEl) scoreEl.textContent = String(score);
      } else {
        if (metaEl) {
          metaEl.textContent = subjectName + " · 历史最高 " + score + " 分 · 成绩已计入排行榜";
        }
      }

      modal.hidden = false;
      window.requestAnimationFrame(function () {
        modal.classList.add("is-open");
      });
      document.body.classList.add("is-ai-exam-submit-open");

      if (opts.animateScore) animateScore(score);
      else if (scoreEl) scoreEl.textContent = String(score);
    };

    modal.querySelectorAll("[data-ai-exam-submit-close]").forEach(function (node) {
      node.addEventListener("click", closeModal);
    });

    if (shareBtn && shareLabel) {
      shareBtn.addEventListener("click", function () {
        if (!activeSubjectKey) return;
        shareBtn.classList.add("is-done");
        shareBtn.disabled = true;
        shareLabel.textContent = "分享链接已复制，快去邀请好友吧";
        window.setTimeout(closeModal, 1400);
      });
    }

    if (openSheetBtn && sheetModal) {
      openSheetBtn.addEventListener("click", function () {
        if (!activeSubjectKey) return;
        var entry = getDisplayEntry(activeSubjectKey);
        sheetModal.openModal(activeSubjectKey, entry.bestScore);
      });
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !modal.hidden) closeModal();
    });

    return { openModal: openModal, closeModal: closeModal };
  };

  var renderHeadExtra = function (cardState, entry) {
    if (cardState === "fresh") {
      return '<span class="ai-exam-subject__badge">第 1 次免费</span>';
    }
    if (cardState === "need-share") {
      return (
        '<p class="ai-exam-subject__score">已考 ' +
        entry.attempts +
        " 次 · 最高 <b>" +
        entry.bestScore +
        '</b> 分</p>' +
        '<span class="ai-exam-subject__badge ai-exam-subject__badge--share">分享后可再考</span>'
      );
    }
    return "";
  };

  var renderActions = function (subjectKey, cardState, entry) {
    if (cardState === "fresh") {
      return (
        '<a class="btn btn--primary" href="' +
        takeUrl(subjectKey, "attempt=1") +
        '">开始模考</a>'
      );
    }

    var actions =
      '<button type="button" class="btn btn--ghost" data-ai-exam-sheet="' +
      subjectKey +
      '">答题卡</button>' +
      '<button type="button" class="btn btn--ghost" disabled aria-disabled="true">AI 报告</button>';

    if (cardState === "need-share") {
      return (
        actions +
        '<button type="button" class="btn btn--primary btn--share" data-ai-exam-share="' +
        subjectKey +
        '">分享可获得下一次机会</button>'
      );
    }

    return (
      actions +
      '<a class="btn btn--primary" href="' +
      takeUrl(subjectKey, "attempt=" + (entry.attempts + 1)) +
      '">继续答题</a>'
    );
  };

  var renderSubjectCards = function (list) {
    list.querySelectorAll("[data-subject]").forEach(function (card) {
      var subjectKey = card.getAttribute("data-subject");
      var index = card.getAttribute("data-subject-index") || "";
      var name = card.getAttribute("data-subject-name") || SUBJECTS[subjectKey] || "";
      var entry = getDisplayEntry(subjectKey);
      var cardState = entry.state;

      card.className = "ai-exam-subject";
      if (cardState !== "fresh") card.classList.add("ai-exam-subject--started");
      if (cardState === "need-share") card.classList.add("ai-exam-subject--need-share");

      card.innerHTML =
        '<div class="ai-exam-subject__row">' +
        '<span class="ai-exam-subject__index">' +
        index +
        "</span>" +
        '<div class="ai-exam-subject__info">' +
        '<div class="ai-exam-subject__head">' +
        '<h3 class="ai-exam-subject__name">' +
        name +
        "</h3>" +
        renderHeadExtra(cardState, entry) +
        "</div>" +
        '<p class="ai-exam-subject__meta">' +
        SUBJECT_META +
        "</p>" +
        "</div>" +
        "</div>" +
        '<div class="ai-exam-subject__actions">' +
        renderActions(subjectKey, cardState, entry) +
        "</div>";
    });
  };

  var openExam = function (href) {
    if (!href) return;
    window.location.assign(href);
  };

  var bindSubjectList = function (list, examModal, sheetModal) {
    list.addEventListener("click", function (event) {
      var sheetBtn = event.target.closest("[data-ai-exam-sheet]");
      if (sheetBtn) {
        event.preventDefault();
        event.stopPropagation();
        var subjectKey = sheetBtn.getAttribute("data-ai-exam-sheet");
        var entry = getDisplayEntry(subjectKey);
        if (sheetModal) sheetModal.openModal(subjectKey, entry.bestScore);
        return;
      }

      var shareBtn = event.target.closest("[data-ai-exam-share]");
      if (shareBtn) {
        event.preventDefault();
        event.stopPropagation();
        var subjectKey = shareBtn.getAttribute("data-ai-exam-share");
        var entry = getDisplayEntry(subjectKey);
        if (examModal) {
          examModal.openModal({
            mode: "share",
            subjectKey: subjectKey,
            score: entry.bestScore,
            animateScore: false,
          });
        }
        return;
      }

      var actionLink = event.target.closest(".ai-exam-subject__actions a");
      if (actionLink) {
        event.stopPropagation();
        return;
      }

      var actionBtn = event.target.closest(".ai-exam-subject__actions button");
      if (actionBtn) {
        event.stopPropagation();
        return;
      }

      var card = event.target.closest(".ai-exam-subject");
      if (!card) return;

      var subjectKey = card.getAttribute("data-subject");
      var cardState = getDisplayEntry(subjectKey).state;

      if (cardState === "need-share") return;

      var primary = card.querySelector(".ai-exam-subject__actions .btn--primary[href]");
      if (!primary || !primary.href) return;

      event.preventDefault();
      openExam(primary.href);
    });
  };

  var list = document.querySelector("[data-ai-exam-subjects]");
  var sheetModal = createSheetModal();
  var examModal = createExamModal(sheetModal);

  if (list) {
    renderSubjectCards(list);
    bindSubjectList(list, examModal, sheetModal);
  }

  var params = new URLSearchParams(window.location.search);
  if (params.get("submitted") === "1") {
    var subjectKey = params.get("subject") || "manage";
    var attempt = parseInt(params.get("attempt") || "1", 10);
    var score = parseInt(params.get("score") || "78", 10);
    if (!Number.isFinite(attempt) || attempt < 1) attempt = 1;
    if (!Number.isFinite(score) || score < 0) score = 78;

    if (examModal) {
      examModal.openModal({
        mode: "submit",
        subjectKey: subjectKey,
        attempt: attempt,
        score: score,
        animateScore: true,
      });
    }

    if (window.history.replaceState) {
      params.delete("submitted");
      params.delete("subject");
      params.delete("attempt");
      params.delete("score");
      var query = params.toString();
      var nextUrl = window.location.pathname + (query ? "?" + query : "");
      window.history.replaceState(null, "", nextUrl);
    }
  }
})();
