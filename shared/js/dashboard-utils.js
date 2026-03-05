/**
 * DASHBOARD UTILITIES
 * Shared helper functions for all dashboards
 * Dependencies: Chart.js (loaded via CDN in each dashboard)
 */

'use strict';

/* ── Chart.js Global Defaults ── */
const DashboardDefaults = {
  applyChartDefaults() {
    if (typeof Chart === 'undefined') return;
    Chart.defaults.color = '#8b949e';
    Chart.defaults.borderColor = '#30363d';
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.plugins.legend.labels.padding = 16;
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.plugins.legend.labels.pointStyleWidth = 10;
    Chart.defaults.plugins.tooltip.backgroundColor = '#1c2128';
    Chart.defaults.plugins.tooltip.borderColor = '#30363d';
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.padding = 12;
    Chart.defaults.plugins.tooltip.titleColor = '#e6edf3';
    Chart.defaults.plugins.tooltip.bodyColor = '#8b949e';
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
    Chart.defaults.animation.duration = 600;
    Chart.defaults.animation.easing = 'easeInOutQuart';
  }
};

/* ── Color Palette ── */
const COLORS = {
  blue:   '#2f81f7',
  green:  '#3fb950',
  yellow: '#d29922',
  red:    '#f85149',
  purple: '#a371f7',
  cyan:   '#39d353',
  orange: '#ffa657',
  teal:   '#56d364',
  blueLight:   'rgba(47,129,247,0.15)',
  greenLight:  'rgba(63,185,80,0.15)',
  yellowLight: 'rgba(210,153,34,0.15)',
  redLight:    'rgba(248,81,73,0.15)',
  purpleLight: 'rgba(163,113,247,0.15)',
  palette: ['#2f81f7','#3fb950','#d29922','#f85149','#a371f7','#ffa657','#39d353','#58a6ff']
};

/* ── Number Formatters ── */
const Format = {
  currency(value, decimals = 0) {
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
    if (value >= 1_000_000)     return `$${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000)         return `$${(value / 1_000).toFixed(0)}K`;
    return `$${value.toFixed(decimals)}`;
  },

  number(value) {
    return new Intl.NumberFormat('en-US').format(value);
  },

  percent(value, decimals = 1) {
    return `${value.toFixed(decimals)}%`;
  },

  delta(value, unit = '') {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}${unit}`;
  },

  date(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  },

  shortDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }
};

/* ── DOM Helpers ── */
const DOM = {
  qs(selector, parent = document) { return parent.querySelector(selector); },
  qsa(selector, parent = document) { return [...parent.querySelectorAll(selector)]; },

  setText(selector, value, parent = document) {
    const el = parent.querySelector(selector);
    if (el) el.textContent = value;
  },

  setHTML(selector, html, parent = document) {
    const el = parent.querySelector(selector);
    if (el) el.innerHTML = html;
  },

  addClass(selector, cls, parent = document) {
    const el = parent.querySelector(selector);
    if (el) el.classList.add(cls);
  },

  on(selector, event, handler, parent = document) {
    const el = parent.querySelector(selector);
    if (el) el.addEventListener(event, handler);
  },

  onAll(selector, event, handler, parent = document) {
    parent.querySelectorAll(selector).forEach(el => el.addEventListener(event, handler));
  }
};

