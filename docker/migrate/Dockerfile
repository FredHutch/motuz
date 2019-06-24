# Build as
# docker build -t motuz_migrate:latest -f docker/migrate/Dockerfile .
# docker run -it --net='host' motuz_migrate:latest

FROM motuz_app:latest
CMD python3 manage.py db upgrade
