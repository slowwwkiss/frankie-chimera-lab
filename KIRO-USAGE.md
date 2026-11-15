# How Kiro Was Used — Frankie (Kiroween 2026)

> Honest write-up for the Devpost form. Only claims that actually happened
> are listed. Anything not yet done is marked TODO, not claimed.

## What Kiro actually did in this build

### 1. Spec-driven development (Kiro specs) — DONE
The build followed Kiro's spec-driven methodology before any code was
written:
- `.kiro/specs/frankie-chimera-lab/requirements.md` — 8 body parts, each
  tied to a verified public API; failure-handling and sharing requirements.
- `.kiro/specs/frankie-chimera-lab/design.md` — static 3-file architecture,
  data model, name/personality generation, fetch layer, persistence scheme.
- `.kiro/specs/frankie-chimera-lab/tasks.md` — phased task list, checked off
  as each gate passed.

### 2. Steering — DONE
- `.kiro/steering/product.md` — product rules (real live data only, one
  click to alive, creature survives a dead part, shareable by URL, free).
- `.kiro/steering/tech.md` — vanilla JS, no build step, no keys, CORS
  verification rule, per-part timeout + `Promise.allSettled`.
- `.kiro/steering/structure.md` — repo layout; `.kiro/` at root, never
  gitignored.

### 3. Custom agent — DONE (authored, not yet executed by Kiro itself)
- `.kiro/agents/dr-frankenstein.md` — "Dr. Frankenstein" agent: persona,
  hard rules (never fake live data, verify every API with curl first,
  one dead part never kills the creature), workflow, definition of done.

### 4. Hooks — DONE (configuration authored; execution pending Kiro IDE/CLI run)
- `.kiro/hooks/format-on-save.json` — after any edit to `index.html`,
  `app.js` or `styles.css`, runs `scripts/verify-app.sh` (static gates:
  files exist, JS parses, no secrets, local assets resolve).
- The hook's target script exists and passes (`bash scripts/verify-app.sh`
  exits 0). The hook itself has not yet fired inside Kiro IDE because the
  build was done outside the IDE (see §6).

### 5. MCP — CONFIGURED, not yet executed
- `.kiro/settings/mcp.json` — declares the `fetch` MCP server
  (`uvx mcp-server-fetch`) for fetching API docs during development.
  The server was not run during this build because API verification was
  done directly with curl instead. The configuration is real and ready to
  use inside Kiro.

### 6. Kiro CLI — NOT LOGGED IN (honest status)
- `kiro-cli` 3.3.0 is installed at `~/.local/bin/kiro-cli`.
- `kiro-cli whoami` returns **"Not logged in"** (verified 15 Nov 2026).
  Login needs a browser sign-in (GitHub/Google) which this build agent
  cannot perform. Therefore **no implementation step in this build was
  executed by `kiro-cli chat`**, and none is claimed here.
- TODO (main agent, free): `kiro-cli login` via browser, then re-run
  implementation/verification steps through
  `kiro-cli chat --no-interactive --trust-all-tools` so Kiro execution is
  real. The free 4,000 Kiro credits for registered entrants may be used;
  no paid credits were bought or used.

### 7. What was NOT used
- No Kiro IDE agent chat sessions (no IDE in this environment).
- No Kiro Crew app (not required for the Frankenstein category).
- No property-based testing (PBT) — verification is gate-by-gate
  headless-browser testing instead (26/26 checks passed; see NOTES.md).

## Summary for the form
Kiro was used spec-first: a full spec (requirements/design/tasks),
steering files, a custom agent, a hook configuration, and MCP settings
were authored in `.kiro/` and drove the build. The Kiro CLI is installed
but awaiting login; once logged in, the same tasks will be re-driven
through headless `kiro-cli chat` before submission.
