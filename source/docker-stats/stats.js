// source/docker-stats/stats.js

var dockerStatsSortMetric = 'cpu';

function setSortMetric(metric) {
    dockerStatsSortMetric = metric;
    updateDockerStats();
}

function updateDockerStats() {
    const container = $('#docker-stats-list');

    if (container.find('.docker-stats-grid').length === 0) {
        container.html('<div class="docker-stats-loading">Loading...</div>');
    }

    $.getJSON('/plugins/docker-stats/get_stats.php', { sort: dockerStatsSortMetric }, function (data) {
        container.empty();

        if (!data || data.length === 0) {
            container.html('<div class="docker-stats-loading">No running containers found.</div>');
            return;
        }

        // Build grid layout with divs
        let html = '<div class="docker-stats-grid">';

        // Header row
        html += '<div class="docker-stats-header-row">';
        html += '<div class="docker-stats-cell docker-stats-col-name">NAME</div>';
        html += `<div class="docker-stats-cell docker-stats-col-cpu docker-stats-sortable ${dockerStatsSortMetric === 'cpu' ? 'active' : ''}" onclick="setSortMetric('cpu')">CPU %<i class="fa ${dockerStatsSortMetric === 'cpu' ? 'fa-sort-desc' : 'fa-sort'}"></i></div>`;
        html += '<div class="docker-stats-cell docker-stats-col-mem-usage">MEM USAGE</div>';
        html += `<div class="docker-stats-cell docker-stats-col-mem-pct docker-stats-sortable ${dockerStatsSortMetric === 'mem' ? 'active' : ''}" onclick="setSortMetric('mem')">MEM %<i class="fa ${dockerStatsSortMetric === 'mem' ? 'fa-sort-desc' : 'fa-sort'}"></i></div>`;
        html += '</div>';

        // Data rows
        data.forEach(function (item) {
            // CPU color class
            let cpuClass = 'usage-low';
            if (item.cpu > 50) cpuClass = 'usage-high';
            else if (item.cpu > 20) cpuClass = 'usage-med';

            // Mem color class
            let memClass = 'usage-low';
            if (item.mem_pct > 80) memClass = 'usage-high';
            else if (item.mem_pct > 50) memClass = 'usage-med';

            html += '<div class="docker-stats-data-row">';
            html += `<div class="docker-stats-cell docker-stats-col-name" title="${item.name}">${item.name}</div>`;
            html += `<div class="docker-stats-cell docker-stats-col-cpu ${cpuClass}">${item.cpu.toFixed(2)}%</div>`;
            html += `<div class="docker-stats-cell docker-stats-col-mem-usage">${item.mem_usage}</div>`;
            html += `<div class="docker-stats-cell docker-stats-col-mem-pct ${memClass}">${item.mem_pct.toFixed(2)}%</div>`;
            html += '</div>';
        });

        html += '</div>';
        container.html(html);
    }).fail(function () {
        container.html('<div class="docker-stats-loading" style="color:#d9534f">Failed to load stats.</div>');
    });
}
