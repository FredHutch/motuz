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
    if ! [ -d "/docker" ]; then
        _confirm "Create directory /docker ?"
        set -x
        sudo install -d -o $USER -m 755 /docker
        set +x
    else
        _color_yellow "/docker exists. Skipping..."
    fi

    mkdir -p /docker/volumes
    mkdir -p /docker/secrets
    mkdir -p /docker/certs
}

generate_certificates() {
    if [ ! -f "/docker/certs/cert.crt" ] || [ ! -f "/docker/certs/cert.key" ]; then
        if [ -f "/docker/certs/cert.crt" ] || [ -f "/docker/certs/cert.key" ]; then
            _color_red "Only one of '/docker/certs/cert.crt', '/docker/certs/cert.key' found. Need both or none"
            exit 1
        fi
        _confirm "Generate self-signed certificates inside /docker/certs ?"
        openssl req -x509 -newkey rsa:4096 -keyout /docker/certs/cert.key -out /docker/certs/cert.crt -days 365 -subj '/CN=localhost'
    else
        _color_yellow "/docker/certs exist. Skipping"
    fi
}

generate_secrets() {
    secrets="/docker/secrets/MOTUZ_DATABASE_PASSWORD /docker/secrets/MOTUZ_FLASK_SECRET_KEY /docker/secrets/MOTUZ_SMTP_PASSWORD"
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
