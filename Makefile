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

#------------------ Spritesheets are DEPRECATED
# sprite-indices:
# 	pnpm pkg:utils build
# 	pnpm pkg:generator build
# 	pnpm pkg:generator make sprite-indices

# sprites: spritesheets
# spritesheets:
# 	pnpm pkg:utils build
# 	pnpm pkg:generator build
# 	pnpm pkg:generator make sprite-indices
# 	pnpm pkg:generator make spritesheets
# 	pnpm format
#------------------ //

images: convert-sprites
convert-sprites:
	./utils/convert-sprites.sh

.PHONY: build data packages images
$(V).SILENT:
.SILENT:
