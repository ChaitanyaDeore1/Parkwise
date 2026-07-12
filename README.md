# ParkWise — 3D Smart Parking Analytics Dashboard

A premium, frontend-only SaaS dashboard for monitoring parking occupancy across airports,
malls, hospitals, universities, and smart cities — featuring a live 3D parking visualization,
real-time simulated data, and full analytics.

## Tech Stack

- React 19 + TypeScript + Vite
- React Three Fiber + Drei + postprocessing (3D scene, bloom)
- Zustand (state/store)
- Tailwind CSS v4
- Framer Motion (UI animation)
- Recharts (analytics charts)
- lucide-react (icons)

All data is realistic **mock data**, generated and simulated entirely on the client.
There is no backend — nothing to configure, no API keys, no server.

## Getting Started

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (typically `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
  components/
    Sidebar/        — left navigation
    Navbar/         — top bar: search, notifications, theme toggle, profile
    KPI/            — animated KPI cards
    Charts/         — Recharts-based analytics (line/bar/pie/area/heatmap)
    ParkingLot3D/   — React Three Fiber scene: spots, environment, moving vehicles
    SpotDetails/    — floating info panels for spots/vehicles
    Alerts/         — alerts panel with severity badges
    common/         — loading screen, filters, recent activity
  hooks/            — vehicle simulation loop
  store/            — Zustand store (spots, vehicles, KPIs, alerts, filters, theme)
  mock-data/        — mock data generators
  pages/            — Dashboard, Parking Lots, Analytics, Vehicles, Reports, Alerts, Settings
  utils/            — types + formatting helpers
```

## Features

- Live 3D isometric parking lot (instanced spots, moving vehicles, entry/exit gates, trees,
  street lights, EV bays) with click-to-inspect spot/vehicle detail panels
- KPI cards with animated counters
- Six analytics chart types: occupancy trend, hourly vehicle count, parking distribution,
  revenue trend, average duration, and a peak-hours heatmap
- Simulated live updates every few seconds (cars entering/leaving, spot status changes,
  new alerts)
- Filters (floor, spot type/status) and search (spot ID / vehicle number) that highlight
  matches in both the table and the 3D scene
- Alerts panel with severity badges and relative timestamps
- Reports page (daily / weekly / monthly summaries)
- Dark/light theme, persisted to `localStorage`

## Push to GitHub

This folder is not yet a git repository. From inside the project folder:

```bash
git init
git add .
git commit -m "Initial commit: ParkWise dashboard"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

Create the empty repository on GitHub first (no README/license, so there's no
merge conflict), then run the commands above.

## Notes

- No external network calls are made; all data is generated in-browser.
- Theme preference is the only thing persisted (via `localStorage`).
- This is a demonstration/portfolio-grade build. Everything here is original code —
  no proprietary assets, no third-party trademarked content.
