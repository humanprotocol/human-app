#!/usr/bin/env bash

set -x # verbose
set -e # quit on error
set -eo pipefail

readonly REGISTRY="340792883311.dkr.ecr.us-east-2.amazonaws.com"
readonly IMAGE="$1"
readonly CONTAINER_NAME="human-app-ui"

docker pull $IMAGE

if [ $? -eq 0 ]; then
  echo "Stopping frontend container"
  docker stop $CONTAINER_NAME
  docker rm $CONTAINER_NAME

  echo "Runing new frontend container"
  docker run \
    --name=$CONTAINER_NAME \
    -d \
    -p 80:8080 \
    -e PORT=8080 \
    -e ENABLE_CSP_FF=true \
    --network=human-protocol-staging \
    --restart=on-failure \
    $IMAGE
else
  echo "Failed to pull docker image"
fi
