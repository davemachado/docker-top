// source/docker-top/stats.js

function updateDockerTop() {
    const metric = $('#docker-top-metric-select').val() || 'cpu';
    const container = $('#docker-top-list');
    const subtitle = $('#docker-top-subtitle');

    // Update subtitle based on metric
    let subtitleText = 'Top 10 by CPU Usage';
    if (metric === 'mem') subtitleText = 'Top 10 by Memory Usage';
    else if (metric === 'disk') subtitleText = 'Top 10 by Disk I/O';
    subtitle.text(subtitleText);

    // Add loading opacity if it's taking a while, or just spinner on first load
    if (container.children().length === 0) {
        container.html('<div class="docker-top-loading">Loading...</div>');
    }

    $.getJSON('/plugins/docker-top/get_stats.php', { sort: metric }, function (data) {
        container.empty();

        if (!data || data.length === 0) {
            container.html('<div>No running containers found.</div>');
            return;
        }

        data.forEach(function (item) {
            // Determine display values and bar percentages
            let label = '';
            let pct = 0;
            let textClass = 'usage-low';

            if (metric === 'cpu') {
                label = item.cpu.toFixed(0) + '%';
                pct = Math.min(item.cpu, 100);

                if (item.cpu > 50) { textClass = 'usage-high'; }
                else if (item.cpu > 20) { textClass = 'usage-med'; }
            } else if (metric === 'mem') {
                label = item.mem_pct.toFixed(0) + '%';
                pct = item.mem_pct;

                if (item.mem_pct > 80) { textClass = 'usage-high'; }
                else if (item.mem_pct > 50) { textClass = 'usage-med'; }
            } else if (metric === 'disk') {
                label = item.io_human.split(' / ')[0]; // Just show read or total? Let's show first part
                let max = Math.max(...data.map(d => d.io_total)) || 1;
                pct = (item.io_total / max) * 100;

                if (pct > 80) { textClass = 'usage-high'; }
            }

            // New Row Layout: Name | Value | Bar
            const row = `
                <div class="docker-top-row">
                    <div class="docker-top-name" title="${item.name}">${item.name}</div>
                    <div class="docker-top-val-text ${textClass}">${label}</div>
                    <div class="docker-top-bar-container">
                        <div class="docker-top-bar-fill" style="width: ${pct}%"></div>
                    </div>
                </div>
            `;

            container.append(row);
        });
    }).fail(function () {
        container.html('<div style="color:red">Failed to load stats. API error.</div>');
    });
}
