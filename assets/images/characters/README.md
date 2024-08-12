## How to update

- Remove the `masters-icons` folder
- Download the "Master Characters" folder from [Lewtwo's Pokémon Asset Archive](https://drive.google.com/drive/folders/11fElcd8kITai4nEGcJCgJIViGiI20X0M)
- There are more than 4000 images (backgrounds, dream team, emotes, frames, lodge, mindscapes, scouts, icons, etc), you have to run a Finder search to find the icons and put them in a separate folder.
- Create a new folder called `masters-icons` and place the PNGs from the "Master Characters" folder,
ending with " Icon.png" or " Icon Masters.png", except those that have "Unused", "beta" or "HM Icon" in their name.
- Run `bun run scripts/update-trainer-sprites.cjs` to rename them (using slugized names) and generate the JSON data file.
- Optimize the images with ImageOptim, and then commit the changes.



## Credits

These files are come from Lewtwo's Pokémon Asset Archive

https://drive.google.com/drive/folders/16bSaqcst0tOMsz4rGBzPK_iZvgx4DZJX

All credits go to Lewtwo and collaborators for extracting them from the Masters EX game.
