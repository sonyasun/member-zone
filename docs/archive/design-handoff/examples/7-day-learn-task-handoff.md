# 7 天学习任务 · 设计交付

**日期**：2026-08-20  
**设计师**：[填写姓名]  
**MasterGo**：[填写链接]  
**预览对照**：
- 个人中心：https://member-zone-6d9.pages.dev/profile.html
- 会员中心：https://member-zone-6d9.pages.dev/member.html

**实现状态**：UI 已在仓库落地；本文档供设计验收与后续改稿对照。

**前端接入指南**：[docs/frontend-handoff-guide.md](../../../docs/frontend-handoff-guide.md)

---

## 1. 范围

### 本次做
- [x] 个人中心（profile）7 天学习任务卡片：idle / active / completed 三态
- [x] 会员中心（member）侧栏任务卡片：同上三态 + 窄版布局
- [x] 临近到期倒计时（剩余 ≤7 天且未完成 7 天时显示）
- [x] 开始任务弹窗、领取奖励弹窗（样式与入口按钮）
- [x] 设计 Token 统一（`--lt-*` 系列）

### 本次不做
- [ ] 真实接口 / 用户数据对接
- [ ] 学习时长统计、打卡逻辑
- [ ] 弹窗内表单提交

---

## 2. 涉及页面与代码

| 页面 | HTML | 页面 CSS | 共享 CSS | JS |
|------|------|----------|----------|-----|
| 个人中心 | `profile.html` | `css/src/20-page-profile.css` | `css/src/01-learn-task-shared.css` | `js/learn-task.js` |
| 会员中心 | `member.html` | `css/src/25-page-member.css` | 同上 | `js/member-learn-task.js` |
| 开始弹窗 | `partials/learn-task-start-modal.html` | `css/src/27-learn-task-start-modal.css` | — | `js/learn-task-start-modal.js` |
| 奖励弹窗 | `partials/learn-task-reward-modal.html` | `css/src/26-learn-task-reward-modal.css` | — | `js/learn-task-reward-modal.js` |

**类名约定**

| 场景 | 根类名 | 状态属性 |
|------|--------|----------|
| 个人中心 | `.learn-task` | `data-state="idle" \| "active"`；completed 为独立 section |
| 会员侧栏 | `.member-lt` | 同上 |

---

## 3. 组件状态

### 3.1 主卡片状态

| 状态 | 说明 | profile 表现 | member 表现 |
|------|------|--------------|-------------|
| **idle** | 未开始 | 左侧大猫插画 + 文案；右侧 week +「开始任务」 | 头像 + 标题 + 说明；week + CTA |
| **active** | 进行中 | 标题全宽；course + 学习进度 + 今日目标 | 标题 + 学习进度 + 今日目标 |
| **completed** | 已完成 | 独立 section 固定展示在默认卡片下方 | 独立 section 在侧栏任务区下方 |

### 3.2 Day 进度（active / completed）

| Day 样式类 | 含义 |
|------------|------|
| 默认 | 未到达 |
| `.is-done` | 已完成 |
| `.is-current` | 当前天（`aria-current="step"`） |

- profile Day 标签文案：`Day1` … `Day7`（无空格）
- member Day 标签文案：`D1` … `D7`（窄屏适配）

### 3.3 倒计时

| 条件 | 行为 |
|------|------|
| 已完成 7 天 | **隐藏**倒计时 |
| 剩余 > 7 天 | **隐藏** |
| 0 ≤ 剩余 ≤ 7 天且未完成 | **profile / member active** 显示到期横幅（见下） |

**profile 到期横幅**（idle / active 面板顶部全宽）：

| 行 | 内容 |
|----|------|
| profile | 单行 | 活动到期提醒 · 未完成 **7** 天，活动将于 **M 月 D 日**到期，还差 **R** 天任务 |
| member | 两行 | 上行：活动到期提醒 · 未完成 **7** 天 · 下行：活动将于 **M 月 D 日**到期，还差 **R** 天任务 |

| 页面 | 位置 | 视觉 |
|------|------|------|
| **profile · active** | `.learn-task__course` 容器内顶部 | 浅红 expiry 底 |
| **profile · idle** | — | 不展示到期横幅 |
| **member · active** | `.member-lt__week` 容器内顶部 | 同 profile 横幅样式 |
| **member · idle** | — | 不展示到期横幅 |

### 3.4 已移除元素（勿恢复）

- profile：`learn-task__badge`（标题旁角标）— 已删除
- member：`member-lt__badge`、`member-lt__course`、`member-lt__expiry-alert`（角标）— 已删除；member 改用 `member-lt__expiry-banner`

---

## 4. 文案定稿

