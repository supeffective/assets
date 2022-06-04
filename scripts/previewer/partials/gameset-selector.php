<?php

$currentGameset = pvw_param('gameset');
//function pvw_gameset_to_tags(array $wantedGameSetIds, array $allGameSets): string
//{
//    $sortedGameSetIds = [];
//    foreach ($allGameSets as $id => $gameSet) {
//        if (in_array($id, $wantedGameSetIds, true)) {
//            $sortedGameSetIds[] = $id;
//        } else {
//            // $sortedGameSetIds[] = "<span class=\"text-muted\">$id</span>";
//        }
//    }
//    if (empty($sortedGameSetIds)) {
//        return '<span class="gameset-tag gameset-none">---</span>';
//    }
//    $tags = [];
//    foreach ($sortedGameSetIds as $gameSetId) {
//        $gameSetName = $allGameSets[$gameSetId]['name'];
//        $tags[] = sprintf(
//            '<span class="gameset-tag gameset-%s" title="%s">%s</span>',
//            $gameSetId,
//            $gameSetName,
//            $gameSetId
//        );
//    }
//
//    return implode(PHP_EOL, $tags);
//}
?>

<div class="gameset-selector">
    <div class="title"><b>Filter by Game Set:</b></div>
    <ul>
        <li class="<?php
        echo !$currentGameset ? 'active' : '' ?>"
        >
            <a href="<?php
            echo pvw_route_url(null, ['gameset' => '']); ?>"
            >
                (All)
            </a></li>
        <?php
        $gameSets = sgg_get_gamesets();

        foreach ($gameSets as $gameSet) {
            ?>
            <li title="<?php
            echo $gameSet['name']; ?>" class="<?php
            echo $currentGameset === $gameSet['id'] ? 'active' : '' ?>"
            >
                <a href="<?php
                echo sprintf(
                    '/%s/?%s',
                    pvw_route(),
                    pvw_query_string(['gameset' => $gameSet['id']])
                ); ?>"
                >
                    <?php
                    echo $gameSet['id']; ?>
                </a>
            </li>
            <?php
        }
        ?>
    </ul>
</div>
