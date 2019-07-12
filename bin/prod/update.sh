#!/bin/bash

if ps aux| grep -v grep |grep --quiet rclone; then
  echo "rclone is running, not redeploying at this time"
  echo "in future, consider adding delays/retries here"
  exit 1
else
  echo rclone is not running, ok to deploy
fi


echo updating code...
sudo bash -c "(cd /root/motuz && git pull)" # # TODO unhardcode motuz dir
# TODO - make sure we are in the right branch?
echo running redeploy script...
# TODO - disable 'sleep' in redeploy script if calling from here, to minimize downtime
sudo bash -c "(cd /root/motuz && bin/prod/redeploy.sh)"
echo Done.



