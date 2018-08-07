#!/bin/bash

install_node () {
	cd 
	wget https://nodejs.org/dist/$NODE_VERSION/node-$NODE_VERSION-linux-armv7l.tar.xz -O node.xz
	tar xvfJ node.xz
	cd node-$NODE_VERSION-linux-armv7l
	sudo cp -R * /usr
	cd ..
	rm -rf node*
}


FS=`pwd`
NODE_VERSION=v8.11.3




# $QEMU_ARM_STATIC=`which qemu-arm-static`

# echo 'Install QEMU'

# # copy qemu-arm-static
# if ![ -f "$FS""$QEMU_ARM_STATIC" ]
# then
# 	cp "$QEMU_ARM_STATIC" "$FS""$QEMU_ARM_STATIC"
# else
# 	echo 'QEMU is already installed'
# fi

# install nodejs

set

echo 'Install NodeJS'

if (! node -v &> /dev/null) || (! dpkg --compare-versions `node -v` 'ge' '8.0.0' &> /dev/null)
then
	install_node
else
	echo 'NodeJS is already installed'
fi

# install supervisor

echo "Install supervisord"

if ! supervisorctl status &> /dev/null;
then
	sudo apt-get update
	sudo apt-get install -y supervisor
else
	echo "supervisor is already installed"
fi

# install wylio

echo "Install Raspberry Pi Server"

sudo npm install -g wylio --unsafe-perm

# Writing fstab
echo "proc            /proc           proc    defaults          0       0" | sudo tee /etc/fstab
