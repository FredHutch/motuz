#!/usr/bin/env bash

set -e

THIS_DIR=$(dirname "$0")
cd ${THIS_DIR}
cd ..

# Pick up latest changes. Add `--no-cache` if this turns out to be unreliable
docker-compose build

# Shut down anything that might still be running
docker-compose down

# Initialize Database
./bin/utils/database_install.sh

# Start the application
docker-compose up --scale database_init=0 -d

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
