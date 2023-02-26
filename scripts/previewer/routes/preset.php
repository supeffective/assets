<?php
/** @noinspection PhpUndefinedVariableInspection */

$gameSetId = $currentGameSetId ?: null;
$presetId = $currentResourceId ?: '_NONE_';
$preset = [];

$speciesCount = 0;
$formsCount = 0;

if (!$gameSetId && $presetId === 'unobtainable') {
    $preset = [
        'name' => 'Currently Not Obtainable',
        'description' => 'Pokémon that are currently not obtainable, because they were only distributed via events.'
            . '<br /> First box: Unobtainable, Second box: Event-only. They are more or less the same.',
        'boxes' => [
            ['pokemon' => sgg_data_load('builds/pokemon/pokemon-unobtainable.json')],
            ['pokemon' => sgg_data_load('builds/pokemon/pokemon-event-only.json')],
        ],
    ];
} elseif (!$gameSetId && $presetId === 'unreleased-shiny') {
    $preset = [
        'name' => 'Shiny Unreleased',
        'description' => 'Pokémon that are not released yet as shiny.',
        'boxes' => [
            ['pokemon' => sgg_data_load('builds/pokemon/pokemon-unobtainable-shiny.json')],
        ],
    ];
} elseif (!$gameSetId || !isset($presets[$gameSetId][$presetId])) {
    throw new Exception('Preset not found');
} else {
    $preset = $presets[$gameSetId][$presetId];
}

foreach ($preset['boxes'] as $boxIdx => $box) {
    foreach ($box['pokemon'] as $pkmIdx => $pkmId) {
        if (!$pkmId) {
            continue;
        }
        if (is_array($pkmId) && isset($pkmId['pid'])) {
            $pkmId = $pkmId['pid'];
        }
        if (!array_key_exists($pkmId, $pkmEntries)) {
            throw new Exception("Entry for '$pkmId' not found.");
        }
        $pkm = $pkmEntries[$pkmId];
        if ($pkm['isForm']) {
            $formsCount++;
        } else {
            $speciesCount++;
        }
    }
}
?>

<div class="max-960">
    <p>
        <a class="btn btn-outline-primary" href="/presets">Presets List</a>
    </p>
    <h3><?= $gameSetId ? $gameSets[$gameSetId]['name'] : 'Misc.' ?></h3>
    <h4><?= $preset['name'] ?></h4>
    <p><?= $preset['description'] ?></p>

</div>
<div class="preset-viewer max-960" style="max-width: 1200px">
    <div style="text-align: center; padding: 1rem; font-weight: bold">
        <?php
        echo "" . $speciesCount . " species, " . $formsCount . " forms";
        ?>
    </div>
    <div class="preset-boxes preset-boxes-<?= $gameSetId ?: 'misc' ?>">
        <?php
        foreach ($preset['boxes'] as $boxIdx => $box): ?>
            <div class="preset-box">
                <?php
                foreach ($box['pokemon'] as $pkmIdx => $pkmId):
                    if (is_array($pkmId) && isset($pkmId['pid'])) {
                        $pkmId = $pkmId['pid'];
                    }

                    ?>
                    <div class="preset-pkm" title="<?php
                    echo $pkmId ?: '-' ?>"
                    >
                        <?php
                        if ($pkmId): ?>
                            <a href="/pokemon-edit?pid=<?= $pkmId ?>">
                                <img class="<?= "pkm pkm-{$pkmId}" ?>"
                                     src="/assets/placeholders/placeholder-64x64.png"
                                     width="64" height="64"
                                />
                            </a>
                        <?php
                        else: ?>
                            <img src="/assets/placeholders/placeholder-64x64.png" width="64" height="64"/>
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

