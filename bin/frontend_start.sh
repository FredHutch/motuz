#!/usr/bin/env bash

set -e

THIS_DIR="$(dirname "$(readlink -f "$0")")"
cd ${THIS_DIR}
cd ..

npm start
