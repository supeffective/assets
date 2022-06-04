<?php

pvw_layout_start();
$gameSets = sgg_get_gamesets();
$presetId = pvw_param('id');
$gamesetId = pvw_param('gameset');
$presets = sgg_data_load('builds/box-presets-full.json');
if (!isset($presets[$gamesetId][$presetId])) {
    throw new Exception('Preset not found');
}

$preset = $presets[$gamesetId][$presetId];
?>

<div class="max-960">
    <p>
        <a class="btn btn-outline-primary" href="/presets">Presets List</a>
    </p>
    <h3><?= $gameSets[$gamesetId]['name'] ?></h3>
    <h4><?= $preset['name'] ?></h4>
    <p><?= $preset['description'] ?></p>

</div>
<div class="preset-viewer max-960" style="max-width: 1200px">
    <div class="preset-boxes preset-boxes-<?= $gamesetId ?>">
        <?php
        foreach ($preset['boxes'] as $boxIdx => $box): ?>
            <div class="preset-box">
                <?php
                foreach ($box['pokemon'] as $pkmIdx => $pkmId): ?>
                    <div class="preset-pkm" title="<?php
                    echo $pkmId ?: '-' ?>"
                    >
                        <?php
                        if ($pkmId): ?>
                            <a href="/pokemon-edit?pid=<?= $pkmId ?>">
                                <img class="<?= "pkm pkm-{$pkmId}" ?>"
                                     src="/assets/spritesheets/pokemon/placeholder-64x64.png"
                                     width="64" height="64"
                                />
                            </a>
                        <?php
                        else: ?>
                            <img src="/assets/spritesheets/pokemon/placeholder-64x64.png" width="64" height="64" />
                        <?php
                        endif; ?>
                    </div>
                <?php
                endforeach; ?>
            </div>
        <?php
        endforeach; ?>
    </div>
</div>


<?php
pvw_layout_end(); ?>
