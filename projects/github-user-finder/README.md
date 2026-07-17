# GitHub User Finder (DevScope)

Search any GitHub username and get a full profile view: repos (paginated 6 per page), organizations, followers preview, recent activity, language color coding, dark/light theme, and a 10-item search history — all in vanilla JavaScript.

**Live:** [rhythmmittal19.github.io/projects/github-user-finder](https://rhythmmittal19.github.io/projects/github-user-finder/)

## How it works

- `js/api.js` — single `fetchGitHubData()` helper centralizes auth headers and error mapping (404 → user not found, 429 → rate limit); `getUserProfile()` fires 5 endpoints in parallel with `Promise.all`
- `js/state.js` / `js/storage.js` — search history and theme persisted to localStorage
- `js/ui.js` — DOM rendering, empty/error/loading states
- Plain script loading in dependency order (config → utils → storage → api → ui → app)

## Run locally

Open `index.html` in a browser. Optional: add a GitHub personal-access token in `js/config.js` (`TOKEN`) to raise the API rate limit — never commit a real token.

## What I learned

Parallel API orchestration with `Promise.all` and its fail-fast tradeoff, centralized error normalization, and why script order matters without ES modules.
