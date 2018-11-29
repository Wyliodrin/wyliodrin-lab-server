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

if ! sudo supervisorctl status &> /dev/null;
then
	sudo apt-get update
	sudo apt-get install -y supervisor
else
	echo "supervisor is already installed"
fi

# install python and python-pip

echo "Install Python and Pyhton Pip"
if ! python --version &> /dev/null;
then
	sudo apt-get update
	sudo apt-get install -y python
else
	echo "python is already installed"
fi

if ! which pip &> /dev/null;
then
	sudo apt-get update
	sudo apt-get install -y python-pip
else
	echo "pip is already installed"
fi

# install wylio

echo "Install Raspberry Pi Server"

sudo npm install -g wyliolab --unsafe-perm

# install wyliozero
echo "Install wyliozero"
sudo pip install PyMata gpiozero pyserial paho-mqtt Adafruit_CharLCD 
sudo pip install wyliozero --upgrade
sudo pip install --install-option="--force-pi2" Adafruit_DHT

# Writing fstab
echo "Setting mount /proc"
echo "proc            /proc           proc    defaults          0       0" | sudo tee /etc/fstab

# Install wyliolab
echo "Install wyliolab"

sudo tee /etc/supervisor/conf.d/wyliolab.conf &> /dev/null << EOF 
[program:wyliolab]
command=/usr/bin/wyliolab
EOF

echo "Done install image"
