<?php

declare(strict_types=1);
//
// Splits the big pokemon.json file into smaller files, more memory-friendly for the front-end.
//
// Do not edit manually the .min.json files, use the build.php script instead.
//

(static function () {
    error_reporting(-1);
    $jsonEncodeFlags = JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE;
    $inputFile = __DIR__ . '/../data/pokemon.json';
    $dataSet = json_decode(file_get_contents($inputFile), true, 512, JSON_THROW_ON_ERROR);
    $dataSetById = [];
    foreach ($dataSet as $data) {
        $dataSetById[$data['id']] = $data;
    }

    $detectDuplicates = static function () use ($dataSet, $jsonEncodeFlags): void {
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

    $prettifyPokemonJson = static function () use ($inputFile, $dataSet, $jsonEncodeFlags) {
        file_put_contents(
            $inputFile,
            json_encode($dataSet, JSON_THROW_ON_ERROR | JSON_PRETTY_PRINT | $jsonEncodeFlags)
        );
    };

    $generatePokemonList = static function () use ($dataSet, $jsonEncodeFlags): void {
        $outputFile = __DIR__ . '/../data/livingdex/pokemon/pokemon-list.min.json';
        $newDataSet = [];

        foreach ($dataSet as $pkm) {
            $newDataSet[] = $pkm['id'];
        }

        file_put_contents(
            $outputFile,
            json_encode($newDataSet, JSON_THROW_ON_ERROR | JSON_PRETTY_PRINT | $jsonEncodeFlags)
        );
    };

    $generateStorablePokemonList = static function () use ($dataSet, $jsonEncodeFlags): void {
        $outputFile = __DIR__ . '/../data/livingdex/pokemon/pokemon-list-storable.min.json';
        $newDataSet = [];

        foreach ($dataSet as $pkm) {
            if (!in_array('home', $pkm['transferableTo'], true)) {
                continue;
            }
            $newDataSet[] = $pkm['id'];
        }

        file_put_contents(
            $outputFile,
            json_encode($newDataSet, JSON_THROW_ON_ERROR | JSON_PRETTY_PRINT | $jsonEncodeFlags)
        );
    };

    $generateMegaPokemonList = static function () use ($dataSet, $jsonEncodeFlags): void {
        $outputFile = __DIR__ . '/../data/livingdex/pokemon/pokemon-list-mega.min.json';
        $newDataSet = [];

        foreach ($dataSet as $pkm) {
            if (!$pkm['isMega']) {
                continue;
            }
            $newDataSet[] = $pkm['id'];
        }

        file_put_contents(
            $outputFile,
            json_encode($newDataSet, JSON_THROW_ON_ERROR | JSON_PRETTY_PRINT | $jsonEncodeFlags)
        );
    };

    $generateGmaxPokemonList = static function () use ($dataSet, $dataSetById, $jsonEncodeFlags): void {
        $outputFile = __DIR__ . '/../data/livingdex/pokemon/pokemon-list-gmax.min.json';
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

        if (count($newDataSet['isGmax']) !== count($newDataSet['canGmax'])) {
            throw new \RuntimeException('Gmax count mismatch');
        }

        file_put_contents(
            $outputFile,
            json_encode($newDataSet['canGmax'], JSON_THROW_ON_ERROR | JSON_PRETTY_PRINT | $jsonEncodeFlags)
        );
    };

    $generateAlphaPokemonList = static function () use ($dataSet, $jsonEncodeFlags): void {
        $outputFile = __DIR__ . '/../data/livingdex/pokemon/pokemon-list-alpha.min.json';
        $newDataSet = [];

        foreach ($dataSet as $pkm) {
            if (!$pkm['canBeAlpha']) {  // TODO set alphas properly in pokemon.json
                continue;
            }
            $newDataSet[] = $pkm['id'];
        }

        file_put_contents(
            $outputFile,
            json_encode($newDataSet, JSON_THROW_ON_ERROR | JSON_PRETTY_PRINT | $jsonEncodeFlags)
        );
    };

    $detectDuplicates();
    $prettifyPokemonJson();
    $generatePokemonList();
    $generateStorablePokemonList();
    $generateMegaPokemonList();
    $generateGmaxPokemonList();
    $generateAlphaPokemonList();

    echo "[OK] Build finished!\n";
})();
