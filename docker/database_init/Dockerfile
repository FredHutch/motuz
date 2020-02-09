# Build as
# docker build --no-cache=true -t motuz_database_init:latest -f docker/database_init/Dockerfile .
# docker run -it --rm -v /docker/volumes/postgres:/var/lib/postgresql/data motuz_database_init:latest

FROM postgres:11.3

COPY \
    ./docker/database_init/database_init.sh \
    ./docker/database_init/pg_hba.conf \
    ./docker/wait-for-it.sh \
    ./docker/load-secrets.sh \
    /app/

WORKDIR /app
CMD /app/database_init.sh
