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

    $generateGamesetBoxesPreset = static function (string $gameSetId, int $maxPkmPerBox = 30, bool $createMinimal = true) use ($dataSetById): void {
        $storables = sgg_data_load("builds/pokemon/storable/storable-pokemon-{$gameSetId}.json");
        $preset = [
            'id' => 'fully-sorted',
            'name' => 'National: Sorted by Forms',
            'version' => 1,
            'gameSet' => $gameSetId,
            "description" => "Pokémon Boxes are sorted following HOME's National Dex order, mixing Species and Forms together.",
            "boxes" => [],
        ];
        $presetMinimal = [
            'id' => 'fully-sorted-minimal',
            'name' => 'National: Sorted by Forms (Minimal)',
            'version' => 1,
            'gameSet' => $gameSetId,
            "description" => "Pokémon Boxes are sorted following HOME's National Dex order mixing Species and Forms, but Legendary or Mythical Pokémon forms (like Hoopa Unbound, etc) will be excluded.",
            "boxes" => [],
        ];
        $presetBySpecies = [
            'id' => 'sorted-species',
            'name' => 'National: Sorted by Species',
            'version' => 1,
            'gameSet' => $gameSetId,
            "description" => "(Recommended) Pokémon Boxes are sorted following HOME's National Dex order, separating Species and Forms. First you will find all the species, then all the forms starting in a new box (leaving a gap with the species).",
            "boxes" => [],
        ];
        $presetBySpeciesMinimal = [
            'id' => 'sorted-species-minimal',
            'name' => 'National: Sorted by Species (Minimal)',
            'version' => 1,
            'gameSet' => $gameSetId,
            "description" => "Pokémon Boxes are sorted following HOME's National Dex order separating Species and Forms, but Legendary or Mythical Pokémon forms (like Magearna Original Color, etc) will be excluded. First you will find all the species, then all the forms starting in a new box (leaving a gap with the species).",
            "boxes" => [],
        ];
        $currentBox = 0;
        $currentBoxMinimal = 0;
        $total = 0;
        $minimalTotal = 0;

        foreach ($storables as $pkmId) {
            $pkm = $dataSetById[$pkmId];
            if (!in_array($gameSetId, $pkm['storableIn'], true)) {
                continue;
            }
            foreach (SGG_BOXES_EXCLUDE_FORMS_PREFIX as $prefix) {
                if (str_starts_with($pkmId, $prefix)) {
                    continue 2;
                }
            }
            if (
                isset($preset['boxes'][$currentBox])
                && (count($preset['boxes'][$currentBox]['pokemon']) >= $maxPkmPerBox)
            ) {
                $currentBox++;
            }
            if (
                isset($presetMinimal['boxes'][$currentBoxMinimal])
                && (count($presetMinimal['boxes'][$currentBoxMinimal]['pokemon']) >= $maxPkmPerBox)
            ) {
                $currentBoxMinimal++;
            }
            if (!isset($preset['boxes'][$currentBox])) {
                $preset['boxes'][$currentBox] = [
                    'pokemon' => [],
                ];
            }
            if (!isset($preset['boxes'][$currentBoxMinimal])) {
                $preset['boxes'][$currentBoxMinimal] = [
                    'pokemon' => [],
                ];
            }
            $preset['boxes'][$currentBox]['pokemon'][] = $pkm['id'];
            $total++;
            $isLegendaryForm = ($pkm['isLegendary'] || $pkm['isMythical']) && $pkm['isForm'];
            if (!$isLegendaryForm) {
                $minimalTotal++;
                $presetMinimal['boxes'][$currentBoxMinimal]['pokemon'][] = $pkm['id'];
            }
        }

        // Loop for separated species

        $species = [];
        $forms = [];
        foreach ($storables as $pkmId) {
            $pkm = $dataSetById[$pkmId];
            if (!in_array($gameSetId, $pkm['storableIn'], true)) {
                continue;
            }
            foreach (SGG_BOXES_EXCLUDE_FORMS_PREFIX as $prefix) {
                if (str_starts_with($pkmId, $prefix)) {
                    continue 2;
                }
            }
            if (!$pkm['isDefault']) {
                $forms[] = $pkmId;
            } else {
                $species[] = $pkmId;
            }
        }

        // TODO: refactor this big chunk of code    :blush:

        $currentBox = 0;
        $currentBoxMinimal = 0;
        $total2 = 0;
        $minimalTotal2 = 0;

        // Add species first
        foreach ($species as $pkmId) {
            foreach (SGG_BOXES_EXCLUDE_FORMS_PREFIX as $prefix) {
                if (str_starts_with($pkmId, $prefix)) {
                    continue 2;
                }
            }
            $pkm = $dataSetById[$pkmId];
            if (!isset($presetBySpecies['boxes'][$currentBox])) {
                $presetBySpecies['boxes'][$currentBox] = [
                    'pokemon' => [],
                ];
            }
            if (!isset($presetBySpeciesMinimal['boxes'][$currentBoxMinimal])) {
                $presetBySpeciesMinimal['boxes'][$currentBoxMinimal] = [
                    'pokemon' => [],
                ];
            }
            if (count($presetBySpecies['boxes'][$currentBox]['pokemon']) >= $maxPkmPerBox) {
                $currentBox++;
            }
            if (count($presetBySpeciesMinimal['boxes'][$currentBoxMinimal]['pokemon']) >= $maxPkmPerBox) {
                $currentBoxMinimal++;
            }
            $presetBySpecies['boxes'][$currentBox]['pokemon'][] = $pkm['id'];
            $presetBySpeciesMinimal['boxes'][$currentBoxMinimal]['pokemon'][] = $pkm['id'];
            $total2++;
            $minimalTotal2++;
        }

        // Leave a gap
        $currentBox++;
        $currentBoxMinimal++;

        // Continue with forms
        foreach ($forms as $pkmId) {
            foreach (SGG_BOXES_EXCLUDE_FORMS_PREFIX as $prefix) {
                if (str_starts_with($pkmId, $prefix)) {
                    continue 2;
                }
            }
            $pkm = $dataSetById[$pkmId];
            if (!isset($presetBySpecies['boxes'][$currentBox])) {
                $presetBySpecies['boxes'][$currentBox] = [
                    'pokemon' => [],
                ];
            }
            if (!isset($presetBySpeciesMinimal['boxes'][$currentBoxMinimal])) {
                $presetBySpeciesMinimal['boxes'][$currentBoxMinimal] = [
                    'pokemon' => [],
                ];
            }
            if (count($presetBySpecies['boxes'][$currentBox]['pokemon']) >= $maxPkmPerBox) {
                $currentBox++;
            }
            if (count($presetBySpeciesMinimal['boxes'][$currentBoxMinimal]['pokemon']) >= $maxPkmPerBox) {
                $currentBoxMinimal++;
            }
            $presetBySpecies['boxes'][$currentBox]['pokemon'][] = $pkm['id'];
            $total2++;
            $isLegendaryForm = ($pkm['isLegendary'] || $pkm['isMythical']) && $pkm['isForm'];
            if (!$isLegendaryForm) {
                $minimalTotal2++;
                $presetBySpeciesMinimal['boxes'][$currentBoxMinimal]['pokemon'][] = $pkm['id'];
            }
        }

        // Save files

        sgg_data_save("builds/box-presets/{$gameSetId}/101-sorted-species.json", $presetBySpecies, minify: false);
        if ($createMinimal && ($total2 !== $minimalTotal2)) {
            sgg_data_save(
                "builds/box-presets/{$gameSetId}/102-sorted-species-minimal.json",
                $presetBySpeciesMinimal,
                minify: false
            );
        }

        sgg_data_save("builds/box-presets/{$gameSetId}/103-fully-sorted.json", $preset, minify: false);
        if ($createMinimal && ($total !== $minimalTotal)) {
            sgg_data_save(
                "builds/box-presets/{$gameSetId}/104-fully-sorted-minimal.json",
                $presetMinimal,
                minify: false
            );
        }
    };

    $generatePokedexBoxesPreset = static function (string $pokedexId, string $gamesetId) use ($dataSetById): void {
        $dexData = sgg_data_load('sources/pokedexes/' . $pokedexId . '.json');
        $dexExtras = [];

        if (file_exists(sgg_get_data_path('sources/pokedexes/' . $pokedexId . '-extra.json'))) {
            $dexExtras = sgg_data_load('sources/pokedexes/' . $pokedexId . '-extra.json') ?: [];
        }

        $preset = [
            'id' => 'fully-sorted-' . $pokedexId,
            'name' => 'Regional: Sorted by Forms',
            'version' => 1,
            'gameSet' => $gamesetId,
            //'shortDescription' => 'Sorted by Species and their Forms, in their HOME order.',
            "description" => "(Recommended) Pokémon Boxes are sorted by Species and Forms together, following regional Pokédex order. This also includes Pokémon that are only available via HOME transfer.",
            "boxes" => [],
        ];
        $presetMinimal = [
            'id' => 'minimal-' . $pokedexId,
            'name' => 'Regional: Sorted by Forms (Minimal)',
            'version' => 1,
            'gameSet' => $gamesetId,
            //'shortDescription' => 'Sorted by Species and their Forms, in their HOME order.',
            "description" => "Pokémon Boxes are sorted by Species and Forms together, following regional Pokédex order. Cosmetic forms and HOME transfer-only Pokémon are excluded.",
            "boxes" => [],
        ];
        $maxPkmPerBox = 30;

        $currentBox = 0;

        foreach ($dexExtras as $pkmId) {
            $dexData[] = [
                'id' => $pkmId,
                'dexNum' => null,
                'forms' => [$pkmId]
            ];
        }

        foreach ($dexData as $dexPkm) {
            foreach ($dexPkm['forms'] as $pkmId) {
                foreach (SGG_BOXES_EXCLUDE_FORMS_PREFIX as $prefix) {
                    if (str_starts_with($pkmId, $prefix)) {
                        continue 2;
                    }
                }
                $pkm = $dataSetById[$pkmId];
                if (!in_array($gamesetId, $pkm['storableIn'], true)) {
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
                        'pokemon' => [],
                    ];
                }
                $preset['boxes'][$currentBox]['pokemon'][] = $pkm['id'];
            }
        }
        sgg_data_save('builds/box-presets/' . $gamesetId . '/100-' . 'fully-sorted-' . $pokedexId . '.json', $preset, minify: false);

        // minimal
        $currentBox = 0;
        foreach ($dexData as $dexPkm) {
            foreach ($dexPkm['forms'] as $pkmId) {
                foreach (SGG_BOXES_EXCLUDE_FORMS_PREFIX as $prefix) {
                    if (str_starts_with($pkmId, $prefix)) {
                        continue 2;
                    }
                }
                $pkm = $dataSetById[$pkmId];
                if (!in_array($gamesetId, $pkm['storableIn'], true)) {
                    continue;
                }
                if (
                    isset($presetMinimal['boxes'][$currentBox])
                    && (count($presetMinimal['boxes'][$currentBox]['pokemon']) >= $maxPkmPerBox)
                ) {
                    $currentBox++;
                }
                if (!isset($presetMinimal['boxes'][$currentBox])) {
                    $presetMinimal['boxes'][$currentBox] = [
                        'pokemon' => [],
                    ];
                }

                // exclude non-minimal tier
                $allowedCosmeticForms = array_merge(
                    [$gamesetId => []],
                    ['sv' => ['vivillon-fancy']]
                );

                if ($pkm['isCosmeticForm'] && !in_array($pkm['id'], $allowedCosmeticForms[$gamesetId], true)) {
                    continue;
                }
                $presetMinimal['boxes'][$currentBox]['pokemon'][] = $pkm['id'];
            }
        }
        sgg_data_save('builds/box-presets/' . $gamesetId . '/101-' . 'minimal-' . $pokedexId . '.json', $presetMinimal, minify: false);
    };

    // National pokedex order:
    $generateGamesetBoxesPreset('rb', 20);
    $generateGamesetBoxesPreset('y', 20);
    $generateGamesetBoxesPreset('gs', 20);
    $generateGamesetBoxesPreset('c', 20);
    $generateGamesetBoxesPreset('rs', 30);
    $generateGamesetBoxesPreset('e', 30);
    $generateGamesetBoxesPreset('frlg', 30);
    $generateGamesetBoxesPreset('dp', 30);
    $generateGamesetBoxesPreset('pt', 30);
    $generateGamesetBoxesPreset('hgss', 30);
    $generateGamesetBoxesPreset('bw', 30);
    $generateGamesetBoxesPreset('b2w2', 30);
    $generateGamesetBoxesPreset('xy', 30);
    $generateGamesetBoxesPreset('oras', 30);
    $generateGamesetBoxesPreset('sm', 30);
    $generateGamesetBoxesPreset('usum', 30);
    $generateGamesetBoxesPreset('go', 9999);
    $generateGamesetBoxesPreset('lgpe', 1000);
    $generateGamesetBoxesPreset('swsh', 30);
    $generateGamesetBoxesPreset('home', 30);
    $generateGamesetBoxesPreset('bdsp', 30);
    $generateGamesetBoxesPreset('sv', 30);

    // Regional pokedex order:
    $generatePokedexBoxesPreset('hisui', 'la');
    $generatePokedexBoxesPreset('paldea', 'sv');

    echo "[OK] Build finished!\n";
})();
