#!/bin/bash

# run this as the ubuntu user - or whatever non-root user you will use for development

cd

mkdir dev
cd dev

git clone https://github.com/FredHutch/motuz.git

cd motuz

python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

mkdir docker
mkdir docker/secrets
mkdir docker/volumes
echo dbpassword > docker/secrets/MOTUZ_DATABASE_PASSWORD
echo secretkey > docker/secrets/MOTUZ_FLASK_SECRET_KEY
echo smtppass > docker/secrets/MOTUZ_SMTP_PASSWORD

source sourceme

# this needs to be personalized for you - if you are not me
git config --global user.email "XXXXXXXX@XXXXX.org" # TODO, redact this before committing
git config --global user.name "XXXXXXXX" # same

# this is a matter of preference:

echo >> ~/.bashrc
echo "export EDITOR=vim" >> ~/.bashrc
