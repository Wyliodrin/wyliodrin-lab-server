#!/bin/bash

FOLDER_SETUP=$1

echo "Install" $FOLDER_SETUP

QEMU=`which qemu-arm-static`

if [ -f $QEMU ];
then
	cp $QEMU "$FOLDER_SETUP""$QEMU"
	cp `dirname "$0"`/install.sh "$FOLDER_SETUP"/install.sh
	chmod a+rx "$FOLDER_SETUP"/install.sh
else
	echo "qemu not found, please install qemu"
	exit -1
fi



