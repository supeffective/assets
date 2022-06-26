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

    $shdPokemon = sgg_json_decode_file(__DIR__ . '/../build/showdown/pokedex.json')['Pokedex'];

    foreach ($dataSetById as $id => $data) {
        if ($data['dexNum'] >= 9000) {
            continue;
        }
        $shdId = $data['refs']['showdown'] ?? '_none_';
        if (!isset($shdPokemon[$shdId])) {
            echo "Missing showdown ID for pokemon $id\n";
            continue;
        }
    }


    echo "[OK] Build finished!\n";
})();
