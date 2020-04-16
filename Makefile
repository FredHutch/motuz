.PHONY: quickstart
quickstart:
	./bin/quickstart.sh

.PHONY: build
build:
	./bin/prod/build.sh

.PHONY: start
start:
	./bin/prod/start.sh

