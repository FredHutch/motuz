#!/usr/bin/env bash

set -e

# Wait for the database to be ready
./wait-for-it.sh "${MOTUZ_DATABASE_HOST:-0.0.0.0:5432}" -t 0

source ./load-secrets.sh

CPU_COUNT=$(grep processor /proc/cpuinfo | wc -l)
CONCURRENCY=$(($CPU_COUNT*3))

celery -A api.tasks worker -l info --concurrency $CONCURRENCY

