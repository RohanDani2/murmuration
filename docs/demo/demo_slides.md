# Demo slides — markdown mirror

> VSCode-readable mirror of `demo_slides.html`. The HTML is the canonical version for stage (Reveal.js, fullscreen). This file is for editing comfort and review. Keep them in sync if you change one — they're tiny.
>
> Single cold-open slide. Demo is the rest. See `demo_flow.md` for the 5-min script and `criteria.md` for the rubric mapping.
>
> **Built against dev-cs codebase** — slide content reflects the live-agent + topology-healer + tiered-router architecture, not nictopia's frontend-only prototype.

---

## Slide 1 · Cold open  (~30s, hard cap 40s)

> SCSP Hackathon · Electric Grid Optimization

# Murmuration

### A protocol — and two live agents — for the grid and the AI compute fleet to negotiate flexibility under stress

| Beat | What you'll see |
|---|---|
| **NEED** | Grid stress detected. Live `GridStateUpdate` stream from EIA-930 + gridstatus. Real `DispatchRequest` fires on the bilateral bus. |
| **DISPATCH** | Compute fleet's standing `FlexibilityEnvelope` auto-accepts. `TelemetryFrame` streams. VPP swarm joins on the same wire format, six orders of magnitude smaller. |
| **SELF-HEAL** | Substation drops. Anomaly detector fires (`ContingencyAlert`). Topology healer reroutes. Workload router fails over to sibling AZs. None of it scripted. |
| **PROTECT** | Critical load held. Peakers stayed cold. Settled at envelope rate. |

*Two real scenarios · One protocol · Two live Claude-narrated agents · Anchored to actual archived events*

### Speaker notes

**Hook line — lock one before stage:**
- A: "The grid and the AI compute fleet need to start talking. We built the protocol — and the agents that speak it."
- B: "Heat waves, line trips, ramps — the grid keeps breaking. Meanwhile a million flexible loads sit idle. We built the wire format that lets them coordinate."

**Then in order, fast:**
1. Names + SCSP Grid track (5s).
2. "Two real-world scenarios, one protocol, two real Python agents on a bilateral bus, anchored to actual archived events."
3. Switch to the live app at `http://127.0.0.1:8765/`. **3D Globe tab** by default. Don't linger on the slide.

**Watch the clock:** target 30s, hard cap 40s. If you're still on this slide at 0:45, you've already eaten into the demo.

---

## Why only one slide

- 5-min budget is unforgiving — every slide-second is a demo-second lost.
- Problem framing ("grid stress is up, flexibility is idle") is *spoken* during the transition, not shown.
- No closing slide either. Beat 4 closes inside the live app — the protocol on screen is the closing visual. (If you want a slide-style close, switch to the **Story tab** in the live app — it's a presentation-grade walkthrough.)
- The previous "Problem" and "Arc" slides from this deck are folded into either (a) speaker delivery during this slide or (b) the live app itself.

If on stage you find you have unexpected extra time, do **not** add a slide — extend the PJM Loudoun walk-through (it has the most depth) or queue CAISO surplus solar as the optional third scenario. See `demo_flow.md` § "What we deliberately cut".
