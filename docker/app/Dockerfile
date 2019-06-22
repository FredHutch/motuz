# Build as
# docker build -t motuz_app:latest -f Dockerfile ../..

FROM python:3.7.3

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update -y
RUN apt-get -y upgrade

RUN apt-get install -y gcc
RUN apt-get install -y --ignore-missing --fix-missing krb5-user libpam-krb5 vim curl wget

RUN pip install uwsgi

ENV PYTHONUNBUFFERED 1
ENV DOCKER_CONTAINER 1

COPY ./requirements.txt /code/requirements.txt
RUN pip install -r /code/requirements.txt

COPY ./src /app/src
WORKDIR /app/src/backend

ENV FLASK_ENV development
ENV MOTUZ_HOST 0.0.0.0

RUN python3 manage.py db upgrade

CMD uwsgi --ini wsgi.ini
