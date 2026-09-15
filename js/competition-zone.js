/**
 * 赛区专区 · Tab / 省份筛选 / 备赛资料与视频弹窗
 */
(function () {
  var filterRoot = document.querySelector(".competition-filter");
  var localPanel = document.getElementById("competition-panel-local");
  var panels = document.querySelectorAll(".competition-panel");

  if (filterRoot) {
    var tabs = filterRoot.querySelectorAll(".competition-filter__tab");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var panelId = tab.getAttribute("aria-controls");
        tabs.forEach(function (item) {
          var active = item === tab;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-selected", active ? "true" : "false");
        });
        panels.forEach(function (panel) {
          panel.hidden = panel.id !== panelId;
        });
      });
    });
  }

  if (localPanel) {
    var regions = localPanel.querySelectorAll(".competition-filter__region");
    regions.forEach(function (region) {
      region.addEventListener("click", function () {
        regions.forEach(function (item) {
          var active = item === region;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", active ? "true" : "false");
        });
      });
    });

    var form = localPanel.querySelector(".competition-filter__search");
    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
      });
    }
  }

  function getEventTitle(trigger) {
    var card = trigger.closest(".competition-event-card");
    var titleEl = card && card.querySelector(".competition-event-card__title");
    return titleEl ? titleEl.textContent.trim() : "当前赛事";
  }

  function parseCount(text) {
    var match = (text || "").match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  function syncBodyScroll() {
    var materialsModal = document.getElementById("competition-materials-modal");
    var videosModal = document.getElementById("competition-videos-modal");
    var materialsOpen = materialsModal && !materialsModal.hidden;
    var videosOpen = videosModal && !videosModal.hidden;
    document.body.style.overflow = materialsOpen || videosOpen ? "hidden" : "";
  }

  /* —— 备赛资料 —— */
  var materialsModal = document.getElementById("competition-materials-modal");
  if (materialsModal) {
    var materialsSubtitleEl = materialsModal.querySelector("[data-competition-materials-subtitle]");
    var materialsListEl = materialsModal.querySelector("[data-competition-materials-list]");
    var materialsCloseBtn = materialsModal.querySelector(".competition-materials-modal__close");
    var materialsLastTrigger = null;

    var MATERIAL_POOL = [
      { name: "竞赛规程说明.pdf", ext: "PDF", size: "1.2 MB" },
      { name: "报名须知与流程.pdf", ext: "PDF", size: "860 KB" },
      { name: "赛题说明与评分标准.pdf", ext: "PDF", size: "2.4 MB" },
      { name: "练习图纸参考包.zip", ext: "ZIP", size: "18.6 MB" },
      { name: "软件安装与操作指引.pdf", ext: "PDF", size: "3.1 MB" },
      { name: "往届获奖作品赏析.pdf", ext: "PDF", size: "5.8 MB" },
    ];

    function downloadDemoFile(fileName, eventTitle) {
      var body = [
        "建筑云课 · 赛区专区备赛资料（演示）",
        "",
        "赛事：" + eventTitle,
        "文件：" + fileName,
        "",
        "正式环境此处将下载真实资料文件。",
      ].join("\n");
      var blob = new Blob([body], { type: "text/plain;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var link = document.createElement("a");
      link.href = url;
      link.download = fileName.replace(/\.(pdf|zip|dwg)$/i, ".txt");
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    }

    function renderMaterials(eventTitle, count) {
      materialsListEl.innerHTML = "";
      MATERIAL_POOL.slice(0, Math.min(count, MATERIAL_POOL.length)).forEach(function (file) {
        var item = document.createElement("li");
        item.className = "competition-materials-modal__item";

        var fileBlock = document.createElement("div");
        fileBlock.className = "competition-materials-modal__file";

        var icon = document.createElement("span");
        icon.className = "competition-materials-modal__file-icon";
        icon.setAttribute("aria-hidden", "true");

        var info = document.createElement("div");
        info.className = "competition-materials-modal__file-info";

        var name = document.createElement("p");
        name.className = "competition-materials-modal__file-name";
        name.textContent = file.name;

        var meta = document.createElement("p");
        meta.className = "competition-materials-modal__file-meta";
        meta.textContent = file.ext + " · " + file.size;

        info.appendChild(name);
        info.appendChild(meta);
        fileBlock.appendChild(icon);
        fileBlock.appendChild(info);

        var downloadBtn = document.createElement("button");
        downloadBtn.type = "button";
        downloadBtn.className = "btn btn--ghost competition-materials-modal__download";
        downloadBtn.textContent = "下载";
        downloadBtn.addEventListener("click", function () {
          downloadDemoFile(file.name, eventTitle);
        });

        item.appendChild(fileBlock);
        item.appendChild(downloadBtn);
        materialsListEl.appendChild(item);
      });
    }

    function openMaterialsModal(trigger) {
      materialsLastTrigger = trigger;
      var eventTitle = getEventTitle(trigger);
      var count = parseCount(trigger.textContent);
      materialsSubtitleEl.textContent = eventTitle + " · 共 " + count + " 份资料";
      renderMaterials(eventTitle, count);
      materialsModal.hidden = false;
      syncBodyScroll();
      if (materialsCloseBtn) materialsCloseBtn.focus();
    }

    function closeMaterialsModal() {
      materialsModal.hidden = true;
      syncBodyScroll();
      if (materialsLastTrigger) materialsLastTrigger.focus();
      materialsLastTrigger = null;
    }

    document.querySelectorAll("[data-competition-materials-open]").forEach(function (trigger) {
      trigger.addEventListener("click", function (event) {
        event.preventDefault();
        openMaterialsModal(trigger);
      });
    });

    materialsModal.querySelectorAll("[data-competition-materials-close]").forEach(function (node) {
      node.addEventListener("click", closeMaterialsModal);
    });

    materialsModal.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !materialsModal.hidden) closeMaterialsModal();
    });
  }

  /* —— 备赛视频 —— */
  var videosModal = document.getElementById("competition-videos-modal");
  if (videosModal) {
    var videosSubtitleEl = videosModal.querySelector("[data-competition-videos-subtitle]");
    var videosListEl = videosModal.querySelector("[data-competition-videos-list]");
    var videosPlayer = videosModal.querySelector("[data-competition-videos-player]");
    var videosPlayerTitle = videosModal.querySelector("[data-competition-videos-player-title]");
    var videosCloseBtn = videosModal.querySelector(".competition-videos-modal__close");
    var videosLastTrigger = null;
    var activeVideoIndex = -1;

    var DEMO_VIDEO_SRC =
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

    var VIDEO_POOL = [
      { title: "第1讲：赛事介绍与报名流程", duration: "12:30" },
      { title: "第2讲：赛题解读与评分要点", duration: "18:45" },
      { title: "第3讲：BIM 建模环境搭建", duration: "22:10" },
      { title: "第4讲：数维设计核心操作", duration: "26:05" },
      { title: "第5讲：协同建模与碰撞检查", duration: "19:40" },
      { title: "第6讲：成果输出与提交规范", duration: "15:20" },
      { title: "第7讲：往届优秀作品点评", duration: "24:55" },
      { title: "第8讲：备赛常见问题答疑", duration: "17:35" },
      { title: "第9讲：决赛答辩技巧分享", duration: "14:50" },
    ];

    function resetPlayer() {
      if (!videosPlayer) return;
      videosPlayer.pause();
      videosPlayer.removeAttribute("src");
      videosPlayer.load();
      if (videosPlayerTitle) videosPlayerTitle.textContent = "请选择视频播放";
    }

    function playVideo(index, items) {
      if (!videosPlayer || !VIDEO_POOL[index]) return;
      activeVideoIndex = index;

      items.forEach(function (item, i) {
        item.classList.toggle("is-active", i === index);
        item.setAttribute("aria-current", i === index ? "true" : "false");
      });

      var video = VIDEO_POOL[index];
      if (videosPlayerTitle) videosPlayerTitle.textContent = video.title;

      if (videosPlayer.getAttribute("src") !== DEMO_VIDEO_SRC) {
        videosPlayer.src = DEMO_VIDEO_SRC;
        videosPlayer.load();
      }

      var playPromise = videosPlayer.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {
          /* 浏览器可能拦截自动播放，用户可通过控件手动播放 */
        });
      }
    }

    function renderVideos(count) {
      videosListEl.innerHTML = "";
      activeVideoIndex = -1;
      resetPlayer();

      var items = [];
      VIDEO_POOL.slice(0, Math.min(count, VIDEO_POOL.length)).forEach(function (video, index) {
        var item = document.createElement("li");
        item.className = "competition-videos-modal__item";

        var button = document.createElement("button");
        button.type = "button";
        button.className = "competition-videos-modal__item-btn";

        var playIcon = document.createElement("span");
        playIcon.className = "competition-videos-modal__play-icon";
        playIcon.setAttribute("aria-hidden", "true");

        var info = document.createElement("span");
        info.className = "competition-videos-modal__item-info";

        var title = document.createElement("span");
        title.className = "competition-videos-modal__item-title";
        title.textContent = video.title;

        var duration = document.createElement("span");
        duration.className = "competition-videos-modal__item-duration";
        duration.textContent = video.duration;

        info.appendChild(title);
        info.appendChild(duration);
        button.appendChild(playIcon);
        button.appendChild(info);

        button.addEventListener("click", function () {
          playVideo(index, items);
        });

        item.appendChild(button);
        videosListEl.appendChild(item);
        items.push(item);
      });

      if (items.length) playVideo(0, items);
    }

    function openVideosModal(trigger) {
      videosLastTrigger = trigger;
      var eventTitle = getEventTitle(trigger);
      var count = parseCount(trigger.textContent);
      videosSubtitleEl.textContent = eventTitle + " · 共 " + count + " 讲";
      renderVideos(count);
      videosModal.hidden = false;
      syncBodyScroll();
      if (videosCloseBtn) videosCloseBtn.focus();
    }

    function closeVideosModal() {
      resetPlayer();
      videosModal.hidden = true;
      syncBodyScroll();
      if (videosLastTrigger) videosLastTrigger.focus();
      videosLastTrigger = null;
      activeVideoIndex = -1;
    }

    document.querySelectorAll("[data-competition-videos-open]").forEach(function (trigger) {
      trigger.addEventListener("click", function (event) {
        event.preventDefault();
        openVideosModal(trigger);
      });
    });

    videosModal.querySelectorAll("[data-competition-videos-close]").forEach(function (node) {
      node.addEventListener("click", closeVideosModal);
    });

    videosModal.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !videosModal.hidden) closeVideosModal();
    });
  }
})();
