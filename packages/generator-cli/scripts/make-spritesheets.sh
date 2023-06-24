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
BUILD_PATH="${APP_DIR}/.local/build"

mkdir -p "${BUILD_PATH}"

# 2D, regular
./packages/admin-cli/dist/index.mjs mount-spritesheet \
  "${ASSETS_PATH}/images/pokemon/2d-68x56px/regular" \
  "${ASSETS_PATH}/dist/images/pokemon-spritesheets/2d/regular" \
  "${BUILD_PATH}" \
  --ext ".png" \
  --cssprefix "pkmm" \
  --responsive \
  --no-webp \
  --width 68 \
  --height 56 \
  --padding 4 \
  --sorting "${BUILD_PATH}/pokemon-sprites-miniSprite.json" \
  --prepend \
  "${ASSETS_PATH}/images/pokemon/2d-68x56px/unknown-swsh.png" \
  "${ASSETS_PATH}/images/pokemon/2d-68x56px/unknown-sv.png" \
  "${ASSETS_PATH}/images/pokemon/2d-68x56px/substitute.png" \
  "${ASSETS_PATH}/images/pokemon/2d-68x56px/egg.png"

# 2D, shiny
./packages/admin-cli/dist/index.mjs mount-spritesheet \
  "${ASSETS_PATH}/images/pokemon/2d-68x56px/shiny" \
  "${ASSETS_PATH}/dist/images/pokemon-spritesheets/2d/shiny" \
  "${BUILD_PATH}" \
  --ext ".png" \
  --cssprefix "pkmm-shiny" \
  --responsive \
  --no-webp \
  --width 68 \
  --height 56 \
  --padding 4 \
  --sorting "${BUILD_PATH}/pokemon-sprites-miniSprite.json" \
  --prepend \
  "${ASSETS_PATH}/images/pokemon/2d-68x56px/unknown-swsh.png" \
  "${ASSETS_PATH}/images/pokemon/2d-68x56px/unknown-sv.png" \
  "${ASSETS_PATH}/images/pokemon/2d-68x56px/substitute.png" \
  "${ASSETS_PATH}/images/pokemon/2d-68x56px/egg.png"

PKM2D_EXTRA_CSS="
.pkmm.shiny,
.pkmm.shiny-on-hover:hover,
.shiny-on-hover .pkmm:hover {
  background-image: url(../shiny/spritesheet.png);
}
"

echo $PKM2D_EXTRA_CSS >> "${ASSETS_PATH}/dist/images/pokemon-spritesheets/2d/regular/spritesheet.css"

# 3D, regular
./packages/admin-cli/dist/index.mjs mount-spritesheet \
  "${ASSETS_PATH}/images/pokemon/3d-512x512px/regular" \
  "${ASSETS_PATH}/dist/images/pokemon-spritesheets/3d/regular" \
  "${BUILD_PATH}" \
  --ext ".png" \
  --cssprefix "pkm" \
  --responsive \
  --width 160 \
  --height 160 \
  --padding 4 \
  --sorting "${BUILD_PATH}/pokemon-sprites-homeSprite.json" \
  --prepend \
  "${ASSETS_PATH}/images/pokemon/3d-512x512px/unknown-swsh.png" \
  "${ASSETS_PATH}/images/pokemon/3d-512x512px/unknown-sv.png" \
  "${ASSETS_PATH}/images/pokemon/3d-512x512px/egg.png"

# 3D, shiny
./packages/admin-cli/dist/index.mjs mount-spritesheet \
  "${ASSETS_PATH}/images/pokemon/3d-512x512px/shiny" \
  "${ASSETS_PATH}/dist/images/pokemon-spritesheets/3d/shiny" \
  "${BUILD_PATH}" \
  --ext ".png" \
  --cssprefix "pkm-shiny" \
  --responsive \
  --width 160 \
  --height 160 \
  --padding 4 \
  --sorting "${BUILD_PATH}/pokemon-sprites-homeSprite.json" \
  --prepend \
  "${ASSETS_PATH}/images/pokemon/3d-512x512px/unknown-swsh.png" \
  "${ASSETS_PATH}/images/pokemon/3d-512x512px/unknown-sv.png" \
  "${ASSETS_PATH}/images/pokemon/3d-512x512px/egg.png"

PKM3D_EXTRA_CSS="
.pkm.shiny,
.pkm.shiny-on-hover:hover,
.shiny-on-hover .pkm:hover {
  background-image: url(../shiny/spritesheet.webp);
}
"

echo $PKM3D_EXTRA_CSS >> "${ASSETS_PATH}/dist/images/pokemon-spritesheets/3d/regular/spritesheet.css"
