#!/bin/bash
set -e

ACTUALIP="$(hostname -I | cut -d " " -f 1)"

sudo sed -i -e 's/PLACEHOLDER/'"$ACTUALIP"'/g' /etc/dnsmasq.conf

node /wyliodrin-lab-server/build/server/server.js