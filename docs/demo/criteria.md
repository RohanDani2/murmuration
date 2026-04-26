# Judging criteria — cheat sheet

> One-page reference for stage. Maps the SCSP rubric (4 × 25%) and the two grid-track judges (McGee, Barati) onto the beats of `demo_flow.md` and the answers in `judge_qa_prep.md`.
>
> Use this when (a) deciding what to emphasize live, (b) answering "which rubric dimension is your strongest?" and (c) sanity-checking that every beat is earning at least one rubric point.

---

## The rubric

| Dimension | Weight | What it really asks |
|---|---|---|
| **Novelty of Approach** | 25% | Did we challenge convention or just rebuild it? |
| **Technical Difficulty** | 25% | Is this beyond off-the-shelf? |
| **Potential National Impact** | 25% | Could this scale and matter at country-scale? |
| **Problem-Solution Fit** | 25% | Do we actually understand the user, and does the build address their real need? |

---

## Where each dimension is won (and lost)

### Novelty (25%)
- **Won by:** the *standing envelope* framing. Existing DR is per-event, per-program, phone-tree. Envelopes are standing, bilateral, telemetric, schema-identical at every scale.
- **Lost by:** sounding like "AI optimizes demand response" — that's a thousand startups. Be specific that the contribution is a *protocol*, a *wire format*, not an optimizer.
- **Stage line:** "One schema, every scale. 200 MW data center to 5 kW home battery, same envelope."

### Technical Difficulty (25%)
- **Won by:** showing the **bilateral bus + telemetric ack** during dispatch. Real EIA-930 + gridstatus.io data behind the numbers. CO₂ math from EPA eGRID. Two-agent negotiation, not a single optimizer.
- **Lost by:** the deterministic-playback critique (see `judge_qa_prep.md` "Where's the AI?"). Pre-empt by naming the LLM's role: it writes the envelope offline, dispatch is auto-accept within band — that's the design, not a shortcut.
- **Stage line:** "These numbers come from a real ERCOT archive. The fetch script is in the repo."

### Potential National Impact (25%)
- **Won by:** anchoring each scenario to a real incident with measurable consequence. Uri (246 deaths, $130B). PSPS (800K customers). Duck curve (~800 GWh curtailed/yr in CAISO).
- **Lost by:** absolutist claims ("would have prevented Uri"). Use **"would have softened"** / **"X% of"**. Honest concession is more credible than bravado.
- **Stage line:** "We don't claim to prevent these. We claim a measurable supplement that costs zero new generation."

### Problem-Solution Fit (25%)
- **Won by:** speaking the language of the people who'd actually deploy this. Operator personas, dispatch timing, settlement, fallback when an envelope under-delivers. This is **the McGee + Barati battle** (see below).
- **Lost by:** abstract "AI agent coordinates everything" framing with no operational grounding.
- **Stage line:** "Today the operator's tools are peakers, curtailment, and brownouts. We add a fourth."

---

## Reading the judges

### Monty McGee — operational realism
- **What he wants:** "could this run in a control room tomorrow?" Cares about dispatch timing, capacity limits, transmission, failure modes, regulatory reality.
- **Frame answers as:** "An operator sees X on their screen → emits Y → gets ack in Z seconds → falls back to W if delivery is short."
- **Strongest demo moments for him:** the <30s dispatch claim, the bilateral framing as an existing FERC/NERC-compatible pattern (DR Auction Mechanism, Capacity Performance), the explicit fallback story.
- **Avoid:** "AI optimizes everything" / "the agent decides." He hears that as hand-waving.

### Dr. Masoud Barati — model correctness
- **What he wants:** "is the simplified model valid?" Cares about cause→effect, feedback loops, what's simulated vs. real, measurable system response.
- **Frame answers as:** "Demand spike → headroom drop → envelope dispatch → frequency held → settlement at envelope rate." A clean causal chain.
- **Strongest demo moments for him:** explicit before/after metrics in the WITH/WITHOUT toggle, the duck-curve scenario showing bidirectional system dynamics (compute leans in, then flips), the volunteered limits in the "honest-limit questions" section.
- **Avoid:** opaque numbers without provenance. He'll ask for the citation; have it ready (see `judge_qa_prep.md` data-integrity section).

### Both judges, in one sentence
> Look like a grid control system (McGee). Behave like a valid simplified power system (Barati). Show clear before/after improvement (both). Be understandable in under 2–3 minutes (both).

---

## Beat → rubric coverage check

If any rubric dimension has zero coverage, fix the demo, not the rubric.

| Beat | Novelty | Tech Diff | Impact | Fit |
|---|:---:|:---:|:---:|:---:|
| Cold open slide | ✓ (name the protocol) | — | ✓ (state the stakes) | ✓ (name the user) |
| ERCOT heat wave | ✓ (envelope on stage) | ✓ (bus + telemetry visible) | ✓ (Uri anchor) | ✓ (operator language) |
| Duck curve | ✓ (bidirectional schema) | ✓ (CO₂ + LMP math) | ✓ (CAISO curtailment $) | ✓ (system feedback) |
| Live close | — | — | ✓ (pilot ask) | ✓ (CTA = real users) |

Every column has at least two ✓. If you cut a scenario on the fly, recheck this table — don't lose your only Novelty hit.

---

## If a judge asks "which dimension is your strongest?"

> "Honestly — Problem-Solution Fit, because we built the protocol that the operators we talked to said was missing. Novelty is close behind because the standing-envelope wire format doesn't exist today. Technical difficulty and impact are real but easier to claim than to prove in five minutes."

This is humble, accurate, and steers them toward the dimensions where we have the strongest evidence.
