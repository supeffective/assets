# supereffective-assets

[![Check Code Quality](https://github.com/itsjavi/supereffective-assets/actions/workflows/check-code-quality.yml/badge.svg)](https://github.com/itsjavi/supereffective-assets/actions/workflows/check-code-quality.yml)

Pokémon datasets used in the SuperEffective.gg website.

This project is based on the [Turbo React Next.js Starter](https://github.com/itsjavi/turborepo-react-next).

## Quick Start

You will need Node 18+, pnpm 8.5+ and Docker in order to run this project locally.

```bash
# Clone the project
git clone https://github.com/itsjavi/supereffective-assets
cd supereffective-assets

# Install local dependencies
make install

# Start the dev enviroment
make dev

# Navigate to the admin panel
make open
```

## Maintenance Workflows

### Manually editing the JSON data

All data from `./data/json` can be edited manually, but it much better to use the admin panel instead,
which has some triggers behind to update all necessary data files.

When you edit the JSONs manually, you might do mistakes or run into other issues.

#### Adding a new Pokémon or form manually

There are special cases where you need to introduce data manually, for example,
when brand new Pokémon species or forms are announced and there isn't info about them yet in the Showdown project.

- Add the entry or entries manually in `data/pokemon.json`
- Open the Admin UI and adjust all other necessary data (pokemon stats, game availability, dexes, boxes, etc.)

## Data Sources

This project has reused these other existing projects to generate the initial set of data:

- Showdown modular project https://github.com/pkmn/ps
- Veekun DB data (which is not longer maintained)

Data that is not covered in the previous sources, comes from the following sources:

- Pokémon HOME Pokédex (specially, for the sorting order of the forms)
- Bulbapedia
- Serebii.net
- Data miners' pastebin files (special thanks to PKHex developers, Kaphotics, Anubis and Matt)
- Naming conventions of the Pokémon community (like BDSP, SwSh etc.)
- Manually crafted by the developers of SuperEffective.gg

## Media Sources

- Most audios come from sounds-resource.com
- Mini menu sprites (pixel-art): pokesprite project and the Delta Pokedex project
- Some sprites from the PokeAPI repository
- Renders (2D and 3D) come from the actual games' assets
