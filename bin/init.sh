#!/usr/bin/env bash

set -e

THIS_DIR=$(dirname "$0")
cd ${THIS_DIR}
cd ..


echo "Installing backend dependencies"
./bin/utils/backend_install.sh
echo "DONE - Installing backend dependencies"

echo "Initializing backend..."
./bin/utils/backend_init.sh
echo "DONE - Initializing backend"

echo "Installing frontend dependencies..."
./bin/utils/frontend_install.sh
echo "DONE - Installing frontend dependencies"

echo "Setting up the database..."
./bin/utils/database_install.sh
echo "DONE - Setting up the database"
