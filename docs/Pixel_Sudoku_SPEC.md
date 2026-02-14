# Pixel Sudoku

Version 0.1 Author: Alex M Project Path:
/home/amoldove/projects/pixel-sudoku Scope: Non-commercial side project

------------------------------------------------------------------------

## 1. Vision

Pixel Sudoku is a modern, arcade-styled Sudoku suite inspired by Pixel
Arcade.

It includes three modes: 1. Sudoku Classic 2. Killer Sudoku 3. Pixel
Sudoku (color-based variant)

The UI should preserve the playful, colorful, arcade feel of Pixel
Arcade.

------------------------------------------------------------------------

## 2. Game Modes

### 2.1 Sudoku Classic

Rules: - 9x9 grid - Rows, columns, and 3x3 boxes contain digits 1--9
exactly once - No duplicates in row, column, or box - Exactly one valid
solution

Content: - 3 puzzles (Easy, Medium, Hard)

------------------------------------------------------------------------

### 2.2 Killer Sudoku

Rules: - Standard Sudoku constraints - Cages with sum clues - Cage
digits must be unique - Cage digits must sum to clue - Typically no
pre-filled numbers

Content: - 3 puzzles (Easy, Medium, Hard)

------------------------------------------------------------------------

### 2.3 Pixel Sudoku

Rules: - Same as Classic Sudoku - Digits represented as 9 distinct
colors - Learn mode shows number + color - Normal mode shows color only

Content: - 3 puzzles (Easy, Medium, Hard)

------------------------------------------------------------------------

## 3. Data Format

Classic / Pixel:

{ "id": "classic-001", "mode": "classic", "difficulty": "easy",
"givens": \[\[row, col, digit\]\], "solution": \[\[9x9 solution grid\]\]
}

Killer:

{ "id": "killer-001", "mode": "killer", "difficulty": "easy", "cages":
\[ { "id": "c1", "sum": 10, "cells": \[\[0,0\],\[0,1\]\] } \],
"solution": \[\[9x9 solution grid\]\] }

All puzzles must include full solution for validation.

------------------------------------------------------------------------

## 4. Architecture

Modules:

grid/ - Placement validation - Conflict detection - Win check

killer/ - Cage model - Sum validation - Cage uniqueness

state/ - Grid values - Givens mask - Selected cell - Timer (future) -
Undo stack (future)

------------------------------------------------------------------------

## 5. MVP Roadmap

### MVP

-   3 puzzles per mode (9 total)
-   Mode select screen
-   Grid interaction
-   Conflict highlighting
-   Killer cage validation
-   Pixel color rendering
-   Win detection

### MVP1

-   Undo / redo
-   Pencil marks
-   Timer
-   Save progress (localStorage)

### MVP2

-   Hint system
-   Scoring
-   Star ratings
-   Arcade map UI
-   Daily puzzle (client-seeded)

### MVP3

-   Puzzle packs
-   Classic generator
-   Backend-ready API stubs
    -   /api/daily
    -   /api/events

------------------------------------------------------------------------

## 6. Acceptance Criteria

-   9 puzzles playable
-   Correct validation in all modes
-   Killer cages enforced correctly
-   Pixel color mapping consistent
-   Runs with npm run dev
-   Works on Windows 11 + WSL

------------------------------------------------------------------------

End of Pixel Sudoku SPEC
