# Design — Frankie: The API Chimera Lab

## 1. Architecture

Static single-page app, three files, no framework:

```
index.html   — structure + part picker + creature stage + saved list
styles.css   — lab theme (dark, green glow, CSS monster silhouette)
app.js       — all logic (ES module-free vanilla JS, runs in any modern browser)
```

No build step. No bundler. No backend. Hosting target: GitHub Pages
(`slowwwkiss/frankie-chimera-lab`, `main` branch, root).

## 2. Data model

```js
// A body part definition (static registry)
PART = {
  id: "brain",            // stable id, used in URL hash + localStorage
  name: "Brain",          // display name (plain text label, no emoji in UI)
  api: "https://api.adviceslip.com/advice",
  sourceName: "Advice Slip",
  sourceUrl: "https://api.adviceslip.com/",
  fetch: async () => {...},   // returns { html, text } render payload
  timeoutMs: 10000
}

// A live creature (runtime state)
creature = {
  parts: ["brain", "heart"],   // selected part ids (2–4)
  name: "ZORP THE CHILLY JOKER",
  personality: "…",
  data: { brain: {ok:true, html:"…", fetchedAt:"…"}, heart: {ok:false, error:"…"} },
  createdAt: ISO string
}
```

## 3. Name + personality generation

- Name: deterministic from the sorted part ids.
  `prefix[hash] + " " + core[hash] + " " + suffix[hash]`.
  Prefixes: ZORP, BOLT, GRIMM, VOLT, MORT, FRANK, IGOR, LURCH…
  Cores: THE, VON, MC, DR…
  Suffixes: THE CHILLY JOKER, THE WANDERING MIND, THE GOLDEN HEART…
  Same part combo → same name, every time (hash = sum of char codes).
- Personality: template slots filled from live data, e.g.
  joke present + temp < 10 °C → "a chilly joker who laughs at the cold";
  BTC up + advice present → "an optimistic thinker riding the market".
  Fallback line if data is thin: "a mysterious creature of stitched-together data."

## 4. Fetch layer

- One `fetchPart(part)` per part: `fetch` + `AbortController` timeout
  (10 s) → parse JSON → validate shape → return render payload.
  Any throw → `{ ok:false, error: short message }`.
- `bringToLife()`: `Promise.allSettled(selected.map(fetchPart))` — one bad
  API can never kill the creature.
- Each part card shows its own fetch time (`new Date().toLocaleTimeString()`).

## 5. Persistence & sharing

- localStorage key `frankie.saved.v1`: JSON array of saved creatures
  (max 12, newest first). Save stores parts + fetched payloads + name +
  timestamp. Load restores the rendered creature as-is (no re-fetch).
- Share URL: `#c=<base64url(JSON {v:1, parts:[...]})>`.
  On load, if the hash parses and has 2–4 known part ids, auto-select those
  parts and bring the creature to life with fresh fetches.
  Unknown ids are dropped; fewer than 2 valid ids → ignore the hash.

## 6. "IT'S ALIVE!" moment

- On first successful `bringToLife` per page session: full-screen overlay
  (CSS lightning flash + big "IT'S ALIVE!" text) for ~1.2 s, then fades.
  Pure CSS animation triggered by adding a class; no audio (autoplay rules).
- Subsequent re-animations use a small inline flash on the creature card only.

## 7. Styling

- Palette: near-black `#0a0f0a` background, lab green `#39ff6a` accents,
  amber `#ffb300` warnings, bone `#e8e4d8` text.
- Font: Google Fonts "Creepster" for the lab title + "Space Grotesk" for UI
  (with system-font fallbacks if the font CDN is unreachable).
- Monster silhouette: inline SVG in the creature header (stitched body
  outline); each attached part card is visually "bolted on" with a bolt
  marker (CSS `::before`, a `+` stitch mark, not an emoji).

## 8. Error states

| Situation | UI |
|---|---|
| One part fails | That card shows "PART FIZZLED" + error + retry-one-part button |
| All parts fail | Stage shows lab-wide error + "Retry the experiment" button |
| < 2 parts selected | Bring-to-life disabled + hint text |
| Bad share hash | Hash ignored, normal picker shown, console warning only |
| localStorage full/unavailable | Save button shows "storage unavailable" note, app keeps working |

## 9. Testing plan (manual, gate-by-gate)

1. Serve locally (`python3 -m http.server 8123`), curl every file → 200.
2. Headless Chromium: load page, assert zero console errors, screenshot.
3. Click 3 parts → Bring to life → all cards show live data (not mock).
4. Remove a part, re-animate, verify the card disappears.
5. Save creature → reload → saved creature listed → click → restored.
6. Copy share link → open in a clean Chromium profile → same parts, fresh data.
7. Block network for one API (devtools offline per-request is not available
   headless; instead test the fallback by pointing a part at a dead URL in a
   scratch copy) → error card renders, creature survives.
8. `grep -ri` for keys/secrets → none.
