# API.md — Defend Your Experience (Backend Endpoints, v1.0)

No authentication exists in v1.0 (per PRD, out of scope). All endpoints are public but only ever called from the deployed frontend origin (enforced via CORS allowlist). No implementation code below — design only, per today's scope.

---

## POST /api/test *(Day 2 scaffolding only — not part of v1.0 product surface)*

**Purpose:** Confirm frontend → backend → AI round trip works.
**Request:** `{}` (no body needed, or optional `{ "prompt": "string" }`)
**Response:** `{ "reply": "string" }`
**Validation:** None required — internal dev check only.
**Auth:** None.
**Errors:** `500` if AI API call fails, with `{ "error": "AI service unavailable" }`.

---

## POST /api/extract-claims

**Purpose:** Convert pasted resume/profile text into a structured, capped list of defensible claims.

**Request:**
```json
{ "resumeText": "string" }
```

**Response (200):**
```json
{
  "claims": [
    { "id": "c1", "text": "string", "category": "project|skill|internship|certification|academic|behavioral", "priority": 1 }
  ]
}
```

**Validation:**
- `resumeText` required, minimum 100 characters, maximum ~8000 characters (reject or truncate beyond this to control AI cost/latency).
- Reject empty or whitespace-only input with a 400.

**Auth:** None.

**Error cases:**
- `400` — `{ "error": "Resume text too short. Please paste at least 100 characters." }`
- `422` — AI returned non-JSON or malformed output after retry → `{ "error": "Could not analyze this resume. Please try again." }`
- `500` — AI API unavailable/timeout → `{ "error": "AI service unavailable, please retry." }`
- `429` — rate limit hit → `{ "error": "Too many requests, please wait a moment." }`

---

## POST /api/interview-turn

**Purpose:** Given conversation history + claims + progress, return the next adaptive interviewer message (or a closing message if the cap is reached).

**Request:**
```json
{
  "claims": [ { "id": "c1", "text": "string", "category": "string", "priority": 1 } ],
  "messages": [ { "role": "interviewer|user", "content": "string" } ],
  "questionCount": 3
}
```

**Response (200):**
```json
{
  "message": "string, the interviewer's next message",
  "claimId": "string, which claim this question targets (null if closing)",
  "isClosing": false,
  "questionCount": 4
}
```

**Validation:**
- `claims` must be a non-empty array.
- `messages` must be an array (can be empty on the very first call).
- `questionCount` must be an integer 0–8; if ≥ 8, backend forces `isClosing: true` regardless of what the AI returns (hard cap enforced in code, not just prompt).

**Auth:** None.

**Error cases:**
- `400` — missing/malformed `claims` or `messages` → `{ "error": "Invalid interview state." }`
- `500`/`429` — same AI-unavailable/rate-limit pattern as above, frontend shows retry button per Day 9 plan.

---

## POST /api/score-answer

**Purpose:** Silently score one Q&A pair on 4 axes. Called fire-and-forget from the frontend; never blocks the chat.

**Request:**
```json
{
  "claimId": "string",
  "question": "string",
  "answer": "string"
}
```

**Response (200):**
```json
{
  "scores": { "confidence": 72, "depth": 65, "communication": 80, "evidence": 55 },
  "reasoning": "string, brief per-axis or combined justification"
}
```

**Validation:**
- All three fields required, non-empty.
- Backend clamps/validates returned scores to integers 0–100; if AI JSON parsing fails, backend returns neutral fallback scores (`{50,50,50,50}`) rather than an error — this endpoint must never surface a user-facing failure, since it's invisible during the chat.

**Auth:** None.

**Error cases:**
- `400` — missing fields → `{ "error": "Missing scoring input." }` (frontend should never trigger this if wired correctly)
- On any AI failure: respond `200` with fallback scores + `"reasoning": "Scoring temporarily unavailable"` rather than a 500 — this endpoint prioritizes never breaking the chat over strict accuracy.

---

## POST /api/generate-report

**Purpose:** Synthesize the full Defense Report (coaching summary + claim breakdown) from a completed session.

**Request:**
```json
{
  "claims": [ { "id": "c1", "text": "string", "category": "string" } ],
  "scores": [ { "claimId": "c1", "question": "string", "answer": "string", "scores": {"confidence":72,"depth":65,"communication":80,"evidence":55}, "reasoning": "string" } ]
}
```
(Note: full raw message transcript is *not* sent — only trimmed claim/answer/score summary, per Day 6 blueprint guidance on avoiding timeouts.)

**Response (200):**
```json
{
  "claimBreakdown": [
    { "claimId": "c1", "convincingPoints": "string", "weakPoints": "string", "missingEvidence": "string", "suggestedImprovement": "string" }
  ],
  "coachingSummary": {
    "strongestAreas": "string",
    "biggestRisks": "string",
    "storiesToPrepare": "string",
    "conceptsToRevise": "string"
  }
}
```

**Validation:**
- `claims` and `scores` both required, non-empty arrays.
- Every `scores[].claimId` should map to a `claims[].id` — backend can proceed even if not perfectly aligned (defensive, non-blocking).

**Auth:** None.

**Error cases:**
- `400` — empty session data → `{ "error": "No session data to generate a report from." }`
- `500`/`429` — AI unavailable → `{ "error": "Could not generate report, please retry." }`, frontend shows retry button, never a blank screen (Day 9 requirement).

---

## Global Error Conventions

- All errors return JSON: `{ "error": "human-readable message" }`.
- Status codes used: `400` (bad input), `422` (AI output unusable), `429` (rate limit), `500` (upstream AI failure).
- No endpoint ever throws an unhandled exception to the client — every route wraps its AI call in try/catch (Day 9 non-functional requirement, NFR "Reliability").
