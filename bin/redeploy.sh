#!/usr/bin/env bash

set -e
set -x

THIS_DIR=$(dirname "$0")
cd ${THIS_DIR}
cd ..


# source secrets
. /var/home/svc_cicd/secrets.sh

sudo docker-compose down
yes | sudo docker system prune -a
sudo docker image ls -a # should show nothing
sudo docker-compose up -d
