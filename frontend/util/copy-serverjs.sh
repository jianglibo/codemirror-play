#!/bin/bash

cd ../backend
yarn build
cp -f ./dist/bundle.min.js ../frontend/util/

# return to the origin directory
cd ../frontend