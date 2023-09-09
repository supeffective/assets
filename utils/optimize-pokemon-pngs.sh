#!/bin/bash

POKEIMGDIR=assets/images/pokemon

# Trim gen8-icon (no need to resize because they are 68x56)
echo "Trimming gen8-icon ..."
./utils/trim-pngs.sh ${POKEIMGDIR}/gen8-icon ${POKEIMGDIR}/gen8-icon-trimmed
./utils/trim-pngs.sh ${POKEIMGDIR}/gen8-icon/regular ${POKEIMGDIR}/gen8-icon-trimmed/regular
./utils/trim-pngs.sh ${POKEIMGDIR}/gen8-icon/shiny ${POKEIMGDIR}/gen8-icon-trimmed/shiny
echo "DONE."

# ----
# Trim home2d-icon (no need to resize because they are 128x128)
echo "Trimming home2d-icon ..."
./utils/trim-pngs.sh ${POKEIMGDIR}/home2d-icon ${POKEIMGDIR}/home2d-icon-trimmed
./utils/trim-pngs.sh ${POKEIMGDIR}/home2d-icon/regular ${POKEIMGDIR}/home2d-icon-trimmed/regular
./utils/trim-pngs.sh ${POKEIMGDIR}/home2d-icon/shiny ${POKEIMGDIR}/home2d-icon-trimmed/shiny
echo "DONE."

# ----
# Trim and resize home3d-icon to 192x192 (around <= 50KB per image)
echo "Resizing down home3d-icon to 192x192 ..."
./utils/scaledown-pngs.sh ${POKEIMGDIR}/home3d-icon ${POKEIMGDIR}/home3d-icon-192x192 192x192
./utils/scaledown-pngs.sh ${POKEIMGDIR}/home3d-icon/regular ${POKEIMGDIR}/home3d-icon-192x192/regular 192x192
./utils/scaledown-pngs.sh ${POKEIMGDIR}/home3d-icon/shiny ${POKEIMGDIR}/home3d-icon-192x192/shiny 192x192

echo "Trimming home3d-icon ..."
./utils/trim-pngs.sh ${POKEIMGDIR}/home3d-icon-192x192 ${POKEIMGDIR}/home3d-icon-trimmed
./utils/trim-pngs.sh ${POKEIMGDIR}/home3d-icon-192x192/regular ${POKEIMGDIR}/home3d-icon-trimmed/regular
./utils/trim-pngs.sh ${POKEIMGDIR}/home3d-icon-192x192/shiny ${POKEIMGDIR}/home3d-icon-trimmed/shiny

echo "Resizing down home3d-icon-trimmed to 192x192..."
./utils/scaledown-pngs.sh ${POKEIMGDIR}/home3d-icon ${POKEIMGDIR}/home3d-icon-192x192 192x192
./utils/scaledown-pngs.sh ${POKEIMGDIR}/home3d-icon/regular ${POKEIMGDIR}/home3d-icon-192x192/regular 192x192
./utils/scaledown-pngs.sh ${POKEIMGDIR}/home3d-icon/shiny ${POKEIMGDIR}/home3d-icon-192x192/shiny 192x192
echo "DONE."

# ----
# Clean up temp files
# rm -rf ${POKEIMGDIR}/home3d-icon-192x192
echo "optimize-pokemon-pngs finished successfully."
