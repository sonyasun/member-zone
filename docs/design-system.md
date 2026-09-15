# 建筑云课 · 平台规范

**真相**：`css/src/00-tokens-and-base.css`（Token）+ 组件 / 页面 CSS  
**预览**：https://member-zone-6d9.pages.dev/

改视觉先改 Token / shared CSS，再 `npm run css`。禁止手改 `css/styles.css`。

---

## 1. 硬性规则

| 规则 | 要求 |
|------|------|
| Token | 新代码用 `var(--*)`，禁止硬编码 `#139686` 等品牌 hex |
| CSS 分层 | Token → 共享组件 → 页面差异；共享规则不进 page CSS |
| 类名 | BEM：`block` / `block__el` / `block--mod` |
| 按钮 | 新 HTML 只用 `.btn.btn--primary` / `.btn.btn--ghost` |
| 断点 | 只用 **1100 / 800 / 560**（`--bp-layout` / `--bp-tablet` / `--bp-narrow`） |
| 字号 | 正文、标签 ≥ 12px（`--font-size-min`） |
| 数字 | 价格、倒计时、进度、排行用 `--font-family-num`（OPPOSans） |
| 图片 | 切图进 `assets/` 或 `assets/mastergo/`，禁止 MasterGo CDN 外链 |
| 状态 | 新功能覆盖全部 UI 态（idle / active / empty / error / completed） |

---

## 2. 色彩

### 品牌与功能

| Token | 值 | 用途 |
|-------|-----|------|
| `--color-primary` | `#139686` | 主色：按钮、链接、选中、进度 |
| `--color-primary-hover` | `#ecfaf9` | Ghost / Tab hover 浅底 |
| `--color-primary-dark` | `#0a7266` | 渐变深端 |
| `--color-primary-mid` | `#128f7f` | 渐变中段 |
| `--color-primary-light` | `#3ec492` | 渐变浅端 |
| `--color-primary-deep` | `#0f8577` | 高饱和进度起点 |
| `--color-theme-blue` | `#1677ff` | 次要主题蓝 |
| `--color-success` | `#22b34a` | 成功 |
| `--color-danger` | `#f56c6c` | 危险 |
| `--color-warning` | `#e6a23c` | 警告 |
| `--color-danger-soft` | `#fc4755` | 促销 / 软危险 |

别名（已有代码可沿用，新代码优先用上表）：`--color-brand` → primary。

### 文本

| Token | 值 | 层级 |
|-------|-----|------|
| `--color-text-primary` | `#333333` | 正文 |
| `--color-text-title` | `#303133` | 标题 |
| `--color-text-secondary` | `#666666` | 辅文 |
| `--color-text-muted` | `#606266` | 说明 |
| `--color-text-tertiary` | `#888888` | 三级 |
| `--color-text-quaternary` | `#999999` | 四级 |
| `--color-text-placeholder-bb` | `#bbbbbb` | 占位 |

别名：`--color-text-main-33` → primary；`--color-text-muted-99` → quaternary。

### 背景、边框、阴影

| Token | 值 | 用途 |
|-------|-----|------|
| `--color-bg-white` | `#ffffff` | 页面 / 卡片底 |
| `--color-bg-01` | `#f7f8fa` | 灰底分区 |
| `--color-border-dd` | `#dddddd` | 分隔线 |
| `--color-footer-bg` | `#1e1e28` | 页脚 |
| `--color-tag-bg` | `#f5f5fa` | 标签底 |
| `--color-shadow` | `rgba(32,56,100,0.06)` | 卡片默认 |
| `--color-shadow-nav` | `rgba(32,56,100,0.08)` | 导航 |
| `--color-shadow-hover` | `0 0.5rem 1.5rem rgba(32,56,100,0.12)` | 卡片 hover |

场景渐变（`--gradient-hero`、`--gradient-faq-card`、`--lt-gradient-*` 等）只在对应模块使用，定义见 Token 文件。

---

## 3. 字体

| Token | 字体 | 用途 |
|-------|------|------|
| `--font-family-base` | PingFang SC, Microsoft YaHei | 正文 |
| `--font-family-display` | Alimama ShuHeiTi | 栏目标题 `.section-heading__title` |
| `--font-family-title` | Alibaba PuHuiTi 2.0 | 部分标题 |
| `--font-family-num` | OPPOSans | 全站数字 |

