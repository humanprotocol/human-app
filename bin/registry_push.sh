REGISTRY_PATH="340792883311.dkr.ecr.us-east-2.amazonaws.com"
IMAGE_NAME="human-app-ui"
TAG=$(git rev-parse --short HEAD)
IMAGE="$REGISTRY_PATH/$IMAGE_NAME:$TAG"
API_URL="https://api.humanprotocol.org/v1"

echo "Image tag - $TAG"

docker build \
  -f Dockerfile \
  --platform=linux/amd64 \
  --build-arg API_URL=$API_URL \
  -t $IMAGE .

docker push $IMAGE
