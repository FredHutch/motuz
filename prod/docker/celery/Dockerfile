# Build as
# docker build -t fredhutch/motuz_celery:latest -f docker/celery/Dockerfile .

FROM motuz_app:latest

COPY ./docker/celery/celery-entrypoint.sh /app/src/backend/

WORKDIR /app/src/backend
CMD ./celery-entrypoint.sh
