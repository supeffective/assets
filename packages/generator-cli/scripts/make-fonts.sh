#!/usr/bin/env bash

# exit when any command fails
set -e

cd ../../

APP_DIR="${PWD}"

if [[ ! -d "${APP_DIR}/packages/website" ]]; then
  echo "Not inside the project root: ${PWD}"
  exit 1
fi

ASSETS_PATH="${APP_DIR}/packages/assets"
FONTSRC_PATH="${APP_DIR}/packages/core-ui/fonts"

mkdir -p ./build

# AppIcons
./packages/admin-cli/dist/index.mjs mount-font \
  "AppIcons" \
  "${FONTSRC_PATH}/AppIcons/SVG" \
  "${ASSETS_PATH}/dist/fonts/AppIcons" \
  --prefix "icn"

# PokeGlyph
./packages/admin-cli/dist/index.mjs mount-font \
  "PokeGlyphs" \
  "${FONTSRC_PATH}/PokeGlyphs/SVG" \
  "${ASSETS_PATH}/dist/fonts/PokeGlyphs" \
  --prefix "pkg"

cat "${FONTSRC_PATH}/PokeGlyphs/extra-styles.css" >>"${ASSETS_PATH}/dist/fonts/PokeGlyphs/PokeGlyphs.css"
