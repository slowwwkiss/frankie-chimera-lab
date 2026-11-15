# Frankie — The API Chimera Lab

**Kiroween 2026 · Category: Frankenstein**

Stitch a living creature together from free public APIs. Pick 2–4 body
parts, press **BRING TO LIFE**, and watch the monster wake up with real,
live data — then save it or share it with a link.

Live demo: `https://slowwwkiss.github.io/frankie-chimera-lab/`
*(enable GitHub Pages on the `main` branch, root folder)*

## What it does

- **8 body parts, 8 real APIs** — every part fetches live data in your
  browser. No keys, no backend, no mocks:

  | Part | API | Data |
  |---|---|---|
  | Brain | Advice Slip | One piece of advice |
  | Heart | CoinGecko | BTC + ETH prices, 24h change |
  | Funny Bone | JokeAPI v2 | One safe joke |
  | Eyes | Dog CEO | Random dog photo |
  | Whiskers | Cat Facts | One cat fact |
  | Weather Skin | wttr.in | Live weather (city selectable) |
  | Memory | OpenLibrary | A Frankenstein book |
  | Hands | Bored API | An activity suggestion |

- **Generated name + personality** — deterministic from the parts you pick,
  flavoured by the live data (cold weather + a joke = a chilly joker).
- **IT'S ALIVE! moment** — lightning flash the first time a creature powers on.
- **Reanimate** — refresh all parts; optional auto-refresh every 60 s.
- **Save creatures** — stored in localStorage, wake them later.
- **Share by URL** — the part selection travels in the `#c=` hash; opening
  the link rebuilds the same creature with fresh live data.
- **Graceful failure** — if one API dies, that part fizzles and the rest of
  the creature lives on. No fake data, ever.

## Run it locally

```bash
python3 -m http.server 8123
# open http://localhost:8123/
```

No build step, no dependencies. Any static host works.

## Deploy to GitHub Pages

1. Push this repo to GitHub (public).
2. Settings → Pages → Source: **Deploy from a branch** → `main` / `/ (root)`.
3. Your demo URL: `https://<username>.github.io/frankie-chimera-lab/`

## Verify

```bash
bash scripts/verify-app.sh   # static gates: files, JS parse, no secrets, assets
```

## Built with Kiro

Spec-driven build: see `.kiro/specs/frankie-chimera-lab/` (requirements,
design, tasks), `.kiro/steering/`, `.kiro/agents/dr-frankenstein.md`,
`.kiro/hooks/format-on-save.json`, `.kiro/settings/mcp.json`.
Honest usage write-up: [`KIRO-USAGE.md`](KIRO-USAGE.md).

## License

MIT — see [LICENSE](LICENSE).
