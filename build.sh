#!/bin/bash
# build.sh - Package the docker-top plugin for Unraid

PLUGIN_NAME="docker-top"
VERSION=$(date +%Y.%m.%d)
SOURCE_DIR="source/${PLUGIN_NAME}"
PLUGIN_DIR="plugins/${PLUGIN_NAME}"
ARCHIVE_NAME="${PLUGIN_NAME}.txz"
PLG_FILE="plugins/${PLUGIN_NAME}.plg"

echo "Building Unraid Plugin: ${PLUGIN_NAME} v${VERSION}"

# 1. Create the plugin directory
mkdir -p "${PLUGIN_DIR}"

# 2. Create the txz archive
echo "Creating archive ${PLUGIN_DIR}/${ARCHIVE_NAME}..."
cd source
tar -cvJf "../${PLUGIN_DIR}/${ARCHIVE_NAME}" "${PLUGIN_NAME}"
cd ..

# 3. Calculate MD5
echo "Calculating MD5 checksum..."
# ARCHIVE_PATH for calculation
ARCHIVE_PATH="${PLUGIN_DIR}/${ARCHIVE_NAME}"
# macOS uses md5, Linux uses md5sum. We'll try to handle both or just use md5 since we are on Mac.
if command -v md5 >/dev/null 2>&1; then
    MD5_SUM=$(md5 -q "${ARCHIVE_PATH}")
elif command -v md5sum >/dev/null 2>&1; then
    MD5_SUM=$(md5sum "${ARCHIVE_PATH}" | awk '{print $1}')
else
    echo "Error: No md5 tool found."
    exit 1
fi

echo "MD5: ${MD5_SUM}"

# 3. Update the PLG file
# We'll use sed to update the version and checksum in the PLG file
echo "Updating ${PLG_FILE}..."

# Update version entity
sed -i '' "s/ENTITY version   \".*\"/ENTITY version   \"${VERSION}\"/" "${PLG_FILE}"

# Update MD5 in the FILE block
echo "Updating MD5 in ${PLG_FILE}..."
# This matches the <MD5> line specifically within the FILE block for the txz
# We use a simple replacement for now, assuming the structure is stable.
sed -i '' "s/<MD5>.*<\/MD5>/<MD5>${MD5_SUM}<\/MD5>/" "${PLG_FILE}"

echo "Build complete. Ready to distribute."
echo "To install on Unraid, run:"
echo "installplg /boot/config/plugins/${PLUGIN_NAME}/${PLUGIN_NAME}.plg (if local)"
echo "Or use the web UI with the URL to your .plg file."
