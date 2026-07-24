# SETUP.md — Defend Your Experience

## Prerequisites

- **Node.js** (v18+; this project verified on v23.11.0) — JavaScript runtime that runs our Express backend.
- **npm** (bundled with Node.js) — installs our project's libraries.
- **VS Code** — code editor.
  - Extension: **ESLint** (Microsoft) — catches JS errors as you type.
  - Extension: **REST Client** (Huachao Mao) — lets you test API endpoints without a frontend.
  - Extension: **Live Server** (Ritwick Dey) — serves the frontend locally so `fetch()` calls aren't blocked by browser security rules.
- **Groq API key** — required for AI calls. Get one at https://console.groq.com → API Keys → Create API Key.
- **Git** + a GitHub account — already set up from Day 2.

## Backend Setup

```
cd defend-your-experience/backend
npm init -y
npm install express cors dotenv groq-sdk
```

Create `backend/.env`:
```
GROQ_API_KEY=your-groq-key-here
PORT=3000
```

Run the server:
```
node server.js
```
Expected output: `Server running on http://localhost:3000`

Verify in browser:
- `http://localhost:3000` → plain text confirming the server is up
- `http://localhost:3000/api/test` → JSON `{"reply": "..."}` from Groq

## Frontend Setup

No install step needed — it's plain HTML/CSS/JS. Just:

1. Install the **Live Server** VS Code extension (see above).
2. Right-click `frontend/index.html` → **"Open with Live Server"**.
3. Browser opens to `http://127.0.0.1:5500/frontend/index.html`.
4. Confirm the page shows `Backend connected: "..."` below the textarea — this means frontend → backend → AI is fully wired.

**Important:** the backend (`node server.js`) must be running in its own terminal window *before* you open the frontend with Live Server, or the connection check will fail.

## Common Issues

| Problem | Fix |
|---|---|
| `'node' is not recognized` | Node.js isn't installed or not in PATH — reinstall from nodejs.org |
| CORS error in browser console | Confirm `app.use(cors())` is present in `server.js` |
| `.env` values not loading | Confirm `require('dotenv').config()` is the first line in `server.js`, and restart the server after any `.env` edit |
| "Could not reach backend" on frontend | Backend isn't running, or is running on a different port than the frontend expects |
| AI call fails with a credits/billing error | Check your provider account's billing page; this project currently uses **Groq**, not Anthropic |

## AI Provider Note (Day 3 update)

This project originally planned to use the Claude API. On Day 3, it was switched to **Groq** (Llama-based models via an OpenAI-compatible API) due to Anthropic account credit availability. This is documented as an approved, intentional substitution — see ARCHITECTURE.md and ENVIRONMENT.md for details. All endpoint contracts and app architecture remain unchanged.
