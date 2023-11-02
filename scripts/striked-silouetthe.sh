#!/bin/bash

set -e # exit when any command fails

SRC_FILE=$1
DEST_FILE=$2
FILL_COLOR=${3:-'#343536'}
LINE_COLOR=${4:-'red'}
LINE_WIDTH=${5:-5}
PADDING=${6:-5}

OPACITY='0.8'

if ! command -v mogrify &> /dev/null; then
  echo "mogrify could not be found"
  echo "Please install ImageMagick: https://imagemagick.org/script/download.php"
  exit 1
fi

echo "Creating a silhouette with a strike line: '${SRC_FILE}'"

# Calculate the extent with 5% padding
extent=$(identify -format "%[fx:w+2*w*0.05]x%[fx:h+2*h*0.05]" "$SRC_FILE")

# Calculate the coordinates for the diagonal line
width=$(identify -format "%[fx:w]" "$SRC_FILE")
height=$(identify -format "%[fx:h]" "$SRC_FILE")
x1=$PADDING
y1=$PADDING
x2=$((width - $PADDING))
y2=$((height - $PADDING))

cp -f "$SRC_FILE" "$DEST_FILE"

# Create the silhouette with the desired fill color
mogrify -format png -colorspace RGB -alpha set -background transparent -fill "$FILL_COLOR" -colorize 100 -channel A -evaluate multiply ${OPACITY} +channel "$DEST_FILE"

# Set opacity of the image to 70%
# convert "$DEST_FILE" -alpha set -channel A -evaluate set 70% "$DEST_FILE"

# Add a diagonal line
convert "$DEST_FILE" -stroke "$LINE_COLOR" -strokewidth ${LINE_WIDTH} -draw "line $x1,$y1 $x2,$y2" "$DEST_FILE-temp"

# Move the temporary file to the destination and clean up
rm -f "$DEST_FILE"
mv "$DEST_FILE-temp" "$DEST_FILE"
rm -f "$DEST_FILE-temp"

echo " > DONE."
