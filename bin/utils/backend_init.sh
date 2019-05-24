#!/usr/bin/env bash

set -e

THIS_DIR=$(dirname "$0")
cd ${THIS_DIR}
cd ..

set +x

source venv/bin/activate

cd src/backend

FLASK_ENV=development python manage.py db init
FLASK_ENV=development python manage.py db migrate
FLASK_ENV=development python manage.py db upgrade
