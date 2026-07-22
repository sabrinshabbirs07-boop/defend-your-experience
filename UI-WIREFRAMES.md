# UI-WIREFRAMES.md — Defend Your Experience

## User Flow (see "screen_flow_diagram" above)

1. **Onboarding** → paste resume text
2. **Claims Review** → confirm what will be interviewed on
3. **Chat Interview** → 5–8 adaptive questions
4. **Defense Report** → readiness dashboard, claim breakdown, coaching summary
5. **History** → accessible any time via nav; reopening a report returns here; starting a new session loops back to Onboarding

Every screen exists for one clear reason — there is no screen in this flow that isn't directly required by a PRD user story.

## Navigation

- Persistent top-left: app name/logo (non-interactive in v1.0)
- Persistent top-right: "History" link, always available except mid-interview (to avoid accidental session loss — a confirm dialog guards leaving an active chat)
- No sidebar, no multi-level nav — this is a linear, single-path product by design (matches "single active profile" scope decision)

## Screen 1 — Onboarding

```
┌─────────────────────────────────────────────┐
│  Defend Your Experience            [History]│
├─────────────────────────────────────────────┤
│                                               │
│   Your resume got you the interview.         │
│   Can you defend it?                         │
│                                               │
│   ┌───────────────────────────────────────┐ │
│   │ Paste your resume / project text here │ │
│   │                                        │ │
│   │                                        │ │
│   └───────────────────────────────────────┘ │
│   (min 100 characters)                       │
│                                               │
│              [ Analyze Resume ]  (disabled   │
│                until text entered)            │
└─────────────────────────────────────────────┘
```
*Stretch (Day 7): a small "or upload PDF/DOCX" link appears below the textarea, opening a file picker; extracted text pre-fills the textarea for review before analyzing.*

## Screen 2 — Claims Review

```
┌─────────────────────────────────────────────┐
│  ← Back                            [History]│
├─────────────────────────────────────────────┤
│  Here's what we'll ask you about:            │
│                                               │
│   ● Built a real-time chat app (Project)     │
│   ● Led a team of 4 interns (Behavioral)     │
│   ● AWS certification (Certification)        │
│   ● 92% test coverage claim (Project)        │
│   ...                                        │
│                                               │
│              [ Start Interview ]              │
└─────────────────────────────────────────────┘
```

## Screen 3 — Chat Interview

```
┌─────────────────────────────────────────────┐
│  Question 3 of ~6              [History]     │
├─────────────────────────────────────────────┤
│  🤖 You mentioned 92% test coverage — how    │
│     did you actually measure that?           │
│                                               │
│                    I used Jest's built-in 🧑 │
│                    coverage reporter...        │
│                                               │
│  🤖 typing...                                │
│                                               │
├─────────────────────────────────────────────┤
│  [ Type your answer...              ] [Send] │
└─────────────────────────────────────────────┘
```
- Message bubbles left-aligned (interviewer) / right-aligned (user)
- Typing indicator shown while `/api/interview-turn` is in flight
- Scoring happens silently — nothing about it is visible on this screen

## Screen 4 — Defense Report

```
┌─────────────────────────────────────────────┐
│  Your Defense Report                [History]│
├─────────────────────────────────────────────┤
│   Overall Readiness: 74%                     │
│   [====progress bar====]                     │
│                                               │
│   Confidence 80  Depth 65  Comm 78  Evid 68  │
│   [bar] [bar] [bar] [bar]                    │
│                                               │
│   Claim: "92% test coverage"                 │
│   ✓ Convincing: clear tooling knowledge      │
│   ✗ Weak: no explanation of what's untested  │
│   → Improvement: prepare a specific example  │
│                                               │
│   AI Coaching Summary                        │
│   Strongest areas: ...                       │
│   Biggest risks: ...                         │
│   Stories to prepare: ...                    │
│   Concepts to revise: ...                    │
│                                               │
│         [ Start New Session ]                │
└─────────────────────────────────────────────┘
```

## Screen 5 — History

```
┌─────────────────────────────────────────────┐
│  Past Sessions                     [+ New]   │
├─────────────────────────────────────────────┤
│  Jul 20, 2026 — Readiness 74%      [Open]   │
│  Jul 15, 2026 — Readiness 61%      [Open]   │
│                                               │
│  (empty state: "No sessions yet — analyze    │
│   your resume to get started")                │
└─────────────────────────────────────────────┘
```

## Responsive Notes (Day 8 target, documented now for planning)

- Mobile (~375px): chat bubbles constrain to `max-width: 85%` with word-wrap; input bar becomes sticky bottom bar.
- Tablet (~768px): claims review and report screens shift from any wide layout to single-column stacking.
- All screens keep a consistent dark-panel, accent-gradient visual language per your established design pattern (see memory: dark themes, glassmorphism, brass/amber or electric-blue accents — final palette choice deferred to Day 8 polish, not decided today).
