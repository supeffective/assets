default: noop

sprite-indices:
	mkdir -p .build
	pnpm cli create-sprite-indices ../../assets/data/pokemon.json .build
	pnpm cli create-sprite-indices ../../assets/data/items.json .build
	pnpm cli create-sprite-indices ../../assets/data/ribbons.json .build
	pnpm cli create-sprite-indices ../../assets/data/marks.json .build

data-types:
	pnpm cli generate-ts-constants ../../assets/data ../datalayer/generated

glyphs:
	./scripts/make-fonts.sh ../../

spritesheets:
	./scripts/make-spritesheets.sh ../../

noop:
	echo ""

.PHONY: build data packages images
$(V).SILENT:
.SILENT: