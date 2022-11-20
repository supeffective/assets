<?php

require_once __DIR__ . '/../vendor/autoload.php';

// _bootstrap.php: Base code for all other PHP scripts
error_reporting(-1);

const SGG_PKM_ENTRIES_BASE_FILENAME = 'builds/pokemon/pokemon-entries';
const SGG_SUPPORTED_GAMESETS = [
    'rb',
    'y',
    'gs',
    'c',
    'rs',
    'e',
    'frlg',
    'dp',
    'pt',
    'hgss',
    'bw',
    'b2w2',
    'xy',
    'oras',
    'sm',
    'usum',
    'go',
    'lgpe',
    'swsh',
    'home',
    'bdsp',
    'la',
    'sv',
];
const SGG_BOXES_EXCLUDE_FORMS_PREFIX = [
    'arceus-',
    'silvally-',
];

function sgg_get_gamesets(): array
{
    $gamesetsArray = sgg_data_load('sources/games/game-sets.json');
    $gamesetsById = [];
    foreach ($gamesetsArray as $gameset) {
        $gamesetsById[$gameset['id']] = $gameset;
    }

    return $gamesetsById;
}

function sgg_get_data_path(?string $relativePath = null): string
{
    $basePath = realpath(dirname(__DIR__) . '/data');
    if (!$relativePath) {
        return $basePath;
    }

    return $basePath . '/' . ltrim($relativePath, '/');
}

function sgg_data_load(string $filename): array
{
    return sgg_json_decode_file(sgg_get_data_path($filename));
}

function sgg_data_save(string $filename, array $data, bool $minify = false): void
{
    sgg_json_encode($data, $minify, sgg_get_data_path($filename));
}

function sgg_json_decode(string $json): array
{
    return json_decode($json, true, 512, JSON_THROW_ON_ERROR);
}

function sgg_json_decode_file(string $fileName): array
{
    if (!file_exists($fileName)) {
        throw new RuntimeException("File '$fileName' does not exist");
    }

    return sgg_json_decode(file_get_contents($fileName));
}

function sgg_json_prettify_file(string $fileName): void
{
    sgg_json_encode(sgg_json_decode_file($fileName), false, $fileName);
}

function sgg_json_minify_file(string $fileName): void
{
    sgg_json_encode(sgg_json_decode_file($fileName), true, $fileName);
}

function sgg_json_encode(array $data, bool $minify = true, ?string $outputFile = null): string
{
    $jsonFlags = JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_OBJECT_AS_ARRAY;
    if (!$minify) {
        $jsonFlags = JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE;
    }
    $json = json_encode($data, $jsonFlags) . PHP_EOL;
    if ($outputFile !== null) {
        sgg_create_file_dir_tree($outputFile);
        file_put_contents($outputFile, $json);
    }

    return $json;
}

function sgg_create_file_dir_tree(string $fileName): void
{
    $dir = dirname($fileName);
    if (!file_exists($dir)) {
        if (!mkdir($dir, 0777, true) && !is_dir($dir)) {
            throw new \RuntimeException(sprintf('Directory "%s" was not created', $dir));
        }
    }
}

function sgg_json_files_in_dir_tree(?string $relativeDataPath = null, bool $ignoreBuildFiles = true): array
{
    $dir = sgg_get_data_path($relativeDataPath);
    if (!is_dir($dir)) {
        throw new RuntimeException("Directory '$dir' does not exist");
    }

    /** @var SplFileInfo[] $iterator */
    $iterator = new \RecursiveIteratorIterator(
        new \RecursiveDirectoryIterator($dir, \RecursiveDirectoryIterator::SKIP_DOTS),
        \RecursiveIteratorIterator::LEAVES_ONLY
    );
    $found = [];

    foreach ($iterator as $path) {
        if ($path->isDir()) {
            continue;
        }
        $file = (string) $path;
        if (!str_ends_with($file, '.json')) {
            continue;
        }
        if ($ignoreBuildFiles && (str_ends_with($file, '.min.json'))) {
            continue;
        }
        $found[] = $file;
    }

    return $found;
}

function sgg_get_sorted_pokemon_ids(): array
{
    return sgg_data_load('sources/pokemon.json');
}

function sgg_get_dex(string $dexId): array
{
    return sgg_data_load('sources/pokedexes/' . $dexId . '.json');
}

function sgg_get_dex_pokemon_ids(string $dexId): array
{
    $ids = [];
    $dex = sgg_data_load('sources/pokedexes/' . $dexId . '.json');
    foreach ($dex as $dexPkm) {
        foreach ($dexPkm['forms'] as $pkmId) {
            $ids[] = $pkmId;
        }
    }

    return $ids;
}

function sgg_get_merged_pkm_entries(bool $failOnError = true): array
{
    $sortedPokemonList = sgg_get_sorted_pokemon_ids();

    $existingPkmEntries = array_map(static function ($fileName) {
        return pathinfo($fileName, PATHINFO_FILENAME);
    }, sgg_json_files_in_dir_tree('sources/pokemon/entries', true));

    $existingPkmEntriesMap = array_combine($existingPkmEntries, $existingPkmEntries);
    $sortedPokemonListMap = [];

    foreach ($sortedPokemonList as $pkmId) {
        // find duplicates in sorted list
        if ($failOnError && isset($sortedPokemonListMap[$pkmId])) {
            throw new \RuntimeException('Duplicated pokemon in data/sources/pokemon.json for: ' . $pkmId);
        }

        // check if some pokemon in the sorted list is missing its entry file
        if ($failOnError && !isset($existingPkmEntriesMap[$pkmId])) {
            throw new \RuntimeException('Missing pokemon entry JSON file for: ' . $pkmId);
        }
        $sortedPokemonListMap[$pkmId] = $pkmId;
    }

    // check if some entry is missing in sorted list
    foreach ($existingPkmEntriesMap as $pkmId) {
        if ($failOnError && !isset($sortedPokemonListMap[$pkmId])) {
            throw new \RuntimeException(
                "Unknown entry: Pokemon '{$pkmId}' not found in full sorted pokemon list (data/sources/pokemon.json)"
            );
        }
    }

    $fullEntries = [];
    // Collect all entries and merge them in a single array
    foreach ($sortedPokemonList as $pkmId) {
        $entryFile = 'sources/pokemon/entries/' . $pkmId . '.json';
        $entryFileFull = sgg_get_data_path($entryFile);
        if ($failOnError && !file_exists($entryFileFull)) {
            throw new \RuntimeException('Missing pokemon entry JSON file for: ' . $pkmId);
        }
        if (!file_exists($entryFileFull)) {
            //echo 'Missing pokemon entry JSON file for: ' . $pkmId . PHP_EOL;
            continue; // skip if failOnError = false and file does not exist
        }
        $entryData = sgg_data_load($entryFile);
        $fullEntries[] = $entryData;
    }

    return $fullEntries;
}

function sgg_get_merged_pkm_entries_by_id(bool $failOnError = true): array
{
    $dataSet = sgg_get_merged_pkm_entries($failOnError);
    $dataSetById = [];
    foreach ($dataSet as $data) {
        if (isset($dataSetById[$data['id']])) {
            throw new \RuntimeException("Duplicated entry for Pokemon ID: " . $data['id']);
        }
        $dataSetById[$data['id']] = $data;
    }

    return $dataSetById;
}

function sgg_array_merge_deep(array ...$arrays): array
{
    $result = [];
    foreach ($arrays as $array) {
        foreach ($array as $key => $value) {
            // Renumber integer keys as array_merge_recursive() does. Note that PHP
            // automatically converts array keys that are integer strings (e.g., '1')
            // to integers.
            if (is_integer($key)) {
                $result[] = $value;
            } elseif (array_key_exists($key, $result) && is_array($result[$key]) && is_array($value)) {
                $result[$key] = sgg_array_merge_deep(
                    $result[$key],
                    $value,
                );
            } else {
                $result[$key] = $value;
            }
        }
    }
    return $result;
}