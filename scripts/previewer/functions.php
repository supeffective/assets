<?php

use JetBrains\PhpStorm\NoReturn;

function tpl_request_route(): string
{
    $uri = str_replace(['\\', '/../'], '', $_SERVER['REQUEST_URI']);

    return trim(explode('?', $uri)[0], '/');
}


function tpl_build_url(?string $route = null, array $params = []): string
{
    return sprintf(
        $route === '/' ? '/?%s' : '/%s/?%s',
        trim($route ?: tpl_request_route(), '/'),
        tpl_request_query_string($params)
    );
}

function tpl_request_query_string(array $newParams = []): string
{
    return http_build_query(array_merge($_GET, $newParams));
}

function tpl_request_param(string $paramName, $default = null): string | null | int
{
    return $_REQUEST[$paramName] ?? $default;
}

function tpl_partial(string $name, array $data = []): void
{
    tpl_render('partials/' . $name, $data);
}

function tpl_layout_start(array $data = []): void
{
    tpl_partial('layout_start', $data);
}

function tpl_layout_end(array $data = []): void
{
    tpl_partial('layout_end', $data);
}

function tpl_render(string $path, array $tplVars = []): void
{
    extract($tplVars, EXTR_OVERWRITE);
    include sprintf("%s/%s.php", __DIR__, $path);
}

#[NoReturn] function tpl_render_page(string $path, array $data = []): void
{
    header('Content-Type: text/html');
    tpl_layout_start($data);
    tpl_render($path, $data);
    tpl_layout_end($data);
    exit;
}
