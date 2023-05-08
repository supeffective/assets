default: build

install:
	docker-compose run --rm --workdir=/usr/src/app previewer composer install

build:
	rm -rf data/builds
	php scripts/build.php
	php scripts/build-with-presets.php
	cp -rf data/builds/box-presets/* data/sources/box-presets/
	make validate


pogo-upgrade:
	docker-compose run --rm dumper-pogo make
	php scripts/build-pogo.php

showdown-upgrade: showdown
showdown:
	docker-compose run --rm dumper-showdown make
	php scripts/build-showdown.php

upgrade: pogo-upgrade showdown-upgrade

validate:
	php scripts/validate.php

migrate:
	php scripts/migrate.php

preview:
	docker-compose up -d previewer
	open http://localhost:8080/

.PHONY: build import-sources validate migrate
