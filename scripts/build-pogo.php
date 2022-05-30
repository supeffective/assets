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
    $unreleasedPogoPkm = [];
    $pogoPkmSlugs = [];

    foreach ($pogoPokemon as $pkm) {
        if ($pkm === null) {
            continue;
        }

        $pkId = $pkm['pokemonId'] ?? null;
        if (!$pkId) {
            continue;
        }
        $pkForm = $pkm['form'] ?? null;
        $pkFormShort = $pkForm ? str_replace($pkId . '_', '', $pkForm) : null;

        $normalizedPkId = strtolower($pkId . ($pkFormShort ? '-' . $pkFormShort : ''));
        $quickMoves = $pkm['quickMoves'] ?? [];
        $cinematicMoves = $pkm['cinematicMoves'] ?? [];
        $struggleSet = ['STRUGGLE'];

        if ($quickMoves === $struggleSet && $cinematicMoves === $struggleSet) {
            $unreleasedPogoPkm[] = $normalizedPkId;
            continue;
        }
        $pogoPkmSlugs[] = $normalizedPkId;
    }

    // THIS script needs more polishing, because it is not accurate.
    print_r($pogoPkmSlugs);
    echo "\n\n UNRELEASED POKEMON?? :\n";
    print_r($unreleasedPogoPkm);

    echo "[OK] Build finished!\n";
})();
