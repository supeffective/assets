<?php
/** @noinspection PhpUndefinedVariableInspection */

$sortedGameSetIds = [];
foreach ($gameSets as $id => $gameSet) {
    if (in_array($id, $gameSetIds, true)) {
        $sortedGameSetIds[] = $id;
    } else {
        // $sortedGameSetIds[] = "<span class=\"text-muted\">$id</span>";
    }
}
if (empty($sortedGameSetIds)) {
    echo '<em class="gameset-tags"><span class="gameset-tag gameset-none">---</span></em>';

    return;
}
$tags = [];
foreach ($sortedGameSetIds as $gameSetId) {
    $gameSetName = $gameSets[$gameSetId]['name'];
    $tags[] = sprintf(
        '<span class="gameset-tag gameset-%s" title="%s">%s</span>',
        $gameSetId,
        $gameSetName,
        $gameSetId
    );
}

echo '<em class="gameset-tags">' . implode(PHP_EOL, $tags) . '</em>';
