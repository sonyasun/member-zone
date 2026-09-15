/**
 * 大咖直播卡片组件
 * 用法：
 *   <div class="live-grid" data-live-cards></div>
 *   <script src="js/components/live-cards.js" defer></script>
 *
 * 可选：页面自定义数据
 *   <script>
 *     window.LIVE_CARDS = [ { title, short, cover, avatar, teacher, tags, ... } ];
 *   </script>
 */
(function (global) {
  "use strict";

  var DEFAULT_CARDS = [
    {
      href: "#",
      cover: "assets/mastergo/843101fdc4bacf8c2b4c3a801434e8f8.png",
      title: "复工后劳务实名制系统常见问题",
      short: "劳务实名制秘籍大公开",
      teacher: "王芳",
      avatar: "assets/mastergo/9615d64b5927d957d73ea4dcb0208a4a.jpg",
      tags: [
        { label: "自研", warm: true },
        { label: "设计" },
        { label: "实用技能" }
      ],
      time: "6月30日 18:30",
      action: "预约直播"
    },
    {
      href: "#",
      cover: "assets/mastergo/469813e3912d582a71577bd26d44ed41.png",
      title: "2024新清单发布后造价4大影响-GTJ算量、清单定额",
      short: "专家带你探究2024清单影响",
      teacher: "田茂鑫",
      avatar: "assets/mastergo/1940c665359727fe9dee9c100b0ac24a.jpg",
      tags: [
        { label: "自研", warm: true },
        { label: "设计" },
        { label: "实用技能" }
      ],
      time: "6月30日 18:30",
      action: "已报名",
      actionClass: "is-done"
    },
    {
      href: "#",
      cover: "assets/mastergo/77b0a14897aa7c527a342c34017b9a16.png",
      title: "新清单对一造考试的影响-拿证秘籍大公开",
      short: "拿证秘籍大公开",
      teacher: "刘丹",
      avatar: "assets/mastergo/9615d64b5927d957d73ea4dcb0208a4a.jpg",
      tags: [
        { label: "自研", warm: true },
        { label: "设计" },
        { label: "实用技能" }
      ],
      live: true,
      action: "开始听课",
      actionClass: "is-soft"
    },
    {
      href: "#",
      cover: "assets/mastergo/abe2509dd9f6b1835e8b07a8b6e5ca02.png",
      title: "两小时听懂市政结算审计争议全解析-攻克管网造价难题",
      short: "攻克管网造价难题",
      teacher: "王海",
      avatar: "assets/mastergo/69dd79abc0381a30a09a3e99b88cb6f8.jpg",
      tags: [
        { label: "自研", warm: true },
        { label: "设计" },
        { label: "实用技能" }
      ],
      limit: "限时观看：2025-0-31",
      time: "2月19日14:00",
      action: "观看回放",
      actionClass: "is-outline"
    }
  ];

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function renderTags(tags) {
    if (!tags || !tags.length) return "";
    return (
      '<div class="live-card__tags">' +
      tags
        .map(function (tag) {
          var label = typeof tag === "string" ? tag : tag.label;
          var warm = typeof tag === "object" && tag.warm;
          return (
            '<span class="tag' +
            (warm ? " tag--warm" : "") +
            '">' +
            escapeHtml(label) +
            "</span>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function renderStatus(card) {
    if (card.live) {
      return (
        '<span class="live-card__live">' +
        '<i class="live-card__live-dot" aria-hidden="true"></i>直播中…</span>'
      );
    }
    return (
      '<span class="live-card__time">' + escapeHtml(card.time || "") + "</span>"
    );
  }

  function renderCard(card) {
    var actionClass = card.actionClass ? " " + card.actionClass : "";
    var limit = card.limit
      ? '<span class="live-card__limit">' + escapeHtml(card.limit) + "</span>"
      : "";

    return (
      '<a class="live-card" href="' +
      escapeHtml(card.href || "#") +
      '">' +
      '<div class="live-card__cover" style="background-image:url(\'' +
      escapeHtml(card.cover) +
      "')\">" +
      limit +
      "</div>" +
      '<div class="live-card__body">' +
      '<h3 class="live-card__title">' +
      escapeHtml(card.title) +
      "</h3>" +
      renderTags(card.tags) +
      '<div class="live-card__author">' +
      '<span class="live-card__author-main">' +
      '<img class="live-card__avatar" src="' +
      escapeHtml(card.avatar) +
      '" width="24" height="24" alt="" />' +
      "<span>" +
      escapeHtml(card.teacher) +
      "</span>" +
      "</span>" +
      '<span class="live-card__short">' +
      escapeHtml(card.short) +
      "</span>" +
      "</div>" +
      '<div class="live-card__foot">' +
      renderStatus(card) +
      '<span class="live-card__action' +
      actionClass +
      '">' +
      escapeHtml(card.action) +
      "</span>" +
      "</div>" +
      "</div>" +
      "</a>"
    );
  }

  function renderLiveCards(container, cards) {
    if (!container) return;
    var list = cards && cards.length ? cards : DEFAULT_CARDS;
    container.innerHTML = list.map(renderCard).join("");
  }

  function mountAll(root) {
    var scope = root || document;
    var nodes = scope.querySelectorAll("[data-live-cards]");
    var data = global.LIVE_CARDS || DEFAULT_CARDS;
    nodes.forEach(function (node) {
      renderLiveCards(node, data);
    });
  }

  global.LiveCards = {
    defaults: DEFAULT_CARDS,
    render: renderLiveCards,
    mount: mountAll
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      mountAll();
    });
  } else {
    mountAll();
  }
})(window);
