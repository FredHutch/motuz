#!/usr/bin/env bash

set -e

if [ -z "$1" ]; then
    SECRETS_DIRECTORY="/run/secrets"
else
    SECRETS_DIRECTORY="$1"
fi

if [ -z "$(ls -A $SECRETS_DIRECTORY 2> /dev/null)" ]; then
    echo "No secrets found at $SECRETS_DIRECTORY"
    exit 0
fi


echo $SECRETS_DIRECTORY

for secret_path in "$SECRETS_DIRECTORY"/*; do
    key=$(basename "$secret_path")
    value=$(cat $secret_path)
    eval "export $key=\"$value\""
done
