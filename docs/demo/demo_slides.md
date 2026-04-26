# Demo slides — markdown mirror

> VSCode-readable mirror of `demo_slides.html`. The HTML is the canonical version for stage (Reveal.js, fullscreen). This file is for editing comfort and review. Keep them in sync if you change one — they're tiny.
>
> Single cold-open slide. Demo is the rest. See `demo_flow.md` for the 5-min script and `criteria.md` for the rubric mapping.

---

## Slide 1 · Cold open  (~30s, hard cap 40s)

> SCSP Hackathon · Electric Grid Optimization

# Murmuration

### A protocol for the grid and the AI compute fleet to negotiate flexibility under stress

| Beat | What happens |
|---|---|
| **NEED** | Grid stress detected. Headroom drop, LMP spike. Grid agent emits a `DispatchRequest`. |
| **SOURCE** | Compute fleet's standing envelope auto-accepts. Workloads migrate within band. |
| **ROUTE** | VPP swarm commits MW on the same protocol — six orders of magnitude smaller. |
| **PROTECT** | Critical load held. Peakers stayed cold. Settled at envelope rate. |

*Two real scenarios · One protocol · Anchored to actual archived events*

### Speaker notes

**Hook line — lock one before stage:**
- A: "The grid and the AI compute fleet need to start talking. We built the protocol."
- B: "Heat waves, wildfires, ramps — the grid keeps breaking. Meanwhile a million flexible loads sit idle."

**Then in order, fast:**
1. Names + SCSP Grid track (5s).
2. "Two real-world scenarios, one protocol, anchored to actual archived events."
3. Switch to the live app at `http://localhost:5173/`. Don't linger on the slide.

**Watch the clock:** target 30s, hard cap 40s. If you're still on this slide at 0:45, you've already eaten into the demo.

---

## Why only one slide

- 5-min budget is unforgiving — every slide-second is a demo-second lost.
- Problem framing ("grid stress is up, flexibility is idle") is *spoken* during the transition, not shown.
- No closing slide either. Beat 4 closes inside the live app — the protocol on screen is the closing visual.
- The previous "Problem" and "Arc" slides from this deck are folded into either (a) speaker delivery during this slide or (b) the live app itself.

If on stage you find you have unexpected extra time, do **not** add a slide — extend the duck-curve walk-through or queue PSPS as the optional third scenario. See `demo_flow.md` § "What we deliberately cut".
