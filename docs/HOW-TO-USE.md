# How to Use — Dashboard Builder Guide

This guide walks through building a new dashboard from scratch using the shared architecture.

---

## Step 1 — Copy the Blank Template

```bash
cp templates/blank.html dashboards/my-dashboard/index.html
```

Open the file and update the two path references at the top:

```html
<link rel="stylesheet" href="../../shared/css/design-system.css">
<script src="../../shared/js/dashboard-utils.js"></script>
```

---

## Step 2 — Add KPI Stat Cards

Stat cards are the top-row summary numbers. Each uses the `.stat-card` component:

```html
<div class="grid grid-4 mb-6">
  <div class="stat-card">
    <div class="stat-card-icon blue">📊</div>
    <div>
      <div class="card-title">My Metric</div>
      <div class="card-value">$12.4M</div>
      <div class="card-delta positive">+8% vs last month</div>
    </div>
  </div>
  <!-- Repeat for each KPI -->
</div>
```

**Icon colors:** `blue` `green` `yellow` `red` `purple`

**Delta classes:** `positive` (green) `negative` (red) `neutral` (gray)

---

## Step 3 — Add Charts

All charts use `ChartFactory` from `dashboard-utils.js`. Call them in a `<script>` block after the canvas elements.

### Line Chart

```javascript
ChartFactory.line('my-canvas-id', labels, [
  { label: 'Series A', data: [10, 20, 15, 30], color: COLORS.blue, fill: true },
  { label: 'Series B', data: [8,  18, 12, 25], color: COLORS.green }
], { yFormat: 'currency' }); // or 'percent'
```

### Bar Chart

```javascript
ChartFactory.bar('my-canvas-id', labels, [
  { label: 'Budget', data: [45, 62, 38, 71], color: COLORS.blue },
  { label: 'Spent',  data: [40, 58, 35, 65], color: COLORS.green }
], { stacked: false });
```

### Doughnut Chart

```javascript
ChartFactory.doughnut('my-canvas-id',
  ['Category A', 'Category B', 'Category C'],
  [40, 35, 25],
  [COLORS.blue, COLORS.green, COLORS.yellow],
  { format: 'percent' }
);
```

### Horizontal Bar Chart

```javascript
ChartFactory.horizontalBar('my-canvas-id',
  ['Project A', 'Project B', 'Project C'],
  [145, 88, 67],
  [COLORS.blue, COLORS.green, COLORS.purple],
  { yFormat: 'currency' }
);
```

### Canvas HTML

Every chart needs a `<canvas>` element inside a `.chart-container`:

```html
<div class="card">
  <div class="card-header"><span class="card-title">My Chart</span></div>
  <div class="chart-container" style="height:260px">
    <canvas id="my-canvas-id"></canvas>
  </div>
</div>
```

---

## Step 4 — Add a Data Table

```javascript
TableBuilder.render('my-table-container',
  ['Project', 'Status', 'Budget', '% Complete'],
  [
    ['EUV Bay Expansion', statusBadge('On Track'), '$145M', renderProgress(62, 'blue')],
    ['HMS Research Tower', statusBadge('At Risk'),  '$120M', renderProgress(71, 'green')],
  ]
);
```

The `statusBadge()` and `renderProgress()` helpers return HTML strings, so they work directly in table cells.

---

## Step 5 — Format Numbers

```javascript
Format.currency(1_450_000)   // → "$1.5M"
Format.currency(450_000)     // → "$450K"
Format.percent(48.2)         // → "48.2%"
Format.date('2026-03-05')    // → "Mar 5, 2026"
Format.shortDate('2026-03-05') // → "Mar 2026"
Format.delta(+3.2, '%')      // → "+3.2%"
```

---

## Step 6 — Generate Month Labels

```javascript
const months = DateUtils.lastNMonths(6);
// → ["Oct '25", "Nov '25", "Dec '25", "Jan '26", "Feb '26", "Mar '26"]

const custom = DateUtils.monthsRange('2025-01-01', 12);
// → 12 months starting from Jan 2025
```

---

## Step 7 — Add CSV Export

```javascript
document.getElementById('export-btn').addEventListener('click', () => {
  exportCSV(
    ['Project', 'Status', 'Budget', '% Complete'],
    myData.map(p => [p.name, p.status, p.budget, p.pct]),
    'my-export.csv'
  );
});
```

---

## Step 8 — Persist Data with localStorage

```javascript
// Save
Store.set('my-dashboard-data', myArray);

// Load (with fallback)
const data = Store.get('my-dashboard-data', []);

// Clear
Store.remove('my-dashboard-data');
```

---

## CSS Grid Layouts

```html
<div class="grid grid-2">  <!-- 2 equal columns -->
<div class="grid grid-3">  <!-- 3 equal columns -->
<div class="grid grid-4">  <!-- 4 equal columns -->
<div class="grid grid-auto"> <!-- auto-fit responsive -->

<!-- Span multiple columns -->
<div class="col-span-2">  <!-- spans 2 of 3 columns -->
<div class="col-span-full"> <!-- full width -->
```

---

## Status Badge Colors

The `statusBadge(status)` function auto-maps these strings to colors:

| Status | Color |
|---|---|
| On Track, Active | Green |
| Complete, Completed, In Progress | Blue |
| At Risk, Delayed, On Hold | Yellow |
| Critical, Cancelled, Over Budget | Red |
| Planning | Purple |

---

## Color Reference

```javascript
COLORS.blue    // #2f81f7
COLORS.green   // #3fb950
COLORS.yellow  // #d29922
COLORS.red     // #f85149
COLORS.purple  // #a371f7
COLORS.orange  // #ffa657
COLORS.palette // Array of 8 colors for multi-series charts
```

---

*See `ARCHITECTURE.md` for the full system design and component reference.*
