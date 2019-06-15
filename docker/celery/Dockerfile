# Build as docker build -t motuz_celery:latest -f Dockerfile ../..

FROM python:3.7.3-slim

ENV PYTHONUNBUFFERED 1
ENV DOCKER_CONTAINER 1

COPY ./requirements.txt /code/requirements.txt
RUN pip install -r /code/requirements.txt

COPY . /code/
WORKDIR /code/src/backend
