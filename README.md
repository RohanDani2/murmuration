# Murmuration

**SCSP AI Hackathon DC** - Distributed Grid Intelligence Platform

Murmuration is a small React/Vite/TypeScript prototype that demonstrates AI-assisted electric grid resilience. The MVP shows Texas entering a grid stress event, Virginia transferring surplus capacity, household and enterprise reserves dispatching energy, and critical services remaining protected.

## Quick Start

```bash
git clone https://github.com/enturesting/murmuration.git
cd murmuration
git checkout copilot/create-murmuration-prototype
npm install
npm run build
npm run dev
```

Open http://localhost:5173 in your browser.

Requirements: Node.js 18+ and npm 9+.

## Demo Flow

1. Click **Trigger Grid Stress Event**.
2. Confirm Texas changes from nominal to overloaded/warning/stable.
3. Confirm the Virginia -> Texas transfer changes from standby to 850 MW transfer.
4. Confirm distributed reserves dispatch 320 MW.
5. Confirm metrics update for overload avoided, reserve dispatched, and critical load protected.
6. Confirm the event log records each phase.
7. Click **Reset** before rerunning the demo.

## Project Structure

```text
src/
├── App.tsx                       # Coordinates prototype state and scenario playback
├── components/
│   ├── EventLog.tsx              # Event log panel
│   ├── GridGraph.tsx             # Demo-safe grid visualization
│   └── MetricsPanel.tsx          # MVP metrics
├── lib/
│   └── simulation.ts             # Hardcoded scenario data and initial state
├── types.ts                      # Shared TypeScript types
├── index.css                     # App styling
└── main.tsx                      # React entry point
```

## Notes

- All data is hardcoded mock data.
- There is no backend, auth, database, or real grid API integration.
- Grid logic is heuristic and intended for a hackathon demo, not electrical modeling.
- Priority is a working clickable demo over extra features.

## MVP2 Task List

- Add a second selectable outage scenario only after the stress demo is stable.
- Add a compact phase timeline so presenters can see where the demo is in the sequence.
- Add deterministic scenario reset/replay tests around `simulation.ts`.
- Improve mobile layout if the team expects to demo from a tablet.
- Replace placeholder copy with final hackathon narrative and numbers.
