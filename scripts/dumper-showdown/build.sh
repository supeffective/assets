#!/usr/bin/env bash

rm -rf "${OUTPUT_DIR}" ./dist
mkdir -p "${OUTPUT_DIR}"

if [[ ! -d "node_modules/pokemon-showdown" ]]; then
  npm install || exit 1
fi

if [[ ! -f "node_modules/pokemon-showdown/config/config-example.js" ]]; then
  cp config-example.js node_modules/pokemon-showdown/config/config-example.js
fi

# shellcheck disable=SC2164
cd node_modules/pokemon-showdown
npm run build || exit 1 # build showdown project
# shellcheck disable=SC2164
# shellcheck disable=SC2103
cd -

node dump.js || exit 1

sleep 3
cp -R ./dist/.data-dist/* "${OUTPUT_DIR}"

sleep 3
rm -f "${OUTPUT_DIR}/**/*.js"
rm -rf "${OUTPUT_DIR}/mods" "${OUTPUT_DIR}/text"
