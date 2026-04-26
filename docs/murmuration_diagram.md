# Murmuration — Problem & Solution Diagrams

A visual companion to the parallel-work plan. Each diagram below frames a piece of the problem Murmuration is trying to solve, then the solution surface.

If a diagram below doesn't render, paste it into [mermaid.live](https://mermaid.live) — every block here is plain Mermaid.

---

## 1. The problem space — four converging pressures

The grid was not designed for the load shape, weather pattern, or asset mix it now faces. Four problems compound:

```mermaid
mindmap
  root((Grid stress<br/>era))
    Climate volatility
      Heat waves
      Wildfires + PSPS
      Hurricanes + ice storms
    AI compute boom
      Hyperscaler load
      Inflexible 24/7 draw
      NoVA / Dallas saturation
    Aging grid
      Long interconnect queues
      Peakers as default tool
      Slow capex cycles
    Underused flexibility
      VPPs sitting idle
      Home batteries
      EVs + smart thermostats
      No common protocol
```

---

## 2. What happens today during a stress event

The default response is some mix of three bad outcomes — peakers, curtailment, blackouts — while flexible loads sit on the sidelines because no signal reaches them.

```mermaid
flowchart TD
    A[Grid stress event<br/>heat / fire / ramp] --> B{Headroom OK?}
    B -- No --> C[Fire up gas peakers]
    B -- No --> D[Curtail wind + solar]
    B -- No --> E[Rolling blackouts]
    C --> F[CO₂ + ratepayer cost]
    D --> G[Wasted clean energy]
    E --> H[Hospitals · water · vulnerable people]
    A -.no signal.-> I[Data centers<br/>still drawing 100%]
    A -.no signal.-> J[VPPs · batteries · EVs<br/>idle or unused]

    style C fill:#5a1f1f,color:#fff
    style D fill:#5a1f1f,color:#fff
    style E fill:#5a1f1f,color:#fff
    style I fill:#3a3a3a,color:#bbb
    style J fill:#3a3a3a,color:#bbb
```

---

## 3. Why DERs alone haven't fixed it — the missing protocol

Distributed Energy Resources exist in the millions, but they aggregate to almost nothing in a real event because every dispatch path is bespoke.

```mermaid
flowchart TB
    DER[Distributed flexibility<br/>exists at scale today] --> M{Common protocol?}
    M -- No --> Bespoke[Bespoke contracts<br/>per utility · per program]
    M -- No --> Manual[Phone-tree dispatch<br/>human in every loop]
    M -- No --> Slow[Slow opt-in · slow telemetry]
    Bespoke --> Tiny[Aggregate response: tiny]
    Manual --> Tiny
    Slow --> Tiny
    Tiny --> Result[Stress event still hits<br/>peakers + blackouts]

    style Result fill:#5a1f1f,color:#fff
    style Tiny fill:#5a4a1f,color:#fff
```

---

## 4. Murmuration's intervention — the four-phase story

The demo plays a single arc — **need → source → route → protect** — across three different stress scenarios using the same protocol.

```mermaid
flowchart LR
    Need["NEED<br/>Grid stress detected<br/>LMP spike · headroom drops"]
        --> Source["SOURCE<br/>Compute throttles +<br/>jobs migrate to other BAs"]
    Source --> Route["ROUTE<br/>VPP swarm dispatches<br/>50K homes commit MW"]
    Route --> Protect["PROTECT<br/>Critical load held<br/>peakers stayed cold"]

    style Need fill:#5a3a1f,color:#fff
    style Source fill:#1f4a5a,color:#fff
    style Route fill:#1f5a4a,color:#fff
    style Protect fill:#2d5a3d,color:#fff
```

---

## 5. The bilateral protocol — how the two agents negotiate

Two agents (Grid-side ISO operator + Compute-side fleet ops) exchange typed messages on a shared bus. Standing **FlexibilityEnvelopes** mean dispatch is auto-accepted within band — no per-event human approval.

```mermaid
sequenceDiagram
    participant G as Grid Agent
    participant B as Bilateral Bus
    participant C as Compute Agent

    Note over G,C: Quiescent — envelopes refreshed every 5 min
    C->>B: FlexibilityEnvelope (130 MW down · 90 min · $280/MWh)
    B->>G: envelope refresh

    Note over G,C: Stress event
    G->>B: GridStateUpdate (LMP $410 · stress 0.86 · headroom 3.8%)
    B->>C: state delta
    G->>B: DispatchRequest (-850 MW · 90 min · reliability)
    B->>C: dispatch needed

    Note over C: within standing envelope<br/>auto-accept · no LLM round-trip
    C->>B: DispatchAck (accepted 850 MW · effective +12s)
    B->>G: relief committed

    loop every ~5s during dispatch
      C->>B: TelemetryFrame (actual MW · pf · queue)
      B->>G: telemetry
    end

    Note over G,C: Settlement at envelope rate<br/>opaque payload · bilateral channel
```

