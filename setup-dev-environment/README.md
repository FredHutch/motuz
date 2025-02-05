

change .env to look like this:

```
#!/usr/bin/env bash

# Default values used by docker-compose.yml
# https://docs.docker.com/compose/environment-variables/
# Run `docker-compose config` to see substitutions

MOTUZ_DATABASE_PROTOCOL=postgresql
MOTUZ_DATABASE_NAME=motuz
MOTUZ_DATABASE_HOST=0.0.0.0:5432
MOTUZ_DATABASE_USER=motuz_user
MOTUZ_DATABASE_REQUIRE_SSL=false

MOTUZ_SMTP_SERVER=0.0.0.0:465
MOTUZ_SMTP_REQUIRE_SSL=true
MOTUZ_SMTP_USER=

MOTUZ_DOCKER_ROOT=/docker

# comma-delimited:
MOTUZ_ALERT_ADDRESS=admin@motuz-admin.com
```


```
./bin/dev/database_start.sh

source venv/bin/activate
source sourceme

python manage.py db upgrade
python manage.py db migrate 


# backend:
MOTUZ_HOST='0.0.0.0' ./bin/dev/backend_start.sh

```

See `install.sh` and `install2.sh` in this directory.
`install.sh` should be run as root on an Ubuntu 18.04 instance or VM, and
`install2.sh` should be run as `ubuntu` or another non-root user
that you plan to use for development.

