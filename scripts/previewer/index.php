<?php

require_once __DIR__ . '/../_bootstrap.php';

function pvw_layout_start(): void
{
    include_once __DIR__ . '/partials/0a_layout_start.php';
}

function pvw_layout_end(): void
{
    include_once __DIR__ . '/partials/0b_layout_end.php';
}

function pvw_route(): string
{
    $uri = str_replace(['\\', '/../'], '', $_SERVER['REQUEST_URI']);

    return trim(explode('?', $uri)[0], '/');
}


function pvw_route_url(?string $route = null, array $params = []): string
{
    return sprintf(
        $route === '/' ? '/?%s' : '/%s/?%s',
        trim($route ?: pvw_route(), '/'),
        pvw_query_string($params)
    );
}

function pvw_query_string(array $newParams = []): string
{
    return http_build_query(array_merge($_GET, $newParams));
}

function pvw_param(string $paramName, $default = null): string | null | int
{
    return $_GET[$paramName] ?? $default;
}

function pvw_partial(string $name, array $data = []): void
{
    (static function () use ($name, $data) {
        extract($data, EXTR_OVERWRITE);
        include sprintf("%s/partials/%s.php", __DIR__, $name);
    })();
}

function pvw_component_load(string $name): void
{
    (static function () use ($name) {
        require_once sprintf("%s/components/%s.php", __DIR__, $name);
    })();
}

(static function () {
    $route = pvw_route();
    $nextYear = ((int) date('Y')) + 1;
    $nextYearExpiration = "Expires: Sat, 26 Jul {$nextYear} 05:00:00 GMT";

    if ($route === '') {
        header('Content-Type: text/html');
        require sprintf("%s/routes/index.php", __DIR__);

        exit;
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
        header('Content-Type: text/html');
        require sprintf("%s/routes/%s.php", __DIR__, $route);

        exit;
    }

    header('Content-Type: text/plain');
    require sprintf("%s/404.php", __DIR__);

    exit;
})();
