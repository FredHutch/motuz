#!/usr/bin/env bash

set -e

THIS_DIR=$(dirname "$0")
cd ${THIS_DIR}
cd ../..

composeFileArgs="-f docker-compose.yml -f docker-compose.override.yml"

docker-compose $composeFileArgs -f deployment/docker-compose/docker-compose.build.yml build --no-cache database_init
docker-compose composeFileArgs -f deployment/docker-compose/docker-compose.init.yml up database_init
