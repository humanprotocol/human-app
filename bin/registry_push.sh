REGISTRY_PATH="340792883311.dkr.ecr.us-east-2.amazonaws.com"
IMAGE_NAME="human-app-ui"
TAG=$(git rev-parse --short HEAD)
IMAGE="$REGISTRY_PATH/$IMAGE_NAME:$TAG"
API_URL="https://api.humanprotocol.org/v1"
HCAPTCHA_SITE_KEY="10cd757e-a469-4302-9ee2-a89e024da91a"

echo "Image tag - $TAG"

docker build \
  -f Dockerfile \
  --platform=linux/amd64 \
  --build-arg API_URL=$API_URL \
  --build-arg HCAPTCHA_SITE_KEY=$HCAPTCHA_SITE_KEY \
  -t $IMAGE .

docker push $IMAGE
