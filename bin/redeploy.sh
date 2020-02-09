#!/usr/bin/env bash

set -e
set -x

THIS_DIR=$(dirname "$0")
cd ${THIS_DIR}
cd ..


# source secrets
. /var/home/svc_cicd/secrets.sh

sudo docker-compose pull motuz_database
sudo docker-compose pull motuz_rabbitmq
sudo docker-compose build motuz_nginx motuz_app motuz_celery
sudo docker-compose restart
