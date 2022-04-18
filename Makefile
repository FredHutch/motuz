.PHONY: quickstart
quickstart:
	./bin/quickstart.sh

.PHONY: build
build:
	./bin/prod/build.sh --no-cache

.PHONY: start
start:
	./bin/prod/start.sh

