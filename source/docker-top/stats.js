// source/docker-top/stats.js

var dockerTopSortMetric = 'cpu';

function setSortMetric(metric) {
    dockerTopSortMetric = metric;
    // Update header active states
    $('.docker-top-col-header').removeClass('active');
    $('.docker-top-col-header[data-metric="' + metric + '"]').addClass('active');
    // Update sort icons
    $('.docker-top-col-header i').removeClass('fa-sort-desc').addClass('fa-sort');
    $('.docker-top-col-header[data-metric="' + metric + '"] i').removeClass('fa-sort').addClass('fa-sort-desc');
    updateDockerTop();
}

function updateDockerTop() {
    const container = $('#docker-top-list');

    // Add loading opacity if it's taking a while, or just spinner on first load
    if (container.children('.docker-top-row').length === 0) {
        container.html('<div class="docker-top-loading">Loading...</div>');
    }

    $.getJSON('/plugins/docker-top/get_stats.php', { sort: dockerTopSortMetric }, function (data) {
        container.empty();

        if (!data || data.length === 0) {
            container.html('<div>No running containers found.</div>');
            return;
        }

        // Add column headers
        const headers = `
            <div class="docker-top-column-headers">
                <div class="docker-top-header-name">Container</div>
                <div class="docker-top-header-cpu docker-top-col-header ${dockerTopSortMetric === 'cpu' ? 'active' : ''}" data-metric="cpu" onclick="setSortMetric('cpu')">
                    CPU <i class="fa ${dockerTopSortMetric === 'cpu' ? 'fa-sort-desc' : 'fa-sort'}"></i>
                </div>
                <div class="docker-top-header-mem docker-top-col-header ${dockerTopSortMetric === 'mem' ? 'active' : ''}" data-metric="mem" onclick="setSortMetric('mem')">
                    Mem <i class="fa ${dockerTopSortMetric === 'mem' ? 'fa-sort-desc' : 'fa-sort'}"></i>
                </div>
            </div>
        `;
        container.append(headers);

        data.forEach(function (item) {
            // CPU values and styling
            let cpuPct = Math.min(item.cpu, 100);
            let cpuLabel = item.cpu.toFixed(0) + '%';
            let cpuClass = 'usage-low';
            if (item.cpu > 50) { cpuClass = 'usage-high'; }
            else if (item.cpu > 20) { cpuClass = 'usage-med'; }

            // Memory values and styling
            let memPct = item.mem_pct;
            let memLabel = item.mem_pct.toFixed(0) + '%';
            let memClass = 'usage-low';
            if (item.mem_pct > 80) { memClass = 'usage-high'; }
            else if (item.mem_pct > 50) { memClass = 'usage-med'; }

            // Row with both metrics
            const row = `
                <div class="docker-top-row">
                    <div class="docker-top-name" title="${item.name}">${item.name}</div>
                    <div class="docker-top-metric docker-top-metric-cpu">
                        <div class="docker-top-val-text ${cpuClass}">${cpuLabel}</div>
                        <div class="docker-top-bar-container">
                            <div class="docker-top-bar-fill" style="width: ${cpuPct}%"></div>
                        </div>
                    </div>
                    <div class="docker-top-metric docker-top-metric-mem">
                        <div class="docker-top-val-text ${memClass}">${memLabel}</div>
                        <div class="docker-top-bar-container">
                            <div class="docker-top-bar-fill" style="width: ${memPct}%"></div>
                        </div>
                    </div>
                </div>
            `;

            container.append(row);
        });
    }).fail(function () {
        container.html('<div style="color:red">Failed to load stats. API error.</div>');
    });
}
