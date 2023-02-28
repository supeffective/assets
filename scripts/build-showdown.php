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

    $showdownEntries = sgg_json_decode_file(__DIR__ . '/dumper-showdown/dist/pokedex.json')['Pokedex'];

    $importData = static function (array $entry, array|null $showdownEntry) use ($entries, $showdownEntries) {
        if ($showdownEntry === null) {
            return;
        }
        if (!isset($showdownEntry['baseStats']) && $entry['isForm'] && $entry['baseSpecies']) {
            $showdownEntry = $showdownEntries[$entries[$entry['baseSpecies']]['refs']['showdown']] ?? [];
        }
        if (!isset($showdownEntry['baseStats'])) {
            echo "Missing showdown base stats for " . $entry['id'] . "\n";

            return;
        }
        $dexNo = $showdownEntry['num'];
        $dexNoPad = sprintf('%04d', $showdownEntry['num']);
        $formId = $entry['formId'];
        if ($formId === null) {
            $formId = explode("-", $entry['id'], 2);
            $formId = isset($formId[1]) ? $formId[1] : null;
        }
        $nid = $dexNoPad;
        if ($formId && $entry['isForm']) {
            $nid .= '-' . $formId;
        }

        $newPkm = sgg_array_merge_deep($entry, [
            'dexNum' => $dexNo,
            'nid' => $nid,
            'formId' => $formId,
            'baseStats' => $showdownEntry['baseStats'],
            'abilities' => [
                'primary' => $showdownEntry['abilities']['0'] ?? null,
                'secondary' => $showdownEntry['abilities']['1'] ?? null,
                'hidden' => $showdownEntry['abilities']['H'] ?? null,
            ],
            'type1' => strtolower($showdownEntry['types'][0] ?? '') ?: null,
            'type2' => strtolower($showdownEntry['types'][1] ?? '') ?: null,
            'color' => strtolower($showdownEntry['color'] ?? '') ?: null,
            //'isForm' => (($showdownEntry['forme'] ?? null) !== null) || str_ends_with($entry['id'], '-f') || str_contains($entry['id'], '--')

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

    $showdownIgnore = ['greninja--battle-bond', 'rockruff--own-tempo', 'zygarde--power-construct', 'zygarde-10--power-construct'];
    $showdownIgnoreFromDexNum = 20000;

    // Import showdown data
    foreach ($entries as $id => $data) {
        if (!in_array($id, $showdownIgnore) && $data['dexNum'] < $showdownIgnoreFromDexNum) {
            $showdownId = isset($showdownMapping[$id]) ? $showdownMapping[$id] : ($data['refs']['showdown'] ?? '???');
            if (!isset($showdownEntries[$showdownId])) {
                echo "Missing or wrong showdown ID '" . $showdownId. "' for pokemon $id\n";
                continue;
            }

            $data = $importData($data, $showdownEntries[$showdownId]);
        }
        if (!$data) {
            echo "No showdown data found for $id";
            continue;
        }
        sgg_data_save(filename: 'sources/pokemon/entries/' . $id . '.json', data: $data, minify: false);
    }

    echo "[OK] Showdown import finished!\n";
})();
