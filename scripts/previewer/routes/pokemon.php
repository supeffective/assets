<?php

pvw_layout_start();
pvw_partial('gameset-selector');
$gameSets = sgg_get_gamesets();
$currentGameset = pvw_param('gameset');
$gameSetsToTags = static function (array $gameSetIds) use ($gameSets): string {
    $sortedGameSetIds = [];
    foreach ($gameSets as $id => $gameSet) {
        if (in_array($id, $gameSetIds, true)) {
            $sortedGameSetIds[] = $id;
        } else {
           // $sortedGameSetIds[] = "<span class=\"text-muted\">$id</span>";
        }
    }
    if (empty($sortedGameSetIds)) {
        return '<span class="gameset-tag gameset-none">---</span>';
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

    return implode(PHP_EOL, $tags);
};

?>

<?php
pvw_component_load('pokemon-list');
pvw_pokemon_list(function (array $pkm) use ($gameSetsToTags) {
    $pkmId = $pkm['id'];
    sort($pkm['obtainableIn']);
    sort($pkm['onlyViaEventIn']);
    sort($pkm['storableIn']);
    $refs = $pkm['refs'];
    ?>

    <div class="availability">
        <div class="debut-in">
            Debut <em><?php
                echo $gameSetsToTags([$pkm['debutIn']]) ?></em>
        </div>
    </div>

    <div class="availability">
        <div class="obtainable-in">
            Obtainable In <em><?php
                echo $gameSetsToTags($pkm['obtainableIn']) ?></em>
        </div>
    </div>


    <div class="availability">
        <div class="eventonly-in">
            Event-Only In <em><?php
                echo $gameSetsToTags($pkm['onlyViaEventIn']) ?></em>
        </div>
    </div>

    <div class="availability">
        <div class="storable-in">
            Storable In <em><?php
                echo $gameSetsToTags($pkm['storableIn']) ?></em>
        </div>
    </div>

    <div class="links">
        <div class="view-in">
            View in: <br />
            <a target="_blank" rel="noreferrer" href="https://www.serebii.net/pokemon/<?php
            echo $refs['serebii']; ?>/" title="serebii.net"
            ><i class="pkmi pkmi-celebi"></i></a>
            <a target="_blank" rel="noreferrer" href="https://bulbapedia.bulbagarden.net/wiki/<?php
            echo $refs['bulbapedia']; ?>_(Pokémon)" title="bulbagarden.net"
            ><i class="pkmi pkmi-bulbasaur"></i></a>
            <a target="_blank" rel="noreferrer" href="https://www.smogon.com/dex/ss/pokemon/<?php
            echo $refs['smogon']; ?>" title="smogon.com"
            ><i class="pkmi pkmi-koffing"></i></a>
        </div>
    </div>
    <?php
});
?>

Game Set:
<pre><?php
    echo $currentGameset ? json_encode($gameSets[$currentGameset], JSON_THROW_ON_ERROR | JSON_PRETTY_PRINT) : ''; ?></pre>

<?php
pvw_layout_end(); ?>
