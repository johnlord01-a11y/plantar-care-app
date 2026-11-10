# Plantar Fasciitis Care — Daily Recovery Plan

A small web app that walks a patient through a daily plantar fasciitis
treatment plan and tracks whether they are actually getting better.

Built around Dr. John Lord's three-part approach:

1. **Protect the injured tissue** — stability shoes, insoles, compression,
   night splint
2. **Reduce inflammation by hand** — heel massage 4x/day, plantar fascia and
   calf stretches
3. **Keep the body from making as much inflammation** — anti-inflammatory
   medication as directed, plus diet and exercise

## Features

- **Today's Plan** — a daily checklist generated from the patient's
  anti-inflammatory protocol (ibuprofen low dose, naproxen as directed, or a
  prescribed steroid taper), with check-offs saved per day
- **Pain scores** — morning first-step pain and evening pain (0–10), recorded
  daily
- **Progress** — a 14-day history with plan completion and pain scores, a
  "percent better" figure once enough days are recorded, and the two-week
  check-in used in the clinic (most people are at least half better by day 14
  when the plan is followed consistently)
- **Care Guide** — the full protocol in plain language: shoe list, insoles,
  massage and stretch instructions, medication framing and safety, and red
  flags for when to get checked

All data is stored in the browser's localStorage. There is no account and no
server.

## Editing the clinical content

Everything clinical — daily tasks, medication protocols, the guide text,
the shoe table, red flags — lives in **`src/plan.js`**, separate from the UI
in `src/App.jsx`. Edit the words in `plan.js` and the app updates everywhere.

This app is education only. It reflects how Dr. John Lord, DPM approaches
plantar fasciitis care in his practice; it is not medical advice for any
individual reader.

## Develop

```bash
npm install
npm run dev     # local dev server
npm run build   # production build
npm run lint    # oxlint
```

React 19 + Vite + Tailwind CSS 4.
