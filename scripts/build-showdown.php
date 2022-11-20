<?php

declare(strict_types=1);
require_once __DIR__ . '/_bootstrap.php';

//
// - Script to import Pokemon Showdown data from dumper-showdown data exports
//    - It iterates the data/pokemon.json file to find the entries in the Showdown data.
//    - It works for new Pokemon that don't have individual .json entries yet (creating them if they don't exist).
//
// - Version: BETA (it may contain errors)
//

(static function () {
    error_reporting(-1);

    $entryTemplate = sgg_json_decode_file(__DIR__ . '/poke-entry.tpl.json');
    $pokemonIds = sgg_get_sorted_pokemon_ids();
    $storedEntries = sgg_get_merged_pkm_entries_by_id(false);
    $entries = [];
    foreach ($pokemonIds as $pid) {
        $entries[$pid] = isset($storedEntries[$pid]) ? sgg_array_merge_deep($entryTemplate, $storedEntries[$pid]) : sgg_array_merge_deep($entryTemplate, [
            'id' => $pid,
            'refs' => [
                'showdown' => str_replace('-', '', $pid),
                'showdownDef' => str_replace(' ', '-', ucwords(str_replace('-', ' ', $pid)))
            ]
        ]);
    }

    $showdownEntries = sgg_json_decode_file(__DIR__ . '/../build/showdown/pokedex.json')['Pokedex'];

    $importData = static function (array $entry, array $showdownEntry) use ($entries, $showdownEntries) {
        if (!isset($showdownEntry['baseStats']) && $entry['isForm']) {
            $showdownEntry = $showdownEntries[$entries[$entry['baseSpecies']]['refs']['showdown']] ?? [];
        }
        if (!isset($showdownEntry['baseStats'])) {
            echo "Missing showdown base stats for " . $entry['id'] . "\n";

            return;
        }
        $newPkm = sgg_array_merge_deep($entry, [
            'baseStats' => $showdownEntry['baseStats'],
            //            'abilities' => [
            //                'primary' => $shdPkm['abilities']['0'] ?? null,
            //                'secondary' => $shdPkm['abilities']['1'] ?? null,
            //                'hidden' => $shdPkm['abilities']['H'] ?? null,
            //            ],

        ]);
        $newPkm['height']['min'] = $newPkm['height']['max'] = $newPkm['height']['alpha'] = -1;
        $newPkm['weight']['min'] = $newPkm['weight']['max'] = $newPkm['weight']['alpha'] = -1;
        $newPkm['height']['avg'] = $showdownEntry['heightm'] ?? -1;
        $newPkm['weight']['avg'] = $showdownEntry['weightkg'] ?? -1;

        return $newPkm;
    };

    $showdownMapping = [
        'tatsugiri-droopy' => 'tatsugiri',
        'tatsugiri-sketchy' => 'tatsugiri',
    ];

    $showdownIgnore = ['num980', 'num987'];
    $showdownIgnoreFromDexNum = 20000;

    // Import showdown data
    foreach ($entries as $id => $data) {
        if ($data['dexNum'] >= $showdownIgnoreFromDexNum || in_array($id, $showdownIgnore)) {
            // is not yet supported by Showdown
            continue;
        }
        $showdownId = isset($showdownMapping[$id]) ? $showdownMapping[$id] : ($data['refs']['showdown'] ?? '???');
        if (!isset($showdownEntries[$showdownId])) {
            echo "Missing or wrong showdown ID '" . $data['refs']['showdown'] . "' for pokemon $id\n";
        }

        //$data = $importData($data, $showdownEntries[$showdownId]);
        sgg_data_save(filename: 'sources/pokemon/entries/' . $id . '.json', data: $data, minify: false);
    }

    echo "[OK] Showdown import finished!\n";
})();