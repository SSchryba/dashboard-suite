# 📊 Capital Projects Dashboard Suite

> A complete HTML data dashboard architecture for capital project management — zero dependencies, pure HTML/CSS/JS, no build step required.

[![Dashboards](https://img.shields.io/badge/Dashboards-6-2f81f7)](#dashboards)
[![Templates](https://img.shields.io/badge/Templates-2-3fb950)](#templates)
[![Chart.js](https://img.shields.io/badge/Charts-Chart.js_4.4-a371f7)](https://www.chartjs.org/)
[![License](https://img.shields.io/badge/License-MIT-d29922)](#)

---

## Dashboards

| Dashboard | Key Features |
|---|---|
| [KPI Overview](dashboards/kpi-overview/index.html) | Portfolio health, SPI, budget variance, at-risk summary |
| [Project Portfolio](dashboards/project-portfolio/index.html) | Searchable register, status/sector filters, CSV export |
| [Schedule & Milestones](dashboards/schedule-milestones/index.html) | HTML Gantt, milestone countdown, SPI by project |
| [Budget Tracker](dashboards/budget-tracker/index.html) | S-curve, CPI, variance table, contingency tracking |
| [Construction Progress](dashboards/construction-progress/index.html) | Phase completion, inspections, workforce, weekly progress |
| [Facility Systems](dashboards/facility-systems/index.html) | Live MEP monitoring, cleanroom metrics, Cx checklist |

## Quick Start

```bash
git clone https://github.com/SSchryba/dashboard-suite.git
open dashboard-suite/index.html
```

No `npm install`. No build step. Works offline.

## Create a New Dashboard

```bash
cp templates/blank.html dashboards/my-dashboard/index.html
# Edit the file, open in browser — done.
```

## Documentation

- [README](docs/README.md) — Full feature overview and deployment guide
- [HOW-TO-USE](docs/HOW-TO-USE.md) — Step-by-step dashboard builder guide
- [ARCHITECTURE](docs/ARCHITECTURE.md) — Technical design and component reference

## Stack

- **Styling:** Custom CSS design system (dark theme, CSS variables)
- **Charts:** [Chart.js 4.4](https://www.chartjs.org/) via CDN
- **Fonts:** [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts
- **Backend:** None required

---

*Built for capital project management across advanced manufacturing (ASML, Cytiva), higher education (Harvard Medical), life sciences, and healthcare sectors.*
