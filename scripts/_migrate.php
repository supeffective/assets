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

    // template to add new fields in particular positions (or sort existing), to the pokemon entries
    $dataTemplate = <<<JSON
{
    "id": null,
    "nid": null,
    "dexNum": null,
    "formId": null,
    "name": null,
    "formName": null,
    "region": null,
    "generation": null,
    "type1": null,
    "type2": null,
    "color": null,
    "abilities": {
        "primary": null,
        "secondary": null,
        "hidden": null
    },
    "isLegendary": null,
    "isMythical": null,
    "isDefault": null,
    "isForm": null,
    "isSpecialAbilityForm": null,
    "isCosmeticForm": null,
    "isFemale": null,
    "hasGenderDifferences": null,
    "isBattleOnlyForm": null,
    "isSwitchableForm": null,
    "isFusion": null,
    "fusedWith": null,
    "isMega": null,
    "isPrimal": null,
    "isRegional": null,
    "isGmax": null,
    "canGmax": null,
    "canDynamax": null,
    "canBeAlpha": null,
    "obtainableIn": [],
    "transferableTo": [],
    "shinyReleased": null,
    "baseStats": {
        "hp": null,
        "atk": null,
        "def": null,
        "spa": null,
        "spd": null,
        "spe": null
    },
    "goStats": {
        "maxCP": null,
        "attack": null,
        "defense": null,
        "stamina": null
    },
    "weight": {
        "avg": null,
        "min": null,
        "max": null,
        "alpha": null
    },
    "height": {
        "avg": null,
        "min": null,
        "max": null,
        "alpha": null
    },
    "maleRate": null,
    "femaleRate": null,
    "refs": [],
    "baseSpecies": null,
    "baseForms": [],
    "forms": null,
    "evolutions": []
}
JSON;

    $dataTemplateArr = sgg_json_decode($dataTemplate);

    foreach ($dataSet as $i => $pkm) {
        $pkmId = $pkm['id'];

        // TODO rename entries-tmp to entries if changes are ok
        $outputFile = 'pokemon/entries/' . $pkmId . '.json';

        /* --- START $newPkm data transformation */

        // TODO modify $newPkm here, e.g.:
        $newPkm = array_merge($dataTemplateArr, $pkm);

        /* --- END $newPkm data transformation */
        // save pkm entry
        sgg_data_save($outputFile, $newPkm, false);
    }

    echo "[OK] Build finished!\n";
})();
