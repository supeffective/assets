default: build

build:
	# rm -rf data/builds
	php scripts/build.php
	make validate

validate:
	php scripts/validate.php

migrate:
	php scripts/migrate.php
	make build
