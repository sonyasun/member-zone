(function () {
  "use strict";

  var TOTAL = 80;
  var SINGLE_COUNT = 60;
  var EXAM_MINUTES = 150;

  var STORAGE_KEY = "ai-exam-subject-state-v3";

  var SUBJECTS = {
    manage: { name: "工程管理", meta: "60单选+20多选 · 150分钟", score: 98, defaultAttempt: 2 },
    pricing: { name: "工程计价", meta: "60单选+20多选 · 150分钟", score: 0, defaultAttempt: 1 },
    civil: { name: "土建计量", meta: "60单选+20多选 · 150分钟", score: 83, defaultAttempt: 1 },
    install: { name: "安装计量", meta: "60单选+20多选 · 150分钟", score: 0, defaultAttempt: 1 },
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

  var loadSubjectScore = function (key) {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (parsed[key] && parsed[key].bestScore) return parsed[key].bestScore;
    } catch (e) {}
    return null;
  };

  var VIEW_LABELS = {
    exam: "模考作答",
    sheet: "答题卡",
  };

  var params = new URLSearchParams(window.location.search);
  var subjectKey = params.get("subject") || "manage";
  var view = params.get("view") || "exam";
  if (view === "report") {
    window.location.replace("ai-exam.html");
    return;
  }
  if (!VIEW_LABELS[view]) view = "exam";

  var subject = SUBJECTS[subjectKey] || SUBJECTS.manage;
  var storedScore = loadSubjectScore(subjectKey);
  if (storedScore) subject = Object.assign({}, subject, { score: storedScore });
  var attempt = parseInt(params.get("attempt") || String(subject.defaultAttempt), 10);
  if (!Number.isFinite(attempt) || attempt < 1) attempt = 1;

  var titleEl = document.querySelector("[data-ai-exam-take-title]");
  var metaEl = document.querySelector("[data-ai-exam-take-meta]");
  var attemptEl = document.querySelector("[data-ai-exam-take-attempt]");
  var timerWrap = document.querySelector("[data-ai-exam-take-timer]");
  var timerFace = timerWrap ? timerWrap.querySelector(".ai-exam-take-header__timer") : null;
  var timerValue = document.querySelector("[data-ai-exam-take-timer-value]");
  var actionsEl = document.querySelector("[data-ai-exam-take-actions]");
  var layoutEl = document.querySelector("[data-ai-exam-take-layout]");
  var timerLabel = document.querySelector("[data-ai-exam-timer-label]");
  var pauseBtn = document.querySelector("[data-ai-exam-pause-btn]");

  if (titleEl) titleEl.textContent = subject.name + " · " + VIEW_LABELS[view];
  if (metaEl) metaEl.textContent = subject.meta;
  document.title = subject.name + " · " + VIEW_LABELS[view] + " - 建筑云课";

  document.querySelectorAll("[data-ai-exam-take-view]").forEach(function (panel) {
    panel.hidden = panel.getAttribute("data-ai-exam-take-view") !== view;
  });

  if (layoutEl) layoutEl.hidden = view !== "exam";

  var pad = function (n) {
    return n < 10 ? "0" + n : String(n);
  };

  var formatTime = function (sec) {
    var h = Math.floor(sec / 3600);
    var m = Math.floor((sec % 3600) / 60);
    var s = sec % 60;
    return pad(h) + ":" + pad(m) + ":" + pad(s);
  };

  var buildSheet = function (container, start, end, state, onPick) {
    if (!container) return;
    container.innerHTML = "";
    for (var i = start; i <= end; i += 1) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ai-exam-take-sheet__cell";
      btn.textContent = String(i);
      btn.setAttribute("data-q", String(i));
      if (state.answered[i]) btn.classList.add("is-done");
      if (i === state.current) btn.classList.add("is-current");
      if (onPick) {
        btn.addEventListener("click", function () {
          onPick(parseInt(this.getAttribute("data-q"), 10));
        });
      }
      container.appendChild(btn);
    }
  };

  if (view === "sheet") {
    var sheetScore = subject.score || 83;
    var summaryEl = document.querySelector("[data-ai-exam-sheet-summary]");
    var recordsEl = document.querySelector("[data-ai-exam-sheet-records]");

    if (summaryEl) {
      summaryEl.textContent =
        subject.name +
        " · 最近一次交卷 · 得分 " +
        sheetScore +
        " 分 · 抽检 5 题作答记录（完整 80 题见 AI 报告）";
    }

    if (recordsEl) {
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
    }

    return;
  }

  if (view !== "exam") return;

  if (attemptEl) {
    attemptEl.hidden = false;
    attemptEl.textContent = "第 " + attempt + " 次模考";
  }
  if (timerWrap) timerWrap.hidden = false;
  if (actionsEl) actionsEl.hidden = false;

  var state = {
    current: 1,
    answered: { 1: true },
    paused: false,
    remainSec: EXAM_MINUTES * 60,
  };

  if (subjectKey === "manage" && attempt > 1) {
    var seed;
    for (seed = 1; seed <= 12; seed += 1) state.answered[seed] = true;
    state.current = 13;
  }

  var currentEl = document.querySelector("[data-ai-exam-take-current]");
  var sidebarDoneEl = document.querySelector("[data-ai-exam-sidebar-done]");
  var qtypeEl = document.querySelector("[data-ai-exam-take-qtype]");
  var optionsEl = document.querySelector("[data-ai-exam-take-options]");
  var prevBtn = document.querySelector('[data-ai-exam-nav="prev"]');
  var nextBtn = document.querySelector('[data-ai-exam-nav="next"]');
  var sheetSingle = document.querySelector("[data-ai-exam-sheet-single]");
  var sheetMulti = document.querySelector("[data-ai-exam-sheet-multi]");

  var countAnswered = function () {
    return Object.keys(state.answered).length;
  };

  var isMulti = function (num) {
    return num > SINGLE_COUNT;
  };

  var renderSheets = function () {
    buildSheet(sheetSingle, 1, SINGLE_COUNT, state, goToQuestion);
    buildSheet(sheetMulti, SINGLE_COUNT + 1, TOTAL, state, goToQuestion);
  };

  var renderQuestion = function () {
    if (currentEl) currentEl.textContent = String(state.current);
    if (qtypeEl) qtypeEl.textContent = isMulti(state.current) ? "多选题" : "单选题";
    if (prevBtn) prevBtn.disabled = state.current <= 1;
    if (nextBtn) nextBtn.disabled = state.current >= TOTAL;

    var done = countAnswered();
    if (sidebarDoneEl) sidebarDoneEl.textContent = String(done);

    if (optionsEl) {
      var selected = state.answered[state.current];
      optionsEl.querySelectorAll(".ai-exam-take-option").forEach(function (node) {
        node.classList.toggle("is-selected", !!selected);
      });
    }

    renderSheets();
  };

  var goToQuestion = function (num) {
    if (num < 1 || num > TOTAL) return;
    state.current = num;
    renderQuestion();
  };

  var renderTimer = function () {
    if (!timerValue) return;
    timerValue.textContent = formatTime(state.remainSec);
    if (timerFace) timerFace.classList.toggle("is-low", !state.paused && state.remainSec <= 600);
    if (timerFace) timerFace.classList.toggle("is-paused", state.paused);
  };

  var setPaused = function (paused) {
    state.paused = paused;
    if (pauseBtn) {
      pauseBtn.textContent = paused ? "继续答题" : "暂停";
      pauseBtn.setAttribute("aria-pressed", paused ? "true" : "false");
      pauseBtn.classList.toggle("btn--primary", paused);
      pauseBtn.classList.toggle("btn--ghost", !paused);
    }
    if (timerLabel) timerLabel.textContent = paused ? "已暂停" : "剩余";
    renderTimer();
  };

  var saveAndLeave = function () {
    window.location.href = "ai-exam.html";
  };

  var submitExam = function () {
    window.clearInterval(timerId);
    var score = subject.score || 78;
    window.location.href =
      "ai-exam.html?submitted=1" +
      "&subject=" +
      encodeURIComponent(subjectKey) +
      "&attempt=" +
      attempt +
      "&score=" +
      score;
  };

  var confirmModal = document.getElementById("ai-exam-submit-confirm");
  var confirmStat = document.querySelector("[data-ai-exam-submit-confirm-stat]");

  var closeSubmitConfirm = function () {
    if (!confirmModal) return;
    confirmModal.classList.remove("is-open");
    document.body.classList.remove("is-ai-exam-submit-confirm-open");
    window.setTimeout(function () {
      confirmModal.hidden = true;
    }, 220);
  };

  var openSubmitConfirm = function () {
    if (!confirmModal) {
      submitExam();
      return;
    }
    var unanswered = TOTAL - countAnswered();
    if (confirmStat) {
      if (unanswered > 0) {
        confirmStat.hidden = false;
        confirmStat.textContent = "还有 " + unanswered + " 题未作答";
      } else {
        confirmStat.hidden = true;
        confirmStat.textContent = "";
      }
    }
    confirmModal.hidden = false;
    window.requestAnimationFrame(function () {
      confirmModal.classList.add("is-open");
    });
    document.body.classList.add("is-ai-exam-submit-confirm-open");
  };

  if (confirmModal) {
    confirmModal.querySelectorAll("[data-ai-exam-submit-confirm-cancel]").forEach(function (node) {
      node.addEventListener("click", closeSubmitConfirm);
    });
    var confirmOk = confirmModal.querySelector("[data-ai-exam-submit-confirm-ok]");
    if (confirmOk) {
      confirmOk.addEventListener("click", function () {
        closeSubmitConfirm();
        submitExam();
      });
    }
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && confirmModal && !confirmModal.hidden) closeSubmitConfirm();
    });
  }

  var timerId = window.setInterval(function () {
    if (state.paused || state.remainSec <= 0) return;
    state.remainSec -= 1;
    renderTimer();
    if (state.remainSec <= 0) submitExam();
  }, 1000);

  renderTimer();
  renderQuestion();

  if (optionsEl) {
    optionsEl.addEventListener("click", function (event) {
      var option = event.target.closest(".ai-exam-take-option");
      if (!option) return;
      optionsEl.querySelectorAll(".ai-exam-take-option").forEach(function (node) {
        node.classList.remove("is-selected");
      });
      option.classList.add("is-selected");
      state.answered[state.current] = true;
      renderQuestion();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      goToQuestion(state.current - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      goToQuestion(state.current + 1);
    });
  }

  document.querySelectorAll("[data-ai-exam-action]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var action = btn.getAttribute("data-ai-exam-action");
      if (action === "toggle-pause") setPaused(!state.paused);
      if (action === "save") saveAndLeave();
      if (action === "submit") openSubmitConfirm();
    });
  });
})();
