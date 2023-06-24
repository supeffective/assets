default: noop

# TODO: stop using absolute app dir paths (use "PWD/../../" )

sprite-indices:
	mkdir -p .build
	pnpm cli create-sprite-indices ../../assets/data/pokemon.json .build/pokemon-index.json regular,shiny
	pnpm cli create-sprite-indices ../../assets/data/items.json .build/items-index.json
	pnpm cli create-sprite-indices ../../assets/data/ribbons.json .build/ribbons-index.json
	pnpm cli create-sprite-indices ../../assets/data/marks.json .build/marks-index.json

types:
	pnpm cli generate-ts-constants ../../assets/data ../datalayer/generated

fonts:
	./scripts/make-fonts.sh

spritesheets:
	make sprite-indices
	./scripts/make-spritesheets.sh

noop:
	echo ""
