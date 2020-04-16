# Build as
# docker build --no-cache=true -t fredhutch/motuz_database_init:latest -f deployment/docker/database_init/Dockerfile .
# docker run -it --rm -v /docker/volumes/postgres:/var/lib/postgresql/data fredhutch/motuz_database_init:latest

FROM postgres:11.3-alpine

COPY \
    ./deployment/docker/database_init/database_init-entrypoint.sh \
    ./deployment/docker/database_init/pg_hba.conf \
    ./deployment/docker/wait-for-it.sh \
    ./deployment/docker/load-secrets.sh \
    /app/

WORKDIR /app
CMD /app/database_init-entrypoint.sh
