<?php

declare(strict_types=1);
require_once __DIR__ . '/_bootstrap.php';

//
// Splits the big pokemon.json file into smaller files, and generates other kinds of lists, and other tasks.
//
// Do not edit manually the .min.json files, use the build.php script instead.
//

(static function () {
    error_reporting(-1);

    $dataSet = sgg_get_merged_pkm_entries();
    $dataSetById = [];
    foreach ($dataSet as $data) {
        $dataSetById[$data['id']] = $data;
    }

    $saveMergedPokemonEntries = static function () use ($dataSet, $dataSetById) {
        sgg_data_save(SGG_PKM_ENTRIES_BASE_FILENAME . '.min.json', $dataSet, true);
        sgg_data_save(SGG_PKM_ENTRIES_BASE_FILENAME . '-byid.min.json', $dataSetById, true);
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
            ];
        }
        sgg_data_save(SGG_PKM_ENTRIES_BASE_FILENAME . '-minimal.min.json', $minimalDataSet, true);
    };

    $generateStorablePokemonList = static function () use ($dataSet): void {
        $storableByGame = [];

        foreach (SGG_SUPPORTED_GAMES as $game) {
            foreach ($dataSet as $pkm) {
                if (in_array($game, $pkm['storableIn'], true)) {
                    $storableByGame[$game][] = $pkm['id'];
                }
            }
        }

        foreach ($storableByGame as $game => $pkmIds) {
            sgg_data_save('livingdex/storable-pokemon/' . $game . '/storable-pokemon.min.json', $pkmIds, false);
        }
    };

    $generateMegaPokemonList = static function () use ($dataSet): void {
        $newDataSet = [];

        foreach ($dataSet as $pkm) {
            if (!$pkm['isMega']) {
                continue;
            }
            $newDataSet[] = $pkm['id'];
        }

        sgg_data_save('pokemon/mega-pokemon.min.json', $newDataSet, false);
    };

    $generateGmaxPokemonList = static function () use ($dataSet, $dataSetById): void {
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

        sgg_data_save('pokemon/gigantamaxable-pokemon.min.json', $newDataSet, false);
    };

    $generateAlphaPokemonList = static function () use ($dataSetById): void {
        $newDataSet = [];
        $hisuiPkm = sgg_get_dex_pokemon_ids('pla', 'hisui');

        foreach ($hisuiPkm as $pkmId) {
            $pkm = $dataSetById[$pkmId];
            if ($pkm['canBeAlpha']) {
                $newDataSet[] = $pkm['id'];
            }
        }

        sgg_data_save('pokemon/alpha-pokemon.min.json', $newDataSet, false);
    };

    $prettifyAndMinifyAllJsonFiles = static function (): void {
        $files = sgg_json_files_in_dir_tree(null, true);

        foreach ($files as $fileName) {
            $minFile = str_replace('.json', '.min.json', $fileName);
            $data = sgg_json_decode_file($fileName);
            sgg_json_encode($data, false, $fileName); // prettify
            // sgg_json_encode($data, true, $minFile); // minify
        }
    };

    $generateFullySortedHomePreset = static function () use ($dataSet): void {
        $outputFile = __DIR__ . '/../data/livingdex/box-presets/home/fully-sorted.min.json';
        $preset = [
            'id' => 'fully-sorted',
            'name' => 'Fully Sorted',
            'game' => 'home',
            //'shortDescription' => 'Sorted by Species and their Forms, in their HOME order.',
            "description" => "Pokémon Boxes sorted by Species and Forms, following original Pokémon HOME order.\n"
                . "Every newly introduced form will alter the order of all the following Pokémon.",
            "boxes" => [],

        ];
        $maxPkmPerBox = 30;
        $currentBox = 0;
        foreach ($dataSet as $i => $pkm) {
            if (!in_array('home', $pkm['storableIn'], true)) {
                continue;
            }
            if (
                isset($preset['boxes'][$currentBox])
                && (count($preset['boxes'][$currentBox]['pokemon']) >= $maxPkmPerBox)
            ) {
                $currentBox++;
            }
            if (!isset($preset['boxes'][$currentBox])) {
                $preset['boxes'][$currentBox] = [
                    'title' => 'Box ' . ($currentBox + 1),
                    'pokemon' => [],
                ];
            }
            $preset['boxes'][$currentBox]['pokemon'][] = $pkm['id'];
        }
        sgg_json_encode($preset, false, $outputFile); // prettified
    };

    $generateHisuiBoxesPreset = static function () use ($dataSetById): void {
        $outputFile = __DIR__ . '/../data/livingdex/box-presets/pla/fully-sorted.min.json';
        $hisuiDex = sgg_data_load('pokedexes/pla/hisui-dex.json');
        $preset = [
            'id' => 'fully-sorted',
            'name' => 'Fully Sorted',
            'game' => 'pla',
            //'shortDescription' => 'Sorted by Species and their Forms, in their HOME order.',
            "description" => "Pokémon Boxes sorted by Species and Forms, following original Legends Arceus order.",
            "boxes" => [],
        ];
        $maxPkmPerBox = 30;
        $currentBox = 0;
        foreach ($hisuiDex as $dexPkm) {
            foreach ($dexPkm['forms'] as $pkmId) {
                $pkm = $dataSetById[$pkmId];
                if (!in_array('pla', $pkm['storableIn'], true)) {
                    continue;
                }
                if (
                    isset($preset['boxes'][$currentBox])
                    && (count($preset['boxes'][$currentBox]['pokemon']) >= $maxPkmPerBox)
                ) {
                    $currentBox++;
                }
                if (!isset($preset['boxes'][$currentBox])) {
                    $preset['boxes'][$currentBox] = [
                        'title' => 'Pasture ' . ($currentBox + 1),
                        'pokemon' => [],
                    ];
                }
                $preset['boxes'][$currentBox]['pokemon'][] = $pkm['id'];
            }
        }
        sgg_json_encode($preset, false, $outputFile); // prettified
    };

    // TASKS runner:
    // TODO generate national dex

    $saveMergedPokemonEntries();
    $generatePokemonEntriesMinimal();

    $generateStorablePokemonList();
    $generateFullySortedHomePreset();
    //$generateMegaPokemonList();
    $generateGmaxPokemonList();
    $generateAlphaPokemonList();

    $generateHisuiBoxesPreset();

    $prettifyAndMinifyAllJsonFiles();

    echo "[OK] Build finished!\n";
})();
