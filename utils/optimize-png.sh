#!/bin/bash

if ! command -v optipng &> /dev/null; then
  echo "optipng could not be found"
  echo "Please install optipng: https://sourceforge.net/projects/optipng/files/optipng/"
  exit 1
fi

SRC_FILE=$1

if [ ! -f "$SRC_FILE" ]; then
  echo "File $SRC_FILE does not exist."
  exit 1
fi

optipng -quiet -o4 -nx "$SRC_FILE" # 24 passes, no palette or depth reduction
# echo "           ↳ [optimized]"
