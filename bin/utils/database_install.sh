#!/usr/bin/env bash

set -e

THIS_DIR=$(dirname "$0")
cd ${THIS_DIR}
cd ../..

docker-compose build --no-cache motuz_database_init
docker-compose up motuz_database_init
