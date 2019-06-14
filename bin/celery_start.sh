#!/usr/bin/env bash

set -e

THIS_DIR="$(dirname "$(readlink -f "$0")")"
cd ${THIS_DIR}
cd ..

source venv/bin/activate

cd src/backend

celery -A api.tasks worker -l info
