# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Single-file React application (`psm-exam.jsx`) — a PSM-I (Professional Scrum Master I) practice exam simulator based on the Scrum Guide 2020. The component is designed to be embedded in a host environment (not a standalone app with its own build system).

## Architecture

The entire app lives in `psm-exam.jsx` as a default-exported React component (`PSMExam`) with no external dependencies beyond React.

### Component Structure
- **`PSMExam`** — Root component managing exam lifecycle via `phase` state: `loading` → `start` → `exam` → `review`
- **`StartScreen`** — Landing page with exam info
- **`QuestionCard`** — Renders a single question with single-select (radio) or multi-select (checkbox) options
- **`ReviewScreen`** — Post-exam results with filtering (all/wrong/correct/flagged), per-category score breakdown, and expandable explanations

### Key Design Decisions
- **All 80 questions are defined inline** in the `QUESTIONS` array at the top of the file. Each question has: `id`, `category`, `question`, `type` ("single"/"multiple"), `options`, `correct` (array of 0-based indices), and `explanation`
- **State persistence** uses `window.storage` (host-provided API, not localStorage) via `saveState`/`loadState`/`clearState` at key `"psm-exam-state"` — allows resuming an in-progress exam
- **Questions are shuffled** on each new exam start via Fisher-Yates shuffle
- **All styling is inline** — no CSS files, no CSS-in-JS library. Uses DM Sans font loaded via Google Fonts CDN
- **Exam config**: 60-minute timer (`TOTAL_TIME`), 85% pass threshold (`PASS_PERCENTAGE`), 80 questions
- **Question flagging**: Users can flag questions for review; flagged state persists and is filterable in the review screen

### Categories
Questions span 6 categories: Scrum Theory, Scrum Values, Scrum Team, Scrum Events, Artifacts & Commitments, Scenarios. Category colors are defined in `QuestionCard`'s `catColors` object.

## Development Notes

- No package.json, no build toolchain — this JSX file is consumed by an external host/runtime
- When adding questions, follow the existing `QUESTIONS` array schema exactly. The `correct` array uses 0-based indices into `options`
- Multi-select questions must include `selectCount` to indicate how many answers the user should choose
- The timer auto-submits the exam when it reaches zero
