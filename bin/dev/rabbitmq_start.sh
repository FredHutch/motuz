#!/usr/bin/env bash

set -e

THIS_DIR=$(dirname "$0")
cd ${THIS_DIR}
cd ../..

docker run --hostname 0.0.0.0 -p 5672:5672 -p 15672:15672 rabbitmq:3.7.16-management
