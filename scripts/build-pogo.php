<?php

declare(strict_types=1);
require_once __DIR__ . '/_bootstrap.php';

//
// Splits the big pokemon.json file into smaller files, and generates other kinds of lists, and other tasks.
//
// Do not edit manually the .min.json or .build.json files, use the build.php script instead.
//

(static function () {
    error_reporting(-1);

    $dataSet = sgg_get_merged_pkm_entries();
    $dataSetById = [];
    foreach ($dataSet as $data) {
        $dataSetById[$data['id']] = $data;
    }

    $pogoPokemon = sgg_json_decode_file(__DIR__ . '/../build/pogo/pogo_pokemon.json');
    $pogoPokemonById = [];
    foreach ($pogoPokemon as $data) {
        if ($data === null) {
            continue;
        }
        $pogoId = $data['pokemonId'] ?? null;
        $pogoFormId = $data['form'] ?? null;
        $actualPogoId = $pogoFormId ?? $pogoId;

        if (!$pogoId || isset($pogoPokemonById[$actualPogoId])) {
            continue;
        }
        $pogoPokemonById[$actualPogoId] = $data;
    }

    // Detect megas
    $megaPokemon = [];
    foreach ($pogoPokemon as $data) {
        if ($data === null) {
            continue;
        }
        if (!isset($data['tempEvoOverrides']) || !is_array($data['tempEvoOverrides'])) {
            continue;
        }
        $pogoId = $data['pokemonId'] ?? null;
        $pogoFormId = $data['form'] ?? null;
        $actualPogoId = $pogoFormId ?? $pogoId;

        foreach ($data['tempEvoOverrides'] as $tmpEvo) {
            if (!isset($tmpEvo['tempEvoId'])) {
                continue;
            }
            $megaData = array_merge($data, $tmpEvo);
            unset($megaData['tempEvoOverrides']);
            $megaData['form'] = $actualPogoId . str_replace('TEMP_EVOLUTION_', '_', $tmpEvo['tempEvoId']);
            $megaPokemon[$megaData['form']] = $megaData;
        }
    }

    $pogoPokemonById = array_merge($pogoPokemonById, $megaPokemon);

    foreach ($dataSetById as $id => $data) {
        if ($data['dexNum'] >= 9000) {
            continue;
        }
        if ($data['isGmax']) {
            continue;
        }
        if ($data['refs']['pogo'] === null) {
            echo "      No POGO entry for $id\n";
            continue;
        }
        $pogoId = $data['refs']['pogo'] ?? '_none_';
        if (!isset($pogoPokemonById[$pogoId])) {
            echo "Wrong/Missing POGO ID for pokemon $id . ID was {$pogoId}\n";
            continue;
        }
    }

    echo "[OK] Build finished!\n";
})();
