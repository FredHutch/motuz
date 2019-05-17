#!/usr/bin/env bash

set -e

THIS_DIR=$(dirname "$0")
cd ${THIS_DIR}
cd ..

source venv/bin/activate

FLASK_ENV=development python manage.py run
