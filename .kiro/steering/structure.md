# Structure Steering — Frankie: The API Chimera Lab

```
frankie-chimera-lab/
├── index.html                  # the whole app UI (single page)
├── app.js                      # all logic: parts, fetch, creature, save/share
├── styles.css                  # lab theme, responsive, IT'S ALIVE animation
├── LICENSE                     # MIT
├── README.md                   # run it, APIs used, deploy to Pages
├── NOTES.md                    # build log + gate verification evidence
├── KIRO-USAGE.md               # honest Kiro usage write-up (Devpost)
├── SUBMISSION-DRAFT.md         # Devpost form fields (draft, main agent submits)
├── scripts/
│   └── verify-app.sh           # static gate checks (used by the Kiro hook)
└── .kiro/                      # MUST be at repo root, MUST NOT be gitignored
    ├── specs/frankie-chimera-lab/
    │   ├── requirements.md
    │   ├── design.md
    │   └── tasks.md
    ├── steering/
    │   ├── product.md
    │   ├── tech.md
    │   └── structure.md
    ├── hooks/
    │   └── format-on-save.json
    ├── agents/
    │   └── dr-frankenstein.md
    └── settings/
        └── mcp.json
```

## Rules
- `.kiro/` lives at the repo ROOT. Never move it, never gitignore it
  (Kiroween rules: missing `/.kiro` = disqualification risk).
- No `node_modules/`, no build output, no generated files in the repo.
- No `.github/workflows/` — the GitHub App token used for pushing cannot
  create workflow files (403); CI is out of scope for this static app.
- Keep the file count small: judges must be able to read the whole app.
