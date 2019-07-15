#!/bin/bash

set -e
set -o pipefail

# clone the repo, capturing the latest changes.
sudo bash -c "(cd /root &&  rm -rf motuz-temp  &&  git clone https://github.com/FredHutch/motuz.git motuz-temp)"

# check if rclone is running
if pgrep -l rclone|grep -q rclone; then
  echo "rclone is running, not redeploying at this time"
  echo "in future, consider adding delays/retries here"
  exit 1
else
  echo rclone is not running, ok to redeploy
fi




echo updating code...
sudo bash -c "(cd /root && rm -rf motuz.bak && mv motuz motuz.bak && mv motuz-temp motuz)"


# TODO - make sure we are in the right branch?
echo running redeploy script...
# TODO - disable 'sleep' in redeploy script if calling from here, to minimize downtime
sudo bash -c "(cd /root/motuz && bin/redeploy.sh)"

# finally clean up and remove backup dir:
sudo bash -c "(cd /root && rm -rf motuz-bak)"

echo Done.



