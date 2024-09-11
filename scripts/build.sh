#!/bin/bash

yarn;
yarn clean:build;

yarn build:libs;
yarn build:apps;

SERVER_PUBLIC="./apps/server/dist/public";
CLIENT_BUILD="../../client/dist";

[ -e "$SERVER_PUBLIC" ] && rm "$SERVER_PUBLIC"

if [ "$ACTION" == "link" ]; then
    echo "Linking $CLIENT_BUILD to $SERVER_PUBLIC"
    ln -s "$CLIENT_BUILD" "$SERVER_PUBLIC"
elif [ "$ACTION" == "copy" ]; then
    echo "Copying $CLIENT_BUILD to $SERVER_PUBLIC"
    cp -r "$CLIENT_BUILD" "$SERVER_PUBLIC"
else
    echo "Please set the ACTION environment variable to either 'link' or 'copy'."
    exit 1
fi