# Prompt 模板（设计师复制到 Cursor）

---

## 1. 首次建立 / 更新整体规范

```text
按 design-to-code-workflow skill，根据 MasterGo 设计稿整理 member-zone 设计规范：

MasterGo：[链接]

典型页面：[列出，如 profile、member、首页]

请：
1. 抽取 Token 写入 css/src/00-tokens-and-base.css
2. 可复用组件写入合适的 css/src/01-*.css
3. 更新 .cursor/rules/design-tokens.mdc（如有新约定）
4. npm run css
5. 列出 Token 表摘要供我确认
```

---

## 2. 新功能实现（最常用）

```text
按 design-to-code-workflow skill，实现 [功能名称]：

MasterGo：[链接或说明 Frame 名称]
涉及页面：[profile.html / member.html / 新页面 xxx.html]
参考典型页：[如 7 天任务卡片]

范围：
- 本次做：[列表]
- 本次不做：[列表]

状态：[idle / active / completed / …]
页面差异：[如 profile 用 pill 倒计时，member 用角标]
文案：[粘贴定稿或写「与 handoff 一致」]

请完整走 Phase 1–3：读规范 → 实现 HTML/CSS/JS → npm run css → 生成交付文档
```

---

## 3. 从 MasterGo MCP 整页还原

```text
按 design-to-code-workflow skill，从 MasterGo 实现 [页面名]：

设计文件 ID / 链接：[填写]
输出： [xxx.html] + css/src/NN-page-xxx.css

要求：
- 走 getDesignSections 全流程 + applyDesign
- 图片本地化到 assets/mastergo/
- 颜色走现有 Token，新色先问我再加 Token
- 断点 1100 / 800 / 560
- 完成后 handoff 文档 + 验收 URL
```

---

## 4. 改稿（小范围）

```text
按 design-to-code-workflow 改稿：

功能：[7 天任务 / …]
变更：
1. [例：倒计时 pill 边框加深]
2. [例：active 态 Day 标签改为 Day 1 带空格]

若涉及颜色 → 只改 Token，说明改了哪些变量。
更新 handoff 改稿记录并 npm run css。
```

---

## 5. 发布预览

```text
按 publish 规则发布 member-zone 到 Cloudflare Pages。
```

---

## 6. 仅生成交付文档（已实现功能补文档）

```text
按 design-handoff skill，为 [功能名] 生成完整交付文档，
对照当前代码库与 profile.html / member.html，输出到
.cursor/skills/design-handoff/examples/[功能名]-handoff.md
```

---

## 设计师每周节奏（参考）

| 阶段 | 你做什么 | Cursor 做什么 |
|------|----------|---------------|
| 周一 | MasterGo 定本 sprint 功能 + 状态 | — |
| 周二 | 复制模板 2 发 Cursor | 实现 + handoff |
| 周三 | 浏览器验收，标注改稿 | 模板 4 改稿 |
| 周四 | 签字 handoff 发给前端 | — |
| 周五 | 前端联调问题 → 视觉微调 | 小改 + 可选 deploy |
