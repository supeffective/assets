default: noop

# TODO: stop using absolute app dir paths (use "PWD/../../" )

sprite-indices:
	mkdir -p .build
	pnpm cli create-sprite-indices ../../assets/data/pokemon.json .build
	pnpm cli create-sprite-indices ../../assets/data/items.json .build
	pnpm cli create-sprite-indices ../../assets/data/ribbons.json .build
	pnpm cli create-sprite-indices ../../assets/data/marks.json .build

data-types:
	pnpm cli generate-ts-constants ../../assets/data ../datalayer/generated

glyphs:
	./scripts/make-fonts.sh

spritesheets:
	make sprite-indices
	./scripts/make-spritesheets.sh

noop:
	echo ""
