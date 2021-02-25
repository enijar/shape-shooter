#!/usr/bin/env bash

npx react-scripts build
rsync -r --delete build/* release
rm -rf build
