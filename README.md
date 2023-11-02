# supereffective-assets

Graphical and audio assets used in the SuperEffective.gg website.

Some assets are sourced for preservation and archive purposes, but most of them are used in the website.

## Data Assets

The static JSON data (mons, moves, games, etc.) is hosted in https://github.com/itsjavi/supereffective-sdk

## Media Assets

Some assets come from the actual games, others are from the community.

- Most audios come from sounds-resource
- Mini menu sprites (pixel-art): pokesprite project and the Delta Pokedex project
- Some sprites from the PokeAPI repository
- Renders (2D and 3D) come from the actual games' assets
- Game covers and some device icons come from IGN

## Assets Server

The local Assets Server is a simple NodeJS server that serves the assets from the `assets` folder.

It requires PNPM and Bun in order to run: `pnpm install && pnpm start`.
