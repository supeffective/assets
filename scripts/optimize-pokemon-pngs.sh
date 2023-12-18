#!/bin/bash

set -e # exit when any command fails

POKEIMGDIR=assets/images/pokemon

# Trim gen8-icon (no need to resize because they are 68x56)
./scripts/prepare-pngs.sh ${POKEIMGDIR}/gen8-icon ${POKEIMGDIR}/gen8-icon-trimmed '68x68'
./scripts/prepare-pngs.sh ${POKEIMGDIR}/gen8-icon/regular ${POKEIMGDIR}/gen8-icon-trimmed/regular '68x68'
./scripts/prepare-pngs.sh ${POKEIMGDIR}/gen8-icon/shiny ${POKEIMGDIR}/gen8-icon-trimmed/shiny '68x68'

# ----
# Trim home2d-icon (no need to resize because they are 128x128)
./scripts/prepare-pngs.sh ${POKEIMGDIR}/home2d-icon ${POKEIMGDIR}/home2d-icon-trimmed '128x128'
./scripts/prepare-pngs.sh ${POKEIMGDIR}/home2d-icon/regular ${POKEIMGDIR}/home2d-icon-trimmed/regular '128x128'
./scripts/prepare-pngs.sh ${POKEIMGDIR}/home2d-icon/shiny ${POKEIMGDIR}/home2d-icon-trimmed/shiny '128x128'

# ----
# Trim and resize home3d-icon to 192x192 (around <= 50KB per image)
./scripts/prepare-pngs.sh ${POKEIMGDIR}/home3d-icon ${POKEIMGDIR}/home3d-icon-trimmed '192x192'
./scripts/prepare-pngs.sh ${POKEIMGDIR}/home3d-icon/regular ${POKEIMGDIR}/home3d-icon-trimmed/regular '192x192'
./scripts/prepare-pngs.sh ${POKEIMGDIR}/home3d-icon/shiny ${POKEIMGDIR}/home3d-icon-trimmed/shiny '192x192'

# ----
# Clean up temp files
# rm -rf ${POKEIMGDIR}/home3d-icon-192x192
echo "DONE! [optimize-pokemon-pngs.sh] finished successfully."
