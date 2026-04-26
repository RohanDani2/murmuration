# Open candidate work — pre-Sunday-5pm

> A scratch list of things that would visibly raise the project's score on the SCSP rubric. **Claim or skip.** If a teammate is already on one, cross it off and move on. Don't double up.
>
> Last touched: 2026-04-25, before the Sunday morning regroup.

---

## Why this list exists

The project today scores well on **Novelty**, **Problem-Solution Fit**, and **National Impact** (real historical anchors, honest grid-physics framing, polished globe demo). The thinnest leg of the rubric is **Technical Difficulty (25%)** because the bilateral protocol is currently **deterministic playback of hardcoded scenarios** — no LLM is in the critical path. A judge asking "where is the AI?" can today only be answered with "in the docs, not the code."

The candidates below are ordered by how directly they answer that question without breaking the demo or the offline-safe guarantee.

---

## Candidate B1 — Live FlexibilityEnvelope writer (RECOMMENDED)

**What:** A small "Operator Console" panel in the UI. The user types a natural-language constraint ("our DFW campus can shed 130 MW for up to 90 minutes between noon and 8pm, floor price $280/MWh, never below 35% utilization"). Claude generates a structured `FlexibilityEnvelope` JSON matching the schema in `BusTicker.tsx`, validates it, and posts it to the bus ticker as if it came from the compute-side agent.

**Why it answers "where's the AI?":** The LLM is doing exactly what the protocol design says it does — translating operator intent into a standing offer that the dispatch path then auto-accepts. It is *off* the critical real-time loop (which stays deterministic and fast, the actual thesis) but *on* a path the audience can see and trigger live. Honest to the design.

**Demo moment:** Beat 3 ("the protocol") becomes interactive. Instead of pointing at a sequence diagram, the presenter types one sentence and the envelope appears on the wire. ~10 seconds of stage time, very persuasive.

**Effort:** ~2-3 hrs.
- Add a textarea + "Submit envelope" button (one new component).
- Add `src/lib/llm.ts` — single Anthropic API call, returns parsed JSON or an error.
- Wire the result into the existing bus ticker as a new `FlexibilityEnvelope` message.
- Cache 2-3 prebuilt envelopes locally so the demo still works **offline** (the offline-safe rule from `electric_travel.md` is non-negotiable). When network is up, use Claude; when not, use the cache.

**Risk:** Low if cached fallback is wired. Medium-high if presenter relies on live API at the venue Wi-Fi.

**Cost of skipping:** A judge asks "where's the AI?" and the answer is doc-only.

---

## Candidate B2 — LLM-written After-Action Review

**What:** After a scenario completes, a "Generate AAR" button feeds the entire event log + bus message history + final metrics into Claude and gets back a structured debrief: what triggered, what worked, what the counterfactual cost would have been, what to tune in the standing envelopes for next time.

**Why it answers "where's the AI?":** Visible, on-screen LLM output produced from the data the audience just watched. Demonstrates the "LLM reads intent, stays out of the dispatch path" thesis from `demo_flow.md` Beat 6. The AAR is exactly the kind of post-event work an ISO operator does manually today.

**Demo moment:** Closes Beat 5 (counterfactual reveal) with a scrollable structured AAR that *the model wrote during the demo*, not a static slide.

**Effort:** ~2-3 hrs.
- Same `src/lib/llm.ts` as B1 (shared infra).
- Prompt template that takes `{phaseHistory, busMessages, metrics, scenario}` and returns markdown sections (Trigger / Response / Counterfactual / Tuning Recommendations).
- Render in a modal or sidebar after `complete: true`.
- Pre-generate AARs for all 3 scenarios as cached JSON for offline-safe fallback.

**Risk:** Lower than B1 because the AAR is post-event — failure just means a less polished modal, not a broken pitch.

**Cost of skipping:** Pitch closes on a static counterfactual instead of a live AI artifact.

---

## Candidate B3 — Red Cell adversarial scenario generator

**What:** A "Generate new stress event" button that asks Claude to combine signals from the unused cache files (`pjm_helene_2024_09_27.json`, `caiso_heatdome_2023_08_15.json`) and produce a new 4-phase scenario JSON in the same shape as the three hardcoded ones. The new scenario then plays through the existing playback engine.

**Why it answers "where's the AI?":** The LLM is generating *content* the audience hasn't seen before, in a doctrine-aware way (it has to respect what's plausible — VPP MW limits, regional asset mix, real LMP ranges from the cache).

**Demo moment:** Optional Beat 7 / "infinite scenarios" — closes the pitch with "every stress event is now playable, not just the three we anchored." Strong if it works.

**Effort:** ~4-5 hrs (highest of the three).
- Same shared `llm.ts`.
- A schema-validated prompt that constrains the LLM to produce a `Scenario` object. Validation is non-trivial — has to round-trip through `applyPhase()` without crashing.
- Pre-generate 2-3 valid examples as cache fallback.

**Risk:** High. Most likely to fail mid-demo if the model produces an invalid scenario shape. Easiest way to embarrass the team if rehearsal is rushed.

**Cost of skipping:** Lower than B1/B2 — this is more "wow" than "answers the rubric question."

---

## Other smaller wins (not LLM-related, low effort)

If a teammate has 30-60 min and the LLM lever is being handled, these are nice incremental finishes:

- **Render the real LMP series.** `caiso_duck_2024_04_15.json` has 96 real 15-minute LMP samples (range -$51.56 to +$61.42). Today the duck-curve scenario uses two hardcoded prices ($-12, $185). A small recharts inline sparkline that highlights the negative-LMP window the DC absorbs would replace those mocks with real data. Adds rubric points on Problem-Solution Fit. ~30 min.
- **Wire the heatdome and Helene cache files into 4th and 5th scenarios.** Both files are already on disk with metadata. Cloning the duck/PSPS scenario shape and swapping in the cached numbers takes ~45 min each, doubles the scenario library, and uses data that's just sitting unused.
- **Fix the broken citation in `demo_flow.md` line 119** — references `docs/calibration.md` which doesn't exist. Either create that doc with the source list or change the line to point at the actual sources (EIA-930, EPA eGRID, gridstatus archive). ~15 min.
- **Clean up the ambient bus ticker mock messages in `App.tsx` lines 46-77.** Right now, when no scenario is running, the ticker emits *random* GridStateUpdate / FlexibilityEnvelope messages every 3.5s — pure decoration. A judge inspecting the codebase will spot this. Either replace with values pulled from the EIA snapshot (cheap, more honest) or drop the ambient mode entirely.

---

## Out of scope for the remaining hours

- Real-time live data fetch during demo (offline-safe rule trumps this).
- Multi-user / auth / backend.
- Actual deployment to a hosted URL (judges run it locally per the README).
- New components in the bus protocol schema beyond what `types.ts` already declares.
