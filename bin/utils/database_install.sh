#!/usr/bin/env bash

set -e

THIS_DIR=$(dirname "$0")
cd ${THIS_DIR}
cd ../..

docker build --no-cache=true -t motuz_database_init:latest -f docker/database_init/Dockerfile .
docker run -it --net='host' -v /docker/volumes/postgres:/var/lib/postgresql/data motuz_database_init:latest
