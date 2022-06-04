<?php

pvw_layout_start();
$gameSets = sgg_get_gamesets();
$currentGameset = pvw_param('gameset');

?>
<h1>Index</h1>
<ul>
    <li>
        <a href="/pokemon">Check Pokémon</a>
    </li>
    <li>
        <a href="/presets">Check Presets</a>
    </li>
</ul>

<?php pvw_layout_end(); ?>
