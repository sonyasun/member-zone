/**
 * 课程视频学习页
 */
(function () {
  "use strict";

  var RATES = ["1x", "1.25x", "1.5x", "2x"];
  var chapterRateToastTimer = null;

  function showChapterRateToast(message) {
    var toast = document.getElementById("course-learn-toast");
    if (!toast) return;

    toast.innerHTML =
      '<span class="course-learn-toast__icon" aria-hidden="true">' +
      '<svg width="10" height="10" viewBox="0 0 10 10" fill="none">' +
      '<path d="M2.5 5.2 4.2 6.8 7.8 3.4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>' +
      "</svg></span>" +
      "<span>" +
      message +
      "</span>";
    toast.hidden = false;
    toast.classList.add("is-visible");

    clearTimeout(chapterRateToastTimer);
    chapterRateToastTimer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
      window.setTimeout(function () {
        toast.hidden = true;
      }, 240);
    }, 2200);
  }

  function padTime(value) {
    return String(value).padStart(2, "0");
  }

  function formatTime(seconds) {
    var mins = Math.floor(seconds / 60);
    var secs = Math.floor(seconds % 60);
    return padTime(mins) + ":" + padTime(secs);
  }

  function initChapterRate() {
    var root = document.querySelector("[data-course-learn-chapter-rate]");
    if (!root) return { setLesson: function () {} };

    var stars = root.querySelectorAll("[data-chapter-star]");
    var hint = root.querySelector("[data-chapter-rate-hint]");
    var closeBtn = root.querySelector("[data-chapter-rate-close]");
    var starGroup = root.querySelector(".course-learn-chapter-rate__stars");
    var ratings = {};
    var lessonId = "1";
    var STORAGE_KEY = "mz-course-chapter-rate-collapsed";

    function setCollapsed(collapsed) {
      root.classList.toggle("is-collapsed", collapsed);
      root.setAttribute("aria-expanded", collapsed ? "false" : "true");
      if (collapsed) {
        root.setAttribute("tabindex", "0");
        root.setAttribute("role", "button");
      } else {
        root.removeAttribute("tabindex");
        root.removeAttribute("role");
      }
      try {
        window.sessionStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
      } catch (e) {}
    }

    function setStars(value) {
      stars.forEach(function (star) {
        var score = parseInt(star.getAttribute("data-chapter-star") || "0", 10);
        star.classList.toggle("is-active", score <= value);
      });
    }

    function sync() {
      var value = ratings[lessonId] || 0;
      setStars(value);
      root.classList.toggle("is-rated", value > 0);
      if (hint) hint.textContent = value > 0 ? "已评价 " + value + " 星" : "请打分";
    }

    stars.forEach(function (star) {
      star.addEventListener("mouseenter", function () {
        var hover = parseInt(star.getAttribute("data-chapter-star") || "0", 10);
        stars.forEach(function (node) {
          var score = parseInt(node.getAttribute("data-chapter-star") || "0", 10);
          node.classList.toggle("is-hover", score <= hover);
        });
      });
      star.addEventListener("click", function () {
        var value = parseInt(star.getAttribute("data-chapter-star") || "0", 10);
        var prev = ratings[lessonId] || 0;
        ratings[lessonId] = value;
        sync();
        if (value !== prev) {
          showChapterRateToast("评分成功，感谢你的反馈");
        }
      });
    });

    if (starGroup) {
      starGroup.addEventListener("mouseleave", function () {
        stars.forEach(function (node) {
          node.classList.remove("is-hover");
        });
        sync();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        setCollapsed(true);
      });
    }

    root.addEventListener("click", function () {
      if (root.classList.contains("is-collapsed")) {
        setCollapsed(false);
      }
    });

    root.addEventListener("keydown", function (e) {
      if (root.classList.contains("is-collapsed") && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        setCollapsed(false);
      }
    });

    try {
      setCollapsed(window.sessionStorage.getItem(STORAGE_KEY) === "1");
    } catch (e) {
      setCollapsed(false);
    }

    return {
      setLesson: function (id) {
        lessonId = String(id || "1");
        sync();
      },
    };
  }

  function initCourseLearn() {
    var stage = document.querySelector("[data-course-learn-stage]");
    var playBtn = document.querySelector("[data-course-learn-play]");
    var progressFill = document.querySelector("[data-course-learn-progress]");
    var progressTrack = document.querySelector(".course-learn-controls__track");
    var currentNode = document.querySelector("[data-course-learn-current]");
    var durationNode = document.querySelector("[data-course-learn-duration]");
    var titleNode = document.querySelector("[data-course-learn-title]");
    var rateBtn = document.querySelector("[data-course-learn-rate]");
    var fullscreenBtn = document.querySelector("[data-course-learn-fullscreen]");
    var lessons = document.querySelectorAll(".course-learn-lesson");

    if (!stage || !lessons.length) return;

    var chapterRate = initChapterRate();

    var state = {
      playing: false,
      current: 4,
      duration: 698,
      rateIndex: 0,
      timer: null,
    };

    function setDuration(seconds) {
      state.duration = seconds;
      state.current = Math.min(state.current, seconds);
      if (durationNode) durationNode.textContent = formatTime(seconds);
      updateProgress();
    }

    function updateProgress() {
      var ratio = state.duration ? (state.current / state.duration) * 100 : 0;
      if (progressFill) progressFill.style.width = ratio + "%";
      if (currentNode) currentNode.textContent = formatTime(state.current);
    }

    function setPlaying(next) {
      state.playing = next;
      stage.classList.toggle("is-playing", next);
      if (next) {
        state.timer = window.setInterval(function () {
          if (state.current >= state.duration) {
            setPlaying(false);
            return;
          }
          state.current += 1;
          updateProgress();
        }, 1000 / (state.rateIndex === 0 ? 1 : state.rateIndex === 1 ? 1.25 : state.rateIndex === 2 ? 1.5 : 2));
      } else if (state.timer) {
        window.clearInterval(state.timer);
        state.timer = null;
      }
    }

    function activateLesson(lesson) {
      lessons.forEach(function (item) {
        item.classList.toggle("is-active", item === lesson);
      });

      var title = lesson.getAttribute("data-lesson-title") || "";
      var duration = parseInt(lesson.getAttribute("data-lesson-duration") || "0", 10);
      var progress = parseInt(lesson.getAttribute("data-lesson-progress") || "0", 10);

      if (titleNode) titleNode.textContent = title;
      state.current = Math.round((duration * progress) / 100);
      setDuration(duration);
      setPlaying(false);
      chapterRate.setLesson(lesson.getAttribute("data-lesson-id"));
    }

    lessons.forEach(function (lesson) {
      lesson.addEventListener("click", function () {
        activateLesson(lesson);
      });
    });

    if (playBtn) {
      playBtn.addEventListener("click", function () {
        setPlaying(!state.playing);
      });
    }

    stage.addEventListener("click", function (e) {
      if (e.target.closest("[data-course-learn-play]")) return;
      setPlaying(!state.playing);
    });

    if (progressTrack) {
      progressTrack.addEventListener("click", function (e) {
        var rect = progressTrack.getBoundingClientRect();
        var ratio = (e.clientX - rect.left) / rect.width;
        state.current = Math.round(Math.max(0, Math.min(1, ratio)) * state.duration);
        updateProgress();
      });
    }

    if (rateBtn) {
      rateBtn.addEventListener("click", function () {
        state.rateIndex = (state.rateIndex + 1) % RATES.length;
        rateBtn.textContent = RATES[state.rateIndex];
        if (state.playing) {
          setPlaying(false);
          setPlaying(true);
        }
      });
    }

    if (fullscreenBtn) {
      fullscreenBtn.addEventListener("click", function () {
        var target = stage.closest(".course-learn-player") || document.documentElement;
        if (!document.fullscreenElement) {
          if (target.requestFullscreen) target.requestFullscreen();
        } else if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      });
    }

    var active = document.querySelector(".course-learn-lesson.is-active") || lessons[0];
    if (active) activateLesson(active);
  }

  function initBadReviewModal() {
    var modal = document.getElementById("course-learn-bad-review");
    if (!modal) return;

    var dialog = modal.querySelector(".course-learn-bad-review__dialog");
    var emojiNode = modal.querySelector("[data-bad-review-emoji]");
    var titleNode = modal.querySelector("[data-bad-review-title]");
    var stars = modal.querySelectorAll("[data-bad-review-star]");
    var tagsRoot = modal.querySelector("[data-bad-review-tags]");
    var textarea = modal.querySelector("[data-bad-review-text]");
    var countNode = modal.querySelector("[data-bad-review-count]");
    var submitBtn = modal.querySelector("[data-bad-review-submit]");
    var starValue = 1;
    var activeTier = "low";

    var REVIEW_TIERS = {
      low: {
        emoji: "assets/review-emoji-low.png",
        title: "差评，课程太差了",
        placeholder: "这门课程差吗？看看你如何吐槽~",
        tags: [
          "内容晦涩难懂",
          "对工作没有帮助",
          "内容老旧过时",
          "内容质量差",
          "结构逻辑混乱",
          "讲师授课枯燥",
        ],
      },
      mid: {
        emoji: "assets/review-emoji-mid.png",
        title: "中评，课程一般般",
        placeholder: "这门课程一般般吗？那留下你的建议呦~",
        tags: [
          "内容不易理解",
          "对工作帮助不大",
          "内容形式单一",
          "内容平平无奇",
          "结构逻辑不清晰",
          "授课通俗易懂",
        ],
      },
      high: {
        emoji: "assets/review-emoji-high.png",
        title: "五星好评，课程太赞了",
        placeholder: "如此高分，说说如此值得的理由~",
        tags: [
          "内容深入浅出",
          "对工作帮助很大",
          "内容形式新颖",
          "内容质量上乘",
          "结构逻辑清晰",
          "授课有趣生动",
        ],
      },
    };

    function getTier(value) {
      if (value <= 2) return "low";
      if (value === 3) return "mid";
      return "high";
    }

    function renderTags(tierKey) {
      if (!tagsRoot) return;
      var tier = REVIEW_TIERS[tierKey];
      tagsRoot.innerHTML = "";
      tier.tags.forEach(function (label) {
        var tag = document.createElement("button");
        tag.type = "button";
        tag.className = "course-learn-bad-review__tag";
        tag.setAttribute("data-bad-review-tag", "");
        tag.textContent = label;
        tag.addEventListener("click", function () {
          tag.classList.toggle("is-active");
        });
        tagsRoot.appendChild(tag);
      });
    }

    function applyTier(value) {
      var tierKey = getTier(value);
      var tier = REVIEW_TIERS[tierKey];
      if (tierKey !== activeTier) {
        activeTier = tierKey;
        renderTags(tierKey);
      }
      if (emojiNode) {
        emojiNode.src = tier.emoji;
      }
      if (titleNode) {
        titleNode.textContent = tier.title;
      }
      if (textarea) {
        textarea.placeholder = tier.placeholder;
      }
      if (dialog) {
        dialog.classList.remove("is-tier-low", "is-tier-mid", "is-tier-high");
        dialog.classList.add("is-tier-" + tierKey);
      }
    }

    function openModal() {
      modal.hidden = false;
      document.body.style.overflow = "hidden";
    }

    function closeModal() {
      modal.hidden = true;
      document.body.style.overflow = "";
    }

    function setStars(value) {
      starValue = value;
      stars.forEach(function (star) {
        var score = parseInt(star.getAttribute("data-bad-review-star") || "0", 10);
        star.classList.toggle("is-active", score <= value);
      });
      applyTier(value);
    }

    document.querySelectorAll("[data-bad-review-open]").forEach(function (btn) {
      btn.addEventListener("click", openModal);
    });

    modal.querySelectorAll("[data-bad-review-close]").forEach(function (btn) {
      btn.addEventListener("click", closeModal);
    });

    modal.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modal.hidden) closeModal();
    });

    stars.forEach(function (star) {
      star.addEventListener("mouseenter", function () {
        var hover = parseInt(star.getAttribute("data-bad-review-star") || "0", 10);
        stars.forEach(function (node) {
          var score = parseInt(node.getAttribute("data-bad-review-star") || "0", 10);
          node.classList.toggle("is-hover", score <= hover);
        });
      });
      star.addEventListener("click", function () {
        setStars(parseInt(star.getAttribute("data-bad-review-star") || "1", 10));
      });
    });

    modal.querySelector(".course-learn-bad-review__stars").addEventListener("mouseleave", function () {
      stars.forEach(function (node) {
        node.classList.remove("is-hover");
      });
      setStars(starValue);
    });

    if (textarea && countNode) {
      textarea.addEventListener("input", function () {
        countNode.textContent = String(textarea.value.length);
      });
    }

    if (submitBtn) {
      submitBtn.addEventListener("click", function () {
        closeModal();
        showChapterRateToast("评分成功，感谢你的反馈");
      });
    }

    renderTags("low");
    setStars(1);
  }

  initBadReviewModal();
  initCourseLearn();
})();
