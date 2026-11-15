# Tech Steering — Frankie: The API Chimera Lab

## Stack
- **HTML + vanilla JavaScript + CSS.** No framework, no bundler, no build
  step, no npm dependencies at runtime. The app is three files.
- **Hosting:** GitHub Pages from the repo root (`main` branch).
- **Storage:** `localStorage` only (saved creatures). No cookies, no backend.
- **Fonts:** Google Fonts ("Creepster" for the title, "Space Grotesk" for
  UI) — the only external asset allowed, with system-font fallbacks.

## API rules
- Only free public APIs with **no key** and **`Access-Control-Allow-Origin: *`**.
- Every API must be verified with curl (HTTP 200 + CORS header) BEFORE it
  is added to the PARTS registry. Rejected so far: Open-Meteo (429 daily
  limit on shared IP), Quotable (connection failed), NumbersAPI (404).
- Every fetch goes through `fetchPart()` with an `AbortController` timeout
  of 10 s and shape validation. A bad response is a per-part failure, never
  a page crash.
- Fetches for a creature run in parallel via `Promise.allSettled`.

## Code rules
- `app.js` must parse clean under `node --check`.
- No `eval`, no `innerHTML` with untrusted API strings unescaped — API text
  is inserted via `textContent` or escaped before `innerHTML`.
- No third-party `<script>` tags. No CDN JavaScript.
- No secrets, keys, tokens, or credentials anywhere in the repo. Grep before
  every commit.

## Verification
- `scripts/verify-app.sh` runs the static gates: files exist, JS parses,
  no secrets, all local asset references resolve.
- Browser gates run headless Chromium: page loads with zero console errors,
  all flows exercised (add/remove part, refresh, save, share URL).
