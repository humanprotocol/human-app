#!/usr/bin/env bash

set -eo pipefail

REGISTRY="340792883311.dkr.ecr.us-east-2.amazonaws.com"
IMAGE="$1"
CONTAINER_NAME="human-app-ui"

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
    --restart=on-failure \
    $IMAGE
else
  echo "Failed to pool docker image"
fi