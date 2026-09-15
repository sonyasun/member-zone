# 设计交付模板（复制使用）

---

## 模板 A：设计说明（发给前端的主文档）

```markdown
# [功能名称] 设计交付

**日期**：YYYY-MM-DD  
**设计师**：[姓名]  
**MasterGo**：[链接]  
**预览对照**：https://member-zone-6d9.pages.dev/[页面路径]

---

## 1. 范围

### 本次做
- [ ] 例：7 天任务卡片视觉优化
- [ ] 例：个人中心倒计时改为 pill

### 本次不做
- [ ] 例：弹窗交互逻辑
- [ ] 例：接口字段

---

## 2. 涉及页面

| 页面 | HTML | 设计稿 Frame |
|------|------|--------------|
| 个人中心 | profile.html | Page 3 - Profile |
| 会员中心 | member.html | Page 4 - Member |

---

## 3. 组件状态

### [组件名，如 7 天学习任务]

| 状态 | 说明 | 设计稿位置 | 备注 |
|------|------|------------|------|
| idle | 未开始 | Frame A | 含猫图 + 文案 |
| active | 进行中 Day N | Frame B | N = 1–7 |
| completed | 已完成 | Frame C | |
| 倒计时-显示 | 剩余 X 天 | Frame D | 演示：?learnTaskDaysLeft=5 |
| 倒计时-隐藏 | 无倒计时 | Frame E | |

### 页面差异（同一组件不同表现）

| 元素 | 个人中心 profile | 会员中心 member |
|------|------------------|-----------------|
| 倒计时样式 | pill，idle 文案区右上 | 角标，course 容器右上 |
| 任务标签文案 | Day N 任务 | Day N 任务 |

---

## 4. 文案定稿

| 位置 | 文案 | 备注 |
|------|------|------|
| 任务标签 | Day 3 任务 | 不要「继续学习 ·」前缀 |
| 倒计时 | 倒计时 7 天 | 「7」为动态数字 |

---

## 5. Token 变更

| 设计命名 | CSS 变量 | 色值 / 值 | 变更类型 | 用于 |
|----------|----------|-----------|----------|------|
| 主色 | --color-primary | #139686 | 沿用 | 按钮、链接 |
| 任务卡 idle 背景 | --lt-bg-idle | （描述或色板） | 修改 | learn-task / member-lt |
| 倒计时 pill 边框 | --lt-expiry-pill-border | rgba(...) | 新增 | profile 倒计时 |

无变更时写：**沿用现有 Token，见 00-tokens-and-base.css**

---

## 6. 切图清单

| 文件名 | 尺寸 @倍率 | 格式 | 用途 | 页面 |
|--------|------------|------|------|------|
| learn-task-icon.png | 48×48 @2x | PNG 透明 | active 标题前头像 | profile |
| learn-task-start-cat.png | 200×180 @2x | PNG 透明 | idle 左侧插画 | profile |

**不需切图（CSS 实现）**：进度条渐变、卡片背景、圆角按钮

---

## 7. 响应式

| 断点 | 设计稿 | 布局变化 |
|------|--------|----------|
| > 1100px | 桌面 Frame | 默认 |
| ≤ 1100px | 可选 Frame | 侧栏折叠 |
| ≤ 800px | 必选 Frame | 任务卡堆叠、文案换行 |
| ≤ 560px | 可选 | 窄屏微调 |

---

## 8. 验收标准

- [ ] 桌面 1440 / 1280 与 MasterGo 一致
- [ ] 800px 以下无横向滚动、无遮挡
- [ ] 所有状态可切换预览（说明如何触发）
- [ ] 切图无糊、无 MasterGo 外链
- [ ] 文案与上表一致

**演示方式**：
- 倒计时：`?learnTaskDaysLeft=5`
- 任务状态：[说明 URL 参数或操作步骤]
```

---

## 模板 B：Token 表（单独附件）

```markdown
# Token 表 — [功能名称]

> 前端写入：`css/src/00-tokens-and-base.css`（全局）或 `01-learn-task-shared.css`（7 天任务）

| 设计 Token 名 | CSS 变量 | 类型 | 值 | 用于 |
|---------------|----------|------|-----|------|
| 主色 | --color-primary | color | #139686 | 全站 |
| 主色-深 | --color-primary-dark | color | #0d7a6d | hover、强调 |
| 页面背景 | --color-bg-01 | color | #f7f8fa | 页面底 |
| 任务卡圆角 | --lt-radius | length | 0.75rem | learn-task 外壳 |
| 任务进度条 | --lt-gradient-progress | gradient | linear-gradient(...) | week/course 进度 |

### 字号（沿用现网变量）

| 设计标注 | CSS 变量 | px |
|----------|----------|-----|
| 正文 14 | --font-size-14 | 14 |
| 辅助 12 | --font-size-12 | 12 |
| 最小 11 | --font-size-min | 11 |
```

---

## 模板 C：切图清单（单独附件）

```markdown
# 切图清单 — [功能名称]

**交付目录**：`assets/` 或 `assets/mastergo/`  
**命名规则**：语义名优先；MasterGo 导出可用 hash 文件名

| # | 文件名 | 宽×高 | @倍率 | 格式 | 透明 | 用途 | 备注 |
|---|--------|-------|-------|------|------|------|------|
| 1 | learn-task-icon.png | 48×48 | 2x | PNG | 是 | profile 任务头像 | |
| 2 | learn-task-start-cat.png | 200×180 | 2x | PNG | 是 | profile idle 猫 | 仅 idle |
| 3 | learn-task-complete.png | 120×120 | 2x | PNG | 是 | completed 装饰 | |

### 不需要导出

- 卡片背景渐变 → Token `--lt-bg-idle` / `--lt-bg-active`
- 简单图标（箭头、关闭）→ SVG 或现有 icon 库
- 头像占位 → 可用现有 rank-avatar-*.png
```

---

## 模板 D：改稿记录（迭代时用）

```markdown
# 改稿记录 — [功能名称]

| 版本 | 日期 | 变更 | MasterGo Frame | 前端动作 |
|------|------|------|----------------|----------|
| v1.0 | 08-20 | 初稿交付 | — | — |
| v1.1 | 08-22 | 倒计时从 panel 移到 course | Page 4 / Frame B | 只改 member-lt__course |
| v1.2 | 08-23 | 主色 #139686 → #128075 | Token 表 | 改 --color-primary |
```

---

## 快速检查清单（发之前自检）

```
设计交付自检：
- [ ] MasterGo 链接有效、权限已开给前端
- [ ] 所有 UI 状态都有稿或文字说明
- [ ] profile / member 差异已单独写明
- [ ] 文案已全部定稿，无「待定」「TBD」
- [ ] Token 表已填或明确写「沿用现网」
- [ ] 切图已导出 + 清单齐全
- [ ] 800px 断点有说明或设计稿
- [ ] 验收标准 + 演示方式已写
```
