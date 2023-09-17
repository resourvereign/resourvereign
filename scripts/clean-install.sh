#!/bin/bash

SERVER_BUILD="./apps/server/dist";
CLIENT_BUILD="./apps/client/build";

rm -rf node_modules packages/*/node_modules apps/*/node_modules $SERVER_BUILD $CLIENT_BUILD;
yarn;
