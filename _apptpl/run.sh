#!/bin/bash

# Run the docker in development mode
docker run \
    -d \
    --name="mockups-creator" \
    --rm \
    -e "PRODUCTION=false" \
    --expose=35729 \
    -p 8080:8080 \
    -p 35729:35729 \
    -v "$(pwd):/app" \
    julianxhokaxhiu/mockups-creator &>/dev/null

# Follow logs
docker logs \
    -f \
    mockups-creator
    