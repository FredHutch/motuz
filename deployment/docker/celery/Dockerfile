# Build as
# docker build -t fredhutch/motuz_celery:latest -f deployment/docker/celery/Dockerfile .

FROM fredhutch/motuz_app:latest

RUN echo "deb http://archive.debian.org/debian stretch main contrib non-free" > /etc/apt/sources.list

ENV DEBIAN_FRONTEND=noninteractive

RUN set -x \
    && apt-get update -y \
    && apt-get install -y --no-install-recommends --no-install-suggests \
       ca-certificates curl gnupg apt-transport-https lsb-release

RUN install -m 0755 -d /etc/apt/keyrings
RUN curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
RUN chmod a+r /etc/apt/keyrings/docker.gpg

RUN echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  "$(lcurl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpgsb_release -c -s)" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null


RUN apt-get update -y

RUN apt-get install -y docker-ce docker-ce-cli containerd.io # docker-buildx-plugin docker-compose-plugin

RUN python3.7 -m pip install docker

RUN python3.7  -m pip uninstall -y urllib3
RUN python3.7 -m pip install urllib3==1.26.16





COPY ./deployment/docker/celery/celery-entrypoint.sh /app/src/backend/

WORKDIR /app/src/backend
CMD ./celery-entrypoint.sh
