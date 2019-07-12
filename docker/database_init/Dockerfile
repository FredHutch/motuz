# Build as
# docker build --no-cache=true -t motuz_database_init:latest -f docker/database_init/Dockerfile .
# docker run -it --net='host' -v /docker/volumes/postgres:/var/lib/postgresql/data motuz_database_init:latest

FROM postgres:11.3

WORKDIR /app
COPY ./docker/database_init/database_init.sh /app/database_init.sh

CMD /app/database_init.sh
