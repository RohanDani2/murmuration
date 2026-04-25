# Murmuration
**SCSP AI Hackathon DC** — Distributed Grid Intelligence Platform

An interactive prototype demonstrating heuristic-based energy grid coordination: regional transfers and household reserve dispatch during a simulated demand spike.

---

## Demo

Click **"⚡ Trigger Grid Stress Event"** to run a 4-phase simulation:

| Phase | Event |
|-------|-------|
| 1 | Texas demand spike — load hits 97% |
| 2 | Virginia transfers 850 MW to Texas |
| 3 | Household Reserve Pool dispatches 320 MW |
| 4 | Grid stabilises at 74% load |

The network graph animates in real-time and the Event Log + Metrics panel update as each phase completes.

---

## Stack

| Tool | Purpose |
|------|---------|
| [Vite](https://vite.dev/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) | App scaffold |
| [React Flow (`@xyflow/react`)](https://reactflow.dev/) | Interactive network graph |
| [Tailwind CSS](https://tailwindcss.com/) | Utility styling |

---

## Setup

### Prerequisites
- **Node.js** ≥ 18
- **npm** ≥ 9

### Install & run

```bash
# 1. Clone the repo
git clone https://github.com/enturesting/murmuration.git
cd murmuration

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open **http://localhost:5173** in your browser.

### Build for production

```bash
npm run build      # outputs to dist/
npm run preview    # locally preview the production build
```

---

## Project structure

```
src/
├── App.tsx        # Main application — graph, simulation logic, metrics, log
├── App.css        # App-level styles + animations
├── index.css      # Global reset + base styles
└── main.tsx       # React entry point
```

---

## Notes

- All data is **hardcoded mock data** — no backend, no authentication, no database.
- Grid logic is **heuristic** — no real electrical modelling.
- Reset the simulation with the **↺ Reset Simulation** button after the event completes.
