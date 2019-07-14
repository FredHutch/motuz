# Build as
# docker build --no-cache=true -t motuz_database_init:latest -f docker/database_init/Dockerfile .
# docker run -it --net='host' -v /docker/volumes/postgres:/var/lib/postgresql/data motuz_database_init:latest

FROM postgres:11.3

# TODO The environment variables below should not be hardcoded
env DB_USER=motuz_user
env DB_PASSWORD=motuz_password
env DB_DATABASE=motuz
env POSTGRES_USER=postgres
env POSTGRES_PASSWORD=lk31j2lj1ss1ws

WORKDIR /app
COPY ./docker/database_init/database_init.sh /app/database_init.sh
COPY ./docker/utils/wait-for-it.sh /app/wait-for-it.sh

CMD /app/database_init.sh
