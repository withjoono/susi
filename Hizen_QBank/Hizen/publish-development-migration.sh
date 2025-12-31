#!/bin/bash

# Load environment variables from .env file if it exists
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Required environment variables
required_vars=(
  "NODE_ENV"
  "PORT"
  "DATABASE_URL"
  "DATABASE_ENCRYPTION_KEY"
  "AWS_ACCESS_KEY_ID"
  "AWS_SECRET_ACCESS_KEY"
  "AWS_REGION"
)

# Check if all required environment variables are set
for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "Error: $var environment variable is not set"
    exit 1
  fi
done

# Set default values for optional variables
export NODE_ENV=${NODE_ENV:-development}
export PORT=${PORT:-3005}
export TEST_ADMIN_EMAIL=${TEST_ADMIN_EMAIL:-test-admin@example.com}
export TEST_ADMIN_USERNAME=${TEST_ADMIN_USERNAME:-test-admin}
export TEST_ADMIN_PASSWORD=${TEST_ADMIN_PASSWORD:-1234}

# ECR login
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REPOSITORY}

# Build and push migration Docker image
docker build -t hizen-ai/be-migration -f docker/Dockerfile.migration .
docker tag hizen-ai/be-migration:latest ${ECR_REPOSITORY}/hizen-ai/be-migration:latest
docker push ${ECR_REPOSITORY}/hizen-ai/be-migration:latest

# Run migration task
aws ecs run-task --cluster ${ECS_CLUSTER} --task-definition ${ECS_TASK_DEFINITION} --launch-type EC2
