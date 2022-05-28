<?php

declare(strict_types=1);
require_once __DIR__ . '/_bootstrap.php';

// Validates all data being correct and that nothing is missing

(static function () {
    error_reporting(-1);
    $pokemonById = sgg_data_load('pokemon/pokemon-entries-byid.build.json');
    $storablePokemonList = sgg_data_load('livingdex/storable-pokemon/home/storable-pokemon.build.json');

    $validateHomeDexPreset = static function (array $dexPreset) use ($storablePokemonList, $pokemonById): array {
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

    $validateHomeDexPresets = static function () use ($validateHomeDexPreset): void {
        // find all json files from ./home and iterate over them
        $files = [];
        $games = ['home']; // TODO add validation for other games
        foreach ($games as $game) {
            $gameFiles = glob(__DIR__ . '/../data/livingdex/box-presets/' . $game . '/*.json');
            $files = array_merge($files, $gameFiles);
        }
        $errors = [];
        $warnings = [];
        foreach ($files as $file) {
            if (str_contains($file, '.min.json') || str_contains($file, '.build.json')) {
                continue;
            }
            $json = file_get_contents($file);
            $data = json_decode($json, true, 512, JSON_THROW_ON_ERROR);
            if ($data === null) {
                throw new \RuntimeException("Error: file '$file' has malformed JSON\n");
            }
            [$fileErrors, $fileWarnings] = $validateHomeDexPreset($data);
            $errorCount = count($fileErrors);
            if ($errorCount > 0) {
                //sort($fileErrors);
                $errors[] = (
                    "\n>  Preset '{$file}' has $errorCount errors: \n" . implode("\n", $fileErrors) . "\n"
                );
            }
            $warningCount = count($fileWarnings);
            if ($warningCount > 0) {
                //sort($fileWarnings);
                $warnings[] = (
                    "\n>  Preset '{$file}' has $warningCount warnings: \n" . implode("\n", $fileWarnings) . "\n"
                );
            }

            if ($errorCount === 0 && $warningCount === 0) {
                echo ">  Preset '{$file}' is valid\n";
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

    $validateHomeDexPresets();

    echo "[OK] All data is correct!\n";
})();
