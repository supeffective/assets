<?php

require_once __DIR__ . '/../_bootstrap.php';
require_once __DIR__ . '/functions.php';

/** @global mixed[] $tplVars */
/** @global array[] $pkmEntries */
/** @global int[] $pkmIds */
/** @global array[] $gameSets */
/** @global string $route */
/** @global string|null $currentGameSetId */
/** @global string|null $currentPid */
/** @global string|null $currentPidIndex */
/** @global string|null $currentResourceId */
/** @global string|null $currentSearch */

(static function () {
    $route = tpl_request_route();
    $nextYear = ((int) date('Y')) + 1;
    $nextYearExpiration = "Expires: Sat, 26 Jul {$nextYear} 05:00:00 GMT";

    $tplVars = [
        'pkmEntries' => sgg_data_load('builds/pokemon/pokemon-entries-map.json'),
        'pkmIds' => sgg_get_sorted_pokemon_ids(),
        'gameSets' => sgg_get_gamesets(),
        'presets' => sgg_data_load('builds/box-presets-full.json'),
        'route' => $route,
        'currentGameSetId' => tpl_request_param('gameset'),
        'currentPid' => tpl_request_param('pid'),
        'currentPidIndex' => tpl_request_param('pidx', 0),
        'currentResourceId' => tpl_request_param('id'),
        'currentSearch' => tpl_request_param('q'),
    ];

    if ($route === '') {
        tpl_render_page("routes/index", $tplVars);
    }

    if (str_starts_with($route, '/assets/')) {
        $route = substr($route, 5);
        $file = sprintf("%s/assets/%s", __DIR__, $route);
        if (file_exists($file)) {
            if (str_ends_with($route, '.css')) {
                header('Content-Type: text/css');
            } elseif (str_ends_with($route, '.js')) {
                header('Content-Type: application/javascript');
            } elseif (str_ends_with($route, '.png')) {
                header($nextYearExpiration);
                header('Content-Type: image/png');
            } elseif (str_ends_with($route, '.jpg')) {
                header($nextYearExpiration);
                header('Content-Type: image/jpeg');
            } elseif (str_ends_with($route, '.webp')) {
                header($nextYearExpiration);
                header('Content-Type: image/webp');
            }
            echo file_get_contents($file);
            exit;
        }
    }

    if (file_exists(sprintf("%s/routes/%s.php", __DIR__, $route))) {
        tpl_render_page(("routes/{$route}"), $tplVars);
    }

    tpl_render_page("404", $tplVars);
})();
