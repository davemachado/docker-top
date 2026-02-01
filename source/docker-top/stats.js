// source/docker-top/stats.js

function updateDockerTop() {
    const metric = $('#docker-top-metric-select').val() || 'cpu';
    const container = $('#docker-top-list');
    
    // Add loading opacity if it's taking a while, or just spinner on first load
    if (container.children().length === 0) {
        container.html('<div class="docker-top-loading">Loading...</div>');
    }

    $.getJSON('/plugins/docker-top/get_stats.php', { sort: metric }, function(data) {
        container.empty();
        
        if (!data || data.length === 0) {
            container.html('<div>No running containers found.</div>');
            return;
        }

        data.forEach(function(item) {
            // Determine display values and bar percentages
            let label = '';
            let pct = 0;
            let barClass = 'bar-low';
            let textClass = 'usage-low';
            
            if (metric === 'cpu') {
                label = item.cpu.toFixed(1) + '%';
                pct = Math.min(item.cpu, 100);
                
                if (item.cpu > 50) { textClass = 'usage-high'; barClass = 'bar-high'; }
                else if (item.cpu > 20) { textClass = 'usage-med'; barClass = 'bar-med'; }
            } else if (metric === 'mem') {
                label = item.mem_used_human; // e.g. "50MiB"
                pct = item.mem_pct; // Use the parsed percentage from docker stats
                
                if (item.mem_pct > 80) { textClass = 'usage-high'; barClass = 'bar-high'; }
                else if (item.mem_pct > 50) { textClass = 'usage-med'; barClass = 'bar-med'; }
            } else if (metric === 'disk') {
                label = item.io_human; // e.g. "1kB / 0B"
                // Disk IO doesn't have a clear "100%", so we might need relative scaling
                // For now, let's just show the text and a small bar or skip bar? 
                // Unraid dashboard usually doesn't show bar for Disk IO throughput unless it's utilization %.
                // We'll fake a bar based on a relative max (e.g. 100MB/s) or just relative to the top item?
                // Relative to top item is better.
                let max = Math.max(...data.map(d => d.io_total)) || 1;
                pct = (item.io_total / max) * 100;
                
                // Colors?
                if (pct > 80) { barClass = 'bar-high'; }
            }

            const row = `
                <div class="docker-top-row">
                    <div class="docker-top-name" title="${item.name}">${item.name}</div>
                    <div class="docker-top-val-text ${textClass}">${label}</div>
                    <div class="docker-top-bar-container">
                        <div class="docker-top-bar-fill ${barClass}" style="width: ${pct}%"></div>
                    </div>
                </div>
            `;
            
            container.append(row);
        });
    }).fail(function() {
        container.html('<div style="color:red">Failed to load stats. API error.</div>');
    });
}
