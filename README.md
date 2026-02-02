# Docker Stats Plugin for Unraid

A dashboard widget plugin for Unraid that visualizes real-time resource usage of your top 10 Docker containers.

![Icon](source/docker-stats/docker-stats.png)

## Features
- **CPU Usage**: Monitor CPU load per container.
- **Memory Usage**: Track memory consumption.
- **Disk I/O**: Watch read/write throughput.
- **Visuals**: Clean, bar-chart style interface matching Unraid's "Processor" widget.
- **Real-time**: Updates every 3 seconds.

## Installation

To install the plugin on your Unraid server:

1. Copy the **Direct Link** to the `docker-stats.plg` file in the root of this repository.
   - Usually: `https://raw.githubusercontent.com/davemachado/docker-stats/master/docker-stats.plg`
2. Go to your Unraid Web UI.
3. Navigate to the **Plugins** tab.
4. Click on **Install Plugin**.
5. Paste the URL and click **Install**.

## Development & Building

1. **Modify Code**: Make changes in the `source/docker-stats` directory.
2. **Build Locally**: Run `./build.sh` to update the `.plg` file and package the versioned `.txz` in the `packages/` directory.
3. **Release**: 
   - Push a new tag (e.g., `git tag v2026.02.01 && git push origin --tags`).
   - The GitHub Action will automatically create a release and upload the assets.

## License
MIT
