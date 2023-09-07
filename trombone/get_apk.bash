#!/bin/bash

set -e
set -x

if [ ! -f './.env' ]; then
    touch './.env'
fi

if ! grep -q "XGROUPAUTHORIZATION" ./.env; then
    echo "XGROUPAUTHORIZATION=$XGROUPAUTHORIZATION" >> ./.env
fi

if ! grep -q "API_URL" ./.env; then
    echo "API_URL=$API_URL" >> ./.env
fi

cd android || exit 1

./gradlew --no-daemon assembleRelease

cp app/build/outputs/apk/release/app-release.apk ..
