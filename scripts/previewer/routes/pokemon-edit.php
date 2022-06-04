<?php

pvw_layout_start();
$pokemonId = pvw_param('pid');
$pokemonEntries = sgg_data_load('builds/pokemon/pokemon-entries-map.json');
$pkm = sgg_data_load('sources/pokemon/entries/' . $pokemonId . '.json');

$jsonSchema = sgg_data_load('schemas/pokemon-entry.schema.json');
$pokemonIds = array_keys($pokemonEntries);
$jsonSchema['$defs']['pkmId'] = [
    'type' => 'string',
    'enum' => $pokemonIds,
];
$jsonSchema['properties']['baseSpecies'] = [
    'oneOf' => [
        [
            'type' => 'string',
            'enum' => $pokemonIds,
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
pvw_component_load('pokemon-card');

if (isset($_POST['pkm_data']) && !empty($_POST['pkm_data'])) {
    $postData = json_decode(base64_decode($_POST['pkm_data']), true, 512, JSON_THROW_ON_ERROR);
    sgg_data_save('sources/pokemon/entries/' . $pokemonId . '.json', $postData);
    ?>
    <script>
        window.location.href = '<?= pvw_route_url('pokemon-edit', ['pid' => $pokemonId]) ?>'
    </script>
    <?php
    pvw_layout_end();
    exit;
}
?>

<script>
    const saveForm = (e) => {
        /** @type  {HTMLFormElement}  */
        const form = document.getElementById('json_editor_form')

        form.pkm_data.value = btoa(JSON.stringify(currentJsonEditor.get(), null, 2))
    }
</script>

<form id="json_editor_form" method="post" onsubmit="saveForm()" class="json-editor-container">
    <a class="btn btn-outline-primary" href="/pokemon">Pokemon List</a>
    <div class="pokemon-list" style="margin:1rem auto">
        <ul style="margin:0 auto; display: block">
            <li style="height: auto">
                <?php
                pvw_pokemon_card($pkm); ?>
                <button class="btn btn-primary" type="submit">Save</button>
            </li>
        </ul>
    </div>
    <input type="hidden" id="pid" name="pid" value="<?= $pokemonId ?>">
    <input type="hidden" id="pkm_data" name="pkm_data" value="<?= base64_encode($pokemonId) ?>">

    <div id="json_editor_container">

    </div>

    <script>
        // create the editor
        const container = document.getElementById("json_editor_container")
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
</form>
<?php
pvw_layout_end(); ?>
