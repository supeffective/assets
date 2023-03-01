<?php

declare(strict_types=1);
require_once __DIR__ . '/_bootstrap.php';

// Edit and run this script to quickly modify/migrate the structure of data files.
//          Usage:    make migrate
//
// Do not commit migration-specific changes of this file to the repository, copy it under archived/ once you run it
// and add a die() on top of it, then discard the changes on this file (except template changes), to reuse it again.
//

(static function () use ($argv) {
    error_reporting(-1);

    $firstArg = $argv[1];
    if (empty($firstArg)) {
        throw new Exception("Missing first argument (pokemon slug)");
    }

    $pkmIdParts = explode('-', $firstArg, 2);
    if (count($pkmIdParts) < 2) {
        $pkmIdParts[] = null;
    }

    $pkmId = $firstArg;
    [$pkmSpeciesId, $pkForm] = $pkmIdParts;

    $dataTemplateArr = sgg_json_decode_file(__DIR__ . '/poke-entry.tpl.json');
    $outputFile = 'sources/pokemon/entries/' . $pkmId . '.json';

    if (file_exists($outputFile)) {
        throw new Exception("Pokemon entry for '$pkmId' already exists");
    }
    $pokeIndex = sgg_data_load('sources/pokemon.json');


    $pkm = array_merge($dataTemplateArr, [
        'id' => $pkmId,
        'name' => ucfirst($pkmId),
        'formId' => $pkForm,
        'formName' => ($pkForm ? ucfirst($pkForm) : null),
        'forms' => [$pkmId],
        'refs' => array_merge($dataTemplateArr['refs'], [
            "showdown" => $pkmId,
            "showdownDef" => ucfirst($pkmId),
            "serebii" => $pkmId,
            "bulbapedia" => ucfirst($pkmId),
            "homeSprite" => "0000-" . $pkmId,
            "miniSprite" => "0000-" . $pkmId
        ])
    ],
    );
    $pokeIndex[] = $pkmId;

    $newPkm = array_merge($dataTemplateArr, $pkm);
    sgg_data_save($outputFile, $newPkm, false);
    sgg_data_save('sources/pokemon.json', $pokeIndex, false);

    echo "[OK] Entry for new Pokemon '$pkmId' added!\n";
})();
