#!/usr/bin/env bash

set -e

THIS_DIR=$(dirname "$0")
cd ${THIS_DIR}
cd ../..

sudo docker build -t 'motuz_celery:latest' -f 'docker/celery/Dockerfile' .
sudo docker-compose run celery
