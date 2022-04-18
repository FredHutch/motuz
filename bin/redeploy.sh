#!/usr/bin/env bash

set -e
set -x

THIS_DIR=$(dirname "$0")
cd ${THIS_DIR}
cd ..


./bin/prod/build.sh
./start.sh
