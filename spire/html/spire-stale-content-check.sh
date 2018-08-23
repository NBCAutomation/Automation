#!/usr/bin/env bash
if [ "$(hostname)" == "ip-10-9-169-143" ]; then
  source /home/ec2-user/.bashrc;
  cd /home/ec2-user/automation-deploy/src/html;
fi
npm run staleContentCheck