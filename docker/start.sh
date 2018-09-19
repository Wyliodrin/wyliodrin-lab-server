#!/bin/bash
set -e

ACTUALIP="$(hostname -I | cut -d " " -f 1)"

sed -i -e 's/PLACEHOLDER/'"$ACTUALIP"'/g' /etc/dnsmasq.conf

redis-server --daemonize yes
service dnsmasq start
mkdir -p /run/sendsigs.omit.d
echo "" > /run/sendsigs.omit.d/rpcbind

echo "/data/version     *(ro)"   > /etc/exports

service rpcbind start
service nfs-kernel-server start

cp -r /data/share/.ssh /root/.ssh
sshpass -p "ubuntu" ssh-copy-id ubuntu@"$ACTUALIP"
ssh ubuntu@"$ACTUALIP" 'sudo service nfs-kernel-server restart && sudo service rpcbind restart'
ssh ubuntu@"$ACTUALIP" 'sudo service nfs-kernel-server stop && sudo service rpcbind stop'

service rpcbind stop
service nfs-kernel-server stop

service rpcbind start
service nfs-kernel-server start


service rpcbind stop
service nfs-kernel-server stop

service rpcbind start
service nfs-kernel-server start



cd wyliodrin-lab-server/build/server && node server.js

while [ 1 ]
do
	tail -f /dev/null
	echo "tail done"
done


