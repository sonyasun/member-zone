#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"
rm -rf .publish
mkdir -p .publish
rsync -a \
  --exclude '.git/' --exclude '.github/' --exclude '.cursor/' \
  --exclude '.mastergo/' --exclude '.publish/' --exclude '.DS_Store' \
  --exclude 'setup-github-pages.sh' --exclude 'deploy-netlify.sh' \
  --exclude '.gitignore' --exclude '.netlify/' \
  ./ .publish/
npx --yes netlify-cli deploy --dir=.publish --prod --no-build "$@"
