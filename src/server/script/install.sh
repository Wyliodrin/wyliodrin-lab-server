#!/bin/bash

install_node () {
	cd /opt
	wget https://nodejs.org/dist/$NODE_VERSION/node-$NODE_VERSION-linux-armv7l.tar.xz -O node.xz
	tar xvfJ /opt/node.xz
	cd node-$NODE_VERSION-linux-armv7l
	cp -R * /usr
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

echo 'Install NodeJS'

if (! node -v &> /dev/null) || (! dpkg --compare-versions `node -v` 'ge' '8.0.0' &> /dev/null)
then
	install_node
else
	echo 'NodeJS is already installed'
fi

# install supervisor

echo "Install supervisord"

sudo apt-get update
sudo apt-get install -y supervisor

# install wylio

echo "Install Raspberry Pi Server"

sudo npm install -g wylio
