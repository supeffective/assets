#!/usr/bin/env bash

# exit when any command fails
set -e

APP_DIR=$1

if [[ ! -d "${APP_DIR}/packages/generator-cli" ]]; then
  echo "Not inside the project root: ${PWD}"
  exit 1
fi

if ! command -v mogrify &> /dev/null; then
  echo "mogrify could not be found"
  echo "Please install ImageMagick: https://imagemagick.org/script/download.php"
  exit 1
fi

ASSETS_PATH="${APP_DIR}/assets"
BUILD_PATH="${APP_DIR}/packages/generator-cli/.build"

mkdir -p "${BUILD_PATH}"

make sprite-indices

# Usage: pnpm cli mount-spritesheet <srcDir> <destDir> <buildDir> [options]

# ----------------------------------------------------------------------

# 2D (pixel-art), regular
pnpm cli mount-spritesheet \
  "${ASSETS_PATH}/images/pokemon/gen8-icon/regular" \
  "${ASSETS_PATH}/images/spritesheets/pokemon/gen8-icon/regular" \
  "${BUILD_PATH}" \
  --ext ".png" \
  --cssprefix "pkm-g8" \
  --responsive \
  --no-webp \
  --width 68 \
  --height 56 \
  --padding 4 \
  --sorting "${BUILD_PATH}/pokemon-index.json" \
  --prepend \
  "${ASSETS_PATH}/images/pokemon/gen8-icon/unknown.png" \
  "${ASSETS_PATH}/images/pokemon/gen8-icon/unknown-sv.png" \
  "${ASSETS_PATH}/images/pokemon/gen8-icon/substitute.png" \
  "${ASSETS_PATH}/images/pokemon/gen8-icon/egg.png"

# 2D (pixel-art), shiny
pnpm cli mount-spritesheet \
  "${ASSETS_PATH}/images/pokemon/gen8-icon/shiny" \
  "${ASSETS_PATH}/images/spritesheets/pokemon/gen8-icon/shiny" \
  "${BUILD_PATH}" \
  --ext ".png" \
  --cssprefix "pkm-g8-shiny" \
  --responsive \
  --no-webp \
  --width 68 \
  --height 56 \
  --padding 4 \
  --sorting "${BUILD_PATH}/pokemon-index.json" \
  --prepend \
  "${ASSETS_PATH}/images/pokemon/gen8-icon/unknown.png" \
  "${ASSETS_PATH}/images/pokemon/gen8-icon/unknown-sv.png" \
  "${ASSETS_PATH}/images/pokemon/gen8-icon/substitute.png" \
  "${ASSETS_PATH}/images/pokemon/gen8-icon/egg.png"

PKMG82D_EXTRA_CSS="
.pkm-g8.shiny,
.pkm-g8.shiny-on-hover:hover,
.shiny-on-hover .pkm-g8:hover {
  background-image: url(../shiny/spritesheet.png);
}
"

echo $PKMG82D_EXTRA_CSS >> "${ASSETS_PATH}/images/spritesheets/pokemon/gen8-icon/regular/spritesheet.css"

# ----------------------------------------------------------------------

# 3D (render), regular
pnpm cli mount-spritesheet \
  "${ASSETS_PATH}/images/pokemon/home3d-icon/regular" \
  "${ASSETS_PATH}/images/spritesheets/pokemon/home3d-icon/regular" \
  "${BUILD_PATH}" \
  --ext ".png" \
  --cssprefix "pkm" \
  --responsive \
  --width 192 \
  --height 192 \
  --padding 4 \
  --sorting "${BUILD_PATH}/pokemon-index.json" \
  --prepend \
  "${ASSETS_PATH}/images/pokemon/home3d-icon/unknown.png" \
  "${ASSETS_PATH}/images/pokemon/home3d-icon/unknown-sv.png" \
  "${ASSETS_PATH}/images/pokemon/home3d-icon/substitute.png" \
  "${ASSETS_PATH}/images/pokemon/home3d-icon/egg.png"

# 3D (render), shiny
pnpm cli mount-spritesheet \
  "${ASSETS_PATH}/images/pokemon/home3d-icon/shiny" \
  "${ASSETS_PATH}/images/spritesheets/pokemon/home3d-icon/shiny" \
  "${BUILD_PATH}" \
  --ext ".png" \
  --cssprefix "pkm-shiny" \
  --responsive \
  --width 192 \
  --height 192 \
  --padding 4 \
  --sorting "${BUILD_PATH}/pokemon-index.json" \
  --prepend \
  "${ASSETS_PATH}/images/pokemon/home3d-icon/unknown-swsh.png" \
  "${ASSETS_PATH}/images/pokemon/home3d-icon/unknown-sv.png" \
  "${ASSETS_PATH}/images/pokemon/home3d-icon/substitute.png" \
  "${ASSETS_PATH}/images/pokemon/home3d-icon/egg.png"

PKM3D_EXTRA_CSS="
.pkm.shiny,
.pkm.shiny-on-hover:hover,
.shiny-on-hover .pkm:hover {
  background-image: url(../shiny/spritesheet.webp);
}
"

echo $PKM3D_EXTRA_CSS >> "${ASSETS_PATH}/images/spritesheets/pokemon/home3d-icon/regular/spritesheet.css"

# ----------------------------------------------------------------------
