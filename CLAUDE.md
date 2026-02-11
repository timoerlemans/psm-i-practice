# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PSM-I (Professional Scrum Master I) practice exam simulator based on the Scrum Guide 2020. React component (`psm-exam.jsx`) with questions loaded from `questions.json`. Deployable standalone via `index.html` (GitHub Pages) or embeddable in a host environment.

## Architecture

- **`psm-exam.jsx`** — Main React component (default export `PSMExam`), no external dependencies beyond React
- **`questions.json`** — Question pool (160+ questions), loaded at runtime via fetch
- **`index.html`** — Standalone entry point using React/Babel from CDN with SRI hashes; polyfills `window.storage` with localStorage

### Component Structure

- **`PSMExam`** — Root component managing exam lifecycle via `phase` state: `loading` → `start` → `exam` → `review`
- **`StartScreen`** — Landing page with exam info
- **`QuestionCard`** — Renders a single question with single-select (radio) or multi-select (checkbox) options
- **`ReviewScreen`** — Post-exam results with filtering (all/wrong/correct/flagged), per-category score breakdown, and expandable explanations

### Key Design Decisions

- **Questions loaded from `questions.json`** at runtime via `loadQuestions()`. Pool is cached after first load. Each exam randomly selects 80 questions (`EXAM_SIZE`) from the full pool via Fisher-Yates shuffle
- **State persistence** uses `window.storage` (host-provided API, not localStorage) via `saveState`/`loadState`/`clearState` at key `"psm-exam-state"`. State is saved on question/answer changes plus every 30 seconds (not every timer tick)
- **All styling is inline** — no CSS files, no CSS-in-JS library. Uses DM Sans font loaded via Google Fonts CDN
- **Exam config**: 60-minute timer (`TOTAL_TIME`), 85% pass threshold (`PASS_PERCENTAGE`), 80 questions per attempt (`EXAM_SIZE`)

### Question Schema (questions.json)

Each question object: `id`, `category`, `question`, `type` ("single"/"multiple"), `options` (string[]), `correct` (0-based index array), `explanation`. Multi-select questions also have `selectCount`.

Categories: Scrum Theory, Scrum Values, Scrum Team, Scrum Events, Artifacts & Commitments, Scenarios.

## Commands

- `npm run format` — format all files with Prettier
- `npm run format:check` — check formatting without writing

## Development Notes

- When adding questions, add them to `questions.json` following the existing schema. The `correct` array uses 0-based indices into `options`
- Multi-select questions must include `selectCount` to indicate how many answers the user should choose
- `index.html` uses Babel standalone to transform JSX at runtime — CDN scripts are pinned with SRI hashes
- GitHub Pages deployment: main branch, root directory
