# supereffective-dataset

Pokémon datasets used in the SuperEffective.gg website.

```
npm i itsjavi/supereffective-dataset
```

## How to contribute

You are welcome to contribute to this project by submitting a Pull Request to fix any mistakes
detected in the JSON files or the PHP scripts that are used to maintain and validate them.

All the `.min.json` and `.build.json` files are auto-generated and are not meant to be modified manually.

Once you are done with your changes, run `make` in the project directory.
You will need Linux or MacOS for the scripts to work, with PHP 8.1 or greater.

Optionally, you can also run it via `docker-compose` if you have Docker installed.


### How to preview changes

This repository contains very simple front-end web pages to visually preview the changes done in the build files
(`/data/builds`), specially the Pokémon data.

You will need docker to run it (or start a `php` server yourself). To start it with Docker, run:

```bash
make preview
```

If you are on a UNIX OS, a URL will automatically open in your browser. There you will see all the available
data arranged in an understandable way, with images for the Pokémon as well.


## Data Sources

This project has reused these other existing projects to generate the initial set of data:

- Pokémon Showdown data
- Veekun DB data

Data that is not covered in the previous sources, comes from the following sources:

- HOME app (official sorting of species + forms, storable Pokémon)
- Bulbapedia
- Serebii.net
- Google
- The developers of SuperEffective.gg
- Naming conventions of the Pokémon community (like BDSP, SwSh, etc.)

> Currently, some of the data for Pokémon entries, abilities, moves and items is incomplete or erroneous like
> for example: the types and stats of the Pokémon. This is a known issue and will be fixed in the future
> piece by piece as soon as the supereffective.gg site needs that info.


## How to add a new Pokémon or form

- Add the entry in `data/sources/pokemon.json`
- Add individual `.json` file entry under the `data/sources/pokemon/entries` directory.
- Add the missing entries in the boxes for the proper games under `data/sources/box-presets/*`.
- Run `make` and make sure there is no error.
