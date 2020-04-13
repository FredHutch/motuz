#!/usr/bin/env bash

set -e


readonly REQUIRED_ENV_VARS=(
  "MOTUZ_DATABASE_PROTOCOL"
  "MOTUZ_DATABASE_USER"
  "MOTUZ_DATABASE_PASSWORD"
  "MOTUZ_DATABASE_HOST"
  "MOTUZ_DATABASE_NAME"
)


# Checks if all of the required environment
# variables are set. If one of them isn't,
# echoes a text explaining which one isn't
# and the name of the ones that need to be
check_env_vars_set() {
  for required_env_var in ${REQUIRED_ENV_VARS[@]}; do
    if [[ -z "${!required_env_var}" ]]; then
      echo "Error:
    Environment variable '$required_env_var' not set.
    Make sure you have the following environment variables set:
      ${REQUIRED_ENV_VARS[@]}
Aborting."
      exit 1
    fi
  done
}


# Performs the initialization in the already-started PostgreSQL
# using the preconfigured postgres user.
init_user_and_db() {
  set +e
  psql -v ON_ERROR_STOP=1 --username "postgres" <<-EOSQL
    CREATE USER $MOTUZ_DATABASE_USER WITH PASSWORD '$MOTUZ_DATABASE_PASSWORD';
    CREATE DATABASE $MOTUZ_DATABASE_NAME;
    GRANT ALL PRIVILEGES ON DATABASE $MOTUZ_DATABASE_NAME TO $MOTUZ_DATABASE_USER;
EOSQL
  rc="$?"
  set -e

  if [ "$rc" != "0" ]; then
    # The database may already be initialized
    psql -v ON_ERROR_STOP=1 "${MOTUZ_DATABASE_PROTOCOL}://${MOTUZ_DATABASE_USER}:${MOTUZ_DATABASE_PASSWORD}@${MOTUZ_DATABASE_HOST}/${MOTUZ_DATABASE_NAME}" <<-EOSQL
    SELECT 1 as "DATABASE ALREADY INITIALIZED" WHERE 1 = 0
EOSQL
  fi
}

source ./load-secrets.sh

check_env_vars_set

if [ "$MOTUZ_DATABASE_HOST" != "0.0.0.0:5432" ]; then
  echo "Custom database set. Can only initialize 0.0.0.0:5432. Found $MOTUZ_DATABASE_HOST"
  echo "Skipping initialization..."
  exit 0
fi

# Entrypoint in the official docker image for postgres
docker-entrypoint.sh postgres &

# Wait for the database to be ready
./wait-for-it.sh "${MOTUZ_DATABASE_HOST:-0.0.0.0:5432}" -t 0

init_user_and_db

# Shut the door behind us, do not allow further alterations or reads to the database
# except from motuz_user for motuz_database
cp pg_hba.conf /var/lib/postgresql/data

echo -e "\n\nSUCCESS!"