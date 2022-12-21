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
    $dataSetById = sgg_get_merged_pkm_entries_by_id();

    $saveMergedPokemonEntries = static function () use ($dataSet, $dataSetById) {
        sgg_data_save(SGG_PKM_ENTRIES_BASE_FILENAME . '.json', $dataSet, minify: false);
        sgg_data_save(SGG_PKM_ENTRIES_BASE_FILENAME . '-map.json', $dataSetById, minify: false);
    };

    $generatePokemonEntriesMinimal = static function () use ($dataSet) {
        $minimalDataSet = [];
        foreach ($dataSet as $pkm) {
            $minimalDataSet[] = [
                'id' => $pkm['id'],
                'dexNum' => $pkm['dexNum'],
                'name' => $pkm['name'],
                'type1' => $pkm['type1'],
                'type2' => $pkm['type2'],
                'isForm' => $pkm['isForm'],
                'baseSpecies' => $pkm['baseSpecies'],
                'baseForms' => $pkm['baseForms'],
                'shinyReleased' => $pkm['shinyReleased'],
                'shinyBase' => $pkm['shinyBase'],
                'obtainableIn' => $pkm['obtainableIn'],
                'versionExclusiveIn' => $pkm['versionExclusiveIn'],
                'eventOnlyIn' => $pkm['eventOnlyIn'],
                'storableIn' => $pkm['storableIn'],
            ];
        }
        sgg_data_save(SGG_PKM_ENTRIES_BASE_FILENAME . '-minimal.json', $minimalDataSet, minify: false);
    };

    $generateStorablePokemonList = static function () use ($dataSet): void{
        $storableByGame = [];

        foreach (SGG_SUPPORTED_GAMESETS as $game) {
            foreach ($dataSet as $pkm) {
                if (in_array($game, $pkm['storableIn'], true)) {
                    $storableByGame[$game][] = $pkm['id'];
                }
            }
        }

        foreach ($storableByGame as $game => $pkmIds) {
            sgg_data_save("builds/pokemon/storable/storable-pokemon-{$game}.json", $pkmIds, minify: false);
        }
    };

    $generateObtainablePokemonList = static function () use ($dataSet): void{
        $availableByGame = [];

        foreach (SGG_SUPPORTED_GAMESETS as $game) {
            foreach ($dataSet as $pkm) {
                if (!isset($pkm['obtainableIn']) || !is_array($pkm['obtainableIn'])) {
                    throw new \Exception("obtainableIn is not an array for {$pkm['id']}");
                }
                if (in_array($game, $pkm['obtainableIn'], true)) {
                    $availableByGame[$game][] = $pkm['id'];
                }
            }
        }

        foreach ($availableByGame as $game => $pkmIds) {
            sgg_data_save("builds/pokemon/obtainable/obtainable-pokemon-{$game}.json", $pkmIds, minify: false);
        }
    };

    $generateGmaxPokemonList = static function () use ($dataSet, $dataSetById): void{
        $newDataSet = [];

        foreach ($dataSet as $pkm) {
            if (!$pkm['canGmax']) {
                continue;
            }
            if (!$pkm['canDynamax']) {
                echo "WARNING: {$pkm['id']} can gmax but not dynamax\n";
            }

            $gmaxableName = $pkm['id'] . '-gmax';
            if (!isset($dataSetById[$gmaxableName]) && !str_ends_with($gmaxableName, '-f-gmax')) {
                echo "WARNING: Gigantamax pokemon '$gmaxableName' not found\n";
            }
            $newDataSet[] = $pkm['id'];
        }

        sgg_data_save('builds/pokemon/gigantamaxable-pokemon.json', $newDataSet, minify: false);
    };

    $generateAlphaPokemonList = static function () use ($dataSetById): void{
        $newDataSet = [];
        $hisuiPkm = sgg_get_dex_pokemon_ids('hisui');

        foreach ($hisuiPkm as $pkmId) {
            $pkm = $dataSetById[$pkmId];
            if ($pkm['canBeAlpha']) {
                $newDataSet[] = $pkm['id'];
            }
        }

        sgg_data_save('builds/pokemon/alpha-pokemon.json', $newDataSet, minify: false);
    };

    $prettifyAllJsonFiles = static function (): void{
        $files = sgg_json_files_in_dir_tree('/sources/', false);

        foreach ($files as $fileName) {
            if (
                str_contains($fileName, 'min.json')
                || str_contains($fileName, 'build.json')
            ) {
                continue;
            }

            sgg_json_encode(sgg_json_decode_file($fileName), false, $fileName); // prettify
        }
    };

    $minifyAllJsonFiles = static function (): void{
        $files = sgg_json_files_in_dir_tree('/builds/', false);

        foreach ($files as $fileName) {
            if (
                str_contains($fileName, 'min.json')
            ) {
                continue;
            }
            // $dataPath = rtrim(sgg_get_data_path(), '/');
            $newFilename = str_replace(['.json'], ['.min.json'], $fileName);
            sgg_json_encode(sgg_json_decode_file($fileName), true, $newFilename); // minify
        }
    };

    $generateGameGamesList = static function (): void{
        $gameSets = sgg_data_load('sources/games/game-sets.json');
        $gameList = [];

        foreach ($gameSets as $data) {
            foreach ($data['games'] as $gameId => $gameName) {
                $gameList[] = [
                    'id' => $gameId,
                    'name' => $gameName,
                    'setId' => $data['id'],
                    'supersetId' => $data['superset'],
                ];
            }
        }
        sgg_data_save('builds/games.json', $gameList, minify: false);
    };

    $mergeAllBoxPresets = static function (): void{
        $buildBoxPresetFiles = []; // sgg_json_files_in_dir_tree('builds/box-presets', false);
        $sourceBoxPresetFiles = sgg_json_files_in_dir_tree('sources/box-presets', false);
        $presetsByGameSet = [];
        $unsortedFiles = [];
        $sortedFiles = [];

        // Get all preset files from sources
        foreach ($sourceBoxPresetFiles as $fileName) {
            $presetKey = basename($fileName, '.json');
            $gameSet = basename(dirname($fileName));
            $unsortedFiles[$gameSet][$presetKey] = $fileName;
        }

        // Get all preset files from builds
        foreach ($buildBoxPresetFiles as $fileName) {
            $presetKey = basename($fileName, '.json');
            $gameSet = basename(dirname($fileName));
            $unsortedFiles[$gameSet][$presetKey] = $fileName;
        }

        // Sort preset key alphabetically on every game
        foreach ($unsortedFiles as $gameSet => $presets) {
            $presetKeys = array_keys($presets);
            sort($presetKeys);
            foreach ($presetKeys as $presetKey) {
                $sortedFiles[$gameSet][] = $presets[$presetKey];
            }
        }

        // Merge all presets
        foreach ($sortedFiles as $gameSet => $presetFiles) {
            foreach ($presetFiles as $presetFile) {
                $data = sgg_json_decode_file($presetFile);
                $data['gameSet'] = $gameSet;
                $presetsByGameSet[$gameSet][$data['id']] = $data;
            }
        }
        sgg_data_save('builds/box-presets-full.json', $presetsByGameSet, minify: false); // prettified
    };

    $generateNationalPokedex = static function (): void{
        $pokemonIds = sgg_get_sorted_pokemon_ids();
        $dex = [];

        //$dexNum = 0;
        foreach ($pokemonIds as $pokemonId) {
            $fileName = 'sources/pokemon/entries/' . $pokemonId . '.json';
            $data = sgg_data_load($fileName);
            if ($data['id'] !== $pokemonId) {
                throw new \RuntimeException('ID mismatch: ' . $pokemonId . ' vs ' . $data['id']);
            }
            if ($data['isDefault'] && !$data['isForm']) {
                //$dexNum++;
                $dex[] = [
                    'id' => $pokemonId,
                    'dexNum' => $data['dexNum'],
                    'forms' => $data['forms'],
                ];
            }
        }
        sgg_data_save('builds/pokedexes/national.json', $dex, minify: false); // prettified
    };

    $generatePokemonAvailabilities = static function () use ($dataSet): void{
        $availability = [];
        $unobtainable = [];
        $unobtainableShiny = [];

        foreach ($dataSet as $pkm) {
            $availability[$pkm['id']] = [
                'obtainableIn' => $pkm['obtainableIn'],
                'storableIn' => $pkm['storableIn'],
                'shinyReleased' => $pkm['shinyReleased'],
            ];
            if (empty($pkm['obtainableIn'])) {
                $unobtainable[] = $pkm['id'];
            }
            if (!$pkm['shinyReleased']) {
                $unobtainableShiny[] = $pkm['id'];
            }
        }

        sgg_data_save('builds/pokemon/pokemon-availability.json', $availability, minify: false);
        sgg_data_save('builds/pokemon/pokemon-unobtainable.json', $unobtainable, minify: false);
        sgg_data_save('builds/pokemon/pokemon-unobtainable-shiny.json', $unobtainableShiny, minify: false);
    };

    $generatePokemonGameDebuts = static function () use ($dataSet): void{
        $gameDebuts = [];

        foreach ($dataSet as $pkm) {
            $gameDebuts[$pkm['debutIn']][] = $pkm['id'];
        }

        foreach ($gameDebuts as $game => $pkmIds) {
            sgg_data_save("builds/pokemon/debuts/debut-pokemon-{$game}.json", $pkmIds, minify: false);
        }
    };

    $generateEventOnlyPokemonList = static function () use ($dataSet): void{
        $pkmIds = [];

        foreach ($dataSet as $pkm) {
            if (empty($pkm['obtainableIn']) && !empty($pkm['eventOnlyIn'])) {
                $pkmIds[] = $pkm['id'];
            }
        }

        sgg_data_save("builds/pokemon/pokemon-event-only.json", $pkmIds, minify: false);
    };

    $generateNewFormatPokemonList = static function () use ($dataSet, $dataSetById): void{
        $data = [];
        $sortedPokemonIds = sgg_get_sorted_pokemon_ids();

        foreach ($sortedPokemonIds as $pkid) {
            $pkm = $dataSetById[$pkid];

            if ($pkm['isForm'] === $pkm['isDefault']) {
                throw new \Exception("in $pkid , isForm=isDefault");
            }

            $data[] = [
                'id' => $pkm['id'],
                'dexNum' => $pkm['dexNum'],
                'dexNumId' => $pkm['nid'],
                'name' => $pkm['name'],
                'form' => [
                    'isForm' => $pkm['isForm'] === true,
                    'formName' => $pkm['formName'],
                    'formId' => $pkm['formId'],
                    'speciesId' => $pkm['baseSpecies'],
                ],
                'type1' => $pkm['type1'],
                'type2' => $pkm['type2'],
                'abilities' => array_merge($pkm['abilities'], ['special' => null]),
                'eggGroup1' => null,
                'eggGroup2' => null,
                'color' => $pkm['color'],
                'weight' => $pkm['weight']['avg'],
                'height' => $pkm['height']['avg'],
                'maleRatio' => $pkm['maleRate'],
                'femaleRatio' => $pkm['femaleRate'],
                'baseStats' => $pkm['baseStats'],
                'refs' => $pkm['refs'],
                'flags' => [
                    "isLegendary" => $pkm['isLegendary'],
                    "isMythical" => $pkm['isMythical'],
                    "isUltraBeast" => $pkm['isUltraBeast'],
                    // ultraBeastCode
                    "ultraBeastCode" => $pkm['ultraBeastCode'],
                    "isSpecialAbilityForm" => $pkm['isSpecialAbilityForm'],
                    "isCosmeticForm" => $pkm['isCosmeticForm'],
                    "isFemaleForm" => $pkm['isFemaleForm'],
                    "hasGenderDifferences" => $pkm['hasGenderDifferences'],
                    "isBattleOnlyForm" => $pkm['isBattleOnlyForm'],
                    "isSwitchableForm" => $pkm['isSwitchableForm'],
                    "isFusion" => $pkm['isFusion'],
                    // fusedWith
                    "fusedWith" => $pkm['fusedWith'],
                    "isMega" => $pkm['isMega'],
                    "isPrimal" => $pkm['isPrimal'],
                    "isRegional" => $pkm['isRegional'],
                    "isGmax" => $pkm['isGmax'],
                    "canGmax" => $pkm['canGmax'],
                    "canDynamax" => $pkm['canDynamax'],
                    "canBeAlpha" => $pkm['canBeAlpha'],
                    "shinyReleased" => $pkm['shinyReleased'],
                    // shinyBase (eg. for alcremie, minior)
                    "shinyBase" => $pkm['shinyBase'],
                ],
                'location' => [
                    'originGeneration' => $pkm['generation'],
                    'originRegion' => $pkm['region'],
                    "originGames" => $pkm['debutIn'],
                    "obtainableIn" => $pkm['obtainableIn'],
                    "versionExclusiveIn" => $pkm['versionExclusiveIn'],
                    "eventOnlyIn" => $pkm['eventOnlyIn'],
                    "storableIn" => $pkm['storableIn']
                ],
                'evolvesFrom' => null,
                'changesFrom' => $pkm['baseForms'],
                'formsOrder' => $pkm['forms'],
            ];
        }

        sgg_data_save("builds/pokemon-full-v2.json", $data, minify: false);
    };

    // run TASKS:

    $saveMergedPokemonEntries();
    $generatePokemonEntriesMinimal();

    $generateStorablePokemonList();
    $generateObtainablePokemonList();
    $generatePokemonGameDebuts();
    $generateEventOnlyPokemonList();
    $generatePokemonAvailabilities();

    $generateGmaxPokemonList();
    $generateAlphaPokemonList();

    $generateGameGamesList();
    $mergeAllBoxPresets();
    $generateNationalPokedex();

    $prettifyAllJsonFiles();
    $minifyAllJsonFiles();

    $generateNewFormatPokemonList();

    echo "[OK] Build finished!\n";
})();