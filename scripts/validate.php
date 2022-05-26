<?php

declare(strict_types=1);
require_once __DIR__ . '/_bootstrap.php';

// Validates all data being correct and that nothing is missing

(static function () {
    error_reporting(-1);
    $storablePokemonList = json_decode(
        file_get_contents(__DIR__ . '/../data/livingdex/storable-pokemon/home/storable-pokemon.min.json'),
        true,
        512,
        JSON_THROW_ON_ERROR
    );

    $validateHomeDexPreset = static function (array $dexPreset) use ($storablePokemonList): array {
        $presetId = $dexPreset['id'];
        $pokemonInBoxes = [];
        $errors = [];
        $allowedDuplicates = ["unown", "vivillon", "alcremie"]; // TODO have a better workaround for this hack
        foreach ($dexPreset['boxes'] as $i => $box) {
            if (count($box['pokemon']) > 30) {
                $errors[] = "Box '$i' in preset '$presetId' has more than 30 pokemon";
            }
            $boxTitle = strtolower($box['title']);
            foreach ($box['pokemon'] as $j => $pokemon) {
                if ($pokemon === null) {
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
                if (
                    ($pokemonInBoxes[$pokemon] ?? false)
                    && !in_array($pokemon, $allowedDuplicates)
                    && !str_contains($boxTitle, 'gigantamax')
                ) {
                    $errors[] = "Duplicate pokemon detected '$pokemon' in preset '$presetId' at box/pokemon $i/$j";
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

        return $errors;
    };

    $validateHomeDexPresets = static function () use ($validateHomeDexPreset): void {
        // find all json files from ./home and iterate over them
        $files = glob(__DIR__ . '/../data/livingdex/box-presets/home/*.json');
        $errors = [];
        foreach ($files as $file) {
            if (str_contains($file, '.min.json')) {
                continue;
            }
            $json = file_get_contents($file);
            $data = json_decode($json, true, 512, JSON_THROW_ON_ERROR);
            if ($data === null) {
                throw new \RuntimeException("Error: file '$file' has malformed JSON\n");
            }
            $fileErrors = $validateHomeDexPreset($data);
            $errorCount = count($fileErrors);
            if ($errorCount > 0) {
                sort($fileErrors);
                $errors[] = (
                    "\n>  Preset '{$file}' has $errorCount errors: \n" . implode("\n", $fileErrors) . "\n"
                );
            }
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
