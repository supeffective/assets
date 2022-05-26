default: build

build:
	php scripts/build.php
	make validate

validate:
	php scripts/validate.php

migrate:
	php scripts/migrate.php
	make build
