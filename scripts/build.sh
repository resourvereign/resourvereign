#!/bin/bash

yarn;
yarn clean:build;

yarn build:common;
yarn build:apps;

SERVER_PUBLIC="./apps/server/dist/public";
CLIENT_BUILD="../../client/dist";

[ -e "$SERVER_PUBLIC" ] && rm "$SERVER_PUBLIC"

ln -s "$CLIENT_BUILD" "$SERVER_PUBLIC";