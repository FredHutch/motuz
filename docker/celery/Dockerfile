# Build as
# docker build -t motuz_celery:latest -f docker/celery/Dockerfile .

FROM motuz_app:latest

# libpython3.7m.so.1.0 cannot be found if /etc is remapped
ENV LD_LIBRARY_PATH /usr/local/lib

WORKDIR /app/src/backend
CMD celery -A api.tasks worker -l info
