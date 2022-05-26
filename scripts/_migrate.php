<?php

declare(strict_types=1);
require_once __DIR__ . '/_bootstrap.php';

// Edit and run this script to quickly modify/migrate the structure of the pokemon.json data file.
//          Usage:    php scripts/_migrate.php
//
// Do not commit migration-specific changes of this file to the repository.
//

(static function () {
    error_reporting(-1);
    $dataSet = sgg_get_merged_pkm_entries();

    foreach ($dataSet as $i => $pkm) {
        $pkmId = $pkm['id'];

        $outputFile = sgg_get_data_path(
        // TODO rename entries-tmp to entries if changes are ok
            'pokemon/entries-tmp/' . $pkmId . '.json'
        );

        $newPkm = $pkm;
        /* --- START $newPkm data transformation */
        // TODO: transform data here
        /* --- END $newPkm data transformation */
        // save pkm entry
        sgg_data_save($outputFile, $newPkm, false);
    }

    echo "[OK] Build finished!\n";
})();
