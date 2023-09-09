#!/bin/bash

SRC_DIR=$1
DEST_DIR=$2

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

  # Trim and save to new file
  convert "$file" -trim +repage -background transparent -gravity center "$_dest_file"

  # Get the new dimensions, as 1:1 aspect ratio calculating max(widht, height)
  new_extent=$(identify -format "%[fx:max(w,h)]x%[fx:max(w,h)]" "$_dest_file")

  # Fit the image to the new dimensions
  mogrify -format png -background transparent -gravity center -extent "$new_extent" "$_dest_file"
  
  ./utils/optimize-png.sh "$_dest_file"
done
