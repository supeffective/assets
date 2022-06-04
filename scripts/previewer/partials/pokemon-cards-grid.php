<?php

if (!isset($pkmIds)) {
    throw new Exception(
        '$pkmIds var not set'
    );
}

if (!isset($pkmEntries)) {
    throw new Exception(
        '$pkmEntries var not set'
    );
}

if (!isset($gameSets)) {
    throw new Exception(
        '$gameSets var not set'
    );
}

if (!isset($currentGameSetId)) {
    $currentGameSetId = null;
}

if (!isset($cardCallback)) {
    $cardCallback = null;
}


$filteredPokemonList = $pkmIds;
$numForms = 0;
$numSpecies = 0;

if ($currentGameSetId) {
    $filteredPokemonList = array_filter(
        $pkmIds,
        static function (string $pokemonId) use ($currentGameSetId, $pkmEntries): bool {
            if (!isset($pkmEntries[$pokemonId])) {
                return false;
            }

            return $currentGameSetId === $pkmEntries[$pokemonId]['debutIn'];
        }
    );
}

foreach ($filteredPokemonList as $pokemonId) {
    $pokemonEntry = $pkmEntries[$pokemonId];
    if ($pokemonEntry['isForm']) {
        $numForms++;
    } else {
        $numSpecies++;
    }
}

$gameSet = $currentGameSetId ? $gameSets[$currentGameSetId] : null;

?>

<div class="pokemon-list">
    <p>
        <b>Pokémon List</b>
    </p>
    <p class="alert alert-primary">
        <?php
        if ($gameSet): ?>
            <b>Pokémon <?= $gameSet['name'] ?> </b> introduced  <?php
            echo sprintf('<b>%s</b> new species and <b>%s</b> new forms.', $numSpecies, $numForms) ?>

        <?php
        else: ?>
            All <?php
            echo sprintf('<b>%s</b> species and <b>%s</b> forms.', $numSpecies, $numForms)
            ?>
        <?php
        endif ?>
    </p>
    <ul>
        <?php
        foreach ($filteredPokemonList as $pkmId) {
            $pkm = $pkmEntries[$pkmId] ?? null;
            if (!$pkm) {
                throw new Exception("Pokemon '$pkmId' entry not found");
            }
            ?>
            <li title="<?php
            echo $pkm['name']; ?>"
            >
                <?php
                tpl_partial('pokemon-card', [
                    'pkm' => $pkm,
                    'cardCalback' => $cardCallback,
                    'gameSets' => $gameSets,
                ]);
                ?>
            </li>
            <?php
        }
        ?>
    </ul>
</div>
