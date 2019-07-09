#!/usr/bin/env bash

set -e

THIS_DIR=$(dirname "$0")
cd ${THIS_DIR}
cd ../..

sudo docker-compose down
yes | sudo docker system prune -a
sudo docker image ls -a # should show nothing
sudo docker-compose up -d

echo "Waiting for docker-compose up, then running migration. Kill script here if no migrations are required"
echo "Sleeping 30 seconds"
sleep 30

# Wait for DB to start, then migrate
sudo docker build --no-cache=true -t motuz_migrate:latest -f docker/migrate/Dockerfile .
sudo docker run -it --net='host' motuz_migrate:latest
