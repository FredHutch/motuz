# Build as
# docker build -t motuz_database:latest -f docker/database/Dockerfile .


FROM postgres:11.3

COPY ./docker/database/init /docker-entrypoint-initdb.d/
