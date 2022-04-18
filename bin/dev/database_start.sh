#!/usr/bin/env bash

set -e

THIS_DIR=$(dirname "$0")
cd ${THIS_DIR}
cd ../..


MOTUZ_DOCKER_ROOT=${MOTUZ_DOCKER_ROOT:-/docker}

# In order to check that it all works well
# docker run -it --entrypoint='bash' --net='host' postgres:11.3
# psql postgresql://motuz_user:motuz_password@0.0.0.0:5432/motuz
# Or
# psql postgresql://postgres:docker@0.0.0.0:5432/postgres
# Or
# psql ${MOTUZ_DATABASE_PROTOCOL}://${MOTUZ_DATABASE_USER}:${MOTUZ_DATABASE_PASSWORD}@${MOTUZ_DATABASE_HOST}/${MOTUZ_DATABASE_NAME}

docker run --rm \
    --name local_motuz_database \
    -e POSTGRES_PASSWORD=docker \
    -p 5432:5432 \
    -v ${MOTUZ_DOCKER_ROOT}/volumes/postgres:/var/lib/postgresql/data \
    postgres:11.3
