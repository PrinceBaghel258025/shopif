#!/bin/bash

rm -rf ./.amplify-hosting

mkdir -p ./.amplify-hosting/compute

cp -r ./dist ./.amplify-hosting/compute/default
cp -r ./node_modules ./.amplify-hosting/compute/default/node_modules

cp -r public ./.amplify-hosting/static
cp -r web/frontend/dist ./.amplify-hosting/compute/default/frontend/build

cp deploy-manifest.json ./.amplify-hosting/deploy-manifest.json