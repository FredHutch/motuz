#!/usr/bin/env bash

set -e

THIS_DIR=$(dirname "$0")
cd ${THIS_DIR}
cd ../..

python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