根字号 16px，单位 rem。

| Token | 大小 | 行高 | 字重 | 用途 |
|-------|------|------|------|------|
| `--font-size-12` | 12px | 20px | 400 | 最小字号；标签、辅助 |
| `--font-size-14` | 14px | 22px | 400 | 正文、按钮 |
| `--font-size-16` | 16px | 24px | 500 | 卡片标题、一级 Tab |
| `--font-size-18` | 18px | 24px | — | 次级标题 |
| `--font-size-20` | 20px | 28px | — | 小标题 |
| `--font-size-24` | 24px（clamp） | 24px | 700 | 栏目标题 |
| `--font-size-32` | 32px | — | — | 大数字 |

字重：`--font-weight-regular` 400 · `--font-weight-medium` 500 · `--font-weight-bold` 700。

---

## 4. 布局

| Token | 值 | 说明 |
|-------|-----|------|
| `--page-max` | 1200px | 内容最大宽 |
| `--content-main` | 900px | 主栏参考 |
| `--content-side` | 276px | 侧栏 |
| `--nav-height` | 64px | 顶栏 |
| `--gap-xs` … `--gap-2xl` | 4 / 8 / 12 / 16 / 24 / 32px | 间距阶梯 |
| `--space-heading` | 24px | 标题 → 内容 |
| `--space-section` | 40–56px（clamp） | 模块间距 |
| `--space-section-cert` | 120px | 考证页主内容 gap |

容器：`.page-inner { width: min(100% - 2rem, var(--page-max)); }`

主栏 + 侧栏：`.main__grid` → `.main-column` + `.side-column`（276px，卡间距 24px）。  
≤1100px 折成单列。

### 圆角

| Token | 值 | 用途 |
|-------|-----|------|
| `--radius-sm` | 8px | 课程卡、小卡片 |
| `--radius-md` / `--lt-radius` | 12px | 中型面板、任务卡 |
| `--radius-lg` | 16px | 大面板 |
| `--lt-radius-sm` | 10px | 任务内子卡 |
| `--btn-radius` | 100px | 胶囊按钮 |

### 断点

| Token | 宽度 | 行为 |
|-------|------|------|
| `--bp-layout` | 1100px | 主栏 + 侧栏 → 单列 |
| `--bp-tablet` | 800px | 内容堆叠、grid 减列 |
| `--bp-narrow` | 560px | 窄屏微调 |

新 `@media` 只加这三档。旧页 600 / 640 / 900 / 960 逐步迁出，勿再新增。

---

## 5. 组件

### 按钮

```html
<button class="btn btn--primary">主按钮</button>
<a class="btn btn--ghost" href="#">幽灵按钮</a>
```

| 态 | Primary | Ghost |
|----|---------|-------|
| 默认 | `--btn-primary-bg` + 白字 | 透明底 + 主色字/边 |
| Hover | `--btn-primary-bg-hover` | `--color-primary-hover` |
| Active | `--btn-primary-bg-active` | 更深浅底 |
| Disabled | `--btn-primary-bg-disabled` | — |
| Focus | `--btn-focus-ring`（双环） | 同左 |

规格：padding `8px 20px`，14px / 500，圆角 100px，过渡 0.2s。  
变体用伪类，不复制 DOM。勿在新页面写 `.btn-primary` / `.btn-ghost` / `.btn-login`。

### 栏目标题

```html
<header class="section-heading section-heading--inline">
  <h2 class="section-heading__title">精选好课</h2>
  <span class="section-heading__rule"></span>
  <p class="section-heading__desc">说明文案</p>
</header>
```

标题：ShuHeiTi 24 / 700 / `--color-text-primary`。描述：14 / `--color-text-quaternary`。下间距 `--space-heading`。

### 筛选 Tab

| 级别 | 类名 | 选中 |
|------|------|------|
| 一级 | `.section-tabs--primary` + `.section-tabs__item` | 主色底 + 白字 |
| 二级 | `.section-tabs--secondary` + `.section-tabs__sub` | 主色字 + 10% 主色底 |

可交互项必须有 `:focus-visible` → `--btn-focus-ring`。

### 课程卡片

DSL 基准 **285 × 312**，三列 `repeat(3, 1fr)`，行 gap 24 / 列 gap 21。

