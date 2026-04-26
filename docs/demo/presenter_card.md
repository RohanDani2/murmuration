# Presenter card — 5-min demo (printable / phone-readable)

> Compressed from `demo_flow.md`. Spoken words in normal text. **STAGE DIRECTIONS in bold.** Bracketed `[~Xs]` is your time budget for that block.
>
> Hook: lock A or B before stage. Strike the loser.
> Watch the session clock — if you're at **2:30 entering Beat 3**, trim setup. If you're at **4:00 entering Beat 4**, cut close to 30s flat and stop.

---

## Beat 1 · Cold open  [~30s · cap 40s]

**[SLIDE UP — `demo_slides.html`]**

> **HOOK A:** "The grid and the AI compute fleet need to start talking. We built the protocol — and the agents that speak it."
>
> **HOOK B:** "Heat waves, line trips, ramps — the grid keeps breaking. Meanwhile a million flexible loads sit idle. We built the wire format that lets them coordinate."

"I'm \_\_\_\_\_, this is Murmuration, SCSP Grid track. **[~5s]**"

"What you'll see: two real-world scenarios, one protocol, two real Python agents on a bilateral bus, anchored to actual archived events."

**[CLOSE SLIDE → SWITCH TO http://127.0.0.1:8765/ · 3D GLOBE TAB]**

---

## Beat 2 · Texas heat wave  [~1:45 · cap 2:00]

**[CLICK "Texas heat wave" in side panel]**

### Stress hits  [~25s]
"HOU_HUB LMP just spiked to **$410**. Real ERCOT scenario override fed into the live tick loop."

**[POINT AT bus feed right rail]** "GridStateUpdate ticking — and there's the **DispatchRequest** firing on the bus."

### Compute responds  [~30s]
"The compute fleet's standing **FlexibilityEnvelope** is already on file. Auto-accept within band."

**[WATCH FOR DispatchAck within ~2s, then TelemetryFrame streaming]**
**[GLOBE: arc fires from ERCOT to a sibling region]**

> **PRE-EMPT THE LLM QUESTION:** "Dispatch path is deterministic by design — that's why it lands in seconds, not minutes. Where's the LLM? It writes the *envelope* offline, and **narrates this scenario live in the agent-chatter feed below.**"

### VPP swarm joins  [~30s]
**[GLOBE: smaller arc fans from Bay Area VPP centroid]**

"Same FlexibilityEnvelope schema, **six orders of magnitude smaller**. One wire format from data center to home battery. The protocol scales."

### Honest counterfactual  [~20s]
"We don't claim Murmuration would have prevented Uri. We claim it would have **softened it**. The 4.5 million customers who lost power were the consequence of zero coordination across the bilateral interface. **This is the coordination.**"

**[POINT AT metrics: MW-min relief · $ paid · tCO₂ avoided]**

---

## Beat 3 · PJM Loudoun self-healing  [~1:45 · cap 2:00]   ★ this is the standout

**[RESET previous scenario → CLICK "PJM Loudoun substation overload"]**

### Outage triggers  [~25s]
"Loudoun substation supplying **DC-VA-1a** just saturated. The AZ goes dark."

**[GLOBE: DC-VA-1a marker dims to gray. PURPLE FLASH = ContingencyAlert from anomaly detector]**

"The detector is a **rolling z-score** on the live GridStateUpdate — 4σ threshold. **No scripting** — the math fired it."

### Topology healer responds  [~25s]
**[BUS FEED: green flag "Self-healing · TX-EDGE-12 rerouted"]**

"TopologyHealer marks the failed edge in the networkx graph, runs **K-shortest alternate paths**, publishes TopologyReconfigure. An ISO operator sees this exact pattern in their EMS today — we're showing the protocol that lets compute react without phone-tree coordination."

### Workload router · tier 1  [~30s]
**[GLOBE: short cyan arcs flash WITHIN NoVA cluster — sibling-AZ failover]**

"WorkloadRouter Tier 1 routes stranded jobs to **sibling AZs** DC-VA-1b and DC-VA-1c. Sub-millisecond latency. **No data migration. No cross-region fired** — sibling AZs had headroom. That's exactly what an actual cloud scheduler does."

### The pitch  [~25s]
"Three things just happened automatically: anomaly detector caught it, topology healer rerouted, workload router picked the cheapest fix. **No human in the loop. None of it scripted.** The scenario only said 'mark DC-VA-1a unavailable.' The protocol did the rest."

---

## Beat 4 · Live close  [~30s · cap 40s]

**[STAY ON GLOBE — or switch to STORY TAB for slide-style close]**

"LLMs can read operator intent and **write standing envelopes** — and stay out of the dispatch path. Live agents on each side, narrating in plain English. **That's the unlock.** [~10s]"

"We want a **pilot**. One ISO, one hyperscaler campus, one VPP aggregator. 12 months. **No new market rules required.** [~10s]"

"Happy to take questions. Seven other scenarios — surplus solar, polar vortex, line-trip contingency, carbon arbitrage, eclipse — all loaded if you want to see them. [~10s]"

---

## 🆘 Recovery cards

| If… | Do this |
|---|---|
| Globe doesn't render (WebGL) | Switch to **Flat Map** tab — same data, simpler renderer |
| Live ISO data times out | Keep going — simulator continues on cached snapshots |
| You're at 4:00 entering Beat 4 | Cut to one line: "We want a pilot — one ISO, one hyperscaler, one VPP. Questions?" |
| You're past 5:00 | **STOP TALKING.** Hand to Q&A. The clock matters more than the close. |
| Backup needed | `docs/demo/backup_video.mp4` open in another tab |

## 🎯 The 3 Q&A answers worth memorizing

> Full set: `judge_qa_prep.md`

1. **"Where's the AI?"** — Live Claude narrator + real anomaly detector + real topology healer. The dispatch path is deterministic *by design* (latency); the LLM writes envelopes offline and narrates live.
2. **"Tell me about the self-healing."** — Walk Beat 3 again, slower: 4σ z-score detector → networkx K-shortest paths → tiered router (intra-AZ → cross-region → throttle).
3. **"How is this different from existing demand response?"** — DR is one-way, slow, opaque. Murmuration is bilateral (envelopes are publishable offers), millisecond-latency (deterministic dispatch), and scales from GW datacenters to kW home batteries on **one schema**.

---

## ⚙️ Pre-stage checklist (5 min before doors)

- [ ] `bash murmuration/run.sh` running, backend up at `http://127.0.0.1:8765/`
- [ ] Browser open · **3D Globe tab selected**
- [ ] Bus feed scrolling (proves tick loop is alive)
- [ ] Audio off (no notifications)
- [ ] Display mirroring tested
- [ ] Backup video open in another tab
- [ ] Hook A or B chosen, the other one struck from the slide
- [ ] Phone with this card visible

If any item isn't ready, **abort and run the backup video.**
