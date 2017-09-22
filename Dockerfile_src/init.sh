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

# Check if we are running the docker in DEV mode
if [ $PRODUCTION = true ]; then
  # Build the mockup
  grunt build_deploy

  # Serve it via HTTP
  grunt server
else
  # Build, Serve via HTTP and Watch for changes
  grunt build
fi
