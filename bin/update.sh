#!/bin/bash

# This script is part of the CI/CD pipeline in use 
# at Fred Hutch to deploy Motuz. It may not be super useful
# in other deployments.


set -e
set -o pipefail

# clone the repo, capturing the latest changes.
sudo bash -c "(cd /root &&  rm -rf motuz-temp motuz-bak &&  git clone https://github.com/FredHutch/motuz.git motuz-temp)"
sudo bash -c "(cd /root/motuz-temp && git checkout prod)"

# check if rclone is running
if sudo bash -c "pgrep -l rclone"|grep -q rclone; then
  echo "rclone is running, not redeploying at this time"
  echo "in future, consider adding delays/retries here"
  exit 1
else
  echo rclone is not running, ok to redeploy
fi




echo updating code...
sudo bash -c "(cd /root && rm -rf motuz.bak && mv motuz motuz.bak && mv motuz-temp motuz)"

# source a file that has some secrets in it 
. ./secrets.sh

# TODO - make sure we are in the right branch?
echo running redeploy script...
# TODO - disable 'sleep' in redeploy script if calling from here, to minimize downtime
sudo bash -c "(cd /root/motuz && bin/redeploy.sh)"

# finally clean up and remove backup dir:
sudo bash -c "(cd /root && rm -rf motuz-bak)"

echo Done.



