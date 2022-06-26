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

    $importData = static function (array $pkm, array $extPkm) use ($dataSetById, $pogoPokemonById) {
        if (!isset($extPkm['stats']) && $pkm['isForm']) {
            $basePogoRef = $dataSetById[$pkm['baseSpecies']]['refs']['pogo'];
            if (!$basePogoRef) {
                throw new \Exception("Missing base POGO reference for species {$pkm['name']}");
            }
            $extPkm = $pogoPokemonById[$basePogoRef] ?? [];
        }
        if (!isset($extPkm['stats'])) {
            echo "Missing POGO base stats for " . $pkm['id'] . "\n";

            return;
        }
        $outputFile = 'sources/pokemon/entries/' . $pkm['id'] . '.json';
        $newPkm = array_merge($pkm, [
            'goStats' => [
                'atk' => $extPkm['stats']['baseAttack'] ?? -1,
                'def' => $extPkm['stats']['baseDefense'] ?? -1,
                'sta' => $extPkm['stats']['baseStamina'] ?? -1,
            ],
        ]);
        sgg_data_save($outputFile, $newPkm, false);
    };

    $formatData = static function (array $pkm) {
        $outputFile = 'sources/pokemon/entries/' . $pkm['id'] . '.json';
        sgg_data_save(
            $outputFile,
            array_merge($pkm, [
                'goStats' => [
                    'atk' => -1,
                    'def' => -1,
                    'sta' => -1,
                ],
            ]),
            false
        );
    };

    foreach ($dataSetById as $id => $data) {
        if ($data['dexNum'] >= 9000) {
            $formatData($data);
            continue;
        }
        if ($data['isGmax']) {
            $formatData($data);
            continue;
        }
        if ($data['refs']['pogo'] === null) {
            echo "      No POGO entry for $id\n";
            $formatData($data);
            continue;
        }
        $pogoId = $data['refs']['pogo'] ?? '_none_';
        if (!isset($pogoPokemonById[$pogoId])) {
            echo "Wrong/Missing POGO ID for pokemon $id . ID was {$pogoId}\n";
            $formatData($data);
            continue;
        }

        $importData($data, $pogoPokemonById[$pogoId]);
    }

    echo "[OK] Build finished!\n";
})();
