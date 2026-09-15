---
name: design-handoff
description: >-
  Generates design-to-frontend handoff documents for member-zone (建筑云课).
  Use when the user is a designer delivering specs to frontend, asks how to hand
  off designs, needs a delivery checklist, token table, asset list, or
  implementation brief from MasterGo. Also use when implementing UI from a
  designer's spec in this repo.
---

# 设计稿 → 前端交付（member-zone）

帮助设计师整理可执行的交付物，或帮助前端/Agent 按交付规范落地实现。

## 触发场景

- 用户说：交付前端、设计说明、handoff、标注、切图清单、Token 表
- 用户是设计师，要把 MasterGo 方案交给开发
- 前端收到设计稿，需要对照本仓库结构实现

## 交付四件套（缺一不可）

| # | 交付物 | 说明 |
|---|--------|------|
| 1 | **MasterGo 链接** | 可查看、可评论；标注 Frame 名称 |
| 2 | **设计说明** | 范围、状态、文案、与现网差异 |
| 3 | **Token / 标注表** | 色值、字号、圆角 → 对应 CSS 变量 |
| 4 | **切图清单** | 文件名、尺寸、用途；放入 `assets/` |

完整模板见 [templates.md](templates.md)。

## 生成交付文档 workflow

1. **确认范围**：涉及哪些页面（见下表），本次做 / 不做什么
2. **列出状态**：每个组件的所有 UI 状态（idle / active / completed / 空态 / 错误等）
3. **标注差异**：同一组件在不同页面若视觉不同，必须分别说明（如 profile vs member）
4. **填 Token 表**：优先映射到已有变量；新值标注「需新增 Token」
5. **填切图清单**：区分「必须切图」vs「可用 CSS 实现」
6. **写验收标准**：断点、演示 URL、query 参数（如 `?learnTaskDaysLeft=5`）

输出时使用 `templates.md` 中的「设计说明」模板，填完整后可直接发给前端。

## 本仓库页面 ↔ 文件映射

| 页面 | HTML | 页面 CSS |
|------|------|----------|
| 首页 | `index.html` | `css/src/14-page-home.css` |
| 认证 | `cert.html` | `css/src/15-page-cert.css` |
| 课程详情 | `course.html` | `css/src/17-page-course.css` |
| 学习页 | `course-learn.html` | `css/src/29-page-course-learn.css` |
| 个人中心 | `profile.html` | `css/src/20-page-profile.css` |
| 会员中心 | `member.html` | `css/src/25-page-member.css` |
| 订单 / 券 / 专题 / 训练营 | 对应 `*.html` | `css/src/18–23*.css` |

公共头尾、登录卡：`partials/`（改后跑 `npm run shell`）。

## 设计 Token（设计师只需填表，前端写进代码）

| 类型 | 文件 | 设计师关注 |
|------|------|------------|
| 全局色 / 字 / 间距 | `css/src/00-tokens-and-base.css` | `--color-primary`、`--color-bg-01` 等 |
| 7 天任务共享 | `css/src/01-learn-task-shared.css` | `--lt-*` 系列 |
| 页面差异 | `20-page-profile.css` / `25-page-member.css` | 布局、间距差异 |

**规则**：新代码禁止硬编码 `#139686` 等主色；改视觉优先改 Token。详见 `.cursor/rules/design-tokens.mdc`。

### 7 天任务组件约定

| 场景 | 类名 | 设计注意 |
|------|------|----------|
| 个人中心 | `.learn-task` | 宽版；倒计时为 **pill**，在 idle 文案区 |
| 会员侧栏 | `.member-lt` | ~276px；倒计时为 **course 容器角标** |

共享样式在 `01-learn-task-shared.css`；**两处 intentionally 不同** 的元素必须在设计说明里写清。

状态属性：`data-state="idle" | "active" | "completed"`。

## 响应式断点（设计稿至少覆盖桌面 + 800 以下）

| 断点 | Token | 典型变化 |
|------|-------|----------|
| 1100px | `--bp-layout` | 主栏 + 侧栏折叠 |
| 800px | `--bp-tablet` | 内容堆叠 |
| 560px | `--bp-narrow` | 窄屏 |

新设计勿使用 600 / 640 / 900 / 960px。

## 切图与 MasterGo 资源

1. 导出到 `assets/` 或 `assets/mastergo/`
2. **禁止**代码里留 `image-resource.mastergo.com` 外链
3. `assets/mastergo/` 文件名用 URL hash 或语义名（如 `learn-task-icon.png`）
4. 发布前可跑 `./localize-mastergo-images.sh`

设计师交付切图时附清单（模板见 `templates.md`）。

## 按钮类名（新 HTML）

- 推荐：`.btn.btn--primary`、`.btn.btn--ghost`
- 勿在新页面使用遗留 `.btn-primary`

## 前端 / Agent 实现 checklist

收到设计交付后：

```
- [ ] 读设计说明中的范围与「不做」项
- [ ] 对照 MasterGo 与状态列表，缺状态则向设计确认
- [ ] 改 `css/src/*`，不手改 `css/styles.css`
- [ ] 颜色走 Token；7 天任务共享规则放 `01-learn-task-shared.css`
- [ ] 切图放 `assets/`，无 MasterGo 外链
- [ ] 跑 `npm run css`
- [ ] 自测 1100 / 800 / 560 断点
- [ ] 用户要求发布时跑 `./deploy-cloudflare.sh`
- [ ] 预览：https://member-zone-6d9.pages.dev/
```

## 设计师不必交付的内容

以下由前端负责，设计说明里可写「沿用现网结构」：

- HTML 结构、BEM 类名
- JS 状态切换逻辑
- `npm run css` / deploy 脚本

## 协作建议

1. **15 分钟设计评审**：过状态、断点、profile vs member 差异
2. **改稿走文档**：颜色变更 → 更新 Token 表；布局变更 → 标 MasterGo Frame + 差异说明
3. **验收对预览**：线上预览或本地 build 后逐状态截图对比

## 附加资源

- 可复制模板：[templates.md](templates.md)
- **前端 onboarding（1 页）**：[docs/frontend-handoff-guide.md](../../../docs/frontend-handoff-guide.md)
- **设计 → 代码完整 SOP**：[design-to-code-workflow/SKILL.md](../../../.cursor/skills/design-to-code-workflow/SKILL.md)
- **示例：7 天学习任务完整交付**：[examples/7-day-learn-task-handoff.md](examples/7-day-learn-task-handoff.md)
- Token 约定：`.cursor/rules/design-tokens.mdc`
- 图片本地化：`.cursor/rules/mastergo-images.mdc`
- 发布流程：`.cursor/rules/publish.mdc`
