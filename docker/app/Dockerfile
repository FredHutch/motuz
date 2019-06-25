# Build as
# docker build -t motuz_app:latest -f Dockerfile ../..

FROM python:3.7.3

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update -y

RUN apt-get install -y build-essential man-db vim curl unzip wget krb5-user libpam-krb5 

RUN curl https://rclone.org/install.sh | bash


ENV PYTHONUNBUFFERED 1
ENV DOCKER_CONTAINER 1
ENV FLASK_ENV development
ENV MOTUZ_HOST 0.0.0.0


COPY ./requirements.txt /code/requirements.txt
RUN pip install -r /code/requirements.txt

RUN mkdir -p /root/.config/rclone/
RUN touch /root/.config/rclone/rclone.conf

COPY ./src/backend /app/src/backend
WORKDIR /app/src/backend

CMD uwsgi --ini wsgi.ini

