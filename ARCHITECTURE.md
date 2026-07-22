# ARCHITECTURE.md — Defend Your Experience

## Tech Stack (finalized Day 2)

| Layer | Choice | Rationale |
|---|---|---|
| Frontend | Vanilla HTML/CSS/JS SPA | No build tooling, matches PRD/blueprint, fastest iteration |
| Backend | Node.js + Express | Matches JS comfort, easy free deployment on Render |
| Database | None (browser localStorage only) | PRD marks DB/cloud sync out of scope for v1.0 |
| Authentication | None | Out of scope for v1.0 |
| AI | Claude API (Anthropic) | Strong structured JSON output for extraction/scoring/reporting |
| Hosting (backend) | Render (free web service) | Free tier, simple env var dashboard |
| Hosting (frontend) | Vercel | Free static hosting, GitHub-integrated deploys |
| Other libraries | dotenv, cors, @anthropic-ai/sdk (backend); pdf.js/mammoth (frontend, Day 7 stretch only) | Minimal, free, blueprint-justified |

## Component Diagram

See the rendered diagram above ("system_architecture_component_diagram"). Summary:

- **Frontend SPA** — the only thing the user's browser talks to for UI. Never calls Claude directly.
- **Express backend** — holds the Claude API key server-side. Exposes 4 endpoints: `/api/test` (Day 2 only), `/api/extract-claims`, `/api/interview-turn`, `/api/score-answer`, `/api/generate-report`.
- **Claude API** — called only from the backend for claim extraction, interview turn generation, answer scoring, and report synthesis.
- **Browser localStorage** — stores the `dye_sessions` array (see SCHEMA.md). No server-side database exists.

## Request Lifecycle — Interview Turn (see diagram above)

1. User types an answer and hits send.
2. Frontend appends the user message to chat state immediately (optimistic UI) and shows a typing indicator.
3. Frontend fires two backend calls:
   - `POST /api/interview-turn` — **awaited**. Response becomes the next AI chat message.
   - `POST /api/score-answer` — **fire-and-forget**, does not block the chat UI.
4. Backend forwards each request to Claude with the appropriate system prompt (persona prompt for interview-turn, rubric prompt for score-answer).
5. `interview-turn` response updates the visible chat. `score-answer` response updates the hidden scoring state array.
6. When question count reaches the cap (8, or early exit at 5 with sufficient coverage), the backend instructs Claude to close the interview instead of asking another question.

## AI Interaction Summary

| Endpoint | Purpose | Prompt type |
|---|---|---|
| `/api/extract-claims` | Turn resume text into 5–8 structured claims | Resume-analyst system prompt, JSON-only output |
| `/api/interview-turn` | Generate next adaptive question or close session | Skeptical-but-fair interviewer persona, full message history sent each call |
| `/api/score-answer` | Score one Q&A pair on 4 axes | Scoring rubric prompt, JSON-only output, fallback defaults on parse failure |
| `/api/generate-report` | Synthesize coaching summary from full session | Report-synthesis prompt, trimmed session data, JSON-only output |

All four are stateless from the AI's perspective — the backend resends full relevant context (claims, message history, or session summary) on every call; nothing is remembered server-side between requests.

## External Services

- **Claude API** (api.anthropic.com) — the only external service this app depends on.
- No other third-party APIs, databases, or auth providers are used in v1.0.

## Notes / Deviations from Blueprint

None. This matches the PRD's Section 9 (High-Level Architecture) and the Day 2 blueprint exactly — no redesign was needed.
