# Capital Projects Dashboard Suite

A complete, zero-dependency HTML data dashboard architecture for capital project management. Built with pure HTML, CSS, and JavaScript — no build step, no framework, no Node.js required. Open any file directly in a browser.

---

## What's Included

| Dashboard | Description |
|---|---|
| **KPI Overview** | Portfolio-wide health metrics: SPI, budget variance, change orders, at-risk summary |
| **Project Portfolio** | Searchable/filterable project register with status, budget, and progress tracking |
| **Schedule & Milestones** | HTML Gantt chart, milestone countdown tracker, SPI bar chart |
| **Budget Tracker** | S-curve analysis, cost variance table, CPI, contingency usage, burn rate |
| **Construction Progress** | Phase completion, weekly progress vs. plan, trade workforce, inspection log |
| **Facility Systems** | Live-simulated MEP/cleanroom monitoring, commissioning checklist |

| Template | Description |
|---|---|
| **Blank Template** | Fully wired shell — sidebar, topbar, KPI cards, charts, table. Start here. |
| **Data Entry Template** | Form-driven dashboard with localStorage persistence and live chart updates |

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/SSchryba/dashboard-suite.git
cd dashboard-suite

# Open the landing page in your browser (no server needed)
open index.html
# or on Windows:
start index.html
```

No `npm install`. No `webpack`. No build step. Every file is a standalone HTML page.

---

## Creating a New Dashboard

```bash
# 1. Copy the blank template into a new folder
cp templates/blank.html dashboards/my-dashboard/index.html

# 2. Update the two relative paths at the top of the file:
#    href="../../shared/css/design-system.css"
#    src="../../shared/js/dashboard-utils.js"

# 3. Open in browser and start customizing
```

---

## Architecture

```
dashboard-repo/
├── index.html                    ← Landing page
├── shared/
│   ├── css/design-system.css     ← CSS variables, layout, all components
│   ├── js/dashboard-utils.js     ← ChartFactory, Format, TableBuilder, etc.
│   └── components/shell.html     ← Sidebar + topbar HTML snippet
├── dashboards/
│   ├── kpi-overview/index.html
│   ├── project-portfolio/index.html
│   ├── schedule-milestones/index.html
│   ├── budget-tracker/index.html
│   ├── construction-progress/index.html
│   └── facility-systems/index.html
├── templates/
│   ├── blank.html
│   └── data-entry.html
└── docs/
    ├── README.md
    ├── ARCHITECTURE.md
    └── HOW-TO-USE.md
```

---

## Key Utilities (`dashboard-utils.js`)

| Utility | Purpose |
|---|---|
| `ChartFactory.line()` | Create a Chart.js line chart with defaults applied |
| `ChartFactory.bar()` | Create a bar chart (vertical or horizontal) |
| `ChartFactory.doughnut()` | Create a doughnut or pie chart |
| `ChartFactory.horizontalBar()` | Create a horizontal bar chart |
| `Format.currency(value)` | Format a number as $1.2M, $450K, etc. |
| `Format.percent(value)` | Format as `48.2%` |
| `Format.date(dateStr)` | Format as `Mar 5, 2026` |
| `TableBuilder.render()` | Render a data table into a container element |
| `renderProgress(pct, color)` | Render an inline progress bar HTML string |
| `badge(text, color)` | Render a colored badge/pill HTML string |
| `statusBadge(status)` | Auto-color badge based on status string |
| `DateUtils.lastNMonths(n)` | Get array of last N month labels |
| `DateUtils.daysUntil(date)` | Days until a future date |
| `exportCSV(headers, rows, filename)` | Download data as a CSV file |
| `Store.get/set/remove(key)` | localStorage wrapper |

---

## CSS Design System

All styling is driven by CSS custom properties defined in `shared/css/design-system.css`. To retheme the entire suite, edit the `:root` block:

```css
:root {
  --color-accent-primary:   #2f81f7;   /* Change to your brand color */
  --color-bg-base:          #0d1117;   /* Main background */
  --color-bg-surface:       #161b22;   /* Card/sidebar background */
  /* ... */
}
```

---

## Dependencies

| Library | Version | CDN |
|---|---|---|
| Chart.js | 4.4.0 | `cdn.jsdelivr.net/npm/chart.js@4.4.0` |
| Google Fonts (Inter) | — | `fonts.googleapis.com` |

Both are loaded via CDN in each HTML file. For offline use, download and reference locally.

---

## Deployment

Since every file is static HTML, deployment is trivial:

- **GitHub Pages**: Push to `main`, enable Pages in repo settings, point to root.
- **Netlify / Vercel**: Drag the folder into the dashboard — done.
- **Local file system**: Open `index.html` directly in any browser.
- **SharePoint / Teams**: Upload the folder and link to `index.html`.
- **Intranet server**: Drop into any web-accessible directory.

---

*Built for capital project management across advanced manufacturing, higher education, life sciences, and healthcare sectors.*
