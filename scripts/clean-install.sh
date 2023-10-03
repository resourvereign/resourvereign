#!/bin/bash

SERVER_BUILD="./apps/server/dist";
CLIENT_BUILD="./apps/client/build";

rm -rf node_modules packages/*/node_modules apps/*/node_modules $SERVER_BUILD $CLIENT_BUILD;

# Check if --delete-lock or -dl parameter is provided, if so delete yarn.lock
if [[ $1 == "--delete-lock" ]] || [[ $1 == "-dl" ]]; then
  rm -f yarn.lock;
fi

yarn;
