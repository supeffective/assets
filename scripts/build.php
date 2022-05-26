<?php

declare(strict_types=1);
//
// Splits the big pokemon.json file into smaller files, more memory-friendly for the front-end.
//
// Do not edit manually the .min.json files, use the build.php script instead.
//

(static function () {
    error_reporting(-1);
    $jsonEncodeFlags = JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE;
    $inputFile = __DIR__ . '/../data/pokemon.json';
    $dataSet = json_decode(file_get_contents($inputFile), true, 512, JSON_THROW_ON_ERROR);
    $dataSetById = [];
    foreach ($dataSet as $data) {
        $dataSetById[$data['id']] = $data;
    }

    $jsonEncodeMin = static function (array $data) {
        return json_encode($data, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    };

    $jsonEncodePretty = static function (array $data) {
        return json_encode(
            $data,
            JSON_THROW_ON_ERROR | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
        );
    };

    $detectDuplicates = static function () use ($dataSet): void {
        $processed = [];

        foreach ($dataSet as $pkm) {
            if ($processed[$pkm['id']] ?? false) {
                throw new \RuntimeException('Duplicated pokemon detected: ' . $pkm['id']);
            }
            if ($processed[$pkm['nid']] ?? false) {
                throw new \RuntimeException('Duplicated pokemon detected: ' . $pkm['nid']);
            }
            $processed[$pkm['id']] = true;
            $processed[$pkm['nid']] = true;
        }
    };

    $generatePokemonList = static function () use ($dataSet, $jsonEncodePretty): void {
        $outputFile = __DIR__ . '/../data/pokemon/pokemon-sorted.min.json';
        $newDataSet = [];

        foreach ($dataSet as $pkm) {
            $newDataSet[] = $pkm['id'];
        }

        file_put_contents($outputFile, $jsonEncodePretty($newDataSet));
    };

    $generateStorablePokemonList = static function () use ($dataSet, $jsonEncodePretty): void {
        $outputFile = __DIR__ . '/../data/livingdex/storable-pokemon/home/storable-pokemon.min.json';
        $newDataSet = [];

        foreach ($dataSet as $pkm) {
            if (!in_array('home', $pkm['transferableTo'], true)) { // TODO, support all games, using nested loop
                continue;
            }
            $newDataSet[] = $pkm['id'];
        }

        file_put_contents($outputFile, $jsonEncodePretty($newDataSet));
    };

    $generateMegaPokemonList = static function () use ($dataSet, $jsonEncodePretty): void {
        $outputFile = __DIR__ . '/../data/pokemon/mega-pokemon.min.json';
        $newDataSet = [];

        foreach ($dataSet as $pkm) {
            if (!$pkm['isMega']) {
                continue;
            }
            $newDataSet[] = $pkm['id'];
        }

        file_put_contents($outputFile, $jsonEncodePretty($newDataSet));
    };

    $generateGmaxPokemonList = static function () use ($dataSet, $dataSetById, $jsonEncodePretty): void {
        $outputFile = __DIR__ . '/../data/pokemon/gigantamaxable-pokemon.min.json';
        $newDataSet = [];

        foreach ($dataSet as $pkm) {
            if ($pkm['isGmax']) {
                $newDataSet['isGmax'][] = $pkm['id'];
            }

            $gmaxableName = $pkm['id'] . '-gmax';
            if ($pkm['canGmax'] || isset($dataSetById[$gmaxableName])) {
                $newDataSet['canGmax'][] = $pkm['id']; // TODO set this properly in pokemon.json
            }
        }

        $formsGmaxable = 1;
        if (count($newDataSet['isGmax']) !== (count($newDataSet['canGmax']) - $formsGmaxable)) {
            throw new \RuntimeException('Gmax count mismatch');
        }

        file_put_contents($outputFile, $jsonEncodePretty($newDataSet['canGmax']));
    };

    $generateAlphaPokemonList = static function () use ($dataSet, $jsonEncodePretty): void {
        $outputFile = __DIR__ . '/../data/pokemon/alpha-pokemon.min.json';
        $newDataSet = [];

        foreach ($dataSet as $pkm) {
            if (!$pkm['canBeAlpha']) {  // TODO set alphas properly in pokemon.json
                continue;
            }
            $newDataSet[] = $pkm['id'];
        }

        file_put_contents($outputFile, $jsonEncodePretty($newDataSet));
    };

    $prettifyAndMinifyAllJsonFiles = static function () use ($jsonEncodePretty, $jsonEncodeMin): void {
        /** @var SplFileInfo[] $iterator */
        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator(__DIR__ . '/../data', \RecursiveDirectoryIterator::SKIP_DOTS),
            \RecursiveIteratorIterator::LEAVES_ONLY
        );

        foreach ($iterator as $path) {
            if ($path->isDir()) {
                continue;
            }
            $file = (string) $path;
            if (str_contains($file, '.min.json')) {
                continue;
            }
            $minFile = str_replace('.json', '.min.json', $file);
            $data = json_decode(file_get_contents($file), true, 512, JSON_THROW_ON_ERROR);
            file_put_contents($file, $jsonEncodePretty($data));
            file_put_contents($minFile, $jsonEncodeMin($data));
        }
    };

    $generateFullySortedHomePreset = static function () use ($dataSet, $jsonEncodePretty): void {
        $outputFile = __DIR__ . '/../data/livingdex/box-presets/home/fully-sorted.json';
        $preset = [
            'id' => 'fully-sorted',
            'name' => 'Fully Sorted',
            //'shortDescription' => 'Sorted by Species and their Forms, in their HOME order.',
            "description" => "Pokémon Boxes sorted by Species and Forms, following original Pokémon HOME order.\n"
                . "Every newly introduced form will alter the order of all the following Pokémon.",
            "boxes" => [],

        ];
        $maxPkmPerBox = 30;
        $currentBox = 0;
        foreach ($dataSet as $i => $pkm) {
            if (!in_array('home', $pkm['transferableTo'], true)) { // TODO, support all games, using nested loop
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

        file_put_contents($outputFile, $jsonEncodePretty($preset));
    };


    $detectDuplicates();

    $generatePokemonList();
    $generateStorablePokemonList();
    $generateFullySortedHomePreset();
    //$generateMegaPokemonList();
    $generateGmaxPokemonList();
    $generateAlphaPokemonList();


    $prettifyAndMinifyAllJsonFiles();

    echo "[OK] Build finished!\n";
})();
