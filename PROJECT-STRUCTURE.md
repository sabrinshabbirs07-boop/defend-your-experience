# PROJECT-STRUCTURE.md — Defend Your Experience

```
defend-your-experience/
  backend/
    routes/
      test.js              (Day 2 — scaffolding, can be removed by Day 10)
      extractClaims.js      (Day 3 — POST /api/extract-claims)
      interviewTurn.js       (Day 4 — POST /api/interview-turn)
      scoreAnswer.js         (Day 5 — POST /api/score-answer)
      generateReport.js      (Day 6 — POST /api/generate-report)
    prompts/
      claimExtraction.js     (Day 3 — resume-analyst system prompt)
      interviewerPersona.js  (Day 4 — skeptical-but-fair persona prompt)
      scoringRubric.js        (Day 5 — 4-axis scoring prompt)
      coachingSummary.js      (Day 6 — report synthesis prompt)
    server.js                (entry point — Express app, CORS, route mounting)
    .env                     (AI API key — gitignored, never committed)
    .env.example             (documents required vars, no real keys — Day 10)
    package.json
  frontend/
    index.html               (single SPA shell, all screens as sections/views)
    styles.css                (global design system — polished in Day 8)
    app.js                    (screen routing, shared state)
    chat.js                   (Day 4 — chat UI logic)
    chatUI.css                 (Day 4 — chat-specific styles)
    scoring.js                 (Day 5 — fire-and-forget scoring calls)
    report.js                  (Day 6 — report rendering)
    report.css                  (Day 6 — report-specific styles)
    history.js                  (Day 7 — localStorage history logic)
    storage.js                   (Day 7 — localStorage read/write helpers)
    upload.js                    (Day 7 stretch — PDF/DOCX extraction)
  TESTING.md                    (Day 9 — test checklist + results log)
  README.md                      (finalized Day 10 — description, setup, live link, tech stack, future scope)
  PROJECT-LOG.md                  (running daily log, updated each day)
  .gitignore
```

## Responsibility Summary

| Folder/file | Responsible for |
|---|---|
| `backend/routes/` | One file per endpoint — HTTP request/response handling only, no prompt text inline |
| `backend/prompts/` | All system prompts as separate exportable strings/functions — kept out of route files so prompts can be iterated on without touching request logic |
| `backend/server.js` | App bootstrapping, middleware (CORS, JSON body parsing), mounting routes — no business logic here |
| `frontend/index.html` | Single shell containing all screen markup; JS toggles visibility between views (no router library needed at this scale) |
| `frontend/app.js` | Shared state (active claims, active session) and screen-switching logic |
| `frontend/*.js` (chat/scoring/report/history/storage) | One file per feature area, matching the Day 4–7 blueprint breakdown exactly — keeps each day's work isolated and reviewable |
| `frontend/*.css` | Feature-specific styles alongside a shared `styles.css` for the global design system |

## Why This Structure

- **Mirrors the blueprint day-by-day** — each day's deliverable maps to a predictable, already-named file, so there's zero ambiguity about "where does today's code go" starting tomorrow.
- **Separates prompts from routes** — prompt engineering (the part you'll iterate on most) never requires touching request-handling code.
- **No premature abstraction** — no `services/`, `controllers/`, `models/` layers. At 4 endpoints and no database, that structure would add indirection without benefit. If the project ever grew past v1.0 scope, this is the first place to refactor.
- **Frontend has no framework/build step** — folder stays flat and readable; every file is directly referenceable by a `<script src>` tag in `index.html`.
