default: build validate

install:
	echo "Installing dependencies..."
	cp -f .env.dist .env
	pnpm install

dev:
	echo "Starting Dev environment..."
	pnpm dev

open:
	open http://localhost:3151

build:
	echo "Building assets and generated data..."
	pnpm build

data: update
update:
	echo "Updating images and data from sources..."
	pnpm data:update
	node utils/update-legacy-box-presets.cjs
	pnpm prettier-fix
	pnpm data:validate

validate:
	echo "Validating generated data and assets..."
	pnpm data:validate

sprite-indices:
	pnpm pkg:utils build
	pnpm pkg:generator build
	pnpm pkg:generator make sprite-indices

constants: data-types
data-types:
	pnpm pkg:utils build
	pnpm pkg:generator build
	pnpm pkg:generator make data-types
	pnpm format

fonts: glyphs
glyphs:
	pnpm pkg:utils build
	pnpm pkg:generator build
	pnpm pkg:generator make glyphs
	pnpm format

sprites: spritesheets
spritesheets:
	pnpm pkg:utils build
	pnpm pkg:generator build
	pnpm pkg:generator make sprite-indices
	pnpm pkg:generator make spritesheets
	pnpm format

trim-pngs:
	./utils/trim-pngs.sh assets/images/pokemon/gen8-icon assets/images/pokemon/gen8-icon-trimmed
	./utils/trim-pngs.sh assets/images/pokemon/gen8-icon/regular assets/images/pokemon/gen8-icon-trimmed/regular
	./utils/trim-pngs.sh assets/images/pokemon/gen8-icon/shiny assets/images/pokemon/gen8-icon-trimmed/shiny
	# ---
	./utils/trim-pngs.sh assets/images/pokemon/home2d-icon assets/images/pokemon/home2d-icon-trimmed
	./utils/trim-pngs.sh assets/images/pokemon/home2d-icon/regular assets/images/pokemon/home2d-icon-trimmed/regular
	./utils/trim-pngs.sh assets/images/pokemon/home2d-icon/shiny assets/images/pokemon/home2d-icon-trimmed/shiny
	# ---
	./utils/trim-pngs.sh assets/images/pokemon/home3d-icon assets/images/pokemon/home3d-icon-trimmed
	./utils/trim-pngs.sh assets/images/pokemon/home3d-icon/regular assets/images/pokemon/home3d-icon-trimmed/regular
	./utils/trim-pngs.sh assets/images/pokemon/home3d-icon/shiny assets/images/pokemon/home3d-icon-trimmed/shiny

.PHONY: build data packages images
$(V).SILENT:
.SILENT:
