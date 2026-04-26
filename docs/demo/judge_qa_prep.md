# Judge Q&A prep — hard-question defenses

> Companion to `demo_flow.md`. The Q&A section there covers the easy questions. This doc handles the **hard** ones — the questions a smart judge or technical SME will actually ask, and the strongest honest answers we have.
>
> Rule for everyone on stage: **never overclaim.** "Would have softened" beats "would have prevented." The grid is real and people have died in these incidents (Uri = 246 deaths). Conservative, precise language is also the most credible language.
>
> **Each answer is tagged for the judge it most directly serves:** `[McGee]` (operational realism — control room, dispatch, failure modes), `[Barati]` (model correctness — assumptions, system dynamics, measurable response), `[Both]` (lands for either lens). The full judge framing is in `criteria.md` § "Reading the judges".

---

## Reading the room — judge cheat sheet

| Judge | Lens | Tell |
|---|---|---|
| **Monty McGee** | "Could this run in a control room tomorrow?" | Cares about dispatch timing, fallback, capacity, FERC/NERC reality. |
| **Dr. Masoud Barati** | "Is the simplified model valid?" | Cares about cause→effect, assumptions, before/after metrics, feedback loops. |

**Default reflex when a question lands:**
1. Identify which judge framing it fits (or both).
2. Lead with the answer in *their* language: McGee → operational steps; Barati → causal chain + measurable delta.
3. End by volunteering one limit. Both judges reward honest scoping more than confident overreach.

If you don't know which judge asked: assume Barati if the question contains words like "model," "assume," "valid," "data." Assume McGee for "deploy," "operator," "fail," "real."

---

## The killer question

### "Where's the AI? This looks like a deterministic simulation."  `[Both]`

**The honest answer:** "You're right that today's playback path is deterministic — and that's deliberate. The thesis of the protocol is that the LLM writes the standing envelope offline, and dispatch within the envelope is auto-accepted with no LLM round-trip. That's how response times stay under 30 seconds instead of minutes, and how an ISO can trust the loop. The LLM lives one layer up — translating operator intent into the standing offer."

**Then pivot to whichever of these is true at demo time:**

- *If the live FlexibilityEnvelope writer (B1 in `todo_list.md`) is shipped:* "Let me show you. I'll type a constraint here…" — type a sentence, watch Claude produce the JSON envelope, see it land on the bus.
- *If the LLM-written AAR (B2) is shipped:* "After we run the scenario, watch this." — generate the AAR live and scroll through it.
- *If neither is shipped:* "The protocol design is in `docs/murmuration_diagram.md`. We chose to make the demo bulletproof and offline-safe before adding the LLM lever — but the architecture supports it cleanly via a single new file at `src/lib/llm.ts`. Happy to walk through the integration point."

**Don't say:** "We ran out of time." Even if true. Frame it as a deliberate sequencing choice.

---

## The data integrity questions

### "Is this real data, or did you just make up numbers that look right?"  `[Barati]`

The cached JSONs in `public/cache/` are real EIA-930 and gridstatus.io pulls — `scripts/fetch_eia.py` and `scripts/fetch_historical.py` are runnable and reproducible (with `EIA_KEY` set). EPA eGRID and IPCC carbon factors are embedded in the fetch script for the CO₂ math. Show the script if pressed.

The **MW dispatch numbers** in each scenario (850 MW migration, 320 MW VPP) are *conservative estimates* of what real campuses and aggregators could commit, anchored to published numbers in the LBNL US Data Center Energy Report. Be explicit that these are scenario inputs, not claims about a specific facility.

### "Show me the citation for [specific number]."  `[Barati]`

The README's `## What's modeled vs. what's playback` section is the cheat sheet. If asked for a specific incident number:
- Uri (246 deaths, $130B): FERC/NERC joint Inquiry into Bulk Power System Operations During February 2021 Cold Weather Event (published Nov 2021).
- PSPS (~800K customers de-energized Oct 9 2019): PG&E press releases + CPUC PSPS reports.
- Duck-curve LMP range -$51.56 to +$61.42 on Apr 15, 2024: gridstatus.io archive, included as `public/cache/historical/caiso_duck_2024_04_15.json`.

**Known gap:** `demo_flow.md` line 119 references `docs/calibration.md` which doesn't exist yet. If asked, point at the fetch scripts and the README's data section instead.

---

## The "why is this hard?" questions

### "Couldn't a hyperscaler just buy peakers and not bother with this?"  `[McGee]`

Three reasons the math doesn't work:
1. **Capital lock-in for an event you might not have.** A 200 MW peaker is ~$200M+ capex for an asset that runs <5% of the year. Standing envelopes monetize the same flexibility with zero new capex.
2. **CO₂.** Peakers are gas turbines at ~430 g/kWh. Migrating 850 MW of training to a clean-grid region during a heat wave is what the eGRID math in our scenarios actually scores.
3. **Permitting.** Adding peaker capacity in NoVA or Dallas runs into multi-year siting fights. Software contracts ship in months.

