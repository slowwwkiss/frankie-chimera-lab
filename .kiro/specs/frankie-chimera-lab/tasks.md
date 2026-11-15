# Tasks — Frankie: The API Chimera Lab

Spec-driven task list. Check off as done; do not mark a task done until its
acceptance check passes.

## Phase 1 — Spec & steering (spec-driven Kiro methodology)
- [x] 1.1 Write `.kiro/specs/frankie-chimera-lab/requirements.md`
- [x] 1.2 Write `.kiro/specs/frankie-chimera-lab/design.md`
- [x] 1.3 Write `.kiro/specs/frankie-chimera-lab/tasks.md` (this file)
- [x] 1.4 Write `.kiro/steering/product.md`, `tech.md`, `structure.md`
- [x] 1.5 Write `.kiro/agents/dr-frankenstein.md` (custom agent)
- [x] 1.6 Write `.kiro/hooks/format-on-save.json` + `scripts/verify-app.sh`
      (hook target) and `.kiro/settings/mcp.json` (fetch MCP server)

## Phase 2 — Verify data sources (before any UI code)
- [x] 2.1 curl each candidate API: status 200 + `Access-Control-Allow-Origin: *`
      - PASS: Advice Slip, CoinGecko, JokeAPI v2, Dog CEO, Cat Facts,
        wttr.in, OpenLibrary, Bored API (15 Nov 2026)
      - FAIL/REJECTED: Open-Meteo (429 daily limit on shared IP),
        Quotable (connection failed), NumbersAPI (404)
- [x] 2.2 Re-verify the 8 chosen APIs once more at final gate time
      (APIs can die between build and submit). DONE 15 Nov ~22:00 WIB:
      all 8 re-fetched via curl, valid JSON, fixtures saved to
      /tmp/frankie-fixtures/. Re-verify AGAIN on submit day.

## Phase 3 — Implementation
- [x] 3.1 `index.html` — picker (8 parts), stage, controls, saved list,
      IT'S ALIVE overlay, aria-live status region.
- [x] 3.2 `styles.css` — lab theme, responsive (360 px / 1280 px), flash animation.
- [x] 3.3 `app.js` — PARTS registry (8 fetchers + timeout + validation),
      name/personality generator, bringToLife (allSettled), reanimate,
      auto-refresh (60 s), localStorage save/load/delete, share-hash
      encode/decode + auto-restore, per-part error cards.
- [x] 3.4 `scripts/verify-app.sh` — static checks: files exist, no secrets
      (grep), HTML references resolve, JS parses (`node --check`).
      Result: 14/14 PASS, exit 0.

## Phase 4 — Verification (gate-by-gate, evidence in NOTES.md)
- [x] 4.1 Serve locally, curl all pages/assets → 200.
- [x] 4.2 Headless Chromium load: zero console errors, screenshot proof.
      (26/26 harness run; see NOTES.md for the sandbox-network caveat.)
- [x] 4.3 Flow test: pick 3 parts → bring to life → live data visible.
- [x] 4.4 Flow test: remove part, reanimate.
- [x] 4.5 Flow test: save → reload → restore from saved list.
- [x] 4.6 Flow test: share URL in clean profile → parts restored, fresh data.
- [x] 4.7 Failure test: one dead API → error card, creature survives.
      (Tested with TWO dead APIs: 2 fizzle cards, 1 live, creature alive.)
- [x] 4.8 Repo hygiene: LICENSE MIT, README, .kiro NOT in .gitignore,
      grep for secrets → none.

## Phase 5 — Delivery (NOT this team: main agent)
- [ ] 5.1 GitHub repo `slowwwkiss/frankie-chimera-lab` (public) + push.
- [ ] 5.2 GitHub Pages enabled, demo URL live.
- [ ] 5.3 Demo video < 3 min (YouTube, public).
- [ ] 5.4 Devpost submit before Sat 5 Dec 2026 05:00 WIB.
- [ ] 5.5 `kiro-cli login` (GitHub slowwwkiss) so future work can run
      real headless Kiro tasks; update KIRO-USAGE.md honestly when done.
