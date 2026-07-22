# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository overview

This is a single-file, static memory game ("Jeu de mémoire – Retiens les chiffres") built as one self-contained HTML document with inline CSS and JavaScript — no build step, no package manager, no dependencies.

- `jeu-memoire-complet.html` — the entire application (markup, styles, and game logic all in one file).
- `README.md` — currently **not documentation**: it is an accidental byte-for-byte duplicate of `jeu-memoire-complet.html` (created as a separate upload rather than a written README). Don't treat its contents as project docs; if asked to fix/write the README, replace it with an actual description rather than merging changes into it.

There is no `package.json`, test suite, linter, or CI configuration in this repo.

## Running / testing the app

There is no build or dev-server tooling. To try changes, simply open the file directly in a browser:

```bash
xdg-open jeu-memoire-complet.html   # or: open jeu-memoire-complet.html on macOS
```

Or serve it locally if you need `http://` instead of `file://` semantics (e.g. for testing `localStorage` behavior consistently):

```bash
python3 -m http.server 8000
```

Verify changes manually in a browser — there are no automated tests. When touching game logic, exercise the golden path (generate → wait → type the correct sequence) and the failure path (wrong answer), plus theme toggle, language switch, and reset.

## Architecture

Everything lives in `jeu-memoire-complet.html` as three inline blocks:

1. **`<style>`** — all CSS, including a `body.dark-mode` class that toggles dark/light theme colors.
2. **`<body>`** — the DOM: digit-count/time inputs, the sequence display, a progress bar, the answer input, and a history panel.
3. **`<script>`** — game logic, structured around a few key functions:
   - `genererChiffres()` — generates a random digit string of the requested length, displays it, then runs a `setInterval`-driven progress bar; when the timer elapses it hides the sequence and reveals the answer input.
   - `verifier()` — compares the typed answer to the generated sequence, shows a success/failure message, and appends a `{date, reussi, suite}` record to history.
   - `afficherHistorique()` — recomputes and renders aggregate stats (success rate, average digit count) and the last 10 history entries.
   - `changerTheme()` / `changerLangue()` — toggle dark mode and swap UI text via the `traductions` object (supports `fr`, `en`, `uk`, `ru`).
   - `chargerDefi()` — runs on `window.onload`; restores saved theme/language from `localStorage` and re-renders history.

**State persistence**: all state is client-side only, via `localStorage` keys:
- `historiqueMemoire` — JSON array of past game results.
- `themeMemoire` — `"dark"` or `"light"`.
- `langueMemoire` — language code (`fr`/`en`/`uk`/`ru`).

There is no server, no framework, and no build pipeline — when adding a UI string, extend the `traductions` object for every supported language, and when adding a DOM element referenced from JS, wire it up by `id` the same way existing elements are (`document.getElementById(...)`).
