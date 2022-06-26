default: build

build:
	rm -rf data/builds
	php scripts/build.php
	make validate

import-sources:
	docker-compose run --rm dumper-pogo make
	docker-compose run --rm dumper-showdown make
#	docker-compose run --rm dumper-veekun make

validate:
	php scripts/validate.php

migrate:
	php scripts/migrate.php
	make build

preview:
	docker-compose up -d previewer
	docker-compose run --rm previewer make
	open http://localhost:8080/

.PHONY: build import-sources validate migrate
