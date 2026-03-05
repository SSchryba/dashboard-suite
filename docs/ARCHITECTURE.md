# Architecture Reference

Technical design document for the Capital Projects Dashboard Suite.

---

## Design Principles

The suite is built around four core principles that make it practical for project management environments:

**Zero build complexity.** Every dashboard is a self-contained HTML file. There is no Node.js, no webpack, no TypeScript compilation, no package.json. A project manager can open any file directly in a browser, edit it in Notepad, and deploy it to SharePoint — no developer required.

**Shared design system.** All visual consistency comes from a single CSS file (`shared/css/design-system.css`) that defines every color, spacing value, typography scale, and component style as CSS custom properties. Retheming the entire suite requires changing fewer than 10 lines.

**Composable JavaScript utilities.** The `dashboard-utils.js` library provides factory functions for every chart type, number formatter, table renderer, and data utility. Dashboard authors call `ChartFactory.line(...)` rather than configuring Chart.js from scratch each time.

**Data-first architecture.** Each dashboard defines its data as a plain JavaScript array or object at the top of its script block. Swapping in real data from an API, a CSV, or a JSON endpoint requires changing only that data declaration — the rendering logic stays the same.

---

## File Dependency Map

```
index.html
    └── shared/css/design-system.css

dashboards/*/index.html
    ├── shared/css/design-system.css
    ├── shared/js/dashboard-utils.js
    └── cdn: chart.js@4.4.0

templates/blank.html
    ├── shared/css/design-system.css
    └── shared/js/dashboard-utils.js

templates/data-entry.html
    ├── shared/css/design-system.css
    └── shared/js/dashboard-utils.js
```

---

## CSS Architecture

The design system uses a single `:root` block with ~60 CSS custom properties organized into semantic groups:

| Group | Variables | Purpose |
|---|---|---|
| Background | `--color-bg-base/surface/elevated/overlay` | Layer hierarchy |
| Border | `--color-border/border-subtle` | Separation and depth |
| Accent | `--color-accent-primary/secondary/warning/danger/purple/cyan` | Status and emphasis |
| Text | `--color-text-primary/secondary/muted/inverse` | Typographic hierarchy |
| Chart | `--chart-1` through `--chart-8` | Consistent chart palette |
| Typography | `--font-sans/mono`, `--text-xs` through `--text-4xl` | Type scale |
| Spacing | `--space-1` through `--space-16` | 4px-base grid |
| Layout | `--sidebar-width`, `--topbar-height` | Shell dimensions |
| Effects | `--shadow-sm/md/lg`, `--shadow-glow-*` | Depth and focus |
| Transitions | `--transition-fast/normal/slow` | Motion |

### Component Classes

| Class | Description |
|---|---|
| `.dashboard-shell` | CSS Grid layout container (sidebar + topbar + main) |
| `.sidebar` | Left navigation panel |
| `.topbar` | Fixed top bar |
| `.main-content` | Scrollable content area |
| `.card` | Surface container with border and padding |
| `.stat-card` | KPI metric card with icon slot |
| `.badge` | Status pill/tag |
| `.progress-track` + `.progress-fill` | Progress bar |
| `.data-table` | Styled HTML table |
| `.btn` | Button (variants: primary, secondary, ghost) |
| `.form-control` | Input, select, textarea |
| `.grid-2/3/4/auto` | Responsive grid layouts |
| `.chart-container` | Chart.js canvas wrapper |

---

## JavaScript Architecture

`dashboard-utils.js` exports the following to the global scope (no module system required):

### `DashboardDefaults`
Applies consistent Chart.js global defaults (colors, fonts, tooltip styles, animation) on `DOMContentLoaded`.

### `COLORS`
Named color constants matching the CSS design system. Use `COLORS.blue`, `COLORS.palette[i]`, etc.

### `Format`
Pure functions for number and date formatting. All return strings.

### `DOM`
Lightweight DOM helpers (`qs`, `qsa`, `setText`, `on`, etc.) to reduce boilerplate.

### `ChartFactory`
Wraps Chart.js with sensible defaults for each chart type. Each method accepts a canvas ID, labels, datasets, and an options object. Returns the Chart.js instance for later updates or destruction.

### `TableBuilder`
Renders an HTML `<table>` into a container element from headers and row arrays. Supports raw strings and `{html, value, class}` cell objects for rich content.

### `renderProgress(pct, color, showLabel)`
Returns an HTML string for an inline progress bar. Safe to inject via `innerHTML`.

### `badge(text, color)` / `statusBadge(status)`
Return HTML strings for colored badge pills. `statusBadge` auto-maps status strings to colors.

### `DateUtils`
Date calculation helpers: `today()`, `daysUntil(date)`, `lastNMonths(n)`, `monthsRange(start, count)`.

### `Store`
localStorage wrapper with JSON serialization and error handling.

### `exportCSV(headers, rows, filename)`
Creates and triggers a CSV file download from arrays.

---

## Data Integration Patterns

### Pattern 1 — Static Data (current)
Data is defined as a JavaScript array in the dashboard's `<script>` block. Best for demos, reports, and dashboards that are updated manually.

### Pattern 2 — JSON File
Replace the static array with a `fetch()` call:

```javascript
fetch('../../data/projects.json')
  .then(r => r.json())
  .then(data => {
    renderTable(data);
    renderCharts(data);
  });
```

### Pattern 3 — REST API
Same pattern as JSON file, but pointing to an API endpoint. Works with any CORS-enabled API.

### Pattern 4 — CSV File
Use `Papa.parse` (CDN: `cdn.jsdelivr.net/npm/papaparse`) to parse a CSV file and feed the result into the existing render functions.

### Pattern 5 — localStorage (Data Entry Template)
The `Store` utility provides a simple key-value store for user-entered data. Suitable for single-user dashboards that don't require a backend.

---

## Extending the Suite

### Adding a New Dashboard
1. Copy `templates/blank.html` to `dashboards/my-dashboard/index.html`
2. Update the two relative paths to `design-system.css` and `dashboard-utils.js`
3. Add the new dashboard to the sidebar nav in `shared/components/shell.html`
4. Add a card to `index.html`

### Adding a New Chart Type
1. Add a new method to `ChartFactory` in `dashboard-utils.js`
2. Follow the existing pattern: accept `(canvasId, labels, datasets, options)`, return the Chart instance

### Adding a New Component
1. Add the HTML structure to `shared/components/shell.html` as a reference
2. Add the CSS to `shared/css/design-system.css` under the appropriate section
3. Document it in this file

### Changing the Color Theme
Edit the `:root` block in `design-system.css`. All dashboards inherit the change instantly.

---

*Last updated: March 2026*
