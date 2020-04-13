#!/usr/bin/env bash

set -e

THIS_DIR=$(dirname "$0")
cd ${THIS_DIR}
cd ../..


echo "Setting up the database..."
./bin/_utils/database_install.sh
echo "DONE - Setting up the database"

echo "Installing backend dependencies"
./bin/_utils/backend_install.sh
echo "DONE - Installing backend dependencies"

echo "Initializing backend..."
./bin/_utils/backend_init.sh
echo "DONE - Initializing backend"

echo "Installing frontend dependencies..."
./bin/_utils/frontend_install.sh
echo "DONE - Installing frontend dependencies"
