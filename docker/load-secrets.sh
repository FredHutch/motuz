#!/usr/bin/env bash

set -e

SECRETS_DIRECTORY='/run/secrets'

for secret_path in $SECRETS_DIRECTORY/*; do
    secret=$(basename "$secret_path")
    eval "export $secret=\"$(cat $secret_path)\""
done
