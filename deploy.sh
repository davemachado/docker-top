#!/bin/bash
# Define your Unraid IP/hostname
UNRAID_IP="tower.local"

# Create the directory on your Unraid flash drive (if it doesn't exist)
ssh root@${UNRAID_IP} "mkdir -p /boot/config/plugins/docker-stats"

# Copy the PLG to the flash drive
scp docker-stats.plg root@${UNRAID_IP}:/boot/config/plugins/

# Copy the versioned TXZ to the local plugin folder
scp packages/docker-stats-*.txz root@${UNRAID_IP}:/boot/config/plugins/docker-stats/

# Install/Update on Unraid
ssh root@${UNRAID_IP} "plugin install /boot/config/plugins/docker-stats.plg"
