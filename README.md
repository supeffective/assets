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

All data from `./data/json` can be edited manually, but it is recommended to use the admin panel instead.

#### Adding a new Pokémon or form manually

- Add the entry in `data/pokemon.json`
- Edit the National dex and other necessary ones in `data/pokedexes/*`
- Add the missing entries in the boxes under `data/legacy/box-presets/*`
- Run `make` to validate and build the data

#### Editing the availability of a Pokémon inside a game

- Edit the games in the wanted Pokémon entry from `data/pokemon.json`
- Run `make` to validate and build the data

## Data Sources

This project has reused these other existing projects to generate the initial set of data:

- Showdown modular project https://github.com/pkmn/ps
- Veekun DB data

Data that is not covered in the previous sources, comes from the following sources:

- Pokémon HOME Pokédex
- Bulbapedia
- Serebii.net
- Google
- Naming conventions of the Pokémon community (like BDSP, SwSh etc.)
- Manually crafter by the developers of SuperEffective.gg
