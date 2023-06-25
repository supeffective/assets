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

update:
	echo "Updating images and data from sources..."
	# download images zip
	# download and parse data

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
	pnpm pkg:generator make spritesheets
	pnpm format

.PHONY: build data packages images
$(V).SILENT:
.SILENT:
