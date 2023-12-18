#!/bin/bash

set -e # exit when any command fails

POKEIMGDIR=assets/images/pokemon
NEW_SIZE='256x256'
# ----
# Convert home3d-icon sprites
./scripts/convert-sprites-with-stroke.sh ${POKEIMGDIR}/home3d-icon ${POKEIMGDIR}/home3d-icon-bordered "${NEW_SIZE}"
./scripts/convert-sprites-with-stroke.sh ${POKEIMGDIR}/home3d-icon/regular ${POKEIMGDIR}/home3d-icon-bordered/regular "${NEW_SIZE}"
./scripts/convert-sprites-with-stroke.sh ${POKEIMGDIR}/home3d-icon/shiny ${POKEIMGDIR}/home3d-icon-bordered/shiny "${NEW_SIZE}"

# ----
# Clean up temp files
# rm -rf ${POKEIMGDIR}/home3d-icon-192x192
echo "DONE! [convert-sprites.sh] finished successfully."
