# Build as
# docker build -t fredhutch/motuz_celery:latest -f deployment/docker/celery/Dockerfile .

FROM fredhutch/motuz_app:latest

COPY ./deployment/docker/celery/celery-entrypoint.sh /app/src/backend/

WORKDIR /app/src/backend
CMD ./celery-entrypoint.sh
