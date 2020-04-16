<div align="center">
    <img src="src/frontend/img/logo.png" width="100" height="100">
    <h1>Motuz</h1>
    <p>
        <b>A web based infrastructure for large scale data movements between on-premise and cloud</b>
    </p>
    <br>
</div>

![Motuz transfer and checksum validation](docs/img/mov-copy-check.gif)

![Motuz settings and features](docs/img/mov-settings.gif)


<!--  The TOC below is created/maintained by
      the `Markdown TOC` extension to the
      Visual Studio Code editor.
 -->

<!-- TOC -->

1. [Quickstart](#quickstart)
2. [Beyond quickstart](#beyond-quickstart)
3. [Customizing your deployment](#customizing-your-deployment)
4. [Setting up production](#setting-up-production)
    1. [Authentication](#authentication)
        1. [Local Authentication](#local-authentication)
        2. [Authenticate against Active Directory](#authenticate-against-active-directory)
    2. [Requirements](#requirements)
    3. [Docker and docker-compose](#docker-and-docker-compose)
    4. [Shared Filesystems (optional)](#shared-filesystems-optional)
    5. [Cloning the Motuz repository](#cloning-the-motuz-repository)
    6. [Set up HTTPS certificate](#set-up-https-certificate)
    7. [Running Motuz the first time](#running-motuz-the-first-time)
    8. [Redeploying](#redeploying)
5. [Developer Installation](#developer-installation)
    1. [Initialize](#initialize)
    2. [Start](#start)
6. [Development Options](#development-options)
7. [Examples](#examples)
    1. [How to use the API](#how-to-use-the-api)
        1. [API Endpoint](#api-endpoint)
    2. [Authentication](#authentication-1)
8. [Folder structure](#folder-structure)
    1. [Overview](#overview)
    2. [Frontend folder structure (inside `/src/frontend/`)](#frontend-folder-structure-inside-srcfrontend)
    3. [Backend folder structure (inside `/src/backend/`)](#backend-folder-structure-inside-srcbackend)
    4. [Temp folders](#temp-folders)
9. [Other resources](#other-resources)

<!-- /TOC -->


## Quickstart

- Install [`docker` and `docker-compose`](https://docs.docker.com/install/linux/docker-ce/ubuntu/)
- Run the following command

```bash
git clone https://github.com/FredHutch/motuz.git
cd motuz
./bin/quickstart.sh
```

- Open browser at http://localhost/ and accept self-signed certificates

---

![Motuz main page ](docs/img/image_root.png)

---


## Beyond quickstart

In this section we will explain what each step of quickstart does. We will also see how to customize some of these steps.

1. Create a folder called `docker` in your root directory using `sudo install -d -o $USER -m 755 /docker`. Inside the folder, create the following subfolders

- `mkdir -p /docker/certs`
- `mkdir -p /docker/secrets`
- `mkdir -p /docker/volumes/postgres`

2. Add SSL certificates inside `/docker/certs` (with names `cert.crt` and `cert.key`). If you don't have SSL certificates, you can temporarily use [self-signed certificates](https://stackoverflow.com/questions/10175812/how-to-create-a-self-signed-certificate-with-openssl#10176685).

3. Create the following secret files and remember the passwords

```bash
mkdir -p /docker/secrets
head /dev/urandom | md5sum | awk '{print $1}' > /docker/secrets/MOTUZ_DATABASE_PASSWORD
head /dev/urandom | md5sum | awk '{print $1}' > /docker/secrets/MOTUZ_FLASK_SECRET_KEY
head /dev/urandom | md5sum | awk '{print $1}' > /docker/secrets/MOTUZ_SMTP_PASSWORD
```

4. Initialize the database

```bash
./bin/_utils/database_install.sh
```

5. Pull and Start all containers

```bash
docker-compose up -d
```

6. See result at http://localhost/.


## Customizing your deployment

- Add your SSL certificates - `/docker/certs/`
- Change the environment variables - `.env`
- Change passwords by editing the files - `/docker/secrets`
- Change the files that are visible to motuz - `docker-compose.override.yml`
- Use a different root (instead of `/docker`) by changing the MOTUZ_DOCKER_ROOT variable in `.env`


## Setting up production

The following instructions could be used on
an on-premises system or an EC2 instance.
For on-premises installations, we have found
that bare metal hardware has faster networking
than virtual machines.


We recommend using a machine running Ubuntu 18.04 (Bionic).

### Authentication

There are two options for authentication:

#### Local Authentication

Motuz will let you log in as any (non-root) user who is in
`/etc/passwd` on the local system.

To use this option, you should make sure the
users you want to use exist in `/etc/passwd`.

If your system does not
have an appropriate user, create one
with `useradd` and set its password
with `passwd`.

#### Authenticate against Active Directory

You can authenticate against Active Directory.
To do this we use PAM and Kerberos (or SSSD on
a CentOS system).

**NOTE**: If you want to use this option, and also
be able to log in as users in `/etc/passwd`,
you must create those users and set their passwords *before* installing Kerberos and PAM.

To authenticate against Active Directory, install the required packages
as follows:

```bash
sudo apt-get update -y
sudo apt-get install -y krb5-user libpam-krb5
```


### Requirements

Git and rsyslog are required regardless of authentication method.
Install them as follows:

```bash
sudo apt-get update -y
sudo apt-get install -y git rsyslog
```


### Docker and docker-compose

Docker is also required. Install it according to
[these instructions](https://docs.docker.com/install/linux/docker-ce/ubuntu/). Do NOT simply run `apt-get install` to install Docker. You must follow these
instructions to install Docker from Docker's own
repositories.

Then, install the latest release of `docker-compose` from
the [releases page](https://github.com/docker/compose/releases) on GitHub. Instructions are provided on that page.



### Shared Filesystems (optional)

If you want to expose shared filesystems to Motuz
users, you'll need to install NFS and mount all the
filesystems that you want to expose. For production
machines these mounts should be added to `/etc/fstab`.

You will need to add the directories you want to expose
to the `docker-compose.yml` file, under the `app`
and `celery` services.

### Cloning the Motuz repository

Clone the repository as follows:

```bash
git clone https://github.com/FredHutch/motuz.git
cd motuz
```

### Set up HTTPS certificate

Obtain an SSL certificate for your domain.
This will consist of a `.key` file and
a `.crt` file.

These files must be placed in the directory `/root/certs`. Create that
directory if it doesn't already exist.

Copy the certificate (.crt) file to
`/root/certs/cert.crt`.

Copy the key (.key) file to
`/root/certs/cert.key`.

The `.key` file should have permission 0400.

If you do not have SSL certificates, you
can temporarily (but not in a production context!)
use [self-signed certificates](https://stackoverflow.com/questions/10175812/how-to-create-a-self-signed-certificate-with-openssl#10176685).


### Running Motuz the first time

First, initialize the database as described
the "Initializing the Database" [section](README.md#initializing-the-database) of the README.
(At some point, we expect this step to go away.)


If you haven't already, change to
the directory where you cloned the
Motuz repository.

Then run the `start.sh` script. This script
is *only* meant to be run the first time
Motuz is started on a machine.

```bash
./start.sh
```

This will take a few moments.

After the stack comes up, assuming your machine
is set up in DNS as hostname.example.com, you should be able to access Motuz at the following URL:

`https://hostname.example.com/`

If you used a self-signed SSL certificate, your
browser will warn you that proceeding is not secure.

### Redeploying

If you want to stop and restart motuz, for example
to deploy new code, use the `bin/redeploy.sh` script.

For example, if you want to deploy recent changes
to the Motuz code base, first grab the latest code:

```bash
git pull
```

Then run the redeployment script:

```bash
bin/redeploy.sh
```

This will stop Motuz, rebuild Docker images, run
database migrations if necessary, and bring Motuz
back up. It will result in short (-2min) downtime.


### Using a custom database

The [.env](/.env) file provides a set of default variables that can be overwritten with environment variables. This can be leveraged to use a custom database.

```bash
export MOTUZ_DATABASE_PROTOCOL=postgresql
export MOTUZ_DATABASE_NAME=your_database_name
export MOTUZ_DATABASE_HOST=your_host.com:5432
export MOTUZ_DATABASE_USER=your_user
echo -n "your_password" > /docker/secrets/MOTUZ_DATABASE_PASSWORD

export MOTUZ_SMTP_SERVER=0.0.0.0:25
export MOTUZ_SMTP_USER=admin
echo -n "your_password" > /docker/secrets/MOTUZ_SMTP_PASSWORD

./start.sh
```

The config above is the equivalent of connecting to

```
postgresql://your_user:your_password@your_host.com:5432/your_database_name
```



## Developer Installation

### Initialize

1. Install system dependencies (tested with Ubuntu 18.04 and MacOS 10.14)

- [Docker](https://docs.docker.com/install/linux/docker-ce/ubuntu/)
- Python ~ 3.7
- Node ~ 10.15


2. Initialize app

```bash
./bin/dev/init_dev.sh
```

### Start

1. Start Database

```bash
./bin/dev/database_start.sh
```

2. Start RabbitMQ (in a new terminal window/tab)

```bash
./bin/dev/rabbitmq_start.sh
```

3. Start Celery (in a new terminal window/tab)

```bash
./bin/dev/celery_start.sh
```

4. Start Backend (in a new terminal window/tab)

```bash
./bin/dev/backend_start.sh
```

5. Start Frontend (in a new terminal window/tab)

```bash
./bin/dev/frontend_start.sh
```

6. See result at http://localhost:8080/

## Development Options

1. Changing the host

```bash
MOTUZ_HOST='0.0.0.0' ./bin/frontend_start.sh
MOTUZ_HOST='0.0.0.0' ./bin/backend_start.sh
```


## Examples

### How to use the API

#### API Endpoint

* `http://localhost:5000/api/` if you followed the [developer installation](#developer-installation) instructions.
* `https://localhost/api/` if you followed the [Quickstart](#quickstart) instructions.
* `https://example.com/api/` if you followed the [Setting up production](#setting-up-production) instructions. Replace `example.com` with your actual domain name.

In the following examples, we'll use `https://example.com/api/` as the API endpoint.

If you visit the endpoint in a web browser, you will see a Swagger front end that makes the API easy to explore.

### Authentication

- POST requests to `/api/auth/login/` with correct credentials will issue an `access_token` and a `refresh_token` (called `access` and `refresh` in the JSON response)

cURL example (replace `myusername` and `mypassword` with your username and password):

```
curl -X POST "https://example.com/api/auth/login/" \
  -H  "accept: application/json" -H  "Content-Type: application/json" \
  -d "{  \"username\": \"myusername\",  \"password\": \"mypassword\"}"
```

- Protected API points can then be accessed by providing the `access_token` as an Authorization header. Example header:
    - Authorization: Bearer `access_token`

- The `access_token` can be provided to Swagger using the "Authorize" button an the top-right and inserting `Bearer $access_token` in the box, where $access_token is the value returned for key "access" in step 1

- The `access_token` is only valid for a limited amount of time (usually 6 hours). Upon expiration, a new `access_token` can be obtained by issuing a POST request to `/api/auth/refresh/` using the `refresh_token` in the Authorization field. Example:
    - Authorization: Bearer `refresh_token`

- The `refresh_token` has longer validity, say T days. Please note that the `POST /api/auth/refresh/` endpoint issues a new `refresh_token` as well, so if the users login at least once every T days, they will never be logged out.



## Folder structure


### Overview

| Folder | Description |
| --- | --- |
| `bin/` | Scripts for starting / installing / testing the application |
| `deployment/` | Container definition for production |
| `docs/` | Documentation |
| `src/` | All source code in one place |
| `src/frontend/` | Frontend code |
| `src/backend/` | Backend code |
| `test/` | All test code in one place |
| `test/frontend/` | Frontend testing |
| `test/backend/` | Backend testing |


### Frontend folder structure (inside `/src/frontend/`)

| Folder | Description |
| --- | --- |
| `css/` | Styling |
| `img/` | Images |
| `js/` | ReactJS Code |
| `js/actions/` | Redux Actions |
| `js/components/` | Reusable React Components |
| `js/managers/` | Reusable React Utilities |
| `js/middleware/` | React middleware |
| `js/reducers/` | Redux Reducers |
| `js/utils/` | Independent JavaScript Utilities |
| `js/views/` | Motuz-Specific view and business logic |
| `webpack/` | Webpack configurations (For JS bundling) |


### Backend folder structure (inside `/src/backend/`)

| Folder | Description |
| --- | --- |
| `api/` | Code for the API (Swagger) Module |
| `api/managers/` | Utilities that the views call to perform actions (Also called services in Flask) |
| `api/mixins/` | Flask Mixins for Database Models |
| `api/models/` | Database Models |
| `api/utils/` | Standalone helper code. Could be inside its own repository |
| `api/views/` | API Endpoints for Swagger |
| `migrations/` | Database Migrations |


### Temp folders

Additional temporary folders - ignore and do not commit

| Folder | Description |
| --- | --- |
| `__pycache__/` | Python Bytecode |
| `node_modules/` | JavaScript dependencies |
| `venv/` | Python dependencies |




## Other resources

- [Server Recipes](docs/server-recipes.md)
- [Homepage of Rclone](https://rclone.org/) - the workhorse behind Motuz
