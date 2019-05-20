# Setuid experiment

I prepared a proof of concept in the form of `setuid.c`. The idea behind the experiment is that we want to impersonate any user and execute a `ls` command in a specific folder. The API for that is

```bash
./setuid path/to/folder uid_to_impersonate
```

## Explanation

> Problem 1: As a casual user we cannot impersonate other users

We can circumvent that by setting the uid sticky bit and changing the ownership of the executable to root.

> Problem 2: Now that we run as root, we need to drop permissions right away

We do that by running `setuid()` and `setgid()` respectively

> Problem 3: This needs to only be ran by the flask user

We fix that by keeping the permission root:flask. This way only those in the flask group and the root user can execute the file

The experiment follows

## Setup the paths

```bash
mkdir -p /tmp/sandbox-deleteme/currentuser
mkdir -p /tmp/sandbox-deleteme/otheruser

sudo chmod 755 /tmp
sudo chmod 755 /tmp/sandbox-delete
touch /tmp/sandbox-deleteme/otheruser/hidden{1..5}.txt
touch /tmp/sandbox-deleteme/currentuser/hidden{1..5}.txt

sudo chmod 700 /tmp/sandbox-delete/currentuser
sudo chmod 700 /tmp/sandbox-delete/otheruser

sudo chown currentuser:currentuser /tmp/sandbox-delete/currentuser
sudo chmod otheruser:otheruser /tmp/sandbox-delete/otheruser
```

## Check user IDs

```bash
id
uid=1000(currentuser) gid=1000(currentuser) groups=1000(currentuser)

su - otheruser
id
uid=1001(otheruser) gid=1001(otheruser) groups=1001(otheruser)
```


## Compile (As `currentuser`)

```bash
g++ setuid.c -o setuid.exe  # Compile as current user
sudo su                     # Get root access
chown root:root setuid.exe  # Change ownership to root
chmod u+s setuid.exe        # Set sticky bit
```


## Proof of Concept

`currentuser` (1000) cannot see `otheruser`'s folder

```bash
$ ./setuid.exe /tmp/sandbox-deleteme/otheruser 1000
uid: 1000 | euid: 0
Permission denied
```

`otheruser` (1001) can see their folder

```bash
$ ./setuid.exe /tmp/sandbox-deleteme/otheruser 1001
uid: 1000 | euid: 0
.
hidden5.txt
hidden3.txt
..
hidden2.txt
hidden1.txt
hidden4.txt
```

`currentuser` (1000) can see their own folder

```bash
$ ./setuid.exe /tmp/sandbox-deleteme/currentuser 1000
uid: 1000 | euid: 0
.
hidden5.txt
hidden3.txt
..
hidden2.txt
hidden1.txt
hidden4.txt
```

`otheruser` (1001) cannot see `currentuser`'s folder

```bash
$ ./setuid.exe /tmp/sandbox-deleteme/currentuser 1001
uid: 1000 | euid: 0
Permission denied
```