<?php

declare(strict_types=1);
require_once __DIR__ . '/_bootstrap.php';

//
// - Script to import Pokemon Showdown data from dumper-showdown data exports
// - Version: BETA (it may contain errors)
//

(static function () {
    error_reporting(-1);

    $dataSet = sgg_get_merged_pkm_entries();
    $dataSetById = [];
    foreach ($dataSet as $data) {
        $dataSetById[$data['id']] = $data;
    }

    $shdPokemonById = sgg_json_decode_file(__DIR__ . '/../build/showdown/pokedex.json')['Pokedex'];

    $importData = static function (array $pkm, array $extPkm) use ($dataSetById, $shdPokemonById) {
        if (!isset($extPkm['baseStats']) && $pkm['isForm']) {
            $extPkm = $shdPokemonById[$dataSetById[$pkm['baseSpecies']]['refs']['showdown']] ?? [];
        }
        if (!isset($extPkm['baseStats'])) {
            echo "Missing showdown base stats for " . $pkm['id'] . "\n";

            return;
        }
        $outputFile = 'sources/pokemon/entries/' . $pkm['id'] . '.json';
        $newPkm = array_merge($pkm, [
            'baseStats' => $extPkm['baseStats'],
            //            'abilities' => [
            //                'primary' => $shdPkm['abilities']['0'] ?? null,
            //                'secondary' => $shdPkm['abilities']['1'] ?? null,
            //                'hidden' => $shdPkm['abilities']['H'] ?? null,
            //            ],

        ]);
        $newPkm['height']['min'] = $newPkm['height']['max'] = $newPkm['height']['alpha'] = -1;
        $newPkm['weight']['min'] = $newPkm['weight']['max'] = $newPkm['weight']['alpha'] = -1;
        $newPkm['height']['avg'] = $extPkm['heightm'] ?? -1;
        $newPkm['weight']['avg'] = $extPkm['weightkg'] ?? -1;
        sgg_data_save($outputFile, $newPkm, false);
    };

    foreach ($dataSetById as $id => $data) {
        if ($data['dexNum'] >= 10000) { // is temporary pokemon
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