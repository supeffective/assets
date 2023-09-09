#!/bin/bash

SRC_DIR=$1
DEST_DIR=$2

mkdir -p ${DEST_DIR}

# Loop through all PNG files of SRC_DIR (non-recursively)
for file in ${SRC_DIR}/*.png; do
  _filename=$(basename -- "$file")
  # _dirname=$(dirname -- "$file")
  # _trimmed_dirname="${_dirname}-trimmed"
  _trimmed_filename="${DEST_DIR}/${_filename}"

  # if [ ! -d "$_trimmed_dirname" ]; then
  #   mkdir -p "$_trimmed_dirname"
  # fi

  if [ -f "$_trimmed_filename" ]; then
      # echo "$_trimmed_filename exists, skipping..."
      continue
  fi

  echo $_trimmed_filename

  # # Trim and save to new file
  # convert "$file" -trim +repage -background transparent -gravity center "$_trimmed_filename"

  # # Get the new dimensions, as square
  # new_extent=$(identify -format "%[fx:max(w,h)]x%[fx:max(w,h)]" "$_trimmed_filename")

  # # Fit the image to the new dimensions
  # mogrify -format png -background transparent -gravity center -extent "$new_extent" "$_trimmed_filename"
done