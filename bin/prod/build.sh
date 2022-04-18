#!/usr/bin/env bash

set -e

THIS_DIR=$(dirname "$0")
cd ${THIS_DIR}
cd ../..

# Pick up latest changes. Add `--no-cache` if this turns out to be unreliable
docker-compose -f docker-compose.yml -f docker-compose.override.yml -f deployment/docker-compose/docker-compose.build.yml build $@
