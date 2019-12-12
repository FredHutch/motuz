#!/usr/bin/env bash

set -e

THIS_DIR=$(dirname "$0")
cd ${THIS_DIR}
cd ..

source venv/bin/activate
cd src/backend/
python manage.py db migrate

echo -e "\n\nCtrl+C to avoid migration..."
sleep 5

python manage.py db upgrade
