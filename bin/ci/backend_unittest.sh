#!/usr/bin/env bash

set -e

THIS_DIR=$(dirname "$0")
cd ${THIS_DIR}
cd ../..


source venv/bin/activate
export FLASK_APP="$PWD/src/backend/api/application.py"
export FLASK_DEBUG=1
export FLASK_ENV=development

cd src/backend
python manage.py test
