# Docker Top Plugin for Unraid

A dashboard widget plugin for Unraid that visualizes real-time resource usage of your top 10 Docker containers.

![Icon](source/docker-top/docker-top.png)

## Features
- **CPU Usage**: Monitor CPU load per container.
- **Memory Usage**: Track memory consumption.
- **Disk I/O**: Watch read/write throughput.
- **Visuals**: Clean, bar-chart style interface matching Unraid's "Processor" widget.
- **Real-time**: Updates every 3 seconds.

## Installation (Development/Manual)

1. **Copy Files**:
   Copy the `source/docker-top` directory to `/usr/local/emhttp/plugins/` on your Unraid server.
   
   ```bash
   scp -r source/docker-top root@unraid-ip:/usr/local/emhttp/plugins/
   ```

2. **Access**:
   The "Docker Top" widget should appear in your Dashboard or Tools menu (depending on Unraid version/config).

## Packaging
To create a standard `.plg` installation:
1. Create a `.txz` of the `source/docker-top` directory.
2. Host it.
3. Update `plugins/docker-top.plg` with the URL and MD5.

## License
MIT
