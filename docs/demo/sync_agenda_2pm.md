# 2pm sync agenda — final mad-dash to 5pm submission

> Today, 2026-04-26. Drafted by Nic at ~1pm to make the team sync productive instead of meandering.
>
> Hard truth: **at 5pm we submit.** Anything not done by 4:45 doesn't ship. This page exists so we don't burn the 1hr sync on architecture debate.

---

## ✅ What's already done (don't relitigate)

- Demo runs locally on `dev-cs` at `http://127.0.0.1:8765/` — Python+FastAPI live tick loop, 9 scenarios, 3 UI views.
- `dev-na` branch ported the demo + reference docs and aligned them with `dev-cs` reality. **Open MR: `dev-na → dev-cs`** (docs-only, +1,536 lines, zero code changes).
- Hook line locked: **____** _(Nic to fill before 2pm)_
- Submission form text drafted: **____** _(Nic to fill before 2pm)_

## 🎯 3 decisions we need to lock by 2:15

1. **Final beat order.** Default proposal: **(1) Texas heat wave → (2) PJM Loudoun substation overload**. Both are dev-cs's strongest scenarios — Loudoun specifically exercises the `TopologyHealer` + tiered `WorkloadRouter` + `AnomalyDetector` (the "self-healing was never scripted" beat). Confirm or swap.
2. **Live ISO data vs cache-only.** Recommend cache-only — fewer demo-day variables. ERCOT live fetch hit SSL issues on Nic's machine; PJM has no API key.
3. **Live narrator (`ANTHROPIC_API_KEY`) vs rule-based fallback.** Recommend rule-based — deterministic output for stage. Live narrator stays a stretch goal if there's time at 4:15.

## ⚙️ Polish list — capped at 3 items, ≤30 min each

Pick 3 max. Anything bigger than 30 min is killed.

| Item | Effort | Owner | Why it matters |
|---|---|---|---|
| REAL DATA pulse badge w/ source URL | ~15 min | TBD | Anti-"is this fake?" — judges click through to FERC/EIA |
| Always-visible legend strip (Stress / Compute / VPP / Protected · Self-heal) | ~25 min | TBD | Solves "what do these lines mean" at a glance |
| Cause-effect label sweep ("850 MW REROUTED · scheduler shifts work") | ~30 min | TBD | Anti-grid-eye-roll — every label tells story |
| Click-to-advance flash banner port from nictopia | ~30 min | TBD | Demo-control: pauses tick until presenter dismisses |
| Per-BA stability gauge (control-room pip score) | ~25 min | TBD | Differentiator — looks pro |

## 👥 Work-split for 3pm–5pm

Four parallel tracks. Each owner reports done by the listed cutoff or escalates.

| Track | Owner | Done by |
|---|---|---|
| Record 5-min fallback video (clean run, no narration glitches) | TBD | 3:45 |
| Final visual polish (≤3 items above) | TBD | 4:00 |
| Presenter rehearsal — 2× full runs with watchers | TBD | 4:30 |
| Fill submission form, paste video link, push final commit | TBD | 4:45 |

**🛑 Hard freeze at 4:45.** No code, no docs, no commits after that. Submit at 4:55. Watch it land at 4:59.

## 🎤 Storytelling angles to lean into (presenter + submission text)

- "Two real Python agents, not a mock." Live narrator + real anomaly detector + real topology healer. Nobody else in the Grid track will have this.
- "Anchored to actual archived events." Texas Uri (Feb 2021), PJM Loudoun (2024). Specificity = credibility.
- "One protocol — six orders of magnitude." Datacenter (GW) and VPP (kW) on the same wire format. That's the thesis.
- "Self-healing was never scripted." Loudoun beat is the proof: AZ drops, sibling AZs absorb, narrator describes it live.

## 🚧 Out of scope for tonight (push back if anyone proposes these)

- New protocol message types
- Refactoring `MurmurationBus`
- Real-time live data fetch beyond what `gridstatus` already does
- Multi-user / auth / hosted deployment
- Counterfactual WITH/WITHOUT toggle (P4 in `todo_list.md` — nice-to-have, not tonight)

---

## Open questions for Shashank specifically

1. Does the **Story tab** walk the right narrative for our 2-scenario arc, or does it need rewiring? (`demo_flow.md` calls it out as a possible close-beat alternative.)
2. Any scenarios in the 9-pack that are dramatically more visual than the 2 we picked, that we should swap in?
3. Branching: dev-na = docs-only forever (option B) or ongoing personal branch with periodic per-feature MRs (option A)? Your repo, your call.
4. Polish ports — happy for me to own 1-2 of them in dev-na, then MR each as its own small PR?
