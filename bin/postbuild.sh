#!/bin/bash

rm -rf ./.amplify-hosting

mkdir -p ./.amplify-hosting/compute
mkdir -p ./.amplify-hosting/compute/default
mkdir -p ./.amplify-hosting/compute/default/frontend

# cp -r ./node_modules ./.amplify-hosting/compute/default/node_modules

cp -r web/frontend/dist ./.amplify-hosting/compute/default/frontend/dist
cp -r web/index.js ./.amplify-hosting/compute/default/index.js
cp -r web/package.json ./.amplify-hosting/compute/default/package.json
cp -r web/privacy.js ./.amplify-hosting/compute/default/privacy.js
cp -r web/shopify.js ./.amplify-hosting/compute/default/shopify.js
cp -r web/product-creator.js ./.amplify-hosting/compute/default/product-creator.js

cp deploy-manifest.json ./.amplify-hosting/deploy-manifest.json
cd ./.amplify-hosting/compute/default
yarn install 