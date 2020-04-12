# Build as
# docker build -t fredhutch/motuz_celery:latest -f prod/docker/celery/Dockerfile .

FROM motuz_app:latest

COPY ./prod/docker/celery/celery-entrypoint.sh /app/src/backend/

WORKDIR /app/src/backend
CMD ./celery-entrypoint.sh
