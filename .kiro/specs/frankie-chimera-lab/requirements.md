# Requirements — Frankie: The API Chimera Lab

> Spec-driven build for Kiroween 2026, category **FRANKENSTEIN**.
> Status: requirements approved 15 Nov 2026. All APIs verified live via curl
> (HTTP 200 + `Access-Control-Allow-Origin: *`) before implementation.

## 1. Product summary

**Frankie — The API Chimera Lab** is a static web app (HTML + vanilla JS, no
backend, no build step) that stitches a living "creature" together from free
public APIs. The user picks 2–4 "body parts"; each part is one public data
source. The app fetches live data for every part, assembles one dashboard
"creature" with a generated name and personality, auto-refreshes it, and lets
the user save it (localStorage) and share it (state encoded in the URL hash).

Theme: a Halloween mad-science lab. Each body part renders as a monster body
part. The first time a creature powers on, the lab plays an "IT'S ALIVE!"
lightning moment.

## 2. Functional requirements

### FR-1 Body parts (data sources)
The app MUST offer exactly these 8 body parts, each backed by a verified
free public API with no key and open CORS:

| Part | API | Data shown |
|---|---|---|
| BRAIN | Advice Slip (`api.adviceslip.com/advice`) | One piece of advice |
| HEART | CoinGecko (`api/v3/simple/price`, BTC + ETH) | Prices USD + 24h change |
| FUNNY BONE | JokeAPI v2 (`v2.jokeapi.dev/joke/Any?type=single&safe-mode`) | One safe joke |
| EYES | Dog CEO (`dog.ceo/api/breeds/image/random`) | Random dog photo |
| WHISKERS | Cat Facts (`catfact.ninja/fact`) | One cat fact |
| WEATHER SKIN | wttr.in (`wttr.in/<city>?format=j1`) | Temp, feels-like, condition, humidity |
| MEMORY | OpenLibrary (`openlibrary.org/search.json?q=frankenstein&limit=5`) | Book title + author |
| HANDS | Bored API (`boredapi.com/api/activity`) | Activity suggestion |

- Open-Meteo was tested and REJECTED as primary weather source: it returned
  HTTP 429 "Daily API request limit exceeded" on the shared VM IP
  (15 Nov 2026). wttr.in is the primary weather source.
- Quotable was tested and REJECTED: connection failed (HTTP 000) twice.
- NumbersAPI was tested and REJECTED: HTTP 404 on `/random/trivia?json`.

### FR-2 Creature assembly
- User selects 2–4 parts. Fewer than 2 → "Bring to life" button stays
  disabled with a hint. More than 4 → further part buttons are disabled.
- On "Bring to life": fetch all selected parts in parallel, render the
  creature, play the IT'S ALIVE! lightning flash once per new creature.
- Creature name is generated deterministically from the selected parts
  (prefix + core + suffix lists) so the same part combo always yields the
  same name.
- Personality line is generated from the live data (e.g. jokes + cold
  weather → "a chilly joker").

### FR-3 Live refresh
- "Reanimate" button re-fetches every attached part and updates the
  creature in place (no full reload).
- Auto-refresh toggle re-fetches every 60 seconds while ON.

### FR-4 Persistence & sharing
- "Save creature" stores the current creature (parts + fetched data +
  timestamp) in localStorage; saved creatures list on the page; clicking one
  restores it; deleting one removes it.
- "Copy share link" builds a URL whose `#c=` hash holds a base64url-encoded
  JSON of the part selection; opening that URL in a clean session restores
  the same parts and fetches fresh live data for them.

### FR-5 Failure handling
- If one API fails (network error, non-200, bad JSON, timeout 10 s), that
  part renders an error card ("this part fizzled — the rest of the creature
  lives on") and the creature still assembles from the surviving parts.
- If ALL parts fail, show a lab-wide error state with a retry button.
- No part may block rendering of the others (parallel fetch, per-part
  try/catch).

### FR-6 UI
- Single-page lab theme: dark background, green "lab glow", monospace
  accents. All CSS local (`styles.css`); Google Fonts allowed as the only
  external asset (graceful fallback to system fonts if offline).
- Responsive: usable at 360 px wide (mobile) and 1280 px (desktop).
- Every part card shows: part name, live data, source API name + link, and
  fetch time.
- No emojis in the UI chrome (plain text labels; the monster is drawn with
  CSS/SVG, not emoji).

## 3. Non-functional requirements

- **NFR-1 Static only.** No server, no build step, no bundler. Runs from any
  static host (GitHub Pages) and from `python3 -m http.server`.
- **NFR-2 No secrets.** Zero API keys, zero credentials anywhere in the repo.
- **NFR-3 No CDN JS.** All JavaScript is local (`app.js`). No third-party
  script tags.
- **NFR-4 Performance.** First paint < 1 s on local serve; all part fetches
  complete or fail within 10 s each.
- **NFR-5 Accessibility.** Buttons are real `<button>` elements with labels;
  status changes announced via `aria-live`.

## 4. Out of scope
- User accounts, server-side storage, payments.
- Any API that needs a key, OAuth, or a CORS proxy.
- Video production and Devpost submission (handled by the main agent).
