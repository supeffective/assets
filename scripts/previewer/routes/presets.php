<?php

pvw_layout_start();
pvw_partial('gameset-selector');
$gameSets = sgg_get_gamesets();
$currentGameset = pvw_param('gameset');
$presets = sgg_data_load('builds/box-presets-full.json');
if ($currentGameset) {
    $presets = [$currentGameset => $presets[$currentGameset]];
}

//    pvw_partial('preset-list', [
//        'gameset' => $gameset,
//        'preset' => $preset,
//    ]);

?>
<ul class="presets-list">

    <?php

    foreach ($presets as $gameset => $gamePresets) {
        ?>
        <li>
            <h4><?= $gameSets[$gameset]['name'] ?></h4>
            <ol>
                <?php

                foreach ($gamePresets as $presetId => $preset) {
                    ?>
                    <li>
                        <a href="<?= pvw_route_url('preset', ['id' => $presetId, 'gameset' => $gameset]) ?>">
                            <?= $preset['name'] ?>
                        </a>
                    </li>
                    <?php
                }
                ?>
            </ol>
        </li>
        <?php
    }
    ?>

</ul>


<?php
pvw_layout_end(); ?>
