<?php

declare(strict_types=1);

// Validates all data being correct and that nothing is missing

(static function () {
    error_reporting(-1);
    $storablePokemonList = json_decode(
        file_get_contents(__DIR__ . '/../data/livingdex/storable-pokemon/home/pokemon-list-storable.min.json'),
        true,
        512,
        JSON_THROW_ON_ERROR
    );

    $validateHomeDexPreset = static function (array $dexPreset) use ($storablePokemonList): array {
        $presetId = $dexPreset['id'];
        $pokemonInBoxes = [];
        $errors = [];
        foreach ($dexPreset['boxes'] as $i => $box) {
            foreach ($box['pokemon'] as $j => $pokemon) {
                if ($pokemon === null) {
                    continue;
                }
                if (!is_string($pokemon)) {
                    $errors[] = "Pokemon name is not a string in preset '$presetId' at box/pokemon $i/$j";
                    continue;
                }
                if (!in_array($pokemon, $storablePokemonList, true)) {
                    $errors[] = "Unregistered pokemon detected '$pokemon' in preset '$presetId' at box/pokemon $i/$j";
                    continue;
                }
                if ($pokemonInBoxes[$pokemon] ?? false) {
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
        foreach ($files as $file) {
            $json = file_get_contents($file);
            $data = json_decode($json, true, 512, JSON_THROW_ON_ERROR);
            if ($data === null) {
                throw new \RuntimeException("Error: file '$file' has malformed JSON\n");
            }
            $errors = $validateHomeDexPreset($data);
            if (!empty($errors)) {
                throw new \RuntimeException(
                    "Error: preset '{$data['id']}' has invalid data\n" . implode("\n", $errors)
                );
            }
        }
    };

    $validateHomeDexPresets();

    echo "[OK] All data is correct!\n";
})();
