#!/usr/bin/env bash

set -e

THIS_DIR=$(dirname "$0")
cd ${THIS_DIR}
cd ../..

docker-compose -f docker-compose.yml -f docker-compose.override.yml -f deployment/docker-compose/docker-compose.build.yml build --no-cache database_init
docker-compose -f docker-compose.yml -f docker-compose.override.yml -f deployment/docker-compose/docker-compose.init.yml run database_init
