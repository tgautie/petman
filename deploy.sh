#!/usr/bin/env bash

set -euo pipefail

if [ $# -lt 2 ]; then
  echo "Usage: ./deploy.sh <s3-bucket-name> <aws-profile> [subfolder]"
  exit 1
fi

BUCKET="$1"
PROFILE="$2"
SUBFOLDER="${3:-}"

S3_TARGET="s3://$BUCKET"
BASE_PATH="/"

if [ -n "$SUBFOLDER" ]; then
  SUBFOLDER="${SUBFOLDER#/}"
  SUBFOLDER="${SUBFOLDER%/}"
  S3_TARGET="s3://$BUCKET/$SUBFOLDER"
  BASE_PATH="/$SUBFOLDER/"
fi

echo "Building project with base path '$BASE_PATH'..."
npx vite build --base "$BASE_PATH"

echo "Deploying dist/ to $S3_TARGET using AWS profile '$PROFILE'..."

aws s3 sync dist/ "$S3_TARGET" \
  --delete \
  --profile "$PROFILE" \
  --exclude "index.html" \
  --cache-control "public,max-age=31536000,immutable"

aws s3 cp dist/index.html "$S3_TARGET/index.html" \
  --profile "$PROFILE" \
  --cache-control "no-cache,no-store,must-revalidate" \
  --content-type "text/html"

echo "Deployment complete."
