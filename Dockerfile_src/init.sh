#!/bin/bash
#
# Init script
#
###########################################################

# Fix permissions
find $DATA_DIR -type d -exec chmod 775 {} \;
find $DATA_DIR -type f -exec chmod 644 {} \;
chown -R root:root $DATA_DIR

# Start grunt process
cd $DATA_DIR

# Install NPM packages only if not present
if [ ! -d "$DATA_DIR/node_modules" ]; then
  npm install
fi

# Start the build for deployment
grunt build_deploy

# Start the HTTP server
if [ "$1" != "--no-http-server" ]; then
  grunt server
fi
