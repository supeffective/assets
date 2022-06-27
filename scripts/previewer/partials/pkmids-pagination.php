<?php

if (!isset($pkmIds, $gameSets)) {
    throw new Exception(
        'pkmIds, gameSets vars: some or all are not set'
    );
}

$currentPidIndex = (int) ($currentPidIndex ?? 0);
$paginationButtons = 5;
$paginationStart = max($currentPidIndex - $paginationButtons, 0);
$paginationEnd = min($currentPidIndex + $paginationButtons, count($pkmIds) - 1);

$minIdx = (int) max($currentPidIndex - 2, 0);
$maxIdx = (int) min($currentPidIndex + 2, count($pkmIds) - 1);

?>

<nav aria-label="Page navigation example" style="display: inline-block" class="text-center">
    <ul class="pagination">
        <?php
        $style = "width:120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: center;";
        $style .= " font-size:12px;";
        for ($i = $minIdx; $i <= $maxIdx; $i++) {
            ?>
            <li class="page-item <?= $currentPidIndex === $i ? ' active' : '' ?>">
                <a class="page-link" href="<?= tpl_build_url('pokemon-locations', ['pidx' => $i]) ?>"
                   style="<?= $style ?>"
                >
                    <?= $pkmIds[$i] ?>
                </a>
            </li>
            <?php
        }
        ?>
    </ul>
</nav>
