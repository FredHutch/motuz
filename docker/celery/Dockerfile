# Build as
# docker build -t motuz_celery:latest -f docker/celery/Dockerfile .

FROM motuz_app:latest

WORKDIR /app/src/backend
CMD celery -A api.tasks worker -l info
