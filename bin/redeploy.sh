#!/usr/bin/env bash

set -e
set -x

THIS_DIR=$(dirname "$0")
cd ${THIS_DIR}
cd ..


# source secrets
. /var/home/svc_cicd/secrets.sh

sudo docker-compose pull database
sudo docker-compose pull rabbitmq
sudo docker-compose build nginx app celery
sudo docker-compose restart
