#!/usr/bin/env bash

set -e

THIS_DIR=$(dirname "$0")
cd ${THIS_DIR}
cd ..

docker run --rm \
    --name local_motuz_database \
    -e POSTGRES_PASSWORD=docker \
    -p 5432:5432 \
    -v /docker/volumes/postgres:/var/lib/postgresql/data \
    postgres:11.3
