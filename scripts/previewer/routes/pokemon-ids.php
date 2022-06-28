<?php

if (!isset($pkmIds)) {
    throw new Exception(
        'pkmIds: variables are not set'
    );
}

?>
<hr />
<h3>Pokemon IDs:</h3>
<pre>
    <?php
    echo print_r($pkmIds, true) ?>
</pre>
<hr />

