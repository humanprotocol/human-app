REGISTRY="340792883311.dkr.ecr.us-east-2.amazonaws.com"
IMAGE_NAME="human-app-ui"
IMAGE="$REGISTRY/$IMAGE_NAME:$IMAGE_TAG"
CONTAINER_NAME="$IMAGE_NAME"

echo "$IMAGE" "$CONTAINER_NAME"
# docker pull $IMAGE

# if [ $? -eq 0 ]; then
#   docker stop $CONTAINER_NAME
#   docker rm $CONTAINER_NAME

#   docker run \
#     --name=$CONTAINER_NAME \
#     -d \
#     -p 80:8080 \
#     -e PORT=8080 \
#     -e REACT_APP_API_URL="http://ec2-18-220-126-12.us-east-2.compute.amazonaws.com:3000" \
#     -e ENABLE_CSP_FF=true \
#     --network=human-protocol-staging \
#     --restart=on-failure \
#     $IMAGE
# else
#   echo "Failed to pool docker image"
# fi