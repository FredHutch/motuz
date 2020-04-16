#!/usr/bin/env bash

# - Idempotent script that sets up the environment with default values
# - Can be called as many times as required
# - Can bootstrap an empty system
#
# Example
# ./quickstart.sh

set -e

THIS_DIR=$(dirname "$0")
cd ${THIS_DIR}
cd ..


source .env
MOTUZ_DOCKER_ROOT=${MOTUZ_DOCKER_ROOT:-/docker}


RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

_color_red() {
    printf "${RED}$@${NC}\n"
}
_color_green() {
    printf "${GREEN}$@${NC}\n"
}
_color_yellow() {
    printf "${YELLOW}$@${NC}\n"
}

_confirm() {
    printf "\n${CYAN}"
    read -r -p "$@ [y/N] " response
    printf "${NC}"
    case "$response" in
        [yY][eE][sS]|[yY])
            return
            ;;
        *)
            _color_red "Aborting..."
            exit 2
            ;;
    esac
}

install_docker() {
    if ! [ -x "$(command -v docker)" ]; then
        _color_red "ERROR: docker not found. Please install docker"
    else
        _color_yellow "docker exists. Skipping..."
    fi
}

install_docker_compose() {
    if ! [ -x "$(command -v docker-compose)" ]; then
        _color_red "ERROR: docker-compose not found. Please install docker-compose"
    else
        _color_yellow "docker-compose exists. Skipping..."
    fi
}

create_folders() {
    if ! [ -d "${MOTUZ_DOCKER_ROOT}" ]; then
        _confirm "Create directory ${MOTUZ_DOCKER_ROOT} ?"
        set -x
        sudo install -d -o $USER -g $(id -gn) -m 755 ${MOTUZ_DOCKER_ROOT}
        set +x
    else
        _color_yellow "${MOTUZ_DOCKER_ROOT} exists. Skipping..."
    fi

    mkdir -p ${MOTUZ_DOCKER_ROOT}/volumes/postgres
    mkdir -p ${MOTUZ_DOCKER_ROOT}/secrets
    mkdir -p ${MOTUZ_DOCKER_ROOT}/certs
}

generate_certificates() {
    if [ ! -f "${MOTUZ_DOCKER_ROOT}/certs/cert.crt" ] || [ ! -f "${MOTUZ_DOCKER_ROOT}/certs/cert.key" ]; then
        if [ -f "${MOTUZ_DOCKER_ROOT}/certs/cert.crt" ] || [ -f "${MOTUZ_DOCKER_ROOT}/certs/cert.key" ]; then
            _color_red "Only one of '${MOTUZ_DOCKER_ROOT}/certs/cert.crt', '${MOTUZ_DOCKER_ROOT}/certs/cert.key' found. Need both or none"
            exit 1
        fi
        _confirm "Generate self-signed certificates inside ${MOTUZ_DOCKER_ROOT}/certs ?"
        openssl req -x509 -newkey rsa:4096 -keyout ${MOTUZ_DOCKER_ROOT}/certs/cert.key -out ${MOTUZ_DOCKER_ROOT}/certs/cert.crt -days 365 -subj '/CN=localhost' -nodes
    else
        _color_yellow "${MOTUZ_DOCKER_ROOT}/certs exist. Skipping"
    fi
}

generate_secrets() {
    secrets="${MOTUZ_DOCKER_ROOT}/secrets/MOTUZ_DATABASE_PASSWORD ${MOTUZ_DOCKER_ROOT}/secrets/MOTUZ_FLASK_SECRET_KEY ${MOTUZ_DOCKER_ROOT}/secrets/MOTUZ_SMTP_PASSWORD"
    for secret in $secrets; do
        if [ ! -f "$secret" ]; then
            _confirm "Generate random value for secret ${secret} ?"
            set -x
            head /dev/urandom | md5sum | awk '{print $1}' > "$secret"
            set +x
        else
            _color_yellow "$secret exists. Skipping"
        fi
    done
}

start() {
    set -x
    ./start.sh
    set +x
}


install_docker
install_docker_compose
create_folders
generate_certificates
generate_secrets
start
