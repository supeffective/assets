FROM php:8.1-bullseye as base-php
ENV DEBIAN_FRONTEND noninteractive
# Ensure local binaries are preferred over distro ones
ENV PATH /usr/local/bin:$PATH

# Alias bash to sh
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Dependencies
RUN apt-get update && apt-get install -y \
    wget \
    zip \
    libzip-dev \
    unzip \
    curl \
    rsync \
    ssh \
    openssh-client \
    git \
    build-essential \
    apt-utils \
    software-properties-common \
    sqlite3 \
    libsqlite3-dev

# SSH and Git
RUN mkdir ~/.ssh && \
    touch ~/.ssh_config && \
    mkdir -p ~/.ssh && ssh-keyscan -H github.com >>~/.ssh/known_hosts && \
    git config --global user.email "noone@localhost" && \
    git config --global user.name "noone"

# PHP extensions
RUN docker-php-ext-install zip && docker-php-ext-enable zip

## Composer
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

EXPOSE 8080
WORKDIR /usr/src/app


#------------------------------------------------------------------------------

FROM node:16-bullseye as base-node
ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && \
    apt-get install -y git zsh jq

RUN git config --global user.email "noone@noone.local" && \
    git config --global user.name "No one"

RUN npm install npm@8.5.0 -g

COPY ./scripts/docker/node-docker-entrypoint.sh /docker-entrypoint.sh
ENTRYPOINT [ "/docker-entrypoint.sh" ]

EXPOSE 3000
WORKDIR /usr/src/app

#------------------------------------------------------------------------------

FROM base-node as dumper-showdown
ENV OUTPUT_DIR=/usr/data

#------------------------------------------------------------------------------

#FROM base-node as dumper-veekun
#ENV OUTPUT_DIR=/usr/data
#RUN npm install --global csv2json

#------------------------------------------------------------------------------

FROM python:3.9 as dumper-pogo
ENV DEBIAN_FRONTEND noninteractive
ENV OUTPUT_DIR=/usr/data

RUN apt-get -yq update # && apt-get -yqq install jq
RUN pip install setuptools

# Install pogo-dumper app
# TODO, dump data from :
#  https://raw.githubusercontent.com/PokeMiners/game_masters/master/latest/latest.json
# instead of ccev/pogodatapy
COPY scripts/dumper-pogo /usr/src/pogo-dumper
WORKDIR /usr/src/pogo-dumper
RUN ls /usr/src/pogo-dumper/pogo-dumper && \
  echo "Setting up pogodata..." && \
  pip install .

WORKDIR /usr/src/app
