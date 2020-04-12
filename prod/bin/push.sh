#!/usr/bin/env bash

# Push all containers to hub.docker.com
# Call as ./push.sh 0.5.3
# Where the only argument is the tag to give to the new container


set -e

THIS_DIR=$(dirname "$0")
cd ${THIS_DIR}

cd .. # motuz/prod/
cd .. # motuz/

if [ "$1" == "" ]; then
  echo "$0: Please provide tag name (eg. 0.1.0, latest)"
  exit 1
fi

read -r -p "Want to rebuild all images (recommended)? [y/N] " response
case "$response" in
    [yY][eE][sS]|[yY])
        docker-compose build --no-cache
        ;;
    *)
        ;;
esac

tag="$1"
containers="motuz_app motuz_celery motuz_database_init motuz_nginx"

for container in $containers; do
    docker tag "${container}:latest" "fredhutch/${container}:${tag}"
done

echo "Ready to publish the following containers"
for container in $containers; do
    echo "fredhutch/${container}:${tag}"
done

echo "To publish, press ENTER. To abort, press Ctrl+C"
read

exit 0

docker login

for container in $containers; do
    docker push "fredhutch/${container}:${tag}"
done
