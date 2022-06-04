<?php
/** @noinspection PhpUndefinedVariableInspection */

tpl_partial('gameset-selector', $tplVars);
if ($currentGameSetId) {
    $presets = [$currentGameSetId => $presets[$currentGameSetId]];
}

//    pvw_partial('preset-list', [
//        'gameset' => $gameset,
//        'preset' => $preset,
//    ]);

?>
<ul class="presets-list">
    <?php if(!$currentGameSetId): ?>
    <li>
        <h4>Misc.</h4>
        <ul>
            <li>
                <a href="<?= tpl_build_url('preset', ['id' => 'unobtainable', 'gameset' => '']) ?>">
                    Unobtainable
                </a>
            </li>
            <li>
                <a href="<?= tpl_build_url('preset', ['id' => 'unreleased-shiny', 'gameset' => '']) ?>">
                    Shiny Unreleased
                </a>
            </li>
        </ul>
        <hr />
    </li>
    <?php endif; ?>

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
                        <a href="<?= tpl_build_url('preset', ['id' => $presetId, 'gameset' => $gameset]) ?>">
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

