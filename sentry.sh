#!/bin/sh

# Script to register releases and add files in sentry

ROUTE="http://sentry.vik.io/api/0/projects/iswlabs/zspin/releases/"

if [[ -z "$KEY" || -z "$1" ]]; then
  echo "KEY=[private_key] ./sentry.sh [add|list|remove] [version]"
  exit
fi

if [ $1 == "add" ]; then
  DATE=`date +"%Y-%m-%dT%H:%m:%SZ"`
  curl -X POST -u $KEY: "$ROUTE" -d "version=$2&dateReleased=$DATE"
  curl -X POST -u $KEY: "$ROUTE$2/files/" -F "file=@build/js/app.js"
  curl -X POST -u $KEY: "$ROUTE$2/files/" -F "file=@build/js/vendors.js"

elif [ $1 == "list" ]; then
  curl -X GET -u $KEY: "$ROUTE"

elif [ $1 == "remove" ]; then
  curl -X DELETE -u $KEY: "$ROUTE$2/"
fi
