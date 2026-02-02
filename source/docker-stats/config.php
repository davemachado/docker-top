<?php
// docker-stats configuration helper
$docker_stats_cfg_file = "/boot/config/plugins/docker-stats/docker-stats.cfg";
$docker_stats_cfg = @parse_ini_file($docker_stats_cfg_file) ?: [];

// Read CONTAINER_LIMIT with validation (5-50)
$docker_stats_container_limit = isset($docker_stats_cfg['CONTAINER_LIMIT']) ? intval($docker_stats_cfg['CONTAINER_LIMIT']) : 10;
if ($docker_stats_container_limit < 5) $docker_stats_container_limit = 5;
if ($docker_stats_container_limit > 50) $docker_stats_container_limit = 50;

// Read REFRESH_INTERVAL with validation (1-30 seconds)
$docker_stats_refresh_interval = isset($docker_stats_cfg['REFRESH_INTERVAL']) ? intval($docker_stats_cfg['REFRESH_INTERVAL']) : 3;
if ($docker_stats_refresh_interval < 1) $docker_stats_refresh_interval = 1;
if ($docker_stats_refresh_interval > 30) $docker_stats_refresh_interval = 30;
?>
