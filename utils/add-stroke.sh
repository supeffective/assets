#!/bin/bash

set -e # exit when any command fails

SRC_FILE=$1
DEST_FILE=$2
FILL_COLOR='#000000'
STROKE_WIDTH=4
CANVAS_EXTENT=8 # double the stroke width

if ! command -v mogrify &> /dev/null; then
  echo "mogrify could not be found"
  echo "Please install ImageMagick: https://imagemagick.org/script/download.php"
  exit 1
fi

# echo "Adding a stroke around: '${SRC_FILE}'"

# Check if the input file exists
if [ ! -f "$SRC_FILE" ]; then
    echo "Input file '$SRC_FILE' not found."
    exit 1
fi

# Make canvas bigger
extent=$(identify -format "%[fx:w+${CANVAS_EXTENT}]x%[fx:h+${CANVAS_EXTENT}]" "$SRC_FILE")
convert "$SRC_FILE" -background transparent -extent "$extent" "$DEST_FILE-temp"

# convert "$DEST_FILE-temp" -fill Black -colorize 100 "$DEST_FILE-black.png"

# Add stroke to the image
convert "$DEST_FILE-temp" +write mpr:INP -alpha extract -morphology \
  dilate disk:${STROKE_WIDTH} \( +clone -fill Black -colorize 100 \) +swap -compose CopyOpacity \
  -composite mpr:INP -compose Over -composite "$DEST_FILE"

rm -f "$DEST_FILE-temp"

echo "Image with black stroke created: $DEST_FILE"
