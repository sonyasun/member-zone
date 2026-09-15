/**
 * 课程详情 · Tab 切换与评价交互
 */
(function () {
  "use strict";

  var STAR_TIPS = ["", "非常不满意", "不满意", "一般", "满意", "非常满意"];
  var REQUIRED_STAR_GROUPS = ["overall", "accuracy", "satisfaction", "clarity", "recommend"];
  var MAX_TAGS = 5;

  function initCourseTabs(panel) {
    var tabs = panel.querySelectorAll(".course-tabs__item[data-course-tab]");
    var tabPanels = panel.querySelectorAll(".course-tab-panel[data-course-panel]");
    if (!tabs.length || !tabPanels.length) return;

    function activateTab(key) {
      tabs.forEach(function (tab) {
        var active = tab.getAttribute("data-course-tab") === key;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", active ? "true" : "false");
      });

      tabPanels.forEach(function (tabPanel) {
        var match = tabPanel.getAttribute("data-course-panel") === key;
        tabPanel.classList.toggle("is-hidden", !match);
        tabPanel.hidden = !match;
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        activateTab(tab.getAttribute("data-course-tab") || "intro");
      });
    });

    return activateTab;
  }

  function initFreeCourseMode(activateTab) {
    var isFree = false;
    try {
      isFree = new URLSearchParams(window.location.search).get("free") === "1";
    } catch (e) {}

    if (!isFree) return;

    var page = document.querySelector(".page--course");
    if (page) page.classList.add("is-free-course");

    var deal = document.querySelector(".course-hero__deal");
    if (deal) deal.hidden = true;

    var buy = document.querySelector(".course-hero__buy");
    if (buy) {
      buy.textContent = "立即学习";
      buy.setAttribute("href", "course-learn.html?free=1");
      buy.setAttribute("target", "_blank");
      buy.setAttribute("rel", "noopener");
      buy.classList.add("course-hero__buy--free");
    }

    var materialsNote = document.querySelector(".course-materials__note");
    if (materialsNote) {
      materialsNote.textContent = "登录后可在「我的学习」中下载全部资料。";
    }

    var reviewTip = document.querySelector(".course-reviews__cta-tip");
    if (reviewTip) reviewTip.textContent = "登录后即可评价";
  }

  function matchesFilter(item, filter) {
    var rating = parseInt(item.getAttribute("data-rating") || "5", 10);

    if (filter === "good") return rating >= 4;
    if (filter === "mid") return rating === 3;
    if (filter === "bad") return rating <= 2;
    return true;
  }

  function applyReviewFilter(root, filter) {
    var items = root.querySelectorAll(".course-review");
    var empty = root.querySelector("[data-course-review-empty]");
    var visible = 0;

    items.forEach(function (item) {
      var show = matchesFilter(item, filter);
      item.classList.toggle("is-hidden", !show);
      if (show) visible += 1;
    });

    if (empty) empty.hidden = visible > 0;
  }

  function setStarInput(starInput, value) {
    var stars = starInput.querySelectorAll("[data-review-star]");
    stars.forEach(function (star) {
      var score = parseInt(star.getAttribute("data-review-star") || "0", 10);
      star.classList.toggle("is-active", score <= value);
    });
    starInput.setAttribute("data-value", String(value));
  }

  function getStarInputValue(starInput) {
    return parseInt(starInput.getAttribute("data-value") || "0", 10);
  }

  function updateStarTip(starTip, value) {
    if (!starTip) return;
    if (value > 0) {
      starTip.textContent = STAR_TIPS[value] || "";
      starTip.classList.add("is-rated");
    } else {
      starTip.textContent = "请评分";
      starTip.classList.remove("is-rated");
    }
  }

  function bindStarInput(starInput, starTip) {
    if (!starInput) return;

    setStarInput(starInput, 0);
    updateStarTip(starTip, 0);

    starInput.querySelectorAll("[data-review-star]").forEach(function (star) {
      star.addEventListener("mouseenter", function () {
        var hover = parseInt(star.getAttribute("data-review-star") || "0", 10);
        starInput.querySelectorAll("[data-review-star]").forEach(function (node) {
          var score = parseInt(node.getAttribute("data-review-star") || "0", 10);
          node.classList.toggle("is-hover", score <= hover);
        });
      });
      star.addEventListener("click", function () {
        var value = parseInt(star.getAttribute("data-review-star") || "0", 10);
        setStarInput(starInput, value);
        updateStarTip(starTip, value);
        var field = starInput.closest("[data-review-field], .course-review-modal__dim");
        if (field) field.classList.remove("is-error");
      });
    });

    starInput.addEventListener("mouseleave", function () {
      starInput.querySelectorAll(".is-hover").forEach(function (node) {
        node.classList.remove("is-hover");
      });
    });
  }

  function bindAllStarInputs(modal) {
    modal.querySelectorAll("[data-review-star-group]").forEach(function (starInput) {
      var group = starInput.getAttribute("data-review-star-group");
      var starTip = modal.querySelector('[data-review-star-tip="' + group + '"]');
      bindStarInput(starInput, starTip);
    });
  }

  function bindDifficultyPills(root) {
    var pills = root.querySelectorAll("[data-difficulty]");
    if (!pills.length) return;

    pills.forEach(function (pill) {
      pill.addEventListener("click", function () {
        var active = pill.classList.contains("is-active");
        pills.forEach(function (node) {
          node.classList.remove("is-active");
        });
        if (!active) pill.classList.add("is-active");
      });
    });
  }

  function syncReviewTagStates(root) {
    var tags = root.querySelectorAll("[data-review-tag]");
    var selected = root.querySelectorAll("[data-review-tag].is-active").length;
    tags.forEach(function (tag) {
      var isActive = tag.classList.contains("is-active");
      tag.classList.toggle("is-disabled", !isActive && selected >= MAX_TAGS);
    });
  }

  function bindReviewTags(root) {
    var tags = root.querySelectorAll("[data-review-tag]");
    if (!tags.length) return;

    tags.forEach(function (tag) {
      tag.addEventListener("click", function () {
        if (tag.classList.contains("is-disabled")) return;
        tag.classList.toggle("is-active");
        syncReviewTagStates(root);
      });
    });

    syncReviewTagStates(root);
  }

  function resetReviewForm(modal) {
    modal.querySelectorAll("[data-review-star-group]").forEach(function (starInput) {
      var group = starInput.getAttribute("data-review-star-group");
      setStarInput(starInput, 0);
      updateStarTip(modal.querySelector('[data-review-star-tip="' + group + '"]'), 0);
    });

    modal.querySelectorAll(".is-error").forEach(function (node) {
      node.classList.remove("is-error");
    });

    modal.querySelectorAll("[data-difficulty]").forEach(function (pill) {
      pill.classList.remove("is-active");
    });

    modal.querySelectorAll("[data-review-tag]").forEach(function (tag) {
      tag.classList.remove("is-active", "is-disabled");
    });
    syncReviewTagStates(modal);

    var textarea = modal.querySelector("[data-course-review-text]");
    var charCount = modal.querySelector("[data-review-char-count]");
    if (textarea) textarea.value = "";
    if (charCount) charCount.textContent = "0";
  }

  function validateRequiredStars(modal) {
    var valid = true;
    var firstInvalid = null;

    REQUIRED_STAR_GROUPS.forEach(function (group) {
      var starInput = modal.querySelector('[data-review-star-group="' + group + '"]');
      var field = modal.querySelector('[data-review-field="' + group + '"]') ||
        (starInput ? starInput.closest(".course-review-modal__dim") : null);
      var value = starInput ? getStarInputValue(starInput) : 0;

      if (value < 1) {
        valid = false;
        if (field) field.classList.add("is-error");
        if (!firstInvalid && starInput) firstInvalid = starInput;
      } else if (field) {
        field.classList.remove("is-error");
      }
    });

    if (firstInvalid) {
      var firstStar = firstInvalid.querySelector("[data-review-star]");
      if (firstStar) firstStar.focus();
    }

    return valid;
  }

  function getSelectedDifficulty(modal) {
    var active = modal.querySelector("[data-difficulty].is-active");
    return active ? active.getAttribute("data-difficulty") || "" : "";
  }

  function getSelectedTags(modal) {
    return Array.prototype.map.call(
      modal.querySelectorAll("[data-review-tag].is-active"),
      function (tag) {
        return tag.textContent.trim();
      }
    );
  }

  function initReviewModal(modal, reviewsRoot) {
    if (!modal) return;

    var form = modal.querySelector("[data-course-review-form]");
    var textarea = modal.querySelector("[data-course-review-text]");
    var charCount = modal.querySelector("[data-review-char-count]");
    var list = reviewsRoot ? reviewsRoot.querySelector("[data-course-review-list]") : null;

    function openModal() {
      resetReviewForm(modal);
      modal.hidden = false;
      document.body.style.overflow = "hidden";
    }

    function closeModal() {
      modal.hidden = true;
      document.body.style.overflow = "";
    }

    document.querySelectorAll("[data-course-review-open]").forEach(function (btn) {
      btn.addEventListener("click", openModal);
    });

    modal.querySelectorAll("[data-course-review-close]").forEach(function (btn) {
      btn.addEventListener("click", closeModal);
    });

    modal.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modal.hidden) closeModal();
    });

    bindAllStarInputs(modal);
    bindDifficultyPills(modal);
    bindReviewTags(modal);

    if (textarea && charCount) {
      textarea.addEventListener("input", function () {
        charCount.textContent = String(textarea.value.length);
      });
    }

    if (form && list) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!validateRequiredStars(modal)) return;

        var overallInput = modal.querySelector('[data-review-star-group="overall"]');
        var rating = overallInput ? getStarInputValue(overallInput) : 0;
        var text = textarea ? textarea.value.trim() : "";
        var difficultyLabel = getSelectedDifficulty(modal) || "未填写";
        var tags = getSelectedTags(modal);
        var displayText = text;

        if (!displayText && tags.length) {
          displayText = tags.join("、");
        }
        if (!displayText) {
          displayText = "已完成评价";
        }

        var item = document.createElement("li");
        item.className = "course-review";
        item.setAttribute("data-rating", String(rating));
        item.innerHTML =
          '<article class="course-review__card">' +
          '<div class="course-review__top">' +
          '<div class="course-review__user">' +
          '<span class="course-review__avatar course-review__avatar--letter" style="--avatar-bg:#139686" aria-hidden="true">我</span>' +
          '<div class="course-review__who">' +
          '<span class="course-review__name">我</span>' +
          '<time class="course-review__time" datetime="' +
          new Date().toISOString().slice(0, 10) +
          '">刚刚</time>' +
          "</div></div>" +
          '<div class="course-review__rating">' +
          '<div class="course-stars course-stars--sm" aria-hidden="true">' +
          '<span class="course-stars__track"></span>' +
          '<span class="course-stars__fill" style="width:' +
          rating * 20 +
          '%"></span>' +
          "</div>" +
          '<span class="course-review__score">' +
          rating.toFixed(1) +
          "</span></div></div>" +
          '<p class="course-review__meta">课程难易度 <strong></strong></p>' +
          '<p class="course-review__text"></p>' +
          "</article>";
        item.querySelector(".course-review__meta strong").textContent = difficultyLabel;
        item.querySelector(".course-review__text").textContent = displayText;
        list.insertBefore(item, list.firstChild);

        var activeFilter = reviewsRoot.querySelector(".course-reviews__filter.is-active");
        applyReviewFilter(reviewsRoot, activeFilter ? activeFilter.getAttribute("data-review-filter") || "all" : "all");
        closeModal();
      });
    }
  }

  function initCourseReviews(root) {
    var filters = root.querySelectorAll("[data-review-filter]");

    filters.forEach(function (filterBtn) {
      filterBtn.addEventListener("click", function () {
        filters.forEach(function (btn) {
          var active = btn === filterBtn;
          btn.classList.toggle("is-active", active);
          btn.setAttribute("aria-selected", active ? "true" : "false");
        });
        applyReviewFilter(root, filterBtn.getAttribute("data-review-filter") || "all");
      });
    });
  }

  var activateTab = null;

  document.querySelectorAll(".course-panel").forEach(function (panel) {
    activateTab = initCourseTabs(panel) || activateTab;
    panel.querySelectorAll("[data-course-reviews]").forEach(initCourseReviews);
  });

  initFreeCourseMode(activateTab);

  var modal = document.getElementById("course-review-modal");
  var reviewsRoot = document.querySelector("[data-course-reviews]");
  initReviewModal(modal, reviewsRoot);
})();