---

## 6. One protocol, every scale

The thesis: the **same** envelope schema fits a 200 MW data center and a 5 kW home battery without modification. Six orders of magnitude on a single wire.

```mermaid
flowchart LR
    P["FlexibilityEnvelope<br/>protocol"] --> A["200 MW data center<br/>training jobs throttle + migrate"]
    P --> B["50,000 home VPP<br/>batteries · thermostats · EVs"]
    P --> C["1 MW commercial site<br/>roof solar + storage"]
    P --> D["5 kW home battery<br/>single asset"]

    style P fill:#1a4d6e,color:#fff
```

---

## 7. The three demo scenarios

Three different physical events. Same protocol. Different asset mix per event.

```mermaid
flowchart TB
    M[Murmuration protocol] --> S1[ERCOT Heat Wave<br/>HOU_HUB LMP $32 → $410<br/>850 MW DC migration<br/>+ 320 MW VPP swarm]
    M --> S2[CAISO Wildfire / PSPS<br/>Bay Area de-energized<br/>700 MW DC out to ERCOT+PJM<br/>+ 280 MW local CA VPP]
    M --> S3[Duck Curve · CAISO 6pm<br/>900 MW absorbed midday<br/>900 MW released at sunset<br/>+ 510 MW VPP ramp shave]

    style M fill:#1a4d6e,color:#fff
```

---

## 8. Counterfactual framing — anchored to real incidents

Every "without Murmuration" claim must point to a real past event. The credibility win is being **conservative + precise** — "would have softened," not "would have prevented."

```mermaid
flowchart LR
    A[Real anchor incident<br/>e.g. Texas · Feb 2021 · Uri] --> WITHOUT
    A --> WITH

    subgraph WITHOUT["WITHOUT Murmuration · what happened"]
        W1[246 deaths]
        W2[~$130B damage]
        W3[$9000/MWh price cap hit]
        W4[Hospitals on diesel]
    end

    subgraph WITH["WITH Murmuration · honest claim"]
        T1[~1.2 GW DFW campuses<br/>shed in &lt;2s on standing envelope]
        T2[Critical-care load softened<br/>not eliminated]
        T3[Telemetry settlement<br/>at envelope rate]
    end

    style WITHOUT fill:#3a1a1a,color:#fff
    style WITH fill:#1a3a2d,color:#fff
```

---

## 9. Offline-safe data architecture

Hard rule from §11.4 of the brainstorm: the demo must work with the network unplugged. All "real data" credibility comes from **historical replay**, pre-fetched offline into JSON snapshots committed to the repo.

```mermaid
flowchart LR
    subgraph offline["Offline · pre-fetch (Python)"]
        G[gridstatus<br/>CAISO · ERCOT · PJM · MISO]
        E[EIA Open Data<br/>hourly fuel mix]
        N[NREL PVWatts / NSRDB<br/>solar profiles]
        O[CAISO OASIS<br/>archive ZIPs]
    end
    offline --> P[scripts/fetch_*.py<br/>run once · no key at runtime]
    P --> J["public/cache/historical/*.json<br/>committed to repo"]
    J --> R[React app · Vite build]
    R --> U[Demo runs fully offline]

    L[CAISO OASIS live<br/>optional · best-effort] -.fallback to cache.-> R

    style U fill:#2d5a3d,color:#fff
    style L fill:#3a3a3a,color:#bbb
```

---

## How these diagrams map to the parallel-work prompts

| Diagram | Prompts that build it |
|---|---|
| 1. Problem space | (framing only — no prompt) |
| 2. Today's failure mode | C2 (counterfactual) |
| 3. Missing protocol | (framing only) |
| 4. Four-phase story | already in `simulation.ts` (`story: need\|source\|route\|protect`) |
| 5. Bilateral protocol | `BusTicker.tsx` shows the wire JSON; **C1** adds the natural-language voices |
| 6. Every scale | already implicit in scenario data; reinforced by **C1** narration |
| 7. Three scenarios | already in `simulation.ts`; **A1** anchors them to real archived dates |
| 8. Counterfactual | **C2** + **D3** |
| 9. Data architecture | **A1** (gridstatus) · **A2** (EIA) · **A3** (cache layer) · **A5** (NREL) · **A1b** (live cherry) |