### "How is this different from existing demand response programs?"  `[McGee]`

Existing DR is per-utility, per-program, with phone-tree dispatch and per-event opt-in. Standing envelopes are: standing (no per-event approval), bilateral (one channel per pair, not per program), telemetric (TelemetryFrame messages stream during dispatch), and settled at the envelope rate. The "one schema, every scale" claim — same envelope works for a 200 MW DC and a 5 kW home battery — is what no existing DR program does.

### "Why won't FERC / NERC / the ISO governance process kill this in committee?"  `[McGee]`

The bilateral framing is a deliberate move around the multi-year tariff filing problem. An ISO can pilot bilateral coordination contracts with a single hyperscaler without rewriting the wholesale market. CAISO's existing Demand Response Auction Mechanism and PJM's Capacity Performance products are precedent for bilateral standing offers. We're not asking FERC for a new market — we're proposing a wire format two existing market participants can agree to use.

---

## The threat-model questions

### "What stops a bad actor from sending fake `DispatchRequest` messages?"  `[McGee]`

The bus is bilateral, not broadcast — each channel is between exactly two named parties (e.g., CAISO ↔ DigitalRealty-SF). Same trust model as the ISO ↔ market-participant channels that exist today. Envelopes are signed; payloads are opaque to anyone outside the channel. We're not proposing new cryptography — we're using what bilateral wholesale markets already deploy.

### "What about a state actor compromising a hyperscaler's compute-side agent and using it to attack the grid?"  `[McGee]`

The dispatch path is bounded by the standing envelope. Even a compromised compute agent can only commit *up to* what its envelope allows, for the duration the envelope allows. The blast radius of a compromised endpoint is the envelope's MW-minutes — not unbounded grid manipulation. The ISO-side agent always has the right to revoke any envelope at any time.

This isn't a complete answer (an envelope of 200 MW can still cause harm), but it's the right architecture: envelopes are circuit breakers, not blank checks.

### "Why should an ISO trust an LLM in the loop?"  `[Both]`

The LLM is **not in the loop**. It writes the standing envelope at intake (where the operator has time to review), and the dispatch path is then deterministic auto-accept within band. An LLM hallucinating an envelope is caught at intake by the operator. An LLM hallucinating mid-dispatch is impossible because no LLM is mid-dispatch.

---

## The scope questions

### "Is this a full solution or a wedge?"  `[Both]`

A wedge. Specifically: a coordination protocol between three constituencies (grid, compute, DERs) that today have no common wire. We don't claim to solve generation adequacy, transmission queue reform, or interconnection. We claim that adding a standing-envelope protocol on top of the existing wholesale market unlocks ~hundreds of MW of latent flexibility per major BA without new generation or new permitting.

### "How does this scale beyond a hackathon demo?"  `[McGee]`

The scaling story has three layers:
1. **Pilot:** one ISO + one hyperscaler campus + one VPP aggregator. ~12-month deployment, no new market rules.
2. **Region:** all hyperscaler campuses in one BA opt in. ~24 months.
3. **Continental:** the wire format becomes a NAESB or NIST standard. Multi-year, but doesn't block earlier value.

### "What happens when this fails — a campus opts out mid-dispatch?"  `[McGee]`

The TelemetryFrame stream is per-second. The ISO sees commitment vs. delivery in real time. Failure to deliver triggers envelope revocation and falls back to the existing peaker / curtailment / blackout response — i.e., the worst case is exactly today's status quo. The protocol is strictly additive.

---

## The honest-limit questions

### "What can your demo NOT do that real grid coordination would need?"  `[Barati]`

Strongest answer is to volunteer the limits before they're pulled out of us:
- No real-time live-data path during demo (offline-safe by design).
- VPP dispatch is modeled as 100% acceptance — real VPPs have opt-outs and constraint violations we don't model.
- No actual scheduling logic on the compute side — we show the migration happening, we don't run a real workload scheduler.
- No frequency / voltage / reactive-power modeling. The protocol talks MW; real grid stability talks Hz and VAR.
- No model of communication failure or latency between the bus and the agents.

### "What would a v1 of this look like in production?"  `[Both]`

- Add the LLM envelope writer for real (the B1 candidate in `todo_list.md`).
- Replace the deterministic playback with a real workload scheduler on the compute side that knows which jobs are checkpointable and which aren't.
- Build a real signing / cert layer for the bus messages.
- Cross-reference each DispatchRequest against the operator's existing day-ahead schedule to avoid double-commitment.
- Add the missing physics layers (Hz, VAR) for grid-side ack credibility.

We chose the protocol design as the contribution because everything above is engineering work that requires the protocol to exist first.

---

## If we're stumped

- "That's a great question. Honestly we haven't modeled that — let me get back to you." Better than a wrong answer. Judges respect technical honesty more than they reward bluffing.
- Defer to the docs: `docs/murmuration_diagram.md` for the protocol spine, `docs/reference/electric_travel.md` for the grid physics, README "What's modeled vs playback" section for the data integrity story.
