FROM node:12.9.1-alpine as builder
ARG BRANCH
WORKDIR /home/hackathon

RUN apk update && apk upgrade && \
    apk add --no-cache bash 

COPY src ./src
COPY .env.development .env.development
COPY package.json ./package.json

RUN npm i
