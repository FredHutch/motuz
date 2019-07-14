#!/usr/bin/env bash

set -e

THIS_DIR=$(dirname "$0")
cd ${THIS_DIR}
cd ..

# Initialize Database
docker build --no-cache=true -t motuz_database_init:latest -f docker/database_init/Dockerfile .
docker run -it --net='host' -v /docker/volumes/postgres:/var/lib/postgresql/data motuz_database_init:latest

# Start the application
docker-compose up -d

echo "
Application is building, initializing and starting...
This can take up to 5 minutes
Use \`docker ps -a\` to check the status
You should see the following services running:
    - motuz_app
    - motuz_nginx
    - motuz_celery
    - motuz_database
    - motuz_rabbitmq
"