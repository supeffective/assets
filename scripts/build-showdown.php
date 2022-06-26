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

    $shdPokemonById = sgg_json_decode_file(__DIR__ . '/../build/showdown/pokedex.json')['Pokedex'];

    $importData = function (array $pkm, array $shdPkm) use ($dataSetById, $shdPokemonById) {
        if (!isset($shdPkm['baseStats']) && $pkm['isForm']) {
            $shdPkm = $shdPokemonById[$dataSetById[$pkm['baseSpecies']]['refs']['showdown']] ?? [];
        }
        if (!isset($shdPkm['baseStats'])) {
            echo "Missing showdown base stats for " . $pkm['id'] . "\n";

            return;
        }
        $outputFile = 'sources/pokemon/entries/' . $pkm['id'] . '.json';
        $newPkm = array_merge($pkm, [
            'baseStats' => $shdPkm['baseStats'],
            //            'abilities' => [
            //                'primary' => $shdPkm['abilities']['0'] ?? null,
            //                'secondary' => $shdPkm['abilities']['1'] ?? null,
            //                'hidden' => $shdPkm['abilities']['H'] ?? null,
            //            ],
        ]);
        $newPkm['height']['min'] = $newPkm['height']['max'] = $newPkm['height']['alpha'] = -1;
        $newPkm['weight']['min'] = $newPkm['weight']['max'] = $newPkm['weight']['alpha'] = -1;
        $newPkm['height']['avg'] = $shdPkm['heightm'] ?? -1;
        $newPkm['weight']['avg'] = $shdPkm['weightkg'] ?? -1;
        sgg_data_save($outputFile, $newPkm, false);
    };

    foreach ($dataSetById as $id => $data) {
        if ($data['dexNum'] >= 9000) {
            continue;
        }
        $shdId = $data['refs']['showdown'] ?? '_none_';
        if (!isset($shdPokemonById[$shdId])) {
            echo "Missing showdown ID for pokemon $id\n";
            continue;
        }

        $importData($data, $shdPokemonById[$shdId]);
    }


    echo "[OK] Build finished!\n";
})();
