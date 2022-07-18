<?php

declare(strict_types=1);
require_once __DIR__ . '/_bootstrap.php';

// Edit and run this script to quickly modify/migrate the structure of data files.
//          Usage:    make migrate
//
// Do not commit migration-specific changes of this file to the repository, copy it under old-migrations once you run it
// and add a die() on top of it, then discard the changes on this file (except template changes), to reuse it again.
//

(static function () {
    error_reporting(-1);

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
    "generation": -1,
    "type1": null,
    "type2": null,
    "color": null,
    "abilities": {
        "primary": null,
        "secondary": null,
        "hidden": null
    },
    "isLegendary": false,
    "isMythical": false,
    "isUltraBeast": false,
    "ultraBeastCode": null,
    "isDefault": false,
    "isForm": false,
    "isSpecialAbilityForm": false,
    "isCosmeticForm": false,
    "isFemaleForm": false,
    "hasGenderDifferences": false,
    "isBattleOnlyForm": false,
    "isSwitchableForm": false,
    "isFusion": false,
    "fusedWith": null,
    "isMega": false,
    "isPrimal": false,
    "isRegional": false,
    "isGmax": false,
    "canGmax": false,
    "canDynamax": false,
    "canBeAlpha": false,
    "obtainableIn": [],
    "storableIn": ["home"],
    "shinyReleased": false,
    "baseStats": {
        "hp": -1,
        "atk": -1,
        "def": -1,
        "spa": -1,
        "spd": -1,
        "spe": -1
    },
    "goStats": {
        "maxCP": -1,
        "attack": -1,
        "defense": -1,
        "stamina": -1
    },
    "weight": {
        "avg": "-1kg",
        "min": "-1kg",
        "max": "-1kg",
        "alpha": "-1kg"
    },
    "height": {
        "avg": "-1m",
        "min": "-1m",
        "max": "-1m",
        "alpha": "-1m"
    },
    "maleRate": -1,
    "femaleRate": -1,
    "refs": {
        "pogo": null,
        "veekunDb": null,
        "smogon": null,
        "showdown": null,
        "showdownDef": null,
        "serebii": null,
        "bulbapedia": null,
        "homeSprite": null,
        "miniSprite": null
    },
    "baseSpecies": null,
    "baseForms": [],
    "forms": [],
    "evolutions": []
}
JSON;

    $dataTemplateArr = sgg_json_decode($dataTemplate);
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

    //  $pokemonIdsMap = array_combine($pokemonIds, $pokemonIds);
    $dataSet = sgg_get_merged_pkm_entries();
    $dataSetById = array_combine(array_column($dataSet, 'id'), $dataSet);
    [$galarList, $isleArmorList, $crownTundraList, $othersList] = sgg_data_load(
        'sources/pokemon/storable-sword-shield.json'
    );
    $allStorablePkm = [];

    $generateDex = static function (array $pkmIdList, string $fileName) use ($dataSetById, &$allStorablePkm) {
        $dex = [];
        $dexNum = 0;
        foreach ($pkmIdList as $i => $pkmId) {
            $femalePkmId = $pkmId . '-f';
            if (!isset($dataSetById[$pkmId])) {
                throw new \RuntimeException('Missing pokemon entry for: ' . $pkmId);
            }
            if (!in_array($pkmId, $allStorablePkm, true)) {
                $allStorablePkm[] = $pkmId;
            }
            if (!isset($dataSetById[$femalePkmId]) && !in_array($femalePkmId, $allStorablePkm, true)) {
                // add female variant
                $allStorablePkm[] = $femalePkmId;
            }
            $pkm = $dataSetById[$pkmId];
            if ($pkm['isForm']) {
                continue;
            }
            $dexNum++;
            $dex[] = [
                'id' => $pkmId,
                'dexNum' => $dexNum,
                'forms' => $pkm['forms'],
            ];
        }
        sgg_data_save("sources/pokedexes/{$fileName}.json", $dex, false);
    };

    $generateDex($galarList, 'galar');
    $generateDex($isleArmorList, 'galar-isle-armor');
    $generateDex($crownTundraList, 'galar-crown-tundra');
    $generateDex($othersList, 'galar-other');


    foreach ($dataSet as $i => $pkm) {
        $pkmId = $pkm['id'];

        $outputFile = 'sources/pokemon/entries/' . $pkmId . '.json';

        /* --- START $newPkm data transformation */

        // TODO modify $newPkm here, e.g.:
        $newPkm = array_merge($dataTemplateArr, $pkm);

        $gameSetId = 'swsh';
        if (!in_array($gameSetId, $newPkm['storableIn'], true) && in_array($pkmId, $allStorablePkm, true)) {
            $newPkm['obtainableIn'][] = $gameSetId;
            $newPkm['storableIn'][] = $gameSetId;

            $newPkm['obtainableIn'] = array_unique($newPkm['obtainableIn']);
            sort($newPkm['obtainableIn']);
            $newPkm['storableIn'] = array_unique($newPkm['storableIn']);
            sort($newPkm['storableIn']);
        }

        /* --- END $newPkm data transformation */
        // save pkm entry
        sgg_data_save($outputFile, $newPkm, false);
    }

    echo "[OK] Build finished!\n";
})();
