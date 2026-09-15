# 前端交接指南

UI 已在仓库落地。前端接数据、接逻辑、做 Review。视觉规范见 [design-system.md](./design-system.md)。

---

## 交付看三样

| # | 内容 | 位置 |
|---|------|------|
| 1 | 交接消息 | 预览链接 + 分支 + 前端待办 |
| 2 | 功能 handoff | `docs/archive/design-handoff/examples/*-handoff.md` |
| 3 | 预览 | https://member-zone-6d9.pages.dev/ |

handoff 必看：范围（做/不做）· 状态表 · 页面差异 · Token 变更 · 演示参数 · 验收标准。

---

## 本地

```bash
npm run css      # 改过 css/src
npm run shell    # 改过 partials/
open profile.html
```

只改 `css/src/*`，禁止手改 `css/styles.css` / `css/styles-core.css`。

---

## 职责

| 已交付 | 前端做 |
|--------|--------|
| HTML / BEM / 静态文案 | 接 API，换演示数据 |
| Token + 组件样式 | Review，不重写 UI |
| `assets/` 切图 | 路径、体积、按需 lazy-load |
| JS 演示态（query） | 换成接口 / 状态机 |
| handoff「本次不做」 | 不要扩大范围 |

视觉争议以 **预览 URL + handoff** 为准。

---

## 演示参数 → 接口（7 天任务）

| 演示参数 | 文件 | 接入 |
|----------|------|------|
| `?learnTask=active` | `js/learn-task.js` | 任务状态 |
| `?learnTaskDaysLeft=5` | 同上 | `expiresAt` → 剩余天数 |
| `?learnTaskDone=3` | 同上 | 已完成天数 |
| `?memberLt=*` | `js/member-learn-task.js` | 同上，会员侧栏 |

到期横幅：active、未完成 7 天、剩余 ≤ 7 天。  
可预留：`data-expires-at`、`data-learn-task-required-days="7"`。

---

## Review

按 [design-system.md §8](./design-system.md) 检查，并确认 handoff「本次不做」未被实现。

发布：`./deploy-cloudflare.sh` → https://member-zone-6d9.pages.dev/
