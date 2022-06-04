<?php
/** @noinspection PhpUndefinedVariableInspection */

tpl_partial('gameset-selector', $tplVars);
tpl_partial('pokemon-cards-grid', array_merge($tplVars, ['cardCallback' => null]));
?>
<hr />
<b>Game Set data:</b>
<pre><?php
    echo $currentGameSetId ? json_encode(
        $gameSets[$currentGameSetId],
        JSON_THROW_ON_ERROR | JSON_PRETTY_PRINT
    ) : ''
    ?>
</pre>
<hr />