| 位置 | 文案 | 备注 |
|------|------|------|
| idle 主标题 | 和阿瓜一起 **7 天** 完成挑战 | `7 天` 用 `<em>` 高亮 |
| idle 描述 | 每天学习任意课程 10 分钟，一个月内完成7天即可领取阿瓜限量周边 | |
| idle 标签 | 每日 10 分钟 · 限量周边 | 两个 perk chip |
| active 标题 | 7 天学习任务 | profile / member active 态 |
| week 摘要 profile | **N** / 7 天已完成 | completed：**7** / 7 天全完成 |
| week 摘要 member | **N** / 7 天 | completed：**7** / 7 天 |
| week 标题 | 学习进度 | |
| 课程进度 | 已完成 · **12** / 12 节 · *100%* | 仅 profile active |
| 今日目标 | 今日学习目标 · **0** / 10 分钟 | |
| idle CTA | 开始任务 | |
| active · 今日目标 | 今日学习目标 · **0** / 10 分钟 | 仅进度条，无 CTA 按钮 |
| 到期横幅 | 见 §3.3 | profile / member active；N=已学天数，R=7-N，日期=活动到期日 |
| completed 标题 profile | 恭喜你完成7天学习任务挑战！ | |
| completed 标题 member | 挑战完成！ | |
| completed 描述 | 你坚持完成了全部挑战，扫码添加**阿瓜**领取限量周边 | |
| 统计 chip | 累计学习 **120** min · 连续打卡 **7** 天 | profile；member 为 stat 行 |
| 奖励 CTA | 领取任务奖励 | 带礼物 icon |

---

## 5. 页面差异一览（设计改稿必看）

| 元素 | 个人中心 profile | 会员中心 member |
|------|------------------|-----------------|
| 布局 | 宽版双栏（idle：猫图 \| week） | ~276px 侧栏单列 |
| idle 猫插画 | 大场景 `learn-task-start-cat.png` + 光效装饰 | 无大插画，仅 32px 头像 |
| 倒计时 | 到期横幅（§3.3，profile / member active） | 同左 |
| Day 标签 | Day1–Day7 | D1–D7 |
| week 摘要 | 「N / 7 天**已完成**」 | 「N / 7 天」 |
| active 标题 | 恢复猫头像 `learn-task-icon.png` 38×38 | 头像 32×32，标题始终「7 天学习任务」 |
| completed | 大完成插画 148×148 + 独立宽版布局 | 紧凑 success-hero 52×52 |

---

## 6. Token 表（已实现）

> 写入位置：`css/src/00-tokens-and-base.css`（全局 + `--lt-*`）  
> 共享组件：`css/src/01-learn-task-shared.css`

| 设计命名 | CSS 变量 | 值 / 说明 | 用于 |
|----------|----------|-----------|------|
| 主色 | `--color-primary` | `#139686` | 全站 |
| 主色-深/中/浅 | `--color-primary-dark/mid/light/deep` | 见 tokens 文件 | 卡片渐变、进度条 |
| 页面背景 | `--color-bg-01` | `#f7f8fa` | profile 页底 |
| 任务卡 idle 背景 | `--lt-bg-idle` | 多层 radial + `--lt-gradient-card` | 未开始 |
| 任务卡 active 背景 | `--lt-bg-active` | 同上系列 active 变体 | 进行中 |
| 卡片渐变 | `--lt-gradient-card` | 112deg 主色三段 | 外壳 |
| 进度条渐变 | `--lt-gradient-progress` | 90deg deep → light | week / course fill |
| 标题 on 绿底 | `--lt-title-on-green` | `#ffffff` | 标题字色 |
| 标题强调数字 | `--lt-title-accent` | `#fff3a8` | `<em>7 天</em>` |
| week 面板背景 | `--lt-week-surface` / `--lt-week-surface-strong` | 白 → 浅绿渐变 | week 容器 |
| week 进度轨道 | `--lt-week-progress-track` | `#e8efec` | 未填充段 |
| 任务标签 chip | `--lt-chip-border` / `--lt-chip-bg-strong` | primary 混色 | `Day N 任务` |
| 倒计时-角标字 | `--lt-expiry-fg` | `#d94848` | profile 到期横幅 |
| 倒计时-角标底 | `--lt-expiry-bg` | 浅红渐变 | profile 到期横幅 |
| 到期横幅 | `--lt-expiry-banner-*` | 见 tokens | profile 到期提醒 |

**改主色流程**：只改 `--color-primary` 及 `--color-primary-*`，避免在页面 CSS 新增 hex。

---

## 7. 切图清单

