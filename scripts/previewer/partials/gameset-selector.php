<?php
/** @noinspection PhpUndefinedVariableInspection */

?>
<div class="gameset-selector">
    <div class="title"><b>Filter by Game Set:</b></div>
    <ul>
        <li class="<?= (!$currentGameSetId ? 'active' : '') ?>">
            <a href="<?= tpl_build_url(null, ['gameset' => '']) ?>">
                (All)
            </a>
        </li>
        <?php

        foreach ($gameSets as $gameSet) {
            ?>
            <li title="<?= $gameSet['name'] ?>"
                class="<?= ($currentGameSetId === $gameSet['id'] ? 'active' : '') ?>"
            >
                <a href="<?= sprintf(
                    '/%s/?%s',
                    tpl_request_route(),
                    tpl_request_query_string(['gameset' => $gameSet['id']])
                ) ?>"
                >
                    <?= $gameSet['id'] ?>
                </a>
            </li>
            <?php
        }
        ?>
    </ul>
</div>
