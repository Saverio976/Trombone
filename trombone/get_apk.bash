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

if ! grep -q "XRAPIDAPIKEY_YAHOOFINANCE_KEY" ./.env; then
    echo "XRAPIDAPIKEY_YAHOOFINANCE_KEY=$XRAPIDAPIKEY_YAHOOFINANCE_KEY" >> ./.env
fi

if ! grep -q "XRAPIDAPIKEY_YAHOOFINANCE_HOST" ./.env; then
    echo "XRAPIDAPIKEY_YAHOOFINANCE_HOST=$XRAPIDAPIKEY_YAHOOFINANCE_HOST" >> ./.env
fi

if ! grep -q "XRAPIDAPIKEY_YAHOOFINANCE_URL" ./.env; then
    echo "XRAPIDAPIKEY_YAHOOFINANCE_URL=$XRAPIDAPIKEY_YAHOOFINANCE_URL" >> ./.env
fi

cd android || exit 1

./gradlew --no-daemon assembleRelease

cp app/build/outputs/apk/release/app-release.apk ..
