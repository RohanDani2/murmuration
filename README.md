# Murmuration
**SCSP AI Hackathon DC** — Distributed Grid Intelligence Platform

A minimal interactive prototype demonstrating heuristic-based energy grid coordination across regional nodes and household battery reserves.

---

## Quick Start

```bash
git clone https://github.com/enturesting/murmuration.git
cd murmuration
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

> **Requirements:** Node.js ≥ 18, npm ≥ 9

---

## How to Use

1. **Select a scenario** from the header buttons
2. Click **⚡ Trigger Grid Stress Event** to run the simulation
3. Watch the network graph animate through phases, the event log fill in, and the metrics panel update
4. Click **↺ Reset** to run again or switch scenarios

---

## Scenarios

### Normal Operations
Baseline grid status check. All three nodes operating within capacity. Shows a routine load-balancing pass with green confirmations.

### Texas Demand Spike *(default)*
A summer heat wave causes a sudden demand surge in Texas:
- **Phase 1** — Texas load hits 97% (overload alert)
- **Phase 2** — Virginia transfers 850 MW; Texas drops to 88%
- **Phase 3** — Household Reserve Pool dispatches 320 MW; Texas drops to 76%
- **Phase 4** — Grid stabilises at 74%; critical loads protected

### Outage Emergency
Major transmission line failure triggers a blackout event in Texas:
- **Phase 1** — Texas goes offline (controlled blackout)
- **Phase 2** — Virginia overloads at 93% absorbing rerouted demand
- **Phase 3** — Reserve Pool emergency dispatch of 480 MW
- **Phase 4** — Texas partial restoration to 38% (critical infrastructure first)
- **Phase 5** — Full stabilisation: Texas 62%, Virginia 68%

---

## Stack

| Tool | Version | Purpose |
|------|---------|---------|
| [Vite](https://vite.dev/) | 8.x | Build tool / dev server |
| [React](https://react.dev/) | 19.x | UI framework |
| [TypeScript](https://www.typescriptlang.org/) | 6.x | Type safety |
| [@xyflow/react](https://reactflow.dev/) | 12.x | Interactive network graph |
| [Tailwind CSS](https://tailwindcss.com/) | 4.x | Styling |

---

## Project Structure

```
src/
├── scenarios.ts   # All scenario data: phases, node/edge updates, log messages
├── App.tsx        # Main UI: graph, scenario selector, metrics, event log
├── App.css        # Animations (pulse-red, pulse-green for node states)
├── index.css      # Global reset and base styles
└── main.tsx       # React entry point
```

### Key Concepts

**Scenarios** are defined as data in `scenarios.ts`. Each scenario has an array of `ScenarioPhase` objects with:
- `delayMs` — when the phase fires relative to trigger
- `logs` — messages appended to the event log
- `nodeUpdates` — node status/load patches
- `edgeUpdates` — edge animation/label/colour patches
- `metricsUpdate` — metric value updates

To add a new scenario: add an entry to the `SCENARIOS` array in `scenarios.ts`. No changes to `App.tsx` needed.

---

## Other Commands

```bash
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
npm run lint      # ESLint
```

---

## Notes

- All data is **hardcoded mock data** — no backend, no auth, no database
- Grid logic is **heuristic** — no real electrical modelling
- Built for a 24-hour hackathon demo (MVP1)
