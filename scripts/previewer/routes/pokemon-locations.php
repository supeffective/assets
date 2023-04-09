<?php

if (!isset($pkmIds, $currentPidIndex, $gameSets)) {
    throw new Exception(
        'pkmIds, currentPidIndex, gameSets vars: some or all are not set'
    );
}

$pokemonId = $pkmIds[$currentPidIndex];
$pkm = sgg_data_load('sources/pokemon/entries/' . $pokemonId . '.json');

//print_r($pkm);
//die();

$pkmStr = json_encode($pkm);
$cardCallback = function () {
    echo ' <div><button class="btn btn-sm btn-primary" type="submit">Save</button></div>';
};

if (isset($_POST['data']) && !empty($_POST['data'])) {
    $newPkm = array_merge(
        [
            'debutIn' => null,
            'obtainableIn' => [],
            'versionExclusiveIn' => [],
            'eventOnlyIn' => [],
            'storableIn' => [],
        ],
        $_POST['data']
    );
    $pkm = array_merge($pkm, $newPkm);
    sgg_data_save('sources/pokemon/entries/' . $pokemonId . '.json', $pkm);
    ?>
    <h4>
        <?= $pkm['name'] ?>
    </h4>
    <div class="icons">
        <i class="pkmi pkmi-<?php
        echo $pkm['id']; ?>"
        ></i>
    </div>
    <div class="alert alert-success" role="alert">
        Saved!
        <div>
            <a class="btn btn-lg btn-outline-primary"
               href="<?= tpl_build_url('pokemon-locations', ['pidx' => $currentPidIndex]) ?>"
            >View</a>
            <a class="btn btn-lg btn-primary"
               href="<?= tpl_build_url('pokemon-locations', ['pidx' => $currentPidIndex + 1]) ?>"
            >Next Pokémon</a>
        </div>
    </div>
    <div class="container-fluid" style="min-width: 900px">
        <div class="row">
            <div class="col-12">
                <?php
                tpl_partial(
                    'pkmids-pagination',
                    ['gameSets' => $gameSets, 'pkmIds' => $pkmIds, 'currentPidIndex' => $currentPidIndex]
                );
                ?>
            </div>
        </div>
    </div>
    <?php
    return;
}
?>

<script>
    const saveForm = (e) => {
        /** @type  {HTMLFormElement}  */
        const form = document.getElementById('pkm_form')

        //form.pkm_data.value = btoa(JSON.stringify(currentJsonEditor.get(), null, 2))
    }
</script>

<div class="container-fluid" style="min-width: 900px">
    <div class="row">
        <div class="col-12">
            <?php
            tpl_partial(
                'pkmids-pagination',
                ['gameSets' => $gameSets, 'pkmIds' => $pkmIds, 'currentPidIndex' => $currentPidIndex]
            );
            ?>
        </div>
    </div>
    <div class="row">
        <div class="col-12 text-center">
            <form id="pkm_form" method="post" onsubmit="saveForm()" class="w-1200">
                <h4>
                    <?= $pkm['name'] ?>
                </h4>
                <div class="icons">
                    <i class="pkm pkm-<?php
                    echo $pkm['id']; ?>"
                    ></i>
                </div>
                <hr/>
                <div>
                    <button class="btn btn-lg btn-primary" type="submit">Save</button>
                    <br/>
                    <br/>
                    <a
                        class="btn btn-sm btn-link-primary"
                        href="<?= tpl_build_url('sources/serebii', ['pid' => $pkm['id']]) ?>"
                    >
                        View in Serebii
                    </a>
                </div>
                <br/>
                <input type="hidden" id="pid" name="pid" value="<?= $pokemonId ?>">

                <hr/>


                <div class="row">
                    <div class="col-6">
                        <div class="blue-box">
                            <h5>Obtainable In:</h5>
                            <p style="height: 50px">
                                Where it is obtainable in-game (this one or its the pre-evolution),
                                without trades or special events.
                            </p>
                            <div class="gameset-input-grid">
                                <?php
                                foreach ($gameSets as $gameSet) {
                                    $checked = in_array($gameSet['id'], $pkm['obtainableIn'], true) ? ' checked ' : '';
                                    ?>
                                    <label class="gameset-tags">
            <span class="gameset-tag gameset-<?= $gameSet['id'] ?>" title="<?= $gameSet['name'] ?>"
            ><?= $gameSet['id'] ?></span>
                                        <input <?= $checked ?>
                                            name="data[obtainableIn][]"
                                            type="checkbox"
                                            value="<?= $gameSet['id'] ?>"
                                        />
                                    </label>
                                    <?php
                                }
                                ?>
                            </div>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="blue-box">
                            <h5>Transferrable to / Storable In:</h5>
                            <p>Where it can be put in the box system, without losing this form.</p>
                            <div class="gameset-input-grid">
                                <?php
                                foreach ($gameSets as $gameSet) {
                                    $checked = in_array($gameSet['id'], $pkm['storableIn'], true) ? ' checked ' : '';
                                    ?>
                                    <label class="gameset-tags">
            <span class="gameset-tag gameset-<?= $gameSet['id'] ?>" title="<?= $gameSet['name'] ?>"
            ><?= $gameSet['id'] ?></span>
                                        <input <?= $checked ?>
                                            name="data[storableIn][]"
                                            type="checkbox"
                                            value="<?= $gameSet['id'] ?>"
                                        />
                                    </label>
                                    <?php
                                }
                                ?>
                            </div>
                        </div>
                    </div>
                </div>

                <hr/>

                <div class="blue-box" style="background-color: rgba(139,204,148,0.59)">
                    <h5>Debut In</h5>
                    <p style="height: 50px">Where it was first introduced.</p>
                    <div class="gameset-input-grid">
                        <?php
                        foreach ($gameSets as $gameSet) {
                            $checked = $gameSet['id'] === $pkm['debutIn'] ? ' checked ' : '';
                            ?>
                            <label class="gameset-tags">
            <span class="gameset-tag gameset-<?= $gameSet['id'] ?>" title="<?= $gameSet['name'] ?>"
            ><?= $gameSet['id'] ?></span>
                                <input <?= $checked ?> name="data[debutIn]"
                                                       type="radio"
                                                       value="<?= $gameSet['id'] ?>"
                                />
                            </label>
                            <?php
                        }
                        ?>
                    </div>
                </div>

                <hr/>

                <div class="row">
                    <div class="col-6">
                        <div class="orange-box">
                            <h5>Version Exclusive In:</h5>
                            <p>
                                More granular version of "Obtainable In". It says if it's exclusive to a particular
                                game version.
                                If it's in both, leave it empty.
                            </p>
                            <div class="gameset-input-grid">
                                <?php
                                foreach ($gameSets as $gameSet) {
                                    foreach ($gameSet['games'] as $gameId => $gameName) {
                                        $gameIdParts = explode('-', $gameId);
                                        $gameIdGame = $gameIdParts[count($gameIdParts) - 1];
                                        $checked = in_array($gameId, $pkm['versionExclusiveIn'], true) ? ' checked ' : '';
                                        ?>
                                        <label class="gameset-tags">
            <span class="gameset-tag gameset-<?= $gameId ?>" title="<?= $gameSet['name'] ?>"
            ><?= $gameIdGame ?></span>
                                            <input <?= $checked ?>
                                                name="data[versionExclusiveIn][]"
                                                type="checkbox"
                                                value="<?= $gameId ?>"
                                            />
                                        </label>
                                        <?php
                                    }
                                }
                                ?>
                            </div>
                        </div>
                    </div>

                    <div class="col-6">
                        <div class="orange-box">

                            <h5>Event-Only In:</h5>
                            <p>Where it can be obtained, but only via Mystery Gift or special events.</p>
                            <div class="gameset-input-grid">
                                <?php
                                foreach ($gameSets as $gameSet) {
                                    $checked = in_array($gameSet['id'], $pkm['eventOnlyIn'], true) ? ' checked ' : '';
                                    ?>
                                    <label class="gameset-tags">
            <span class="gameset-tag gameset-<?= $gameSet['id'] ?>" title="<?= $gameSet['name'] ?>"
            ><?= $gameSet['id'] ?></span>
                                        <input <?= $checked ?>
                                            name="data[eventOnlyIn][]"
                                            type="checkbox"
                                            value="<?= $gameSet['id'] ?>"
                                        />
                                    </label>
                                    <?php
                                }
                                ?>
                            </div>
                        </div>
                    </div>
                </div>

                <hr/>
                <div>
                    <button class="btn btn-lg btn-primary" type="submit">Save</button>
                </div>
            </form>
        </div>
    </div>
    <div class="row">
        <div class="col-12">
            <?php
            tpl_partial(
                'pkmids-pagination',
                ['gameSets' => $gameSets, 'pkmIds' => $pkmIds, 'currentPidIndex' => $currentPidIndex]
            );
            ?>
        </div>
    </div>
</div>
