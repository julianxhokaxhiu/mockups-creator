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
grunt build_deploy
grunt server
