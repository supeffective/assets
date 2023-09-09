#!/bin/bash

SRC_DIR=$1
DEST_DIR=$2
FIT_SIZE=${3:-'128x128'}

if ! command -v mogrify &> /dev/null; then
  echo "mogrify could not be found"
  echo "Please install ImageMagick: https://imagemagick.org/script/download.php"
  exit 1
fi

mkdir -p ${DEST_DIR}

# Loop through all PNG files of SRC_DIR (non-recursively)
for file in ${SRC_DIR}/*.png; do
  _filename=$(basename -- "$file")
  _dest_file="${DEST_DIR}/${_filename}"

  if [ -f "$_dest_file" ]; then
      continue
  fi

  echo "Processing $_dest_file ..."

  # Fit the image into the new dimensions
  # The key part here is the -resize option with the > symbol, 
  # which ensures that the image will only be resized if its dimensions  
  # exceed $FIT_SIZE pixels. If the image is smaller, it will remain unchanged, not scaled up.
  # This prevents upscaling of smaller images and the subsequent loss of quality.

  convert "$file" -format png -resize "$FIT_SIZE>" -background transparent -gravity center -extent "$FIT_SIZE" "$_dest_file"
  
  ./utils/optimize-png.sh "$_dest_file"
done
