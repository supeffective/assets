<?php

if (!isset($pkmIds, $currentPid, $gameSets)) {
    throw new Exception(
        'pkmIds, currentPid, gameSets vars: some or all are not set'
    );
}

$pokemonId = $currentPid;
$pkm = sgg_data_load('sources/pokemon/entries/' . $pokemonId . '.json');

$jsonSchema = sgg_data_load('schemas/pokemon-entry.schema.json');
$jsonSchema['$defs']['pkmId'] = [
    'type' => 'string',
    'enum' => $pkmIds,
];
$jsonSchema['properties']['baseSpecies'] = [
    'oneOf' => [
        [
            'type' => 'string',
            'enum' => $pkmIds,
        ],
        [
            'type' => 'null',
        ],
    ],
];
$jsonSchema['properties']['evolutions'] =
$jsonSchema['properties']['forms'] =
$jsonSchema['properties']['baseForms'] = [
    'type' => 'array',
    'items' => [
        '$ref' => '#/$defs/pkmId',
    ],
];
$jsonSchemaStr = json_encode($jsonSchema);
$pkmStr = json_encode($pkm);
$cardCallback = function () {
    echo ' <div><button class="btn btn-sm btn-primary" type="submit">Save</button></div>';
};

if (isset($_POST['pkm_data']) && !empty($_POST['pkm_data'])) {
    $postData = json_decode(base64_decode($_POST['pkm_data']), true, 512, JSON_THROW_ON_ERROR);
    sgg_data_save('sources/pokemon/entries/' . $pokemonId . '.json', $postData);
    ?>
    <script>
        window.location.href = '<?= tpl_build_url('pokemon-edit', ['pid' => $pokemonId]) ?>'
    </script>
    <?php
    return;
}
?>

<script>
    const saveForm = (e) => {
        /** @type  {HTMLFormElement}  */
        const form = document.getElementById('json_editor_form')

        form.pkm_data.value = btoa(JSON.stringify(currentJsonEditor.get(), null, 2))
    }
</script>

<form id="json_editor_form" method="post" onsubmit="saveForm()" class="json-editor-form">
    <h4 style="text-align: center">
        Editing: <?= $pokemonId ?>
    </h4>
    <br />
    <input type="hidden" id="pid" name="pid" value="<?= $pokemonId ?>">
    <input type="hidden" id="pkm_data" name="pkm_data" value="<?= base64_encode($pokemonId) ?>">
    <div class="json-editor-wrapper">
        <div class="pokemon-list json-editor-pkm">
            <ul style="margin:0 auto; display: block">
                <li style="height: auto">
                    <?php
                    tpl_partial('pokemon-card', [
                        'pkm' => $pkm,
                        'cardCallback' => $cardCallback,
                        'gameSets' => $gameSets,
                    ]); ?>
                </li>
            </ul>
        </div>
        <div id="json_editor_instance" class="json-editor"></div>
    </div>
</form>

<script>
    // create the editor
    const container = document.getElementById("json_editor_instance")
    const options = {
        schema: <?= $jsonSchemaStr ?>,
    }
    const currentJsonEditor = new JSONEditor(container, options)

    // set json
    const initialJson = <?= $pkmStr ?>;

    currentJsonEditor.set(initialJson)

    // get json
    const updatedJson = currentJsonEditor.get()
</script>
