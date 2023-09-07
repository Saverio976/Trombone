#!/bin/bash

set -e
set -x

if [ ! -f './.env' ]; then
    cp ./.env.default ./.env
    sed -i "s/=XGROUPAUTHORIZATION/=$XGROUPAUTHORIZATION/g" ./.env
    sed -i "s/=API_URL/=$API_URL/g" ./.env
fi

cd android || exit 1

./gradlew --no-daemon assembleRelease

cp app/build/outputs/apk/release/app-release.apk ..
