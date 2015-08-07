FROM base/archlinux
MAINTAINER Julian Xhokaxhiu <info@julianxhokaxhiu.com>

## Installing dependencies ##
RUN pacman -Sy openssh fontforge nodejs npm jre8-openjdk java-batik
RUN npm install -g ttf2eot bower

## Start SSH Server
EXPOSE 22
RUN systemctl enable sshd.socket
RUN systemctl start sshd.socket

## Install Batik Java Binaries Manually
RUN cd /root
RUN wget http://ftp-stud.hs-esslingen.de/pub/Mirrors/ftp.apache.org/dist/xmlgraphics/batik/binaries/batik-bin-1.8.tar.gz
RUN tar xzf batik-bin-1.8.tar.gz
RUN mv batik-bin-1.8/batik-1.8/* /usr/share/java/batik-1.8

## Executable script to get the command "batik-ttf2svg" working
RUN cd /usr/local/bin/
RUN cat > batik-ttf2svg <<- EOM
        #!/bin/bash.
        java -Djava.awt.headless=true -jar /usr/share/java/batik-1.8/batik-ttf2svg-1.8.jar "$@".
    EOM
RUN chmod 0755 batik-ttf2svg
RUN chown root:root batik-ttf2svg

## Install mockups-creator ##
ADD . /src
RUN cd /src
RUN npm install

## Tell Docker that this path is gonna be a real path on the Host
VOLUME "/src/app/"