#!/bin/bash

SRC_DIR=$1

# Loop through all PNG files recursively
find ${SRC_DIR} -type f -name "*.png" | while read file; do
  # Get the file name without the path
  _filename=$(basename -- "$file")
  _dirname=$(dirname -- "$file")
  _trimmed_dirname="${_dirname}-trimmed"
  _trimmed_filename="${_trimmed_dirname}/${_filename}"
#   echo $_trimmed_dirname
  if [ ! -d "$_trimmed_dirname" ]; then
    mkdir -p "$_trimmed_dirname"
  fi
#   echo "Processing $file"

    echo $_trimmed_filename

  # Calculate the extent using identify
#   extent=$(identify -format "%[fx:max(w,h)]x%[fx:max(w,h)]" "$file")

  # Trim, make square, and save the edited image
  convert "$file" -trim +repage -background transparent -gravity center "$_trimmed_filename"

  new_extent=$(identify -format "%[fx:max(w,h)]x%[fx:max(w,h)]" "$_trimmed_filename")

  mogrify -format png -background transparent -gravity center -extent "$new_extent" "$_trimmed_filename"
done