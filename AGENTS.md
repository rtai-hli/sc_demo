# AGENTS.md

## Cursor Cloud specific instructions

This is a self-contained Next.js 16 app ("What to Eat Today" food wheel) with an embedded SQLite database (via `better-sqlite3`). No external services, Docker, or environment variables are needed.

### Running the app

- `npm run dev` — starts the Next.js dev server on port 3000
- `npm run build` — production build
- `npm run lint` — runs ESLint (pre-existing warnings/errors exist in the codebase)

### Key caveats

- The SQLite database file (`food-wheel.db`) is auto-created in the project root on first API request. No migrations or manual DB setup needed.
- `better-sqlite3` is a native Node addon; if `node_modules` is deleted or Node.js is upgraded, `npm install` must be re-run to rebuild it.
- There is no test framework configured (no Jest, Vitest, Playwright, or Cypress). Automated testing requires manual setup.
- The `npm run lint` command exits with code 1 due to pre-existing lint errors in the codebase — this is expected and not caused by agent changes.
- See `README.md` for standard Next.js project commands.
