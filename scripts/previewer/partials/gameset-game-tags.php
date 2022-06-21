<?php
/** @noinspection PhpUndefinedVariableInspection */

$fullListGameSetGames = [];
foreach ($gameSets as $gameSet) {
    foreach ($gameSet as $gameId => $game) {
        $fullListGameSetGames[] = "{$gameSet['id']}-{$gameId}";
    }
}

$sortedGameIds = [];
foreach ($fullListGameSetGames as $id) {
    if (in_array($id, $gameIds, true)) {
        $sortedGameIds[] = $id;
    }
}
if (empty($sortedGameIds)) {
    echo '<em class="gameset-tags"><span class="gameset-tag gameset-none">---</span></em>';

    return;
}
$tags = [];
foreach ($sortedGameIds as $fullGameId) {
    $gameSetId = substr($fullGameId, 0, strpos($fullGameId, '-'));
    $gameId = substr($fullGameId, strpos($fullGameId, '-') + 1);
    $gameName = $gameSets[$gameSetId]['games'][$gameId];
    $tags[] = sprintf(
        '<span class="gameset-tag gameset-%s" title="%s">%s</span>',
        $gameSetId . ' gameset-' . $fullGameId,
        $gameName,
        $gameId
    );
}

echo '<em class="gameset-tags">' . implode(PHP_EOL, $tags) . '</em>';
