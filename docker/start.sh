#!/bin/bash
set -e

ACTUALIP="$(hostname -I | cut -d " " -f 1)"

sed -i -e 's/PLACEHOLDER/'"$ACTUALIP"'/g' /etc/dnsmasq.conf

redis-server --daemonize yes
service dnsmasq start

while [ 1 ]
do
	tail -f /dev/null
	echo "tail done"
done

cd wyliodrin-lab-server/build/server && node server.js

