#!/bin/sh
# Gera public/og.jpg (1200x630) a partir de og/og.html com o Chrome headless.
set -e
cd "$(dirname "$0")/.."
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
TMP="$(mktemp -d)"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files \
  --window-size=1200,630 --virtual-time-budget=5000 \
  --screenshot="$TMP/og.png" "file://$PWD/og/og.html" >/dev/null 2>&1
sips -s format jpeg -s formatOptions 88 "$TMP/og.png" --out public/og.jpg >/dev/null
rm -rf "$TMP"
echo "public/og.jpg gerado"
