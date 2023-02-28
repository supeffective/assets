#!/usr/bin/env bash

set -e

# cd to /scripts/dumper-showdown
cd /usr/src/app

echo "  >> Running ./dumper-showdown/build.sh"

# install deps
rm -f package-lock.json
# npm install
# npm upgrade pokemon-showdown

if [[ ! -f "node_modules/pokemon-showdown/config/config.js" ]]; then
  mkdir -p node_modules/pokemon-showdown/config
  cp -f config-example.cjs node_modules/pokemon-showdown/config.js
  cp -f config-example.cjs node_modules/pokemon-showdown/config-example.js
  cp -f config-example.cjs node_modules/pokemon-showdown/config/config.js
  cp -f config-example.cjs node_modules/pokemon-showdown/config/config-example.js
fi

# build showdown project
cd node_modules/pokemon-showdown
npm run build || exit 1 # build showdown project
cd -

# generate JSON files
node dump.cjs || exit 1

if [[ ! -f "./build/pokedex.json" ]]; then
  echo "JSON files haven't been correctly generated under ./build/data"
  exit 1
fi

# copy generated files
sleep 2
mkdir -p ./dist
cp -R ./build/*.json ./dist

# cleanup
sleep 2
rm -rf ./build
rm -f "./dist/**/*.js" ./dist/mods_*
rm -rf "./dist/mods" "./dist/text"

echo "DONE."