| 文件名 | 尺寸（HTML 引用） | 格式 | 用途 | 页面 |
|--------|-------------------|------|------|------|
| `assets/learn-task-start-cat.png` | 场景插画 | PNG 透明 | idle 左侧大猫 | profile only |
| `assets/learn-task-icon.png` | 38×38（profile active）/ 32×32（member） | PNG 透明 | 任务头像 / mark | 两处 |
| `assets/learn-task-complete.png` | 148×148（profile）/ 52×52（member） | PNG 透明 | completed 庆祝 | 两处 |

### 不需切图（CSS / Token）

- 卡片绿色渐变背景 → `--lt-bg-idle` / `--lt-bg-active`
- idle 光效（halo、glow、spark 等）→ CSS 伪元素 + 动画
- week / course 进度条 → `--lt-gradient-progress`
- 礼物按钮 icon → 内联 SVG
- Day 完成勾选 → JS 注入 SVG（profile active）

---

## 8. 响应式

| 断点 | profile | member |
|------|---------|--------|
| **> 1100px** | 任务卡双栏：左 course / 右 week | 侧栏固定 ~276px |
| **≤ 1100px** | `learn-task__inner` 改为单列堆叠 | 侧栏随 layout 折叠 |
| **≤ 800px** | 内容区 padding 缩小；任务卡 grid 单列 | 同全站 tablet 规则 |
| **≤ 560px** | week / day 标签保持 7 列 grid | D1–D7 窄标签 |

设计稿建议至少提供：**桌面（≥1100）** + **≤800 堆叠** 两版。

---

## 9. 交互说明（演示用）

### URL 参数（静态预览）

**个人中心 `profile.html`**

| 参数 | 示例 | 效果 |
|------|------|------|
| `learnTask` | `?learnTask=active` | 切换 idle / active |
| `learnTaskDaysLeft` | `?learnTaskDaysLeft=5` | 模拟剩余 5 天，显示倒计时 |
| `learnTaskDone` | `?learnTaskDone=3` | 模拟已完成 3 天（影响倒计时是否显示） |

**会员中心 `member.html`**

| 参数 | 示例 | 效果 |
|------|------|------|
| `memberLt` | `?memberLt=active` | 切换 idle / active |
| `memberLtDaysLeft` | `?memberLtDaysLeft=5` | 倒计时演示 |
| `memberLtDone` | `?memberLtDone=3` | 已完成天数演示 |

### 用户操作

| 操作 | 结果 |
|------|------|
| 点击「开始任务」 | 打开开始任务弹窗；确认后 → active |
| 点击「领取任务奖励」 | 打开奖励弹窗（completed 态） |

---

## 10. 验收标准

- [ ] **profile idle**：无到期横幅；大猫插画、week 0/7、「开始任务」
- [ ] **profile active**：课程卡上方到期横幅（条件满足时）、course 标题与进度、week 3/7
- [ ] **profile completed**：完成插画、统计 chip、7/7 天全完成、金色 day 样式、「领取任务奖励」
- [ ] **member idle**：说明文案、week D1–D7、「开始任务」
- [ ] **member active**：学习进度卡内到期横幅（条件满足时）+ 今日目标进度
- [ ] **member completed**：挑战完成文案 + 领取按钮
- [ ] **profile / member** 到期横幅：完成 7 天或剩余 >7 天时不显示
- [ ] 无 MasterGo CDN 外链；切图均来自 `assets/`
- [ ] 800px 以下无遮挡、无横向滚动
- [ ] 主色变更只需改 Token，页面无散落 `#139686`

### 推荐验收 URL

```
https://member-zone-6d9.pages.dev/profile.html?learnTask=active&learnTaskDaysLeft=5&learnTaskDone=3
https://member-zone-6d9.pages.dev/member.html?memberLt=active&memberLtDaysLeft=0&memberLtDone=3
```

---

## 11. 改稿记录

| 版本 | 日期 | 变更 | 前端动作 |
|------|------|------|----------|
| v1.0 | 2026-08-20 | 初版交付文档（对应当前实现） | — |
| — | — | 倒计时 profile→pill / member→course 角标 | 已完成 |
| — | — | 移除 badge；active 恢复猫头像 | 已完成 |
| — | — | 文案「继续学习 · Day N」→「Day N 任务」 | 已完成 |
| — | — | Token 统一 + 共享 CSS 模块 | 已完成 |

---

## 12. 设计师自检（发前端 / 提改稿前）

```
- [ ] MasterGo 链接有效
- [ ] idle / active / completed / 倒计时显隐 均有稿或说明
- [ ] profile 与 member 差异已分别标注
- [ ] 文案与第 4 节一致，或已更新第 4 节
- [ ] 改色已映射到 Token 表，而非散落 hex
- [ ] 新切图已入 assets/ 并更新第 7 节
- [ ] 800px 断点有说明或设计稿
```