| 项 | 规范 |
|----|------|
| 圆角 | `--radius-sm` |
| 封面 | `aspect-ratio: 285 / 160` |
| Hover | 上移 2px（`--card-hover-lift`）+ `--color-shadow-hover`；标题变主色 |
| 过渡 | `--card-transition`（0.2s ease） |

### 7 天学习任务

共享：`css/src/01-learn-task-shared.css` + `--lt-*` Token。页面差异只写在 profile / member CSS。

| 场景 | 根类 | 布局 |
|------|------|------|
| 个人中心 | `.learn-task` | 宽版 |
| 会员侧栏 | `.member-lt` | 276px 窄版 |

状态：`data-state="idle" | "active"`；completed 为独立 section。  
进度格：`.is-done` / `.is-current`（`aria-current="step"`）。  
到期横幅：active 且未完成 7 天且剩余 ≤ 7 天；色用 `--lt-expiry-*`，勿另造色。

状态、文案、演示参数见 [7-day-learn-task-handoff.md](./archive/design-handoff/examples/7-day-learn-task-handoff.md)。

### 交互通用

- 卡片抬升：`--card-hover-lift`（2px）
- 焦点环：`--btn-focus-ring`
- 装饰 SVG：`aria-hidden="true"`
- `prefers-reduced-motion: reduce` 时关闭任务卡 ambient / 动画

---

## 6. 文件

### CSS 三层

| 层 | 路径 | 内容 |
|----|------|------|
| Token | `00-tokens-and-base.css` | `:root`、字体 |
| 组件 | `01`–`13`、`26`–`28` | 跨页 BEM |
| 页面 | `NN-page-*.css` | 仅布局与差异 |

构建：`npm run css` → `css/styles.css`（全站）、`css/styles-core.css`（壳层 + 组件）。  
新页面：加 `NN-page-*.css`，写入 `manifest.txt` 与 `manifest-pages.txt`。

公共头尾：`partials/`，改完 `npm run shell`。

### 页面映射

| 页面 | HTML | CSS |
|------|------|-----|
| 首页 | `index.html` | `14-page-home.css` |
| 职业考证 | `cert.html` | `15-page-cert.css` |
| 课程详情 | `course.html` | `17-page-course.css` |
| 套餐课 | `course-pack.html` | `19-page-course-pack.css` |
| 订单 | `order.html` / `order-pack.html` | `18-page-order.css` |
| 个人中心 | `profile.html` | `20-page-profile.css` |
| 领券 | `coupon-claim.html` | `21-page-coupon.css` |
| 专题 / 考证课列表 | `topic-courses.html` / `cert-courses.html` | `22-page-topic-list.css` |
| 训练营 | `camps.html` | `23-page-camps.css` |
| 会员中心 | `member.html` | `25-page-member.css` |
| 学习页 | `course-learn.html` | `29-page-course-learn.css` |
| 人才计划 | `talent-plan.html` | `30-page-talent-plan.css` |
| AI 模考 / 答题 | `ai-exam.html` / `ai-exam-take.html` | `31-page-ai-exam.css` |
| 竞赛专区 | `competition-zone.html` | `32-page-competition-zone.css` |

评价：`28-course-reviews.css`。任务弹窗：`26` / `27-learn-task-*-modal.css`。

### 图片

MasterGo URL 下载到 `assets/mastergo/<hash>.png`，代码只写本地路径。发布前：`./localize-mastergo-images.sh`。

---

## 7. 命令

| 动作 | 命令 |
|------|------|
| 改 `css/src` | `npm run css` |
| 改 `partials/` | `npm run shell` |
| 全量构建 | `npm run build` |
| 发布 | `./deploy-cloudflare.sh` |

---

## 8. Review

```
- [ ] 无硬编码品牌 hex，用 var(--color-*) / var(--lt-*)
- [ ] 新 @media 只有 1100 / 800 / 560
- [ ] 新按钮是 .btn.btn--primary / .btn.btn--ghost
- [ ] 共享规则未粘进 page CSS
- [ ] 无 image-resource.mastergo.com
- [ ] 已 npm run css
- [ ] 全部 UI 状态已实现
- [ ] 正文/标签 ≥ 12px
```

---

前端接接口：[frontend-handoff-guide.md](./frontend-handoff-guide.md)
