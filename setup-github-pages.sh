#!/bin/bash
# 一键创建 GitHub 仓库并开启 Pages
set -euo pipefail
cd "$(dirname "$0")"

if ! command -v gh >/dev/null 2>&1; then
  echo "未检测到 gh，请先安装：https://cli.github.com/"
  echo "或执行：brew install gh"
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "请先登录 GitHub："
  gh auth login
fi

REPO_NAME="${1:-member-zone}"

if ! git remote get-url origin >/dev/null 2>&1; then
  gh repo create "$REPO_NAME" --public --source=. --remote=origin --push
else
  git push -u origin HEAD
fi

gh api -X POST "repos/{owner}/{repo}/pages" \
  -f build_type=workflow \
  -f source[branch]=main \
  -f source[path]=/ 2>/dev/null || true

# 确保 Pages 使用 GitHub Actions
gh api -X PUT "repos/{owner}/{repo}/pages" \
  -f build_type=workflow 2>/dev/null || true

OWNER=$(gh api user -q .login)
echo ""
echo "已推送。请到仓库 Settings → Pages 确认 Source 为 GitHub Actions。"
echo "约 1～2 分钟后访问："
echo "  https://${OWNER}.github.io/${REPO_NAME}/"
echo "  https://${OWNER}.github.io/${REPO_NAME}/member.html"
echo "  https://${OWNER}.github.io/${REPO_NAME}/topic-courses.html"
