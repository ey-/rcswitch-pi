#!/usr/bin/env bash

sudo sed -i "s/rlimit-nproc=3/#rlimit-nproc=3/" /etc/avahi/avahi-daemon.conf
#sudo mkdir -p /var/run/dbus/
#sudo dbus-daemon --system

sudo avahi-daemon -D

homebridge
tail -f /dev/null