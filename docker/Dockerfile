FROM repository.wyliodrin.com/com.wyliodrin.intel64.noui.nodejs

RUN apt-get update && \
	apt-get install -y supervisor build-essential dnsmasq nfs-kernel-server qemu-user-static python git nano procps openssh-client file redis-server sshpass --no-install-recommends && \
	apt-get clean && rm -r /var/lib/apt/lists/* && \
	npm install -g grunt


#ADD http://worldclockapi.com/api/json/utc/now /tmp/bustcache

RUN git clone https://github.com/Wyliodrin/wyliodrin-lab-server/ && \
	cd wyliodrin-lab-server && npm install && grunt

COPY .env wyliodrin-lab-server/build/server/.env
COPY dnsmasq.conf /etc/dnsmasq.conf
COPY start.sh /start.sh

CMD /start.sh
