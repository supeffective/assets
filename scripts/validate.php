<?php

declare(strict_types=1);
require_once __DIR__ . '/_bootstrap.php';

// Validates all data being correct and that nothing is missing

(static function () {
    error_reporting(-1);
    $pokemonById = sgg_data_load('builds/pokemon/pokemon-entries-map.json');
    $defaultPkmLimitPerBox = 30;
    $pkmLimitPerBox = [
        'lgpe' => 1000,
        'go' => 6000,
    ];
    $gameSetsThatCanHaveBattleOnlyForms = [
        'go',
    ];

    $validateDexPreset = static function (array $dexPreset, array $storablePokemonList) use (
        $pokemonById,
        $pkmLimitPerBox,
        $defaultPkmLimitPerBox,
        $gameSetsThatCanHaveBattleOnlyForms
    ): array {
        $presetId = $dexPreset['id'];
        $gameSetId = $dexPreset['gameSet'];
        $presetPath = "{$gameSetId}.{$dexPreset['id']}";
        $pokemonInBoxes = [];
        $errors = [];
        $warnings = [];
        $currentPkmLimit = $pkmLimitPerBox[$gameSetId] ?? $defaultPkmLimitPerBox;

        foreach ($dexPreset['boxes'] as $i => $box) {
            $isGmaxBox = str_contains(strtolower($box['title'] ?? ''), 'gigantamax');

            if (count($box['pokemon']) > $currentPkmLimit) {
                $warnings[] = "Warning: Box '$i' in preset '$presetPath' has more than $currentPkmLimit pokemon.";
            }
            foreach ($box['pokemon'] as $j => $pokemon) {
                $cellLabel = "boxes[$i][$j]";
                $presetLoc = "'$presetPath.$cellLabel'";
                if ($pokemon === null) {
                    continue;
                }
                $entry = $pokemonById[$pokemon] ?? null;
                if ($entry === null) {
                    $errors[] = "Error: Pokémon '$pokemon' in $presetLoc has no JSON file in pokemon/entries. Is it a new Pokémon or a typo?";
                    continue;
                }
                if ($entry['isBattleOnlyForm'] && !in_array($gameSetId, $gameSetsThatCanHaveBattleOnlyForms, true)) {
                    $errors[] = "Error: Pokemon '$pokemon' in $presetLoc is a battle-only form and cannot be stored in a box.";
                    continue;
                }
                if (!is_string($pokemon)) {
                    $errors[] = "Error: Pokemon ID is not of type string|null in $presetLoc: " .
                        var_export($pokemon, true);
                    continue;
                }
                if (!in_array($pokemon, $storablePokemonList, true)) {
                    $errors[] = "Error: Pokemon '$pokemon' in $presetLoc is not registered as storable ('storableIn') for this game.";
                    continue;
                }
                if (!$isGmaxBox && ($pokemonInBoxes[$pokemon] ?? false)) {
                    $warnings[] = "Warning: Duplicate '$pokemon' found in $presetLoc. If intentional, ignore this warning.";
                    continue;
                }
                $pokemonInBoxes[$pokemon] = true;
            }
        }

        if (!in_array($presetId, ['fully-sorted-minimal', 'sorted-species-minimal'])) {
            // detect missing
            foreach ($storablePokemonList as $pokemon) {
                if (!isset($pokemonInBoxes[$pokemon])) {
                    $errors[] = "Error: Missing storable pokemon '$pokemon' in preset '$presetPath'";
                }
            }
        }

        return [$errors, $warnings];
    };

    $totalWarnings = 0;
    $validateDexPresets = static function () use ($validateDexPreset, &$totalWarnings): void {
        $presetsByGameSet = sgg_data_load('builds/box-presets-full.json');
        $errors = [];
        $warnings = [];

        foreach ($presetsByGameSet as $gameSetId => $presets) {
            foreach ($presets as $presetId => $preset) {
                $presetPath = "{$gameSetId}.{$presetId}";
                $storablePokemonList = sgg_data_load(
                    "builds/pokemon/storable/storable-pokemon-{$gameSetId}.json"
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
                $totalWarnings += $warningCount;
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

    if ($totalWarnings > 0) {
        echo "\n\n[OK] All data looks OK-ish: Validation resulted in $totalWarnings warnings.\n";

        return;
    }
    echo "\n\n[OK] All data is VALID!\n";
})();
