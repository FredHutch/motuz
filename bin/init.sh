#!/usr/bin/env bash

set -e

THIS_DIR=$(dirname "$0")
cd ${THIS_DIR}
cd ..


echo "Installing backend dependencies"
./bin/backend_install.sh
echo "DONE - Installing backend dependencies"

echo "Initializing backend..."
./bin/backend_init.sh
echo "DONE - Initializing backend"

echo "Installing frontend dependencies..."
./bin/frontend_install.sh
echo "DONE - Installing frontend dependencies"
