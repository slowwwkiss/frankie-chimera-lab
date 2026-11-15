# Build Notes — Frankie: The API Chimera Lab

## Build log (15 Nov 2026, WIB)

- **21:48** — Read GATE-CHECK.md (gates passed). `kiro-cli` 3.3.0 installed
  at `~/.local/bin/kiro-cli`, `whoami` = **Not logged in** (login needs
  browser; main agent's job).
- **21:48–21:50** — API verification via curl (status + CORS header):
  - PASS (200 + `Access-Control-Allow-Origin: *`): Advice Slip, JokeAPI v2,
    CoinGecko simple price (BTC $64,709 / ETH $1,803.52 at check time),
    Dog CEO, Cat Facts, OpenLibrary, wttr.in, Bored API.
  - REJECTED: Open-Meteo (HTTP 429 "Daily API request limit exceeded" on
    the shared VM IP — wttr.in is the weather source instead), Quotable
    (connection failed, HTTP 000, twice), NumbersAPI (HTTP 404).
- **21:50–21:52** — Spec-driven: `.kiro/specs/frankie-chimera-lab/`
  (requirements/design/tasks) + steering (product/tech/structure) +
  `.kiro/agents/dr-frankenstein.md` + `.kiro/hooks/format-on-save.json` +
  `.kiro/settings/mcp.json` (fetch MCP server) + `scripts/verify-app.sh`.
- **21:52–21:54** — App built: `index.html`, `styles.css`, `app.js`
  (8-part registry, parallel fetch with 10 s timeout, deterministic name
  generator, personality from live data, localStorage save, `#c=` share
  hash, IT'S ALIVE! flash, per-part error cards). LICENSE (MIT), README.
- **21:54** — `scripts/verify-app.sh` first run: 13/14 PASS; secret-grep
  logic was faulty (matched prose words "secret/key" in docs). Fixed to
  match only credential values/assignments → **14/14 PASS, exit 0**.
- **21:55** — Local serve: `python3 -m http.server 8123` →
  `index.html`/`app.js`/`styles.css` all HTTP 200.
- **21:55–22:00** — Headless Chromium (Playwright) gate test, run 1:
  **19/25**. All API fetches from the browser failed with
  `ERR_TUNNEL_CONNECTION_FAILED`. Root cause: the VM egress proxy
  (`hatch-egress-proxy:3128`) accepts curl but rejects Chromium CONNECT
  tunnels, and direct connections are blocked too. This is a sandbox
  limitation, not an app bug (curl proves the APIs + CORS work).
- **22:00** — Harness v2: Playwright route interception fulfills each API
  with REAL payloads captured via curl minutes earlier
  (`/tmp/frankie-fixtures/*.json`, all 8 valid JSON). This proves the
  app's fetch → parse → render path against genuine API responses. The
  only unproven hop is a real user's browser fetching the APIs directly —
  covered by the curl + CORS evidence above.
- **22:01** — Harness v2 run 1: **17/26**. Two harness bugs (route glob
  `**/host/**` doesn't match subdomains like `api.adviceslip.com` /
  `www.boredapi.com`; weather regex expected 5 °C, fixture is 7 °C) + one
  app bug (name "IGOR THE THE RESTLESS HANDS" — duplicate THE). Fixed all
  three.
- **22:02** — Harness v2 run 2: **26/26 PASS.** Screenshots in
  `/tmp/frankie-shots/` (01-picker, 02-alive, 03-saved, 04-share,
  05-failure, 06-mobile).

## Gate evidence (harness v2, run 2 — 26/26)

| Gate | Evidence |
|---|---|
| Serve + 200s | `index.html`, `app.js`, `styles.css` → HTTP 200 |
| Static gates | `verify-app.sh` 14/14 PASS, exit 0 |
| Picker | 8 parts render; bring disabled at 0; 5th part disabled at 4/4 |
| Bring to life | Creature "IGOR THE RESTLESS HANDS"; personality "A chilly joker who laughs at the cold; a cautious soul watching red candles; wise beyond its stitches." (Berlin 7 °C + joke + BTC −1.71%) |
| Live data | Heart: BTC $64,781 (−1.71%), ETH $1,805.68 (−2.40%); Brain: advice #190 "Don't always believe what you think."; Weather: Berlin 7 °C, feels-like 5 °C; Memory: "Frankenstein; or, The Modern Prometheus" by Mary Shelley, 1818; Hands: "Find a DIY to do"; Eyes img src `images.dog.ceo/breeds/wolfhound-irish/n02090721_348.jpg` |
| Reanimate | 4 cards stay live after refresh |
| Remove part | 4 → 3 cards after un-picking Funny Bone |
| Save / reload / wake | Saved list 1 entry → persists after reload → Wake restores 3 cards |
| Share URL | Clean context + `#c=` hash → 4 parts restored with fresh data |
| Failure path | 2 APIs blocked → 2 "PART FIZZLED" cards, 1 live card, creature survives; retry dead part keeps creature alive |
| Mobile | 360 px viewport renders all 8 parts |
| Console | 0 JS errors (Google Fonts load failure excluded — sandbox has no external net for browsers; system-font fallback renders fine) |

## Known limitations (honest)
1. **Headless-browser network**: this VM's Chromium cannot reach the
   internet (proxy rejects browser CONNECT). Live-data rendering was
   proven with real API payloads via route interception; the final
   end-to-end check in a real browser (judge's browser / GitHub Pages)
   still needs one live pass by the main agent after deploy.
2. **Google Fonts**: the only external asset. If fonts CDN is unreachable,
   the app falls back to system fonts (verified in screenshots).
3. **Dog image**: the `<img>` element is wired to the real Dog CEO URL;
   the binary image itself could not load in the sandbox. In a real
   browser it loads from `images.dog.ceo`.
4. **kiro-cli not logged in** — no step was executed by Kiro itself yet
   (see KIRO-USAGE.md). Main agent: browser login, then re-drive via
   `kiro-cli chat --no-interactive`.
5. **API freshness**: Open-Meteo 429 was a shared-IP daily limit; if the
   8 chosen APIs change/die before 5 Dec, re-verify and swap the part.

## Free-only compliance (user order 21:51 WIB)
- Zero money spent on this build. No paid Kiro credits, no Devpost fee,
  no purchases, no deposits. Only free public APIs (no keys) + free
  GitHub Pages hosting. The free 4,000 Kiro credits for registered
  entrants were NOT requested yet (needs user ID verification — main
  agent's job, still free).

## Still missing (main agent)
- GitHub repo `slowwwkiss/frankie-chimera-lab` (public) + push + Pages
- Demo video < 3 min (YouTube public)
- `kiro-cli login` + real headless Kiro run
- Devpost registration + submit before Sat 5 Dec 2026 05:00 WIB
