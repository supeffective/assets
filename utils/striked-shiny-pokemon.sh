#!/bin/bash

set -e # exit when any command fails

POKEMON_NID=$1
FILL_COLOR=${3:-'#777777'}
LINE_COLOR=${4:-'#FF6204'} # orange

VARIANT_DIRS=(home2d-icon home2d-icon-trimmed home3d-icon home3d-icon-trimmed)
VARIANT_DIRS_THIN=(gen8-icon gen8-icon-trimmed)

for VARIANT_DIR in "${VARIANT_DIRS[@]}"; do
  SRC_DIR="assets/images/pokemon/${VARIANT_DIR}/regular/${POKEMON_NID}.png"
  DEST_DIR="assets/images/pokemon/${VARIANT_DIR}/shiny/${POKEMON_NID}.png"
  LINE_WIDTH=8
  PADDING=10

  ./utils/striked-silouetthe.sh "$SRC_DIR" "$DEST_DIR" "$FILL_COLOR" "$LINE_COLOR" "$LINE_WIDTH" "$PADDING"
done

for VARIANT_DIR in "${VARIANT_DIRS_THIN[@]}"; do
  SRC_DIR="assets/images/pokemon/${VARIANT_DIR}/regular/${POKEMON_NID}.png"
  DEST_DIR="assets/images/pokemon/${VARIANT_DIR}/shiny/${POKEMON_NID}.png"
  LINE_WIDTH=2
  PADDING=2

  ./utils/striked-silouetthe.sh "$SRC_DIR" "$DEST_DIR" "$FILL_COLOR" "$LINE_COLOR" "$LINE_WIDTH" "$PADDING"
done
