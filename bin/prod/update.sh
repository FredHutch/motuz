#!/bin/bash

if ps aux| grep -v grep |grep --quiet rclone; then
  echo "rclone is running, not redeploying at this time"
  echo "in future, consider adding delays/retries here"
  exit 1
else
  echo rclone is not running, ok to deploy
fi


sudo bash -c "(cd /root/motuz && git pull)" # # TODO unhardcode motuz dir
echo updating code...
# TODO - make sure we are in the right branch?
git pull
echo running redeploy script...
sudo bash -c "(cd /root/motuz && /bin/prod/redeploy.sh)"
echo Done.



