#!/bin/bash

if ps aux| grep -v grep |grep --quiet rclone; then
  echo rclone is running, not redeploying at this time
  echo in future, consider adding delays/retries here
  exit 1
else
  echo rclone is not running, ok to deploy
fi


sudo -s
cd ~root/motuz # # TODO unhardcode motuz dir
echo updating code...
git pull
echo running redeploy script...
bin/prod/redeploy.sh


