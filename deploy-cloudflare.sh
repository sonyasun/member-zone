#!/bin/bash
# 发布静态站到 Cloudflare Pages（无密码公开预览）
set -euo pipefail
cd "$(dirname "$0")"

# 1) 同步公共壳（header / footer / login-card）
python3 scripts/apply-shell.py

# 2) 由 css/src 模块重建 styles.css
python3 scripts/build-css.py

# 3) 本地化 MasterGo 外链图，避免线上拉 CDN 过慢
if [[ -x ./localize-mastergo-images.sh ]]; then
  ./localize-mastergo-images.sh
fi

rm -rf .publish
mkdir -p .publish
rsync -a \
  --exclude '.git/' \
  --exclude '.github/' \
  --exclude '.cursor/' \
  --exclude '.mastergo/' \
  --exclude '.publish/' \
  --exclude '.DS_Store' \
  --exclude 'setup-github-pages.sh' \
  --exclude 'deploy-netlify.sh' \
  --exclude 'deploy-cloudflare.sh' \
  --exclude 'localize-mastergo-images.sh' \
  --exclude 'scripts/' \
  --exclude 'partials/' \
  --exclude 'css/src/' \
  --exclude 'package.json' \
  --exclude 'node_modules/' \
  --exclude '.gitignore' \
  --exclude '.netlify/' \
  ./ .publish/

npx --yes wrangler pages deploy .publish \
  --project-name=member-zone \
  --branch=main \
  --commit-dirty=true

echo ""
echo "正式预览: https://member-zone-6d9.pages.dev/"
echo "会员区:   https://member-zone-6d9.pages.dev/member.html"
