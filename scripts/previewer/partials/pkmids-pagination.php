<?php

if (!isset($pkmIds, $gameSets)) {
    throw new Exception(
        'pkmIds, gameSets vars: some or all are not set'
    );
}

$currentPidIndex = (int) ($currentPidIndex ?? 0);
$siblingButtons = 3;

$minIdx = (int) max($currentPidIndex - $siblingButtons, 0);
$maxIdx = (int) min($currentPidIndex + $siblingButtons, count($pkmIds) - 1);
$maxAbsIdx = count($pkmIds) - 1;
$currentPkmId = $pkmIds[$currentPidIndex];

?>

<div class="container-fluid text-center pkmids-pagination" style="margin: 1em 0">
    <nav aria-label="Page navigation example" style="display: inline-block">
        <ul class="pagination">
            <li class="page-item <?= $currentPidIndex === 0 ? ' active' : '' ?>">
                <a class="page-link" href="<?= tpl_build_url('pokemon-locations', ['pidx' => 0]) ?>">
                    [FIRST] ...
                </a>
            </li>
            <?php
            for ($i = $minIdx; $i <= $maxIdx; $i++) {
                ?>
                <li class="page-item <?= $currentPidIndex === $i ? ' active' : '' ?>">
                    <a class="page-link" href="<?= tpl_build_url('pokemon-locations', ['pidx' => $i]) ?>">
                        <?= $pkmIds[$i] ?>
                    </a>
                </li>
                <?php
            }
            ?>
            <li class="page-item <?= $currentPidIndex === $maxAbsIdx ? ' active' : '' ?>">
                <a class="page-link" href="<?= tpl_build_url('pokemon-locations', ['pidx' => $maxAbsIdx]) ?>">
                    ... [LAST]
                </a>
            </li>
        </ul>
        <div>
            <select onchange="((select) => {
                window.location.href = '/<?= tpl_request_route(
            ) ?>?pidx=' + select.options[select.selectedIndex].value})(this)"
            >
                <?php
                foreach (
                    $pkmIds

                    as $idx => $pkmId
                ) {
                    ?>
                    <option value="<?= $idx ?>"<?= $idx === $currentPidIndex ? ' selected' : '' ?>>
                        <?= $pkmId ?>
                    </option>
                    <?php
                }
                ?>
            </select>
        </div>
    </nav>
</div>
