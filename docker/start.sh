#!/bin/bash

ACTUALIP="$(hostname -I | cut -d " " -f 1)"

sed -i -e 's/PLACEHOLDER/'"$ACTUALIP"'/g' /etc/dnsmasq.conf


while [ 1 ]
do
	tail -f /dev/null
	echo "tail done"
done

cd wyliodrin-lab-server/build/server && node server.js