# Changelog

## [Unreleased]

- Moved questions to `questions.json` (160 questions total, 80 randomly selected per exam)
- Added 80 new PSM-I questions including True/False and multi-select types
- Security hardened `index.html`: pinned CDN versions with SRI hashes, added CSP, error handling
- Removed dead code and unused Babel script block from `index.html`

## Bug Fixes

- Fixed state persistence triggering on every timer tick (#4)
- Fixed timer race condition on auto-submit (#5)
- Fixed restored state not validated (#25)
- Replaced direct DOM mutation with CSS hover (#3)
- Moved global styles to render in all phases (#11, #12)
- Added console.warn to storage error handlers (#2)
- Added ARIA attributes for accessibility (#6)
- Added Prettier with config

## Initial State

- PSM-I practice exam with 80 questions across 6 categories (Scrum Theory, Scrum Values, Scrum Team, Scrum Events, Artifacts & Commitments, Scenarios)
- 60-minute timed exam with 85% pass threshold
- Question flagging, navigation overview, and state persistence
- Review screen with per-category scoring, answer filtering, and explanations
