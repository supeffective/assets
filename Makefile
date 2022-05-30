default: build

build:
	# rm -rf data/builds
	php scripts/build.php
	make validate

import-sources:
	docker-compose run --rm dumper-pogo make
#	docker-compose run --rm dumper-showdown make
#	docker-compose run --rm dumper-veekun make

validate:
	php scripts/validate.php

migrate:
	php scripts/migrate.php
	make build

.PHONY: build import-sources validate migrate
