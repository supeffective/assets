<?php

declare(strict_types=1);
require_once __DIR__ . '/_bootstrap.php';

// Edit and run this script to quickly modify/migrate the structure of data files.
//          Usage:    make migrate
//
// Do not commit migration-specific changes of this file to the repository, copy it under archived/ once you run it
// and add a die() on top of it, then discard the changes on this file (except template changes), to reuse it again.
//

(static function () {
    error_reporting(-1);

    // template to add new fields in particular positions (or sort existing), to the pokemon entries
    $dataTemplateArr = sgg_json_decode_file(__DIR__ . '/poke-entry.tpl.json');
    $pokemonIds = sgg_get_sorted_pokemon_ids();

    foreach ($pokemonIds as $pkmId) {
        // Quick placeholder entry generator for missing pokes that are present in the sorted list, but don't have an entry
        $pkmFile = 'sources/pokemon/entries/' . $pkmId . '.json';
        if (!file_exists(sgg_get_data_path($pkmFile))) {
            $newPkm = $dataTemplateArr;
            $newPkm['id'] = $pkmId;
            $newPkm['name'] = ucfirst($pkmId);
            $newPkm['isForm'] = str_contains($pkmId, '-');
            sgg_data_save($pkmFile, $newPkm, false);
        }
    }

    $paldeaDex = sgg_data_load('sources/pokedexes/paldea.json');
    $paldeaAvailable = [];
    foreach ($paldeaDex as $pk) {
        foreach ($pk['forms'] as $form) {
            $paldeaAvailable[$form] = $form;
        }
    }
    $dataSet = sgg_get_merged_pkm_entries();
    foreach ($dataSet as $i => $pkm) {
        $pkmId = $pkm['id'];

        $outputFile = 'sources/pokemon/entries/' . $pkmId . '.json';

        /* --- START $newPkm data transformation */

        $newPkm = array_merge($dataTemplateArr, $pkm);
        // TODO modify $newPkm here, e.g.:
        if (isset($paldeaAvailable[$pkmId])) {
            $newPkm['obtainableIn'][] = 'sv';
            $newPkm['obtainableIn'] = array_values(array_unique($newPkm['obtainableIn']));
            sort($newPkm['obtainableIn']);

            $newPkm['storableIn'][] = 'sv';
            $newPkm['storableIn'] = array_values(array_unique($newPkm['storableIn']));

            sort($newPkm['storableIn']);
        }

        /* --- END $newPkm data transformation */
        // save pkm entry
        sgg_data_save($outputFile, $newPkm, false);
    }

    echo "[OK] Build finished!\n";
})();