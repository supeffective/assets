FROM php:8.1-bullseye as base-php
ENV DEBIAN_FRONTEND noninteractive
# Ensure local binaries are preferred over distro ones
ENV PATH /usr/local/bin:$PATH
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

WORKDIR /usr/src/app

#------------------------------------------------------------------------------

#FROM base-node as node-frontend
#EXPOSE 3000

#------------------------------------------------------------------------------

#FROM base-node as dumper-showdown
#ENV OUTPUT_DIR=/usr/data

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
COPY ./scripts/pogo-dumper /usr/src/pogo-dumper
WORKDIR /usr/src/pogo-dumper
RUN ls /usr/src/pogo-dumper/pogo-dumper && \
  echo "Setting up pogodata..." && \
  pip install .

WORKDIR /usr/src/app
