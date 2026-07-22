# SCHEMA.md — Defend Your Experience

Per PRD Section 6 (Out of Scope), there is **no server-side database** in v1.0. All persistence lives in the browser's `localStorage`, keyed under `dye_sessions`. This document defines that schema and the in-memory session object used during an active interview.

## Root key

```
localStorage.dye_sessions  →  Array<Session>
```

## Session object

```json
{
  "id": "string (uuid or timestamp-based)",
  "createdAt": "ISO 8601 timestamp",
  "profileSnippet": "string, first ~200 chars of the resume text used, for display in history list",
  "claims": [
    {
      "id": "string, e.g. 'c1'",
      "text": "string, the extracted claim",
      "category": "enum: project | skill | internship | certification | academic | behavioral",
      "priority": "integer 1-3"
    }
  ],
  "messages": [
    {
      "role": "enum: interviewer | user",
      "content": "string",
      "claimId": "string, which claim this message relates to (nullable for closing message)",
      "timestamp": "ISO 8601 timestamp"
    }
  ],
  "scores": [
    {
      "claimId": "string, matches a claims[].id",
      "question": "string",
      "answer": "string",
      "scores": {
        "confidence": "integer 0-100",
        "depth": "integer 0-100",
        "communication": "integer 0-100",
        "evidence": "integer 0-100"
      },
      "reasoning": "string, one line per axis or combined"
    }
  ],
  "readinessPercent": "integer 0-100, computed average of all axis scores across all answers",
  "report": {
    "claimBreakdown": [
      {
        "claimId": "string",
        "convincingPoints": "string",
        "weakPoints": "string",
        "missingEvidence": "string",
        "suggestedImprovement": "string"
      }
    ],
    "coachingSummary": {
      "strongestAreas": "string",
      "biggestRisks": "string",
      "storiesToPrepare": "string",
      "conceptsToRevise": "string"
    }
  },
  "questionCount": "integer, 5-8"
}
```

## Constraints (enforced in application logic, not a DB engine)

- `messages[].role` must be one of `interviewer` | `user` — reject/ignore anything else on read.
- `claims` array length is capped at 8 (enforced at extraction time, per blueprint Day 3).
- `questionCount` hard-caps at 8; session must close at or before this value.
- `scores[].scores.*` values must be integers 0–100; malformed AI output falls back to a neutral default (e.g. 50) rather than crashing.
- All localStorage reads must be wrapped in try/catch with an empty-array fallback, since a corrupted or manually-edited value is possible in a client-only store.
- localStorage has a ~5–10MB browser-imposed size limit — store only the essential fields above, never full raw AI API response objects.

## Relationships

There is no relational database, so relationships are expressed by ID reference within a single JSON object, not foreign keys:

- `messages[].claimId` → `claims[].id`
- `scores[].claimId` → `claims[].id`
- `report.claimBreakdown[].claimId` → `claims[].id`

Everything lives inside one `Session` object — there is never a need to join across separate top-level collections.

## Validation Against PRD User Stories

| User story (PRD §4, §7) | Schema support |
|---|---|
| Paste resume → extract 5–8 claims | `claims[]`, capped array |
| Adaptive chat interview, 5–8 questions | `messages[]` + `questionCount` |
| Silent per-answer scoring, 4 axes | `scores[]` |
| Defense Report: dashboard + claim breakdown + coaching summary | `readinessPercent`, `report.claimBreakdown`, `report.coachingSummary` |
| Session history persists across reloads | Root `dye_sessions` array in localStorage |
| Replacing active profile doesn't erase history | Each session is a fully independent object; "replace profile" only clears **in-memory** active state, never touches `dye_sessions` |

No gaps found — schema fully covers every functional requirement in the PRD.
