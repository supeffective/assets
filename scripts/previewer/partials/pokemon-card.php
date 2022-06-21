<?php

if (!isset($cardCallback)) {
    $cardCallback = null;
}

if (!isset($pkm) || !is_array($pkm)) {
    throw new Exception('pkm var is not set');
}
if (!isset($gameSets)) {
    throw new Exception('$gameSets var is not set');
}

$isCompact = isset($isCompact) && $isCompact;
$pkmId = $pkm['id'];

?>
<?php
$isGmax = $pkm['isGmax'];
$isMega = $pkm['isMega'];
sort($pkm['obtainableIn']);
sort($pkm['onlyViaEventIn']);
sort($pkm['storableIn']);
$refs = $pkm['refs'];
?>
<div class="pokemon-card" title="<?php
echo $pkm['name']; ?>"
>
    <div class="title">
        <?php
        if ($isGmax) { ?>
            <span class="symbol gmax-symbol"></span>
            <?php
        } ?>
        <?php
        if ($isMega) { ?>
            <span class="symbol mega-symbol"></span>
            <?php
        } ?>
        <?php
        if ($pkm['isFemaleForm']) { ?>
            <span class="symbol female-symbol">♀</span>
            <?php
        } ?>
        <span><?php
            echo $pkm['name']; ?></span>
        <code><?php
            echo $pkm['id']; ?></code>
    </div>
    <div class="title">
        <small><span style="font-weight: normal;"
            >Form</span>: <?php
            echo $pkm['formName'] ?? '---'; ?>
        </small>
    </div>
    <div class="icons">
        <i class="pkm pkm-<?php
        echo $pkmId; ?>"
        ></i>
        <i class="pkmi pkmi-<?php
        echo $pkmId; ?>"
        ></i>
    </div>

    <div class="types">
        <?php
        if ($pkm['type1']) { ?>
            <img src="/assets/types/<?php
            echo $pkm['type1']; ?>.png"
                 width="24" height="24" alt="<?php
            echo $pkm['type1']; ?>"
            /><?php
        } ?>

        <?php
        if ($pkm['type2']) { ?>
            <img src="/assets/types/<?php
            echo $pkm['type2']; ?>.png"
                 width="24" height="24" alt="<?php
            echo $pkm['type2']; ?>"
            /><?php
        } ?>
    </div>
    <div class="title">
        <span><span style="font-weight: normal"
            >Generation</span>: <b style=" color: deeppink;"><?php
                echo $pkm['generation'] ?? '???'; ?></b>
        </span>
    </div>
    <div class="title">
        <span><span style="font-weight: normal"
            >Dex No.</span>: <b style=" color: darkblue;"><?php
                echo var_export($pkm['dexNum'], true) ?? '???'; ?></b>
        </span>
    </div>

    <div class="info-3col">
        <div>
            <p>Color</p>
            <div>
                <?php
                if ($pkm['color']) { ?>
                    <span class="poke-color" title="Color: <?php
                    echo $pkm['color']; ?>" style="background-color:<?php
                    echo $pkm['color']; ?>;"
                    ></span>
                    <?php
                } ?>
            </div>
        </div>
        <div>
            <p>Weight</p>
            <div>
                <?php
                if ($pkm['height']['avg']) { ?>
                    <span class="size"><?php
                        echo $pkm['weight']['avg']; ?></span>
                    <?php
                } ?>
            </div>
        </div>
        <div>
            <p>Height</p>
            <div>
                <?php
                if ($pkm['height']['avg']) { ?>
                    <span class="size"><?php
                        echo $pkm['height']['avg']; ?></span>
                    <?php
                } ?>
            </div>
        </div>
    </div>

    <div class="info-3col">
        <div><p>HP</p>
            <div><span class="size"><?= $pkm['baseStats']['hp'] ?></span></div>
        </div>
        <div><p>Attack</p>
            <div><span class="size"><?= $pkm['baseStats']['atk'] ?></span></div>
        </div>
        <div><p>Defense</p>
            <div><span class="size"><?= $pkm['baseStats']['def'] ?></span></div>
        </div>
    </div>

    <div class="info-3col">
        <div><p>Sp.Att.</p>
            <div><span class="size"><?= $pkm['baseStats']['spa'] ?></span></div>
        </div>
        <div><p>Sp.Def.</p>
            <div><span class="size"><?= $pkm['baseStats']['spd'] ?></span></div>
        </div>
        <div><p>Speed</p>
            <div><span class="size"><?= $pkm['baseStats']['spe'] ?></span></div>
        </div>
    </div>

    <div class="info-2col">
        <div><p>Max CP</p>
            <div><span class="size"><?= $pkm['goStats']['maxCP'] ?></span></div>
        </div>
        <div><p>GO Att.</p>
            <div><span class="size"><?= $pkm['goStats']['attack'] ?></span></div>
        </div>
    </div>

    <div class="info-2col">
        <div><p>GO Def.</p>
            <div><span class="size"><?= $pkm['goStats']['defense'] ?></span></div>
        </div>
        <div><p>Stamina</p>
            <div><span class="size"><?= $pkm['goStats']['stamina'] ?></span></div>
        </div>
    </div>


    <div class="availability">
        <div class="debut-in">
            Debut
            <?php
            tpl_partial(
                'gameset-tags', ['gameSetIds' => [$pkm['debutIn']], 'gameSets' => $gameSets]
            ); ?>
        </div>
    </div>

    <div class="availability">
        <div class="obtainable-in">
            Obtainable In
            <?php
            tpl_partial(
                'gameset-tags', ['gameSetIds' => $pkm['obtainableIn'], 'gameSets' => $gameSets]
            ); ?>
        </div>
    </div>

    <div class="availability">
        <div class="exclusive-in">
            Version-Exclusive In
            <?php
            tpl_partial(
                'gameset-game-tags', ['gameIds' => $pkm['versionExclusiveIn'] ?: [], 'gameSets' => $gameSets]
            ); ?>
        </div>
    </div>


    <div class="availability">
        <div class="eventonly-in">
            Event-Only In
            <?php
            tpl_partial(
                'gameset-tags', ['gameSetIds' => $pkm['onlyViaEventIn'], 'gameSets' => $gameSets]
            ); ?>
        </div>
    </div>

    <div class="availability">
        <div class="storable-in">
            Storable In
            <?php
            tpl_partial(
                'gameset-tags', ['gameSetIds' => $pkm['storableIn'], 'gameSets' => $gameSets]
            ); ?>
        </div>
    </div>

    <div class="links">
        <div class="view-in">
            View in: <br />
            <a target="_blank" rel="noreferrer"
               href="https://www.serebii.net/pokemon/<?= $refs['serebii']; ?>/" title="serebii.net"
            ><i class="pkmi pkmi-celebi"></i></a>
            <a target="_blank" rel="noreferrer"
               href="https://bulbapedia.bulbagarden.net/wiki/<?= $refs['bulbapedia']; ?>_(Pokémon)"
               title="bulbagarden.net"
            ><i class="pkmi pkmi-bulbasaur"></i></a>
            <a target="_blank" rel="noreferrer"
               href="https://www.smogon.com/dex/ss/pokemon/<?= $refs['smogon']; ?>" title="smogon.com"
            ><i class="pkmi pkmi-koffing"></i></a>
        </div>
    </div>

    <?php
    if ($cardCallback) {
        $cardCallback($pkm);
    } else { ?>
        <div>
            <a class="btn btn-outline-primary btn-sm" href="<?php
            echo tpl_build_url('/pokemon-edit', ['pid' => $pkmId]) ?>"
            >Edit</a>
        </div>
        <?php
    } ?>
</div>
