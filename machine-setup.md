# Machine Setup

This document describes how to set up a machine from scratch to run Motuz.

These instructions will work for any machine 
on-premises or in the cloud, but we envision them
being used in an on-premises context.

We recommend using a machine running Ubuntu 18.04 (Bionic).

## Requirements 

Git, Kerberos and the PAM library are required. Install them
as follows:

```
sudo apt-get update -y
sudo apt-get install -y git krb5-user libpam-krb5
```

## Docker and docker-compose

Docker is also required. Install it according to
[these instructions](https://docs.docker.com/install/linux/docker-ce/ubuntu/). Do NOT simply run `apt-get install` to install Docker. You must follow these 
instructions to install Docker from Docker's own
repositories.

Then, install the latest release of `docker-compose` from
the [releases page](https://github.com/docker/compose/releases) on GitHub. Instructions are provided on that page.



## Shared Filesystems (optional)

If you want to expose shared filesystems to Motuz
users, you'll need to install NFS and mount all the 
filesystems that you want to expose. For production
machines these mounts should be added to `/etc/fstab`.

## Cloning the Motuz repository

Clone the repository as follows:

```
git clone https://github.com/FredHutch/motuz.git
cd motuz
```

## Set up HTTPS certificate

Obtain an SSL certificate for your domain.
This will consist of a `.key` file and 
a `.crt` file. 

These files must be placed in the directory `/root/certs`. Create that 
directory if it doesn't already exist.

Copy the certificate (.crt) file to
`/root/certs/cert.crt`.

Copy the key (.key) file to
`/root/certs/cert.crt`.

The `.key` file should have permission 0400.

## Create User(s) (optional)

You can log in to Motuz as any (non-root) Unix user
on the system. If your system does not
have an appropriate user, create one
with `useradd` and set its password 
with `passwd`.

## Running Motuz

First, initialize the database as described 
the "Initializing the Database" [section](README.md#initializing-the-database) of the README.
(At some point, we expect this step to go away.)


If you haven't already, change to 
the directory where you cloned the
Motuz repository.

Then run the full docker-compose stack.
This should be run in the background or
in a tmux session, so that it will not go
down when you log out.

```
docker-compose up
```

After the stack comes up, assuming your machine
is set up in DNS as hostname.example.com, you should be able to access Motuz at the following URL:

`https://hostname.example.com/`
