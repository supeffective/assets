<?php

function pvw_pokemon_card(array $pkm, callable $pkmCallback = null): void
{
    $pkmId = $pkm['id'];

    ?>
    <?php
    $isGmax = str_contains($pkmId, '-gmax');
    $isMega = str_contains($pkmId, '-mega');
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

        <?php
        if ($pkmCallback) {
            $pkmCallback($pkm);
        } ?>
    </div>
    <?php
}

?>
