<?php

require_once __DIR__ . '/pokemon-card.php';

function pvw_pokemon_list(callable $pkmCallback = null): void
{
    $currentGameset = pvw_param('gameset');
//    $params = [
//        'debut' => pvw_param('debut'),
//        'obtainable' => pvw_param('obtainable'),
//        'storable' => pvw_param('storable'),
//        'event-only' => pvw_param('event-only'),
//    ];

    $pokemonEntries = sgg_data_load('builds/pokemon/pokemon-entries-map.json');
    $pokemonList = sgg_get_sorted_pokemon_ids();
    $filteredPokemonList = $pokemonList;
    $numForms = 0;
    $numSpecies = 0;

    if ($currentGameset) {
        $filteredPokemonList = array_filter(
            $pokemonList,
            static function (string $pokemonId) use ($currentGameset, $pokemonEntries): bool {
                if (!isset($pokemonEntries[$pokemonId])) {
                    return false;
                }

                return $currentGameset === $pokemonEntries[$pokemonId]['debutIn']
                    //|| in_array($currentGameset, $pokemonEntries[$pokemonId]['obtainableIn'], true)
                    //|| in_array($currentGameset, $pokemonEntries[$pokemonId]['storableIn'], true)
                    //|| in_array($currentGameset, $pokemonEntries[$pokemonId]['onlyViaEventIn'], true)
                    ;
            }
        );
    } else {
//        $filteredPokemonList = array_filter(
//            $pokemonList,
//            static function (string $pokemonId) use ($currentGameset, $pokemonEntries): bool {
//                if (!isset($pokemonEntries[$pokemonId])) {
//                    return false;
//                }
//                if ($pokemonEntries[$pokemonId]['isForm']) {
//                    return false;
//                }
//                return true;
//            }
//        );
    }

    foreach ($filteredPokemonList as $pokemonId) {
        $pokemonEntry = $pokemonEntries[$pokemonId];
        if ($pokemonEntry['isForm']) {
            $numForms++;
        } else {
            $numSpecies++;
        }
    }

    ?>

    <div class="pokemon-list">
        <p>
            <b>Pokémon List</b>
        </p>
        <p class="alert alert-primary">
            Introduced: <?php
            echo sprintf('%s species, %s forms', $numSpecies, $numForms) ?>
        </p>
        <ul>
            <?php
            foreach ($filteredPokemonList as $pkmId) {
                $pkm = $pokemonEntries[$pkmId] ?? null;
                if (!$pkm) {
                    throw new Exception("Pokemon '$pkmId' entry not found");
                }
                ?>
                <li title="<?php
                echo $pkm['name']; ?>"
                >
                    <?php
                    pvw_pokemon_card($pkm, $pkmCallback); ?>
                    <a class="btn btn-outline-primary btn-sm" href="<?php
                    echo pvw_route_url('/pokemon-edit', ['pid' => $pkmId]) ?>"
                    >Edit</a>
                </li>
                <?php
            }
            ?>
        </ul>
    </div>
    <?php
}

?>
