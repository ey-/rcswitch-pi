# Pull base image
FROM resin/rpi-raspbian:jessie

# Install dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    wget \
    openssh-client \
    libssl-dev \
    libcurl4-openssl-dev \
    git-core \
    build-essential \
    gcc \
    python \
    python-dev \
    python-pip \
    python-virtualenv \
  && rm -rf /var/lib/apt/lists/* \
  && apt-get clean

RUN pip install pyserial
RUN git clone git://git.drogon.net/wiringPi
RUN cd wiringPi && ./build
RUN pip install wiringpi2

# gpg keys listed at https://github.com/nodejs/node
RUN set -ex \
  && for key in \
    9554F04D7259F04124DE6B476D5A82AC7E37093B \
    94AE36675C464D64BAFA68DD7434390BDBE9B9C5 \
    0034A06D9D9B0064CE8ADF6BF1747F4AD2306D93 \
    FD3A5288F042B6850C66B31F09FE44734EB7990E \
    71DCFD284A79C3B38668286BC97EC7A07EDE3FC1 \
    DD8F2338BAE7501E3DD5AC78C273792F7D83545D \
    B9AE9905FFD7803F25714661B63B535A4C206CA9 \
    C4F0DFFF4E8C1A8236409D08E73BC641CC11F4C8 \
    56730D5401028683275BD23C23EFEFE93C4CFFFE \
  ; do \
    gpg --keyserver ha.pool.sks-keyservers.net --recv-keys "$key"; \
  done

ENV NPM_CONFIG_LOGLEVEL info
ENV NODE_VERSION 7.6.0

RUN curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-armv6l.tar.gz" \
  && curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/SHASUMS256.txt.asc" \
  && gpg --batch --decrypt --output SHASUMS256.txt SHASUMS256.txt.asc \
  && grep " node-v$NODE_VERSION-linux-armv6l.tar.gz\$" SHASUMS256.txt | sha256sum -c - \
  && tar -xzf "node-v$NODE_VERSION-linux-armv6l.tar.gz" -C /usr/local --strip-components=1 \
  && rm "node-v$NODE_VERSION-linux-armv6l.tar.gz" SHASUMS256.txt SHASUMS256.txt.asc

ENV RC_SWITCH_OUTPUT_PIN 3
RUN mkdir /opt/rcswitch-pi
COPY rc-send/ /opt/rcswitch-pi/rc-send/
COPY rc-switch/ /opt/rcswitch-pi/rc-switch/

RUN cd /opt/rcswitch-pi/rc-send && make && \
    ln -s /opt/rcswitch-pi/rc-send/send /usr/local/bin/rc-send && \
    chmod u+x /usr/local/bin/rc-send

COPY rest-server/ /opt/rcswitch-pi/rest-server/

RUN cd /opt/rcswitch-pi/rest-server && npm install

EXPOSE 9876
# Define working directory
WORKDIR /opt/rcswitch-pi/rest-server

# Define default command
CMD [ "npm", "start" ]
