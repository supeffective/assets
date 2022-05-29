<?php

declare(strict_types=1);
require_once __DIR__ . '/_bootstrap.php';

// Validates all data being correct and that nothing is missing

(static function () {
    error_reporting(-1);
    $pokemonById = sgg_data_load('pokemon/pokemon-entries-map.build.json');

    $validateDexPreset = static function (array $dexPreset, array $storablePokemonList) use ($pokemonById): array {
        $presetId = $dexPreset['id'];
        $pokemonInBoxes = [];
        $errors = [];
        $warnings = [];

        foreach ($dexPreset['boxes'] as $i => $box) {
            if (count($box['pokemon']) > 30) {
                $errors[] = "Box '$i' in preset '$presetId' has more than 30 pokemon";
            }
            foreach ($box['pokemon'] as $j => $pokemon) {
                if ($pokemon === null) {
                    continue;
                }
                $entry = $pokemonById[$pokemon] ?? null;
                if ($entry === null) {
                    $errors[] = "Box '$i' in preset '$presetId' has invalid pokemon '$pokemon'";
                    continue;
                }
                if (!is_string($pokemon)) {
                    $errors[] = "Pokemon name is not a string in preset '$presetId' at box/pokemon $i/$j : " .
                        json_encode($pokemon);
                    continue;
                }
                if (!in_array($pokemon, $storablePokemonList, true)) {
                    $errors[] = "Unregistered pokemon detected '$pokemon' in preset '$presetId' at box/pokemon $i/$j";
                    continue;
                }
                if (($pokemonInBoxes[$pokemon] ?? false)) {
                    $warnings[] = "Warning: duplicate pokemon detected '$pokemon' in preset '$presetId' at box/pokemon $i/$j";
                    continue;
                }
                $pokemonInBoxes[$pokemon] = true;
            }
        }

        foreach ($storablePokemonList as $pokemon) {
            if (!isset($pokemonInBoxes[$pokemon])) {
                $errors[] = "Missing storable pokemon '$pokemon' in preset '$presetId'";
            }
        }

        return [$errors, $warnings];
    };

    $validateDexPresets = static function () use ($validateDexPreset): void {
        $presetsByGame = sgg_data_load('livingdex/box-presets.build.json');
        $errors = [];
        $warnings = [];

        foreach ($presetsByGame as $gameId => $presets) {
            foreach ($presets as $presetId => $preset) {
                $presetPath = "{$gameId}.{$presetId}";
                $storablePokemonList = sgg_data_load(
                    'livingdex/storable-pokemon/' . $gameId . '/storable-pokemon.build.json'
                );
                [$fileErrors, $fileWarnings] = $validateDexPreset($preset, $storablePokemonList);
                $errorCount = count($fileErrors);
                if ($errorCount > 0) {
                    //sort($fileErrors);
                    $errors[] = (
                        "\n>  Preset '$presetPath' has $errorCount errors: \n" . implode("\n", $fileErrors) . "\n"
                    );
                }
                $warningCount = count($fileWarnings);
                if ($warningCount > 0) {
                    //sort($fileWarnings);
                    $warnings[] = (
                        "\n>  Preset '{$presetPath}' has $warningCount warnings: \n" . implode(
                            "\n",
                            $fileWarnings
                        ) . "\n"
                    );
                }

                if ($errorCount === 0 && $warningCount === 0) {
                    echo ">  Preset '{$presetPath}' is valid\n";
                }
            }
        }

        if (count($warnings) > 0) {
            echo(
                "\nWARNINGS FOUND: \n" . implode("\n", $warnings)
            );
        }

        if (count($errors) > 0) {
            echo(
                "\nVALIDATION FAILED: \n" . implode("\n", $errors)
            );
            exit(1);
        }
    };

    $validateDexPresets();

    echo "[OK] All data is correct!\n";
})();
