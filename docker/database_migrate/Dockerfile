# Build as
# docker build --no-cache=true -t motuz_app:latest -f docker/app/Dockerfile .
# docker build --no-cache=true -t motuz_database_migrate:latest -f docker/database_migrate/Dockerfile .
# docker run -it --net='host' motuz_database_migrate:latest

FROM motuz_app:latest
CMD python3 manage.py db upgrade
