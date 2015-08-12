FROM base/archlinux
MAINTAINER Julian Xhokaxhiu <info@julianxhokaxhiu.com>

## Update the keyring key database
RUN pacman-key --init && pacman-key --populate archlinux && pacman-key --refresh-keys

## Upgrade the system to max so we not gonna have package conflicts during installation
RUN yes '' | pacman -Syu --noprogressbar --noconfirm
RUN pacman-db-upgrade

## Installing dependencies ##
RUN yes '' | pacman -Sy --noprogressbar --noconfirm --needed openssh wget fontforge nodejs npm jre8-openjdk java-batik
RUN npm install -g ttf2eot bower

## Install Batik Java Binaries Manually
RUN wget http://ftp-stud.hs-esslingen.de/pub/Mirrors/ftp.apache.org/dist/xmlgraphics/batik/binaries/batik-bin-1.8.tar.gz -P /root
RUN tar xzf /root/batik-bin-1.8.tar.gz -C /usr/share/java

## Executable script to get the command "batik-ttf2svg" working
RUN echo $'#!/bin/bash\n\
java -Djava.awt.headless=true -jar /usr/share/java/batik-1.8/batik-ttf2svg-1.8.jar "$@"\n'\
>> /usr/local/bin/batik-ttf2svg
RUN chmod 0755 /usr/local/bin/batik-ttf2svg
RUN chown root:root /usr/local/bin/batik-ttf2svg

## Install mockups-creator ##
ADD . /src
WORKDIR /src
RUN npm install

## Tell Docker that this path is gonna be a real path on the Host
VOLUME "/src/app/"

## Start SSH Server
EXPOSE 22
CMD ["/usr/sbin/sshd", "-D"]