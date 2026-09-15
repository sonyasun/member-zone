(function () {
  "use strict";

  var pad = function (n) {
    return n < 10 ? "0" + n : String(n);
  };

  var rankRoot = document.querySelector("[data-ai-exam-rank]");
  if (!rankRoot) return;

  var tabsEl = rankRoot.querySelector("[data-ai-exam-rank-tabs]");
  var panelsEl = rankRoot.querySelector("[data-ai-exam-rank-panels]");
  if (!tabsEl || !panelsEl) return;

  var SUBJECTS = [
    {
      id: "mgmt",
      label: "工程管理",
      total: 128,
      rows: [
        { rank: 1, name: "李希希", avatar: "assets/rank-avatar-01.png", score: 96, times: 8, at: "9月18日 14:32" },
        { rank: 2, name: "王大宝", avatar: "assets/rank-avatar-02.png", score: 94, times: 6, at: "9月17日 09:15" },
        { rank: 3, name: "李虹猫", avatar: "assets/rank-avatar-03.png", score: 92, times: 5, at: "9月16日 20:48" },
        { rank: 4, name: "刘晓梅", avatar: "assets/rank-avatar-04.png", score: 89, times: 4, at: "9月15日 11:06" },
        { rank: 11, name: "张**", avatar: "assets/rank-avatar-05.png", score: 85, times: 3, at: "9月14日 16:22" },
        { rank: 18, name: "陈**", avatar: "assets/rank-avatar-06.png", score: 82, times: 2, at: "9月13日 08:40" },
        { rank: 35, name: "赵**", avatar: "assets/rank-avatar-07.png", score: 68, times: 2, at: "9月12日 19:55" },
        { rank: 42, name: "周**", avatar: "assets/rank-avatar-08.png", score: 61, times: 1, at: "9月11日 13:18" },
      ],
    },
    {
      id: "price",
      label: "工程计价",
      total: 156,
      rows: [
        { rank: 1, name: "田茂鑫", avatar: "assets/rank-avatar-02.png", score: 98, times: 7, at: "9月18日 10:20" },
        { rank: 2, name: "郭红领", avatar: "assets/rank-avatar-01.png", score: 95, times: 9, at: "9月17日 15:44" },
        { rank: 3, name: "王天来", avatar: "assets/rank-avatar-03.png", score: 91, times: 4, at: "9月16日 08:12" },
        { rank: 5, name: "孙**", avatar: "assets/rank-avatar-04.png", score: 88, times: 3, at: "9月15日 21:30" },
        { rank: 12, name: "吴**", avatar: "assets/rank-avatar-05.png", score: 84, times: 2, at: "9月14日 07:58" },
        { rank: 22, name: "郑**", avatar: "assets/rank-avatar-06.png", score: 79, times: 2, at: "9月13日 18:06" },
        { rank: 38, name: "钱**", avatar: "assets/rank-avatar-07.png", score: 63, times: 1, at: "9月12日 12:33" },
      ],
    },
    {
      id: "civil",
      label: "土建计量",
      total: 142,
      rows: [
        { rank: 1, name: "王芳", avatar: "assets/rank-avatar-03.png", score: 97, times: 6, at: "9月18日 16:05" },
        { rank: 2, name: "李希希", avatar: "assets/rank-avatar-01.png", score: 93, times: 5, at: "9月17日 11:27" },
        { rank: 3, name: "刘**", avatar: "assets/rank-avatar-04.png", score: 90, times: 4, at: "9月16日 14:19" },
        { rank: 8, name: "黄**", avatar: "assets/rank-avatar-05.png", score: 86, times: 3, at: "9月15日 09:41" },
        { rank: 15, name: "林**", avatar: "assets/rank-avatar-06.png", score: 81, times: 2, at: "9月14日 22:08" },
        { rank: 28, name: "何**", avatar: "assets/rank-avatar-07.png", score: 74, times: 2, at: "9月13日 10:52" },
        { rank: 51, name: "马**", avatar: "assets/rank-avatar-08.png", score: 60, times: 1, at: "9月12日 17:16" },
      ],
    },
    {
      id: "install",
      label: "安装计量",
      total: 97,
      rows: [
        { rank: 1, name: "王大宝", avatar: "assets/rank-avatar-02.png", score: 95, times: 5, at: "9月18日 08:36" },
        { rank: 2, name: "赵**", avatar: "assets/rank-avatar-05.png", score: 92, times: 4, at: "9月17日 19:14" },
        { rank: 3, name: "杨**", avatar: "assets/rank-avatar-06.png", score: 88, times: 3, at: "9月16日 13:02" },
        { rank: 6, name: "徐**", avatar: "assets/rank-avatar-07.png", score: 85, times: 3, at: "9月15日 17:45" },
        { rank: 14, name: "胡**", avatar: "assets/rank-avatar-08.png", score: 80, times: 2, at: "9月14日 06:28" },
        { rank: 25, name: "高**", avatar: "assets/rank-avatar-09.png", score: 76, times: 2, at: "9月13日 15:37" },
        { rank: 44, name: "唐**", avatar: "assets/rank-avatar-10.png", score: 62, times: 1, at: "9月11日 20:49" },
      ],
    },
  ];

  var rewardMeta = function (rank, score) {
    if (rank <= 10) {
      return { label: "考霸先锋奖", className: "ai-exam-rank-item__reward--gold" };
    }
    if (rank <= 30) {
      return { label: "实力悍将奖", className: "ai-exam-rank-item__reward--silver" };
    }
    if (score >= 60) {
      return { label: "潜力黑马奖", className: "ai-exam-rank-item__reward--green" };
    }
    return { label: "—", className: "ai-exam-rank-item__reward--empty" };
  };

  var renderPodiumItem = function (row) {
    var reward = rewardMeta(row.rank, row.score);
    return (
      '<article class="ai-exam-rank-podium__item ai-exam-rank-podium__item--' +
      row.rank +
      '">' +
      '<span class="ai-exam-rank-podium__medal">' +
      pad(row.rank) +
      "</span>" +
      '<div class="ai-exam-rank-podium__avatar-wrap">' +
      '<img class="ai-exam-rank-podium__avatar" src="' +
      row.avatar +
      '" width="48" height="48" alt="" loading="lazy" />' +
      "</div>" +
      '<p class="ai-exam-rank-podium__name">' +
      row.name +
      "</p>" +
      '<p class="ai-exam-rank-podium__score"><b>' +
      row.score +
      '</b><i>分</i></p>' +
      '<p class="ai-exam-rank-podium__meta">' +
      row.times +
      " 次 · " +
      row.at +
      "</p>" +
      '<span class="ai-exam-rank-podium__reward ' +
      reward.className +
      '">' +
      reward.label +
      "</span>" +
      '<span class="ai-exam-rank-podium__pedestal" aria-hidden="true"></span></article>'
    );
  };

  var renderTableRow = function (row) {
    var reward = rewardMeta(row.rank, row.score);
    return (
      '<li class="ai-exam-rank-table__row">' +
      '<span class="ai-exam-rank-table__rank">' +
      pad(row.rank) +
      "</span>" +
      '<div class="ai-exam-rank-table__user">' +
      '<img class="ai-exam-rank-table__avatar" src="' +
      row.avatar +
      '" width="32" height="32" alt="" loading="lazy" />' +
      '<span class="ai-exam-rank-table__name">' +
      row.name +
      "</span></div>" +
      '<div class="ai-exam-rank-table__score"><b>' +
      row.score +
      '</b><i>分</i></div>' +
      '<div class="ai-exam-rank-table__times">' +
      row.times +
      '<i>次</i></div>' +
      '<time class="ai-exam-rank-table__time">' +
      row.at +
      "</time>" +
      '<span class="ai-exam-rank-table__reward ' +
      reward.className +
      '">' +
      reward.label +
      "</span></li>"
    );
  };

  var renderPanel = function (subject) {
    var topByRank = {};
    var rest = [];

    subject.rows.forEach(function (row) {
      if (row.rank <= 3) {
        topByRank[row.rank] = row;
      } else {
        rest.push(row);
      }
    });

    var podiumOrder = [2, 1, 3]
      .map(function (rank) {
        return topByRank[rank];
      })
      .filter(Boolean);

    var podiumHtml = podiumOrder.map(renderPodiumItem).join("");
    var tableHtml = rest.map(renderTableRow).join("");

    return (
      (podiumHtml
        ? '<div class="ai-exam-rank-podium">' + podiumHtml + "</div>"
        : "") +
      (tableHtml
        ? '<div class="ai-exam-rank-table">' +
          '<div class="ai-exam-rank-table__head" aria-hidden="true">' +
          '<span class="ai-exam-rank-table__col ai-exam-rank-table__col--rank">名次</span>' +
          '<span class="ai-exam-rank-table__col ai-exam-rank-table__col--user">考生</span>' +
          '<span class="ai-exam-rank-table__col ai-exam-rank-table__col--score">最高分</span>' +
          '<span class="ai-exam-rank-table__col ai-exam-rank-table__col--times">模考次数</span>' +
          '<span class="ai-exam-rank-table__col ai-exam-rank-table__col--time">达成时间</span>' +
          '<span class="ai-exam-rank-table__col ai-exam-rank-table__col--reward">奖励</span>' +
          "</div>" +
          '<ol class="ai-exam-rank-table__body">' +
          tableHtml +
          "</ol>" +
          '<p class="ai-exam-rank-table__note">本科目实时榜：取历次模考最高分排名 · 不限次数，每次考完分享即可再考 · 9.24 24:00 冻结</p></div>'
        : "")
    );
  };

  var activeId = SUBJECTS[0].id;

  SUBJECTS.forEach(function (subject, index) {
    var tabId = "ai-exam-rank-tab-" + subject.id;
    var panelId = "ai-exam-rank-panel-" + subject.id;
    var isActive = index === 0;

    var tab = document.createElement("button");
    tab.type = "button";
    tab.className = "ai-exam-rank-board__tab" + (isActive ? " is-active" : "");
    tab.id = tabId;
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-selected", isActive ? "true" : "false");
    tab.setAttribute("aria-controls", panelId);
    tab.setAttribute("data-ai-exam-rank-tab", subject.id);
    tab.textContent = subject.label;
    tabsEl.appendChild(tab);

    var panel = document.createElement("div");
    panel.className = "ai-exam-rank-panel";
    panel.id = panelId;
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", tabId);
    panel.setAttribute("data-ai-exam-rank-panel", subject.id);
    panel.hidden = !isActive;
    panel.innerHTML = renderPanel(subject);
    panelsEl.appendChild(panel);
  });

  tabsEl.addEventListener("click", function (event) {
    var tab = event.target.closest("[data-ai-exam-rank-tab]");
    if (!tab || !tabsEl.contains(tab)) return;

    var subjectId = tab.getAttribute("data-ai-exam-rank-tab");
    if (!subjectId || subjectId === activeId) return;

    activeId = subjectId;

    tabsEl.querySelectorAll("[data-ai-exam-rank-tab]").forEach(function (item) {
      var on = item.getAttribute("data-ai-exam-rank-tab") === subjectId;
      item.classList.toggle("is-active", on);
      item.setAttribute("aria-selected", on ? "true" : "false");
    });

    panelsEl.querySelectorAll("[data-ai-exam-rank-panel]").forEach(function (panel) {
      panel.hidden = panel.getAttribute("data-ai-exam-rank-panel") !== subjectId;
    });
  });
})();
