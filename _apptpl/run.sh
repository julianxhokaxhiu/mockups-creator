#!/bin/bash

# Run the docker in development mode
docker run \
    -d \
    --rm \
    -e "PRODUCTION=false" \
    -p 8080:8080 \
    -v "$(pwd):/app" \
    julianxhokaxhiu/mockups-creator
