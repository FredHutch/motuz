#!/usr/bin/env bash

set -e

THIS_DIR=$(dirname "$0")
cd ${THIS_DIR}
cd ../..

sudo docker build -t 'motuz_nginx:latest' -f 'docker/nginx/Dockerfile' .
sudo docker-compose run nginx
