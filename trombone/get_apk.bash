#!/bin/bash

set -e
set -x

cp ./.env.default ./.env
sed -i "s/=XGROUPAUTHORIZATION/$XGROUPAUTHORIZATION/g" ./.env
sed -i "s/=API_URL/$API_URL/g" ./.env

cd android
./gradlew --no-daemon assembleRelease
cp app/build/outputs/apk/release/app-release.apk ..
