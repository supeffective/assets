<?php

$hrefParam = tpl_request_param('href', null);

if ($hrefParam) {
    $htmlCode = @file_get_contents('https://www.serebii.net/' . $hrefParam);
    if ($htmlCode === false) {
        echo 'HTTP 404 NOT FOUND';

        return;
    }
    if (str_contains($hrefParam, 'pokedex-swsh/')) {
        $selector = "//main/div[2]";
    } else {
        $selector = "//main/div/div[1]";
    }
} else {
    if (!isset($currentPid)) {
        throw new Exception(
            'pid GET var is not set'
        );
    }
    $pkm = sgg_data_load('sources/pokemon/entries/' . $currentPid . '.json');
    $ref = $pkm['refs']['serebii'];
    $dexNo3Pad = str_pad($pkm['dexNum'], 3, '0', STR_PAD_LEFT);

    $htmlCode = @file_get_contents('https://www.serebii.net/pokedex-swsh/' . $ref);
    $selector = "//main/div[2]";
    if ($htmlCode === false) {
        $htmlCode = @file_get_contents('https://www.serebii.net/pokedex-sm/' . $dexNo3Pad . '.shtml');
        $selector = "//main/div/div[1]";
    }

    if ($htmlCode === false) {
        echo 'HTTP 404 NOT FOUND';

        return;
    }
}

$htmlCode = str_replace('/style/', 'https://www.serebii.net/style/', $htmlCode);
$htmlCode = str_replace('src="/', 'src="https://www.serebii.net/', $htmlCode);
$htmlCode = str_replace('href="/pokedex-', 'href="/sources/serebii?href=pokedex-', $htmlCode);
$htmlCode = str_replace('href="/pokedex/', 'href="/sources/serebii?href=pokedex/', $htmlCode);

//$htmlCode = explode('id="dex_locations"', $htmlCode)[1];
$domDocument = new \DOMDocument();
$domDocument->loadHTML($htmlCode, LIBXML_NOERROR | LIBXML_NOWARNING);
$xpath = new \DOMXPath($domDocument);
$htmlCodeHead = $domDocument->saveHTML($xpath->query("//head")->item(0));
$htmlCode = $domDocument->saveHTML($xpath->query($selector)->item(0));
echo $htmlCodeHead;
echo '<main>' . $htmlCode . '</main>
<style>
nav{ display: none}
html, body, main, .main { background: #333; font-size: 12px; margin: 0;}
* { font-size: 12px;}
main { padding: 8px;}
header { padding: 0}
img {max-width: 50px; height: auto !important; display: none;}
</style>';
?>
