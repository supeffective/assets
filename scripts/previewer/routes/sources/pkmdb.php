<?php

if (!isset($_GET['ref'])) {
    throw new Exception(
        'ref GET var is not set'
    );
}
$htmlCode = file_get_contents('https://pokemondb.net/pokedex/' . $_GET['ref']);

$htmlCode = str_replace('/static/', 'https://pokemondb.net/static/', $htmlCode);

//$htmlCode = explode('id="dex_locations"', $htmlCode)[1];
$domDocument = new \DOMDocument();
$domDocument->loadHTML($htmlCode, LIBXML_NOERROR | LIBXML_NOWARNING);
$xpath = new \DOMXPath($domDocument);
$xpath->query("//div[@id='dex-locations']/following-sibling::div[1]");
$htmlCodeHead = $domDocument->saveHTML($xpath->query("//head")->item(0));
$htmlCode = $domDocument->saveHTML($xpath->query("//div[@id='dex-locations']/following-sibling::div/div")->item(0));
echo $htmlCodeHead;
echo '<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>'.$htmlCode . ' <style> nav{ display: none}</style>';
?>
