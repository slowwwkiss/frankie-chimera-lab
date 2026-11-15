# Devpost Submission Draft — Frankie: The API Chimera Lab

> DRAFT ONLY. Do NOT submit from this file — the main agent submits via
> the Devpost form. Deadline: **Fri 4 Dec 2026 14:00 PT = Sat 5 Dec 2026
> 05:00 WIB**.

## Title
Frankie — The API Chimera Lab

## Category
**Frankenstein** — "stitch together a chimera of technologies"

## Tagline (short description)
Stitch a living creature together from free public APIs — pick 2–4 body
parts, press BRING TO LIFE, and watch the monster wake up with real data.

## Description (long, for the form)
Frankie is a Frankenstein in the most literal sense: a chimera stitched
from eight different technologies — eight free public APIs, each one a
body part of a living creature.

Pick 2–4 body parts (Brain from Advice Slip, Heart from CoinGecko, Funny
Bone from JokeAPI, Eyes from Dog CEO, Whiskers from Cat Facts, Weather
Skin from wttr.in, Memory from OpenLibrary, Hands from Bored API) and
press BRING TO LIFE. The lab fetches live data for every part in parallel,
generates the creature a name and a personality from that live data, and
plays an IT'S ALIVE! lightning moment as the monster wakes.

Every part is real: no mock data anywhere. If one API dies, that part
fizzles and the rest of the creature lives on. Creatures can be saved in
the browser and shared with a link — the part selection travels in the URL
hash, and the data is fetched fresh on arrival. Reanimate refreshes all
parts; auto-refresh keeps the creature breathing every 60 seconds.

The whole app is three static files (HTML + vanilla JS + CSS), no backend,
no keys, no build step — it runs anywhere, including GitHub Pages, free
forever.

Built spec-driven with Kiro: full spec (requirements/design/tasks),
steering, a custom "Dr. Frankenstein" agent, a verify-on-save hook, and
MCP settings, all in `.kiro/` at the repo root.

## Built With
- Kiro (spec-driven development, steering, custom agent, hooks, MCP)
- HTML, CSS, vanilla JavaScript (no framework, no build step)
- Advice Slip API, CoinGecko API, JokeAPI v2, Dog CEO API, Cat Facts API,
  wttr.in, OpenLibrary API, Bored API (all free, no key, CORS-open)

## Links
- GitHub repo (public): https://github.com/slowwwkiss/frankie-chimera-lab
- Demo URL: https://slowwwkiss.github.io/frankie-chimera-lab/
- Demo video: TODO — record < 3 min, public on YouTube, shows: pick parts,
  bring to life, live data, save, share link opened fresh, one API failing
  gracefully.

## Kiro usage write-up
See KIRO-USAGE.md in the repo (honest status: specs/steering/agent/hooks/
MCP authored; kiro-cli installed v3.3.0 but awaiting browser login —
re-drive via `kiro-cli chat` once logged in, before submitting).

## Pre-submit checklist (main agent)
- [ ] GitHub repo `slowwwkiss/frankie-chimera-lab` created (public) + all files pushed
- [ ] GitHub Pages enabled, demo URL live and verified in a real browser
- [ ] `kiro-cli login` done (GitHub slowwwkiss) + at least one real headless Kiro task run; KIRO-USAGE.md updated
- [ ] Demo video < 3 min recorded + public on YouTube
- [ ] Devpost account + "Join Hackathon" registration (erjeganteng3@gmail.com)
- [ ] Kiro credits request form by 1 Dec 12:00 PT (optional; free 4,000 credits) + ID verification (user step)
- [ ] Re-verify all 8 APIs live on submit day (they can die between build and submit)
- [ ] Submit before Sat 5 Dec 2026 05:00 WIB
