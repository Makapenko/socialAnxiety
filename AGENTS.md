# Repository Guidelines

## Project Structure & Module Organization
This repository is a small static web app. The entry point is [`index.html`](index.html), which loads shared styles from [`styles.css`](styles.css) and scripts from [`js/`](js/). Main runtime files are:

- [`js/app.js`](js/app.js) for app bootstrapping
- [`js/state.js`](js/state.js) for shared state
- [`js/utils.js`](js/utils.js) for helper functions
- [`js/handlers.js`](js/handlers.js) for UI/event logic
- [`js/views/`](js/views/) for tab-specific screens such as `today.js`, `assessment.js`, and `health.js`

Static assets live alongside the source in `css/`, `js/`, and the root HTML/CSS files. There is no build output directory in the repo.

## Build, Test, and Development Commands
There is no package manager or build pipeline in this project. Use a local static server while developing:

- `python3 -m http.server 8000` - serves the repository at `http://localhost:8000`
- `npx serve .` - alternative static server if Node.js is available

Open `index.html` directly only for very quick checks; a local server is safer for script loading and navigation.

## Coding Style & Naming Conventions
Follow the existing style in the codebase:

- Use 2-space indentation in HTML, CSS, and JavaScript.
- Keep filenames lowercase with descriptive names, e.g. `js/views/today.js`.
- Prefer small, focused modules and named functions over large inline blocks.
- Keep UI strings in Russian unless you are intentionally adding English copy.

No formatter or linter is configured, so match the surrounding style before introducing new patterns.

## Testing Guidelines
There is no automated test suite yet. Verify changes manually in the browser:

- Reload the app and confirm each bottom-nav tab works.
- Check the main flows after editing state, handlers, or view files.
- Test in a narrow viewport as well as desktop width.

If you add tests later, keep them close to the affected module and document the runner in this file.

## Commit & Pull Request Guidelines
Git history is currently minimal and uses short imperative commits, such as `Commit all changes`. Keep commit messages concise and action-focused.

Pull requests should include:

- A short summary of what changed and why
- Notes on manual verification
- Screenshots or screen recordings for UI changes
- Links to related issues, if applicable

## Agent Notes
Do not introduce a build system unless the task explicitly requires it. When editing, prefer targeted changes that preserve the current static structure.
