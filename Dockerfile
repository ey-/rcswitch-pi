# Pull base image
FROM acencini/rpi-python-serial-wiringpi
# MAINTAINER Andrew Cencini <andrew@vapor.io>

ENV RC_SWITCH_OUTPUT_PIN 3
RUN mkdir /opt/rcswitch-pi
COPY * /opt/rcswitch-pi/

RUN cd /opt/rcswitch-pi && make && \
    ln -s /opt/rcswitch-pi/send /usr/local/bin/rc-send && \
    chmod u+x /usr/local/bin/rc-send

# Define working directory
WORKDIR /data
VOLUME /data

# Define default command
CMD ["bash"]

