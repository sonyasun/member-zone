---
name: design-to-code-workflow
description: >-
  End-to-end design-to-code workflow for member-zone: designer sets style in
  MasterGo, Agent extracts tokens/specs into css/src, implements new features
  per existing conventions, builds CSS, and produces handoff docs for frontend.
  Use when the user wants to implement a new UI feature from design, follow the
  team design SOP, generate pages from design specs, or says 按设计规范做/设计转代码.
---

# 设计 → 代码工作流（member-zone）

设计师在 MasterGo 定风格与典型页 → Agent 规范入库 → 按规范生成功能 UI → 代码库即交付。

需要给前端写**交付文档**时，参考 [docs/archive/design-handoff/SKILL.md](../../../docs/archive/design-handoff/SKILL.md)（已归档，非日常必需）。

## 触发场景

- 「按现有设计规范做 XX 功能」
- 「从 MasterGo 实现这个页面 / 组件」
- 设计师描述新功能，要求直接进本地代码库
- 整理 / 更新整体设计规范（Token、组件层）

## 团队分工

| 角色 | 负责 |
|------|------|
| 设计师 | 风格、典型页、**全状态**、文案、MasterGo、视觉验收 |
| Agent | 规范抽取、HTML/CSS/JS、Token、切图本地化 |
| 前端 | 接口、复杂交互、A11y、性能、Code Review |

---

## Phase 0：首次 / 大改版 — 建立规范库

设计师已在 MasterGo 输出整体风格 + 若干典型界面时执行：

```
规范入库 checklist：
- [ ] 读 MasterGo DSL / 设计稿，抽取色、字、间距、圆角、阴影
- [ ] 写入 css/src/00-tokens-and-base.css（:root），勿散落 hex
- [ ] 可复用组件 → css/src/01-*.css 或对应组件文件（如 02-button.css）
- [ ] 页面独有布局 → css/src/NN-page-*.css
- [ ] 断点只用 1100 / 800 / 560（--bp-layout / --bp-tablet / --bp-narrow）
- [ ] 更新 .cursor/rules/design-tokens.mdc（若有新约定）
- [ ] npm run css
```

**三层结构（强制）**

| 层 | 文件 | 放什么 |
|----|------|--------|
| Token | `00-tokens-and-base.css` | 色、字、间距、阴影、断点、`--lt-*` 等 |
| 组件 | `01-learn-task-shared.css` 等 | 跨页复用的 BEM 块 |
| 页面 | `20-page-profile.css` 等 | 仅布局与页面差异 |

---

## Phase 1：新功能 — 实现前（先读再写）

**必读文件（按顺序）**

1. `css/src/00-tokens-and-base.css`
2. 相关 page CSS（见页面映射表）
3. 若涉 7 天任务或类似双场景： `css/src/01-learn-task-shared.css`
4. `.cursor/rules/design-tokens.mdc`
5. `.cursor/rules/mastergo-images.mdc`
6. 同功能已有 HTML（如 `profile.html` / `member.html`）— 对齐结构与类名

**向设计师确认（缺则标注假设）**

- 涉及页面、本次做 / 不做
- 所有 UI 状态（idle / active / empty / error / loading…）
- 同组件多页面差异（如 profile vs member）
- 文案是否定稿
- MasterGo 链接或 section 索引

---

## Phase 2：新功能 — 实现

```
实现 checklist：
- [ ] HTML：沿用 partials/ 壳层（site-header / footer）；新块用 BEM
- [ ] 新按钮：.btn.btn--primary / .btn.btn--ghost（勿新增 .btn-primary）
- [ ] CSS：只改 css/src/*；可共享的规则不进 page CSS
- [ ] 颜色/渐变：var(--color-primary)、var(--lt-*) 等，禁止硬编码 hex
- [ ] 图片：下载到 assets/ 或 assets/mastergo/，禁止 MasterGo CDN 外链
- [ ] JS：若仅 UI 演示，放 js/ 并注释演示 query 参数
- [ ] 响应式：1100 / 800 / 560；新代码勿用 600/640/900/960
- [ ] 改 partials/ → npm run shell
- [ ] 改 css/src/ → npm run css
- [ ] 自检：rg 'image-resource.mastergo.com|mastergo.com/' 改动文件无命中
```

### MasterGo 还原规范

**字体**

- 「苹方 / PingFang SC」→ `var(--font-family-base)`；数字 → `var(--font-family-num)`
- 字号、行高、字重用 CSS 变量或 `rem`（基准 16px）；响应式用 `clamp()` 或媒体查询

**布局**

- Auto Layout → Flexbox / Grid（`display`、`gap`、`align-items`、`justify-content`）
- 绝对定位仅用于装饰层；主体结构用流式布局

**组件变体**

- 同一组件多变体（Default / Hover / Active / Disabled）→ **一份 DOM + CSS 伪类**，不复制节点
- hover / active 不改变宽高、padding、border-width（可用 transparent 占位）
- 必须包含 `:focus-visible` 焦点环

**过渡**

- 交互态变化加 `transition`（0.15s–0.25s，`ease` / `ease-out`）
- `:hover` 只用 transition，不用 animation

**代码整洁**

- 禁止无用 wrapper、重复 inline style；类名语义化（BEM）
- DSL 先解析 `styles` / `tokens`，映射 CSS 变量后再写样式；缺失 token 时提示设计师补规范，勿瞎编数值
- 文案必须来自 DSL `allTexts` / `rowTexts`，禁止 hallucinate

### 页面 ↔ 文件映射

| 页面 | HTML | CSS |
|------|------|-----|
| 首页 | index.html | 14-page-home.css |
| 认证 | cert.html | 15-page-cert.css |
| 人才计划 | talent-plan.html | 30-page-talent-plan.css |
| 课程详情 | course.html | 17-page-course.css |
| 学习页 | course-learn.html | 29-page-course-learn.css |
| 个人中心 | profile.html | 20-page-profile.css |
| 会员中心 | member.html | 25-page-member.css |
| 订单/券/专题/营 | 对应 html | 18–23-page-*.css |

新页面：新增 `css/src/NN-page-*.css` 并写入 `css/src/manifest.txt`（及 `manifest-pages.txt`）。

### MasterGo MCP 实现顺序

1. `mcp__getDesignSections` 拿全页 section 列表
2. 分批 fetch 每个 sectionIndex 的 DSL
3. 生成 HTML/CSS，图标用 `@@SVG:{svgShortKey}@@` 占位
4. `mcp__applyDesign` 替换 SVG 并写文件（必须提供 outDir）
5. 图片 URL → 本地化到 `assets/mastergo/`（见 `mastergo-images.mdc`）

---

## Phase 3：交付

1. 回复中给出：
   - 改动文件列表
   - 验收 URL（本地路径 + 线上 `https://member-zone-6d9.pages.dev/`）
   - 演示 query 参数（若有）
2. 需写 handoff 文档时 → [docs/archive/design-handoff/](../../../docs/archive/design-handoff/) 模板，或 [docs/frontend-handoff-guide.md](../../../docs/frontend-handoff-guide.md)
3. 用户明确要求发布 → `./deploy-cloudflare.sh`（见 `publish.mdc`）

---

## Phase 4：设计师视觉验收

设计师对照：

- MasterGo Frame vs 浏览器预览
- 状态表逐项（含倒计时显隐等边界）
- 800px 以下堆叠
- 文案与 handoff 一致（若有）

改稿时：

- **改色** → 先改 Token，再 npm run css
- **改布局/文案** → 更新 MasterGo → Agent 改 HTML/CSS

---

## 唯一真相（避免设计与代码分叉）

| 内容 | 唯一真相 |
|------|----------|
| 色、间距、组件结构 | `css/src` Token + shared CSS |
| 布局、插图、视觉稿 | MasterGo |
| 交付与验收 | 预览 URL + handoff md（按需） |

---

## 常见反模式（禁止）

- 手改 `css/styles.css` / `css/styles-core.css`
- 在 page CSS 重复粘贴 shared 已有规则
- 代码中保留 MasterGo 图片外链
- 只实现 happy path，漏 completed / empty / 错误态
- 同一组件两页面用一套 HTML 却不写差异说明

---

## 附加资源

- 设计师 Prompt 模板：[prompt-templates.md](prompt-templates.md)
- 交付文档（归档）：[docs/archive/design-handoff/](../../../docs/archive/design-handoff/)
- Token 规则：`.cursor/rules/design-tokens.mdc`
- 图片本地化：`.cursor/rules/mastergo-images.mdc`
- 发布：`.cursor/rules/publish.mdc`
