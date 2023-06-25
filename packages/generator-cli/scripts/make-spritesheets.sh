#!/usr/bin/env bash

# exit when any command fails
set -e

APP_DIR="${PWD}/${1}"

if [[ ! -d "${APP_DIR}/packages/generator-cli" ]]; then
  echo "Not inside the project root: ${PWD}"
  exit 1
fi

if ! command -v mogrify &> /dev/null; then
  echo "mogrify could not be found"
  echo "Please install ImageMagick: https://imagemagick.org/script/download.php"
  exit 1
fi

# same for optipng:
if ! command -v optipng &> /dev/null; then
  echo "optipng could not be found"
  echo "Please install optipng: https://sourceforge.net/projects/optipng/files/optipng/"
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
  "${ASSETS_PATH}/images/pokemon/home3d-icon/unknown.png" \
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

# 2D (render), regular
pnpm cli mount-spritesheet \
  "${ASSETS_PATH}/images/pokemon/home2d-icon/regular" \
  "${ASSETS_PATH}/images/spritesheets/pokemon/home2d-icon/regular" \
  "${BUILD_PATH}" \
  --ext ".png" \
  --cssprefix "pkm" \
  --responsive \
  --width 128 \
  --height 128 \
  --padding 4 \
  --sorting "${BUILD_PATH}/pokemon-index.json" \
  --prepend \
  "${ASSETS_PATH}/images/pokemon/home2d-icon/unknown.png" \
  "${ASSETS_PATH}/images/pokemon/home2d-icon/unknown-sv.png" \
  "${ASSETS_PATH}/images/pokemon/home2d-icon/substitute.png" \
  "${ASSETS_PATH}/images/pokemon/home2d-icon/egg.png"

# 2D (render), shiny
pnpm cli mount-spritesheet \
  "${ASSETS_PATH}/images/pokemon/home2d-icon/shiny" \
  "${ASSETS_PATH}/images/spritesheets/pokemon/home2d-icon/shiny" \
  "${BUILD_PATH}" \
  --ext ".png" \
  --cssprefix "pkm-shiny" \
  --responsive \
  --width 192 \
  --height 192 \
  --padding 4 \
  --sorting "${BUILD_PATH}/pokemon-index.json" \
  --prepend \
  "${ASSETS_PATH}/images/pokemon/home2d-icon/unknown.png" \
  "${ASSETS_PATH}/images/pokemon/home2d-icon/unknown-sv.png" \
  "${ASSETS_PATH}/images/pokemon/home2d-icon/substitute.png" \
  "${ASSETS_PATH}/images/pokemon/home2d-icon/egg.png"

PKM3D_EXTRA_CSS="
.pkm.shiny,
.pkm.shiny-on-hover:hover,
.shiny-on-hover .pkm:hover {
  background-image: url(../shiny/spritesheet.webp);
}
"

echo $PKM3D_EXTRA_CSS >> "${ASSETS_PATH}/images/spritesheets/pokemon/home2d-icon/regular/spritesheet.css"

# ----------------------------------------------------------------------

# ribbons (gen 9 style)
pnpm cli mount-spritesheet \
  "${ASSETS_PATH}/images/ribbons/gen9-style" \
  "${ASSETS_PATH}/images/spritesheets/ribbons/gen9-style" \
  "${BUILD_PATH}" \
  --ext ".png" \
  --cssprefix "ribbon" \
  --responsive \
  --width 128 \
  --height 128 \
  --padding 4 \
  --sorting "${BUILD_PATH}/ribbons-index.json"

# ----------------------------------------------------------------------

# marks (gen 9 style)
# --- TODO: uncomment when all the mark images are ready
# pnpm cli mount-spritesheet \
#   "${ASSETS_PATH}/images/marks/gen9-style" \
#   "${ASSETS_PATH}/images/spritesheets/marks/gen9-style" \
#   "${BUILD_PATH}" \
#   --ext ".png" \
#   --cssprefix "mark" \
#   --responsive \
#   --width 128 \
#   --height 128 \
#   --padding 4 \
#   --sorting "${BUILD_PATH}/marks-index.json"

# ----------------------------------------------------------------------

# items (gen 9 style)
# --- TODO: uncomment when all the items images are ready
# pnpm cli mount-spritesheet \
#   "${ASSETS_PATH}/images/items/gen9-style" \
#   "${ASSETS_PATH}/images/spritesheets/items/gen9-style" \
#   "${BUILD_PATH}" \
#   --ext ".png" \
#   --cssprefix "item" \
#   --responsive \
#   --width 128 \
#   --height 128 \
#   --padding 4 \
#   --sorting "${BUILD_PATH}/items-index.json"

# ----------------------------------------------------------------------
