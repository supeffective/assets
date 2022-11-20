<?php

declare(strict_types=1);

(static function () {
    error_reporting(-1);

    /* Map Rows and Loop Through Them */
    $rows = array_map('str_getcsv', file(__DIR__ . '/paldea.csv'));
    $header = array_shift($rows);
    $csv = [];
    foreach ($rows as $row) {
        $csv[] = array_combine($header, $row);
    }

    $data = [];
    foreach ($csv as $pk) {
        $pkid = strtolower($pk['name']);
        $data[] = ['id' => $pkid, 'dexNum' => (int) ltrim($pk['num'], '0'), 'forms' => [$pkid]];
    }

    foreach ($data as $i => $pk) {
        $pkid = $pk['id'];
        $entryFile = __DIR__ . "/../pokemon/entries/$pkid.json";
        if (!file_exists($entryFile)) {
            throw new \RuntimeException("Missing entry: " . $entryFile);
        }
        $entry = json_decode(file_get_contents($entryFile), true);
        $data[$i]['forms'] = $entry['forms'];
    }

    file_put_contents(__DIR__ . '/paldea.json', json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));

})();