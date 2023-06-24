#!/usr/bin/env bash

# exit when any command fails
set -e

echo "  >> Running update-showdown.sh"

cd ../../

APP_DIR="${PWD}"

if [[ ! -d "${APP_DIR}/packages/website" ]]; then
  echo "Not inside the project root: ${PWD}"
  exit 1
fi

DATA_VENDOR_PATH="${APP_DIR}/packages/data/vendor"
SHOWDOWN_DIR_NAME="pkmn-ps-showdown"
SHOWDOWN_PATH="${APP_DIR}/packages/data/vendor/${SHOWDOWN_DIR_NAME}"

rm -rf "$SHOWDOWN_PATH"
mkdir -p "${DATA_VENDOR_PATH}"

if [[ ! -d "${SHOWDOWN_PATH}/.git" ]]; then
  cd "${DATA_VENDOR_PATH}"
  git clone https://github.com/pkmn/ps.git ${SHOWDOWN_DIR_NAME}
  cd -
else
  cd "${SHOWDOWN_PATH}"
  git reset --hard
  git pull
  cd -
fi

if [[ ! -d "${SHOWDOWN_PATH}/.git" ]]; then
    echo "(admin-cli) ERROR: ${SHOWDOWN_PATH} not cloned properly"
    exit 1
fi

echo "DONE."
