#!/usr/bin/env bash

# exit when any command fails
set -e

APP_DIR=$1

if [[ ! -d "${APP_DIR}/packages/generator-cli" ]]; then
  echo "Not inside the project root: ${PWD}"
  exit 1
fi

ASSETS_PATH="${APP_DIR}/assets"
FONTSRC_PATH="${APP_DIR}/assets/fonts"

mkdir -p ./build

# AppIcons
pnpm cli mount-font \
  "AppIcons" \
  "${FONTSRC_PATH}/AppIcons/SVG" \
  "${FONTSRC_PATH}/AppIcons/dist" \
  --prefix "icn"

# PokeGlyph
pnpm cli mount-font \
  "PokeGlyphs" \
  "${FONTSRC_PATH}/PokeGlyphs/SVG" \
  "${FONTSRC_PATH}/PokeGlyphs/dist" \
  --prefix "pkg"

cat "${FONTSRC_PATH}/PokeGlyphs/extra-styles.css" >> "${FONTSRC_PATH}/PokeGlyphs/dist/PokeGlyphs.css"
