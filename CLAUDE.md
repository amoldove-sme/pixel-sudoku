# Pixel Sudoku — Project Guide

## Overview

Sudoku game suite (Classic, Killer, Pixel modes) with a dark arcade aesthetic. Monorepo using npm workspaces.

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Bundler:** Vite 6
- **State:** Zustand
- **Styling:** CSS Modules + CSS custom properties
- **Testing:** Vitest + Testing Library + jsdom
- **Routing:** React Router v7
- **Package manager:** npm workspaces

## Commands

```bash
npm install          # Install all workspace deps (run from root)
npm run dev          # Start dev server (Vite, localhost:5173)
npm run build        # TypeScript check + Vite production build
npm run test         # Run all unit tests (Vitest)
npm run lint         # TypeScript type-check only
```

To run tests in watch mode:
```bash
npm run test:watch -w apps/web
```

## Repo Structure

```
pixel-sudoku/
  package.json              # Root workspace config + scripts
  CLAUDE.md                 # This file
  apps/web/                 # Main web app
    src/
      main.tsx              # Entry point
      App.tsx               # Router setup
      theme.css             # Dark arcade theme (CSS custom properties)
      types/                # TypeScript interfaces (puzzle.ts, game.ts)
      game/                 # Pure game logic + Zustand store
        store.ts            # Zustand store
        validation.ts       # Row/col/box conflict detection
        killer.ts           # Cage sum/uniqueness validation
        colors.ts           # Digit-to-color mapping (Pixel mode)
        puzzles.ts          # Puzzle loader (fetches JSON from /data/)
        __tests__/          # Unit tests
      grid/                 # Grid components (Cell, Grid, NumberPad)
      components/           # Shared components (Header, ModeCard, PuzzleCard)
      screens/              # Route screens (Home, PuzzleSelect, Game)
  data/puzzles/             # Puzzle JSON files (served as public assets)
  docs/                     # Spec and deployment docs
```

## Development Practices

- **TDD:** Write tests first, then implementation. Tests live in `__tests__/` directories adjacent to source.
- **Pure functions:** Game logic (validation, killer, colors) is pure — no side effects. Easy to test.
- **CSS Modules:** Every component has a co-located `.module.css` file. Use `var(--*)` custom properties from `theme.css`.
- **No over-engineering:** Keep solutions simple. No premature abstractions.
- **Strict TypeScript:** `strict: true`, no unused locals/params.

## Testing

Tests use Vitest with jsdom environment. Test setup in `src/test-setup.ts` imports `@testing-library/jest-dom`.

Run a single test file:
```bash
cd apps/web && npx vitest run src/game/__tests__/validation.test.ts
```

## Puzzle Data Format

- **Classic/Pixel:** `{ id, mode, difficulty, givens: [row, col, value][], solution: number[][] }`
- **Killer:** `{ id, mode, difficulty, cages: { id, sum, cells: [row, col][] }[], solution: number[][] }`
- **Manifest:** `data/puzzles/puzzle-index.json` lists all puzzles with `{ id, mode, difficulty, filename }`

## Routes

- `/` — Mode select (Classic, Killer, Pixel)
- `/:mode` — Difficulty select
- `/:mode/:id` — Gameplay
