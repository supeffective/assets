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
    $baseDir = __DIR__ . '/../data/livingdex';
    $inputFile = $baseDir . '/pokemon.json';
    $outputFile = $baseDir . '/pokemon-tmp.json'; // rename to pokemon.json after migration is successful
    $dataSet = json_decode(file_get_contents($inputFile), true, 512, JSON_THROW_ON_ERROR);
    $newDataSet = [];

    foreach ($dataSet as $i => $pkm) {
        /* --- START $pkm data transformation */
        // TODO: transform data here
        /* --- END $pkm data transformation */
        $newDataSet[] = $pkm;
    }

    $jsonFlags = JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE;
    file_put_contents($outputFile, json_encode($newDataSet, JSON_THROW_ON_ERROR | $jsonFlags));

    echo "[OK] Build finished!\n";
})();
