#!/bin/sh
# line endings must be \n, not \r\n !
echo "window._env_ = {" > ./env-config.js
awk -F '=' '/^\s*$/ {next;} {printf ("  ") } { print $1 ": \x27" $2 "\x27," }' ./.env >> ./env-config.js
echo "}" >> ./env-config.js