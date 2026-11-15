# Product Steering — Frankie: The API Chimera Lab

## What this is
A static Halloween lab web app for Kiroween 2026, category FRANKENSTEIN.
It stitches a living "creature" dashboard out of free public APIs — no
backend, no keys, no build step. The monster metaphor is literal: every data
source is a body part bolted onto one creature.

## Who it is for
- Hackathon judges: must understand the idea in 10 seconds and see it work
  in 30 seconds.
- Curious visitors: pick parts, press one button, get a living creature.
- The builder (solo, Achmad Reza Baehaqi): must be able to deploy it to
  GitHub Pages by pushing files, nothing else.

## Product rules (never break these)
1. **It must REALLY work.** Every body part shows live data from a real
   public API. No mock data, no fake numbers, no lorem ipsum. If an API is
   down, say so on that card — never fake it.
2. **One click to alive.** Pick 2–4 parts, press "BRING TO LIFE". That is
   the whole core loop. Everything else is secondary.
3. **The creature survives a dead part.** One API failing must never kill
   the creature. Graceful per-part failure is a feature, not an edge case.
4. **Shareable by URL.** A creature is a link. Anyone opening the link gets
   the same parts with fresh live data.
5. **Free forever.** No keys, no accounts, no paid APIs, no tracking.
   The app must still run in 2027 with zero maintenance.

## Tone
Mad-science lab, playful but functional. Plain text, no hype emoji.
The monster is drawn with CSS/SVG, never with emoji.
