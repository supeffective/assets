#!/usr/bin/env bash

POKEMON_JSON_FILE="${OUTPUT_DIR}/pogo_pokemon.json"
MOVES_JSON_FILE="${OUTPUT_DIR}/pogo_moves.json"

rm -f "${OUTPUT_DIR}/*" ./dist
mkdir -p "${OUTPUT_DIR}"

echo "==========================================================="
echo "Running Pogo Dumper"
echo "- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -"
echo "OUTPUT_DIR: ${OUTPUT_DIR}"

mkdir -p "${OUTPUT_DIR}"
rm -f "${OUTPUT_DIR}/"*.json

function prettify_json {
  echo "Prettifying JSON"
  python -m json.tool < "${1}" > "${1}.pretty"
  mv "${1}.pretty" "${1}"
}

echo "Generating Pokemon JSON"
python3 pogo-dumper/dumper.py pokemon > $POKEMON_JSON_FILE
prettify_json $POKEMON_JSON_FILE
#jq . $POKEMON_JSON_FILE > "${POKEMON_JSON_FILE}.tmp"
#rm -f $POKEMON_JSON_FILE && mv "${POKEMON_JSON_FILE}.tmp" $POKEMON_JSON_FILE

echo "Generating Moves JSON"
python3 pogo-dumper/dumper.py moves > $MOVES_JSON_FILE
prettify_json $MOVES_JSON_FILE
echo "- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -"

echo "Done"
echo "==========================================================="
