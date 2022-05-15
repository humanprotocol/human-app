#!/usr/bin/env bash

set -x # verbose
set -e # quit on error with last exit code
set -eo pipefail

readonly REGISTRY="340792883311.dkr.ecr.us-east-2.amazonaws.com"
readonly IMAGE="$1"
readonly CONTAINER_NAME="human-app-ui"

docker pull $IMAGE || echo "Failed to pull docker image $IMAGE"

if [ "$(docker ps -q -f name=${CONTAINER_NAME})" ]; then
	echo "Stopping frontend container"
	docker stop $CONTAINER_NAME
fi

if [ "$(docker ps -aq -f status=exited -f name=${CONTAINER_NAME})" ]; then
	# cleanup
	docker rm $CONTAINER_NAME
fi

echo "Runing new frontend container: $IMAGE"
docker run \
  --name=$CONTAINER_NAME \
  -d \
  -p 80:8080 \
  --network=human-protocol-staging \
  --restart=on-failure \
  $IMAGE
