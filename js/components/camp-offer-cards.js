/**
 * 训练营横向课程卡组件（高度以 420×236 / 16:9 封面为基准）
 *
 * 用法：
 *   <div data-camp-offer-list></div>
 *   <script>
 *     window.CAMP_OFFER_SECTIONS = [
 *       {
 *         id: "install",
 *         title: "安装",
 *         cards: [{
 *           title, cover, href, buyHref, consultHref?,
 *           region, form, level, validity, duration,
 *           price, origin, countdownEnd?
 *         }]
 *       }
 *     ];
 *   </script>
 *   <script src="js/components/camp-offer-cards.js" defer></script>
 *   <script src="js/course-countdown.js" defer></script>
 */
(function (global) {
  "use strict";

  var FIRE_ICON =
    '<svg class="camp-offer-section__icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
    '<path d="M12 23a7.5 7.5 0 0 1-5.138-12.963C8.204 8.774 11.5 6.5 11 1.5c6 4 9 8 3 14 1 0 2.5 0 5-2.5.5 5-2.786 8.5-7 10.5z"/>' +
    "</svg>";

  var DEFAULT_SECTIONS = [
    {
      id: "install",
      title: "安装",
      cards: [
        {
          title: "安装造价实战训练营——从入门到提升",
          cover: "assets/course-pack-cover.png",
          href: "course-pack.html",
          buyHref: "order-pack.html",
          region: "全国",
          form: "录播",
          level: "初阶/中阶学习",
          validity: "730天",
          duration: "181小时 3分钟",
          price: "1699.00",
          origin: "3299.00"
        }
      ]
    },
    {
      id: "advanced",
      title: "进阶",
      cards: [
        {
          title: "土建造价进阶训练营——从入门到提升",
          cover: "assets/mastergo/8e22f52296613490c0de02cdd449cce6.png",
          href: "course-pack.html",
          buyHref: "order-pack.html",
          region: "全国",
          form: "录播",
          level: "初阶/中阶学习",
          validity: "730天",
          duration: "181小时 3分钟",
          price: "1699.00",
          origin: "3299.00"
        }
      ]
    },
    {
      id: "exam",
      title: "考证",
      cards: [
        {
          title: "二级建造师全科通关营——系统备考不过退费",
          cover: "assets/mastergo/e962723d970aceb5b867523ac72aae77.png",
          href: "course-pack.html",
          buyHref: "order-pack.html",
          region: "全国",
          form: "直播+录播",
          level: "中阶学习",
          validity: "365天",
          duration: "120小时",
          price: "890.00",
          origin: "1850.00"
        }
      ]
    }
  ];

  function escapeHtml(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function renderMetaRow(label, value) {
    return (
      "<div><dt>" +
      escapeHtml(label) +
      "</dt><dd>" +
      escapeHtml(value) +
      "</dd></div>"
    );
  }

  function renderCard(card) {
    var href = escapeHtml(card.href || "course-pack.html");
    var buyHref = escapeHtml(card.buyHref || "order-pack.html");
    var consultHref = card.consultHref ? escapeHtml(card.consultHref) : "";
    var title = escapeHtml(card.title || "");
    var cover = escapeHtml(card.cover || "");
    var countdownAttr = card.countdownEnd
      ? ' data-countdown-end="' + escapeHtml(card.countdownEnd) + '"'
      : ' data-countdown-end=""';
    var aria = escapeHtml(card.ariaLabel || card.title || "训练营");

    var promoLabel =
      card.promo === false
        ? ""
        : escapeHtml(card.promo || "限时优惠");
    var promoHtml = promoLabel
      ? '<span class="course-card__promo">' + promoLabel + "</span>"
      : "";

    var consultHtml = consultHref
      ? '<a class="camp-offer-card__consult" href="' + consultHref + '">在线咨询</a>'
      : '<button type="button" class="camp-offer-card__consult">在线咨询</button>';

    return (
      '<article class="camp-offer-card">' +
      '<a class="camp-offer-card__cover" href="' +
      href +
      '" aria-label="' +
      aria +
      '">' +
      '<img src="' +
      cover +
      '" width="420" height="236" alt="" loading="lazy" />' +
      promoHtml +
      "</a>" +
      '<div class="camp-offer-card__body">' +
      '<div class="camp-offer-card__top">' +
      '<h3 class="camp-offer-card__title"><a href="' +
      href +
      '">' +
      title +
      "</a></h3>" +
      '<div class="camp-offer-card__countdown"' +
      countdownAttr +
      ' aria-label="限时优惠倒计时">' +
      '<span class="camp-offer-card__countdown-label" data-countdown-label>距结束:</span>' +
      '<span class="camp-offer-card__countdown-time">' +
      '<b data-unit="h">00</b><i>:</i>' +
      '<b data-unit="m">00</b><i>:</i>' +
      '<b data-unit="s">00</b>' +
      "</span></div></div>" +
      '<dl class="camp-offer-card__meta">' +
      '<div class="camp-offer-card__meta-col">' +
      renderMetaRow("适用地区:", card.region || "全国") +
      renderMetaRow("学习形式:", card.form || "录播") +
      "</div>" +
      '<div class="camp-offer-card__meta-col">' +
      renderMetaRow("课程难度:", card.level || "") +
      renderMetaRow("总有效期:", card.validity || "") +
      "</div>" +
      '<div class="camp-offer-card__meta-col">' +
      renderMetaRow("课程时长:", card.duration || "") +
      '<div class="camp-offer-card__meta-spacer" aria-hidden="true"></div>' +
      "</div></dl>" +
      '<div class="camp-offer-card__foot">' +
      '<div class="camp-offer-card__price">' +
      '<span class="camp-offer-card__sale-label">优惠价格:</span>' +
      '<span class="camp-offer-card__sale"><i>¥</i>' +
      escapeHtml(card.price || "") +
      "</span>" +
      '<span class="camp-offer-card__origin-wrap">' +
      '<span class="camp-offer-card__origin-label">价值:</span>' +
      '<del class="camp-offer-card__origin">¥' +
      escapeHtml(card.origin || "") +
      "</del></span></div>" +
      '<div class="camp-offer-card__actions">' +
      '<a class="camp-offer-card__buy" href="' +
      buyHref +
      '">立即购买</a>' +
      consultHtml +
      "</div></div></div></article>"
    );
  }

  function renderSection(section) {
    var id = escapeHtml(section.id || "camp");
    var titleId = "camp-offer-" + id;
    var cards = Array.isArray(section.cards) ? section.cards : [];
    return (
      '<section class="camp-offer-section" aria-labelledby="' +
      titleId +
      '">' +
      '<h2 class="camp-offer-section__title" id="' +
      titleId +
      '">' +
      FIRE_ICON +
      escapeHtml(section.title || "") +
      "</h2>" +
      '<div class="camp-offer-section__list">' +
      cards.map(renderCard).join("") +
      "</div></section>"
    );
  }

  function mount(root, sections) {
    if (!root) return;
    root.innerHTML = (sections || []).map(renderSection).join("");
  }

  function init() {
    var roots = document.querySelectorAll("[data-camp-offer-list]");
    if (!roots.length) return;
    var sections =
      global.CAMP_OFFER_SECTIONS && global.CAMP_OFFER_SECTIONS.length
        ? global.CAMP_OFFER_SECTIONS
        : DEFAULT_SECTIONS;
    Array.prototype.forEach.call(roots, function (root) {
      mount(root, sections);
    });
  }

  // 与 live-cards 一致：defer 时文档已解析，直接挂载，供后续 countdown 扫描
  init();

  global.CampOfferCards = {
    render: mount,
    defaults: DEFAULT_SECTIONS,
    init: init
  };
})(window);
