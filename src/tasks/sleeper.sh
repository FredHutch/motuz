#!/usr/bin/env bash

set -e

THIS_DIR=$(dirname "$0")
cd ${THIS_DIR}


echo "0%"
sleep 3
echo "30%"
sleep 1
echo "40%"
sleep 2
echo "60%"
sleep 3
echo "90%"
sleep 1
echo "100%"

exit $RANDOM
