# ENVIRONMENT.md — Defend Your Experience

## Environment Variables

Stored in `backend/.env` (never committed to Git — covered by `.gitignore`).

| Variable | Purpose | Example |
|---|---|---|
| `GROQ_API_KEY` | Authenticates backend requests to the Groq API | `gsk_xxxxxxxxxxxxxxxxxxxx` |
| `PORT` | Port the Express server listens on | `3000` |

A `.env.example` (no real values) will be added at the project root on Day 10 for anyone else setting up the project.

## Local Development Tools

| Tool | Version confirmed | Purpose |
|---|---|---|
| Node.js | v23.11.0 | Runs the Express backend |
| npm | 10.9.2 | Installs backend dependencies |
| VS Code | 1.126.0 | Code editor |
| VS Code: ESLint (Microsoft) | — | Real-time JS error checking |
| VS Code: REST Client (Huachao Mao) | — | Manual endpoint testing without a frontend |
| VS Code: Live Server (Ritwick Dey) | — | Serves frontend locally on port 5500 |
| Git | — | Version control (set up Day 2) |

## Backend Dependencies (`backend/package.json`)

| Package | Purpose |
|---|---|
| express | Web framework / routing |
| cors | Allows frontend (port 5500) to call backend (port 3000) |
| dotenv | Loads `.env` values into `process.env` |
| groq-sdk (or direct HTTPS calls to Groq's OpenAI-compatible endpoint) | Sends prompts to Groq's hosted models |

## AI Provider Configuration (Day 3 update)

- **Provider:** Groq (previously planned: Anthropic Claude)
- **Reason for change:** Anthropic account had no available API credits; Groq provided a working, low-latency, OpenAI-compatible alternative to keep Day 3 foundation work unblocked.
- **API format:** OpenAI-compatible chat completions (`messages: [{role, content}]`, response in `choices[0].message.content`) — differs slightly from Anthropic's `messages.create()` / `content[0].text` format used in earlier planning; this only affects internal request/response parsing in the routes, not the API contract exposed to the frontend.
- **Endpoint base:** `https://api.groq.com/openai/v1/...`

## Ports

| Service | Port | URL |
|---|---|---|
| Backend (Express) | 3000 | http://localhost:3000 |
| Frontend (Live Server) | 5500 | http://127.0.0.1:5500 |

## Git Branching Convention (established Day 3)

- `main` — always working, deployable state
- `dayN-<short-description>` — one short-lived branch per day's work (e.g. `day3-foundation`), merged into `main` once confirmed working
- No PR review process needed (solo project) — branches exist purely as a safety net against breaking `main`
