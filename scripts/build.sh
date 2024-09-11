#!/bin/bash

yarn;
yarn clean:build;

yarn build:libs;
yarn build:apps;

SERVER_PUBLIC="./apps/server/dist/public";
CLIENT_BUILD_LINK_PATH="../../client/dist";
CLIENT_BUILD_COPY_PATH="./apps/client/dist";

[ -e "$SERVER_PUBLIC" ] && rm "$SERVER_PUBLIC"

if [ "$ACTION" == "link" ]; then
    echo "Linking $CLIENT_BUILD_LINK_PATH to $SERVER_PUBLIC"
    ln -s "$CLIENT_BUILD_LINK_PATH" "$SERVER_PUBLIC"
elif [ "$ACTION" == "copy" ]; then
    echo "Copying $CLIENT_BUILD_COPY_PATH to $SERVER_PUBLIC"
    cp -r "$CLIENT_BUILD_COPY_PATH" "$SERVER_PUBLIC"
else
    echo "Please set the ACTION environment variable to either 'link' or 'copy'."
    exit 1
fi