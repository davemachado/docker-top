<?php
// unraid-top-plugin/source/docker-top/get_stats.php

header('Content-Type: application/json');

// Helper to parse size strings (e.g., "1.5GiB", "10MB", "1kB") to bytes
function parseSize($sizeStr) {
    $units = ['B' => 0, 'kB' => 1, 'MB' => 2, 'GiB' => 3, 'TB' => 4, 'KiB' => 1, 'MiB' => 2]; // Docker uses specific units sometimes
    // Normalize units
    $sizeStr = trim($sizeStr);
    
    // Simple regex to grab number and unit
    if (preg_match('/^([\d\.]+)\s*([a-zA-Z]+)$/', $sizeStr, $matches)) {
        $val = floatval($matches[1]);
        $unit = $matches[2];
        
        // Handle variations if needed, but docker stats usually gives standard output
        // Standard conversions for base 1024 (KiB) vs 1000 (kB) - generic approximation or precise?
        // Docker often uses binary prefixes but labels them variably. 
        // Let's assume standard powers of 1024 for GiB/MiB/KiB and 1000 for kB/MB if strictly followed, 
        // but often simpler parses are sufficient for relative sorting.
        
        $multiplier = 1;
        if (stripos($unit, 'Ti') !== false || stripos($unit, 'TB') !== false) $multiplier = 1024 * 1024 * 1024 * 1024;
        elseif (stripos($unit, 'Gi') !== false || stripos($unit, 'GB') !== false) $multiplier = 1024 * 1024 * 1024;
        elseif (stripos($unit, 'Mi') !== false || stripos($unit, 'MB') !== false) $multiplier = 1024 * 1024;
        elseif (stripos($unit, 'Ki') !== false || stripos($unit, 'kB') !== false || stripos($unit, 'KB') !== false) $multiplier = 1024;
        
        return $val * $multiplier;
    }
    return floatval($sizeStr); // Fallback
}

// Check if a metric was requested
$sortBy = isset($_GET['sort']) ? $_GET['sort'] : 'cpu'; // cpu, mem, disk

// Command to get stats
// Format: Name | CPU Pct | Mem Pct | Mem Usage | Block IO
$cmd = "docker stats --no-stream --format \"{{.Name}}|{{.CPUPerc}}|{{.MemPerc}}|{{.MemUsage}}|{{.BlockIO}}\"";
$output = [];
$return_var = 0;
exec($cmd, $output, $return_var);

$data = [];

foreach ($output as $line) {
    if (empty(trim($line))) continue;
    
    $parts = explode('|', $line);
    if (count($parts) < 5) continue;
    
    $name = $parts[0];
    
    // Parse CPU
    $cpuRaw = str_replace('%', '', $parts[1]);
    $cpuVal = floatval($cpuRaw);
    
    // Parse Mem Pct
    $memPctRaw = str_replace('%', '', $parts[2]);
    $memPctVal = floatval($memPctRaw);
    
    // Parse Mem Usage (e.g., "50MiB / 1GiB")
    $memUsageParts = explode('/', $parts[3]);
    $memUsedBytes = parseSize($memUsageParts[0]);
    $memLimitBytes = count($memUsageParts) > 1 ? parseSize($memUsageParts[1]) : 0;
    
    // Parse Block IO (e.g., "10MB / 50MB") -> In / Out
    $ioParts = explode('/', $parts[4]);
    $ioInBytes = parseSize($ioParts[0]);
    $ioOutBytes = count($ioParts) > 1 ? parseSize($ioParts[1]) : 0;
    $ioTotalBytes = $ioInBytes + $ioOutBytes;
    
    $data[] = [
        'name' => $name,
        'cpu' => $cpuVal,
        'mem_pct' => $memPctVal,
        'mem_used' => $memUsedBytes,
        'mem_used_human' => trim($memUsageParts[0]),
        'io_total' => $ioTotalBytes,
        'io_in' => $ioInBytes,
        'io_out' => $ioOutBytes,
        'io_human' => trim($parts[4])
    ];
}

// Sort
usort($data, function($a, $b) use ($sortBy) {
    if ($sortBy === 'mem') {
        return $b['mem_used'] <=> $a['mem_used'];
    } elseif ($sortBy === 'disk') {
        return $b['io_total'] <=> $a['io_total'];
    } else {
        // default cpu
        return $b['cpu'] <=> $a['cpu'];
    }
});

// Returns top 10
echo json_encode(array_slice($data, 0, 10));
?>
