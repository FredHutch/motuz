#!/bin/bash

# sets up a motuz dev environment on an Ubuntu 18.04 machine
# this could be a local VM, container, or ec2 instance.

# currently using ami:
# ami-0a588942e90cfecc9
# in us-west-2

# run me as root

export TERM=xterm-color

# much of this is from
# https://github.com/docker-library/python/blob/master/3.9/slim-bookworm/Dockerfile

apt-get update -y

echo TODO add /usr/local/bin to PATH (at beginning)

echo TODO set LANG to en_US.UTF-8

apt-get install -y --no-install-recommends \
    ca-certificates \
    netbase \
    tzdata \
    postgresql-client \
    git \
    curl


apt-get install -y --no-install-recommends \
    dpkg-dev \
    gcc \
    gnupg \
    libbluetooth-dev \
    libbz2-dev \
    libc6-dev \
    libdb-dev \
    libffi-dev \
    libgdbm-dev \
    liblzma-dev \
    libncursesw5-dev \
    libreadline-dev \
    libsqlite3-dev \
    libssl-dev \
    make \
    tk-dev \
    uuid-dev \
    wget \
    xz-utils \
    zlib1g-dev

export PYTHON_VERSION=3.7.3

wget -O python.tar.xz "https://www.python.org/ftp/python/${PYTHON_VERSION%%[a-z]*}/Python-$PYTHON_VERSION.tar.xz";

mkdir -p /usr/src/python

tar --extract --directory /usr/src/python --strip-components=1 --file python.tar.xz

rm python.tar.xz

cd /usr/src/python

gnuArch="$(dpkg-architecture --query DEB_BUILD_GNU_TYPE)"

./configure \
    --build="$gnuArch" \
    --enable-loadable-sqlite-extensions \
    --enable-optimizations \
    --enable-option-checking=fatal \
    --enable-shared \
    --with-ensurepip

nproc="$(nproc)"

EXTRA_CFLAGS="$(dpkg-buildflags --get CFLAGS)"
LDFLAGS="$(dpkg-buildflags --get LDFLAGS)"
LDFLAGS="${LDFLAGS:--Wl},--strip-all"
make -j "$nproc" \
    "EXTRA_CFLAGS=${EXTRA_CFLAGS:-}" \
    "LDFLAGS=${LDFLAGS:-}"


rm python

make -j "$nproc" \
    "EXTRA_CFLAGS=${EXTRA_CFLAGS:-}" \
    "LDFLAGS=${LDFLAGS:--Wl},-rpath='\$\$ORIGIN/../lib'" python

make install

cd /

rm -rf /usr/src/python


find /usr/local -depth \
    \( \
        \( -type d -a \( -name test -o -name tests -o -name idle_test \) \) \
        -o \( -type f -a \( -name '*.pyc' -o -name '*.pyo' -o -name 'libpython*.a' \) \) \
    \) -exec rm -rf '{}' + \
; 

ldconfig

pip3 install \
    --disable-pip-version-check \
    --no-cache-dir \
    --no-compile \
    'setuptools==58.1.0' \
    wheel 


for src in idle3 pip3 pydoc3 python3 python3-config; do \
    dst="$(echo "$src" | tr -d 3)"; \
    [ -s "/usr/local/bin/$src" ]; \
    [ ! -e "/usr/local/bin/$dst" ]; \
    ln -svT "$src" "/usr/local/bin/$dst"; \
done

# install docker - https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-18-04

apt install -y apt-transport-https ca-certificates curl software-properties-common

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -

add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"

apt update -y

apt-cache policy docker-ce

apt install -y docker-ce


usermod -aG docker ubuntu # or whatever non root user....

# https://docs.docker.com/compose/install/linux/
#apt-get install -y docker-compose-plugin # this is installed by the above steps


# dirs

mkdir -p /efs/
mkdir -p /fh/economy
mkdir -p /fh/fast
mkdir -p /fh/scratch/
mkdir -p /fh/secure
mkdir -p /fh/silver
mkdir -p /shared
mkdir -p /hpc/temp
mkdir -p /fh/working




# set a password for ubuntu (or whatever non-root user)

echo "ubuntu:ubuntu" | chpasswd

# apt install -y nodejs npm
# apt-get purge -y nodejs npm

curl -sL https://deb.nodesource.com/setup_10.x | bash -

apt install -y nodejs


curl -L https://www.npmjs.com/install.sh | bash

npm install -g npm@6


# already done
# curl -L https://github.com/docker/compose/releases/download/v2.32.4/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
# chmod +x /usr/local/bin/docker-compose

apt install -y unzip

curl -LO https://github.com/rclone/rclone/releases/download/v1.64.0/rclone-v1.64.0-linux-amd64.zip

unzip rclone-v1.64.0-linux-amd64.zip

cp rclone-v1.64.0-linux-amd64/rclone /usr/local/bin/rclone-v1.64.0

ln -s /usr/local/bin/rclone-v1.64.0 /usr/local/bin/rclone

rm -rf rclone-v1.64.0-linux-amd64 rclone-v1.64.0-linux-amd64.zip



curl -LO https://github.com/rclone/rclone/releases/download/v1.47.0/rclone-v1.47.0-linux-amd64.zip

unzip rclone-v1.47.0-linux-amd64.zip

cp rclone-v1.47.0-linux-amd64/rclone /usr/local/bin/rclone-v1.47.0

rm -rf rclone-v1.47.0-linux-amd64 rclone-v1.47.0-linux-amd64.zip


curl -LO https://github.com/rclone/rclone/releases/download/v1.69.0/rclone-v1.69.0-linux-amd64.zip

unzip rclone-v1.69.0-linux-amd64.zip

cp rclone-v1.69.0-linux-amd64/rclone /usr/local/bin/rclone-v1.69.0

rm -rf rclone-v1.69.0-linux-amd64 rclone-v1.69.0-linux-amd64.zip




# rm /usr/local/bin/rclone

# ln -s /usr/local/bin/rclone-v1.47.0 /usr/local/bin/rclone


# do this later....
source sourceme


# on my UTM VM **only** I needed to do this in order to be able to pull docker images:


# first run `ifconfig` and verify the device name (enp0s1 in my case)
ip link set dev enp0s1 mtu 1400
# the answer came from here: https://stackoverflow.com/a/72407420
# Need to make this change permanent:
# https://chatgpt.com/share/67a164e8-97c4-800b-925a-e865be44f64e
# basically adding `mtu: 1400` under `dhcp4` in /etc/netplan/00-installer-config.yaml
# then running `sudo netplan apply`





# control-alt-z to run selected/current line in vs code terminal
# that's a custom key binding
