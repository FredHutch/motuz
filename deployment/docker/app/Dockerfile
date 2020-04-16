# Build as
# docker build -t fredhutch/motuz_app:latest -f deployment/docker/app/Dockerfile .

FROM python:3.7.3-slim as build-image

ENV DEBIAN_FRONTEND=noninteractive

RUN set -x \
    && apt-get update -y \
    && apt-get install -y --no-install-recommends --no-install-suggests \
        build-essential \
    && rm -rf /var/lib/apt/lists/*

ENV PATH=/root/.local/bin:$PATH
COPY ./requirements.txt /code/requirements.txt
RUN pip install --user -r /code/requirements.txt






FROM python:3.7.3-slim

COPY --from=build-image /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH

ENV DEBIAN_FRONTEND=noninteractive

RUN set -x \
    && apt-get update -y \
    && apt-get install -y --no-install-recommends --no-install-suggests \
        krb5-user \
        libpam-krb5 \
        sssd \
        libpam-sss \
        sudo \
        curl \
        unzip \
    && curl -LO https://downloads.rclone.org/v1.47.0/rclone-v1.47.0-linux-amd64.zip \
    && unzip rclone-v1.47.0-linux-amd64.zip \
    && cp rclone-v1.47.0-linux-amd64/rclone /usr/local/bin/ \
    && rm -rf rclone-v1.47.0-linux-amd64.zip rclone-v1.47.0-linux-amd64/ \
    && apt-get remove --purge --auto-remove -y \
        unzip \
        curl \
    && apt-get purge -y --auto-remove \
    && rm -rf /var/lib/apt/lists/*

ENV PYTHONUNBUFFERED 1
ENV DOCKER_CONTAINER 1
ENV FLASK_ENV development
ENV MOTUZ_HOST 0.0.0.0
# libpython3.7m.so.1.0 cannot be found if /etc is remapped
ENV LD_LIBRARY_PATH /usr/local/lib

RUN set -x \
    && install -d -m 755 /root/.config/rclone/ \
    && touch /root/.config/rclone/rclone.conf

COPY ./src/backend /app/src/backend
COPY \
    ./deployment/docker/app/app-entrypoint.sh \
    ./deployment/docker/wait-for-it.sh \
    ./deployment/docker/load-secrets.sh \
    /app/src/backend/

WORKDIR /app/src/backend
CMD /app/src/backend/app-entrypoint.sh
