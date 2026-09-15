#!/usr/bin/env bash
# Download MasterGo CDN images referenced in site source and rewrite to assets/mastergo/.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"
OUT_DIR="$ROOT/assets/mastergo"
mkdir -p "$OUT_DIR"

# Collect html/css/js outside excluded dirs
FILES="$(
  find "$ROOT" \
    \( -path "$ROOT/.git" -o -path "$ROOT/.mastergo" -o -path "$ROOT/.wrangler" -o -path "$ROOT/node_modules" -o -path "$ROOT/.publish" \) -prune -o \
    -type f \( -name '*.html' -o -name '*.css' -o -name '*.js' \) -print
)"

URL_RE='https?://image-resource\.mastergo\.com/[^[:space:]\"'\''<>)]+'

TMP_URLS="$(mktemp)"
trap 'rm -f "$TMP_URLS"' EXIT

echo "$FILES" | while IFS= read -r f; do
  [[ -z "$f" ]] && continue
  grep -Eo "$URL_RE" "$f" 2>/dev/null || true
done | sort -u > "$TMP_URLS"

if [[ ! -s "$TMP_URLS" ]]; then
  echo "No MasterGo image URLs found in html/css/js."
  exit 0
fi

count="$(wc -l < "$TMP_URLS" | tr -d ' ')"
echo "Found $count MasterGo image URL(s)."

while IFS= read -r url; do
  [[ -z "$url" ]] && continue
  path="${url%%\?*}"
  path="${path%%\#*}"
  name="$(basename "$path")"
  if [[ -z "$name" || "$name" == "/" || "$name" == "." ]]; then
    echo "Skip unusable URL: $url" >&2
    continue
  fi
  dest="$OUT_DIR/$name"
  if [[ ! -f "$dest" ]]; then
    echo "Downloading $name ..."
    curl -fsSL -o "$dest" "$url"
  else
    echo "Exists: $name"
  fi
  local_path="assets/mastergo/$name"
  echo "$FILES" | while IFS= read -r f; do
    [[ -z "$f" ]] && continue
    if grep -qF "$url" "$f" 2>/dev/null; then
      python3 -c "
from pathlib import Path
path = Path(r'''$f''')
old = r'''$url'''
new = r'''$local_path'''
text = path.read_text(encoding='utf-8')
if old in text:
    path.write_text(text.replace(old, new), encoding='utf-8')
    print('  rewritten:', path)
"
    fi
  done
done < "$TMP_URLS"

echo "Done. Local files in $OUT_DIR"