/* ── Chart Factory ── */
const ChartFactory = {
  /**
   * Create a line chart
   * @param {string} canvasId
   * @param {string[]} labels
   * @param {object[]} datasets  [{label, data, color}]
   * @param {object} options
   */
  line(canvasId, labels, datasets, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    return new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: datasets.map((d, i) => ({
          label: d.label,
          data: d.data,
          borderColor: d.color || COLORS.palette[i % COLORS.palette.length],
          backgroundColor: d.fill ? (d.color || COLORS.palette[i % COLORS.palette.length]).replace(')', ', 0.1)').replace('rgb', 'rgba') : 'transparent',
          borderWidth: d.borderWidth || 2,
          pointRadius: d.pointRadius ?? 3,
          pointHoverRadius: 5,
          tension: d.tension ?? 0.4,
          fill: d.fill || false,
          ...d.extra
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        scales: {
          x: { grid: { color: '#21262d' }, ticks: { maxRotation: 0 } },
          y: { grid: { color: '#21262d' }, beginAtZero: options.beginAtZero ?? true,
               ticks: { callback: options.yFormat === 'currency' ? v => Format.currency(v) : options.yFormat === 'percent' ? v => `${v}%` : undefined } }
        },
        plugins: { legend: { display: datasets.length > 1 } },
        ...options.chartOptions
      }
    });
  },

  /**
   * Create a bar chart
   */
  bar(canvasId, labels, datasets, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: datasets.map((d, i) => ({
          label: d.label,
          data: d.data,
          backgroundColor: d.colors || (d.color || COLORS.palette[i % COLORS.palette.length]),
          borderColor: 'transparent',
          borderRadius: 4,
          borderSkipped: false,
          ...d.extra
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        scales: {
          x: { grid: { display: false }, stacked: options.stacked || false },
          y: { grid: { color: '#21262d' }, stacked: options.stacked || false, beginAtZero: true,
               ticks: { callback: options.yFormat === 'currency' ? v => Format.currency(v) : undefined } }
        },
        plugins: { legend: { display: datasets.length > 1 } },
        ...options.chartOptions
      }
    });
  },

  /**
   * Create a doughnut / pie chart
   */
  doughnut(canvasId, labels, data, colors, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    return new Chart(ctx, {
      type: options.pie ? 'pie' : 'doughnut',
      data: {
        labels,
        datasets: [{ data, backgroundColor: colors || COLORS.palette, borderColor: '#161b22', borderWidth: 2, hoverOffset: 4 }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: options.cutout || '65%',
        plugins: {
          legend: { position: options.legendPosition || 'right' },
          tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${options.format === 'currency' ? Format.currency(ctx.raw) : options.format === 'percent' ? Format.percent(ctx.raw) : ctx.raw}` } }
        },
        ...options.chartOptions
      }
    });
  },

  /**
   * Create a horizontal bar chart
   */
  horizontalBar(canvasId, labels, data, colors, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{ data, backgroundColor: colors || COLORS.palette.slice(0, data.length), borderRadius: 4, borderSkipped: false }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { grid: { color: '#21262d' }, beginAtZero: true,
               ticks: { callback: options.yFormat === 'currency' ? v => Format.currency(v) : options.yFormat === 'percent' ? v => `${v}%` : undefined } },
          y: { grid: { display: false } }
        },
        plugins: { legend: { display: false } },
        ...options.chartOptions
      }
    });
  },

  /**
   * Create a scatter / bubble chart
   */
  scatter(canvasId, datasets, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    return new Chart(ctx, {
      type: 'scatter',
      data: { datasets: datasets.map((d, i) => ({ label: d.label, data: d.data, backgroundColor: d.color || COLORS.palette[i % COLORS.palette.length], pointRadius: 6, ...d.extra })) },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: {
          x: { grid: { color: '#21262d' }, title: { display: !!options.xLabel, text: options.xLabel, color: '#8b949e' } },
          y: { grid: { color: '#21262d' }, title: { display: !!options.yLabel, text: options.yLabel, color: '#8b949e' } }
        },
        plugins: { legend: { display: datasets.length > 1 } },
        ...options.chartOptions
      }
    });
  }
};

/* ── Table Builder ── */
const TableBuilder = {
  /**
   * Render a data table into a container
   * @param {string} containerId
   * @param {string[]} headers
   * @param {Array[]} rows  — each row is an array of cell values or {value, html, class} objects
   */
  render(containerId, headers, rows, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const thead = headers.map(h => `<th>${h}</th>`).join('');
    const tbody = rows.map(row => {
      const cells = row.map(cell => {
        if (typeof cell === 'object' && cell !== null) {
          return `<td class="${cell.class || ''}">${cell.html || cell.value || ''}</td>`;
        }
        return `<td>${cell}</td>`;
      }).join('');
      return `<tr>${cells}</tr>`;
    }).join('');

    container.innerHTML = `
      <table class="data-table">
        <thead><tr>${thead}</tr></thead>
        <tbody>${tbody}</tbody>
      </table>`;
  }
};

/* ── Progress Bar Helper ── */
function renderProgress(percent, color = 'blue', showLabel = true) {
  const clamp = Math.min(100, Math.max(0, percent));
  return `
    <div class="flex items-center gap-2">
      ${showLabel ? `<span class="text-xs font-mono" style="width:36px;text-align:right">${clamp}%</span>` : ''}
      <div class="progress-track flex-1">
        <div class="progress-fill ${color}" style="width:${clamp}%"></div>
      </div>
    </div>`;
}

/* ── Badge Helper ── */
function badge(text, color = 'gray') {
  return `<span class="badge badge-${color}">${text}</span>`;
}

/* ── Status to Color Map ── */
const STATUS_COLOR = {
  'On Track':    'green',
  'Active':      'green',
  'Complete':    'blue',
  'Completed':   'blue',
  'At Risk':     'yellow',
  'Delayed':     'yellow',
  'On Hold':     'gray',
  'Cancelled':   'red',
  'Critical':    'red',
  'Over Budget': 'red',
  'Planning':    'purple',
  'In Progress': 'blue',
};

function statusBadge(status) {
  const color = STATUS_COLOR[status] || 'gray';
  return badge(status, color);
}

/* ── Date Utilities ── */
const DateUtils = {
  today() { return new Date().toISOString().split('T')[0]; },

  daysUntil(dateStr) {
    const diff = new Date(dateStr) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  },

  monthsRange(start, count) {
    const months = [];
    const d = new Date(start);
    for (let i = 0; i < count; i++) {
      months.push(d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }));
      d.setMonth(d.getMonth() + 1);
    }
    return months;
  },

  lastNMonths(n) {
    return DateUtils.monthsRange(new Date(new Date().setMonth(new Date().getMonth() - n + 1)), n);
  }
};

/* ── Local Storage Data Store ── */
const Store = {
  get(key, fallback = null) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch {}
  },
  remove(key) { localStorage.removeItem(key); }
};

/* ── Export to CSV ── */
function exportCSV(headers, rows, filename = 'export.csv') {
  const lines = [headers.join(','), ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

/* ── Initialize on DOM Ready ── */
document.addEventListener('DOMContentLoaded', () => {
  DashboardDefaults.applyChartDefaults();

  // Sidebar toggle
  const toggleBtn = document.getElementById('sidebar-toggle');
  const shell = document.querySelector('.dashboard-shell');
  if (toggleBtn && shell) {
    toggleBtn.addEventListener('click', () => shell.classList.toggle('collapsed'));
  }

  // Active nav item highlight
  const currentPath = window.location.pathname.split('/').pop();
  document.querySelectorAll('.sidebar-item').forEach(item => {
    if (item.getAttribute('href') === currentPath) item.classList.add('active');
  });
});
