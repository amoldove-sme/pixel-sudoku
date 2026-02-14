import { create } from 'zustand';
import type { GameMode, Puzzle, PuzzleIndexEntry, KillerPuzzle, ClassicPuzzle } from '../types/puzzle';
import type { CellState, GameStatus } from '../types/game';
import { getAllConflicts, isGridComplete } from './validation';
import { getAllCageErrors } from './killer';
import { loadPuzzleIndex, loadPuzzle } from './puzzles';

interface GameStore {
  // State
  puzzleIndex: PuzzleIndexEntry[];
  currentPuzzle: Puzzle | null;
  grid: CellState[][];
  selectedCell: [number, number] | null;
  conflicts: Set<string>;
  cageErrors: Set<string>;
  gameMode: GameMode | null;
  status: GameStatus;

  // Actions
  fetchPuzzleIndex: () => Promise<void>;
  selectMode: (mode: GameMode) => void;
  selectPuzzle: (id: string) => Promise<void>;
  selectCell: (row: number, col: number) => void;
  placeDigit: (digit: number) => void;
  clearCell: () => void;
  reset: () => void;
}

function createEmptyGrid(): CellState[][] {
  return Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => ({
      value: null,
      isGiven: false,
      hasConflict: false,
    }))
  );
}

function initGridFromPuzzle(puzzle: Puzzle): CellState[][] {
  const grid = createEmptyGrid();

  if (puzzle.mode === 'classic' || puzzle.mode === 'pixel') {
    const cp = puzzle as ClassicPuzzle;
    for (const [row, col, val] of cp.givens) {
      grid[row][col] = { value: val, isGiven: true, hasConflict: false };
    }
  }
  // Killer puzzles start with an empty grid (no givens)

  return grid;
}

export const useGameStore = create<GameStore>((set, get) => ({
  puzzleIndex: [],
  currentPuzzle: null,
  grid: createEmptyGrid(),
  selectedCell: null,
  conflicts: new Set<string>(),
  cageErrors: new Set<string>(),
  gameMode: null,
  status: 'idle',

  fetchPuzzleIndex: async () => {
    const index = await loadPuzzleIndex();
    set({ puzzleIndex: index });
  },

  selectMode: (mode) => {
    set({ gameMode: mode, status: 'puzzle-select' });
  },

  selectPuzzle: async (id) => {
    const puzzle = await loadPuzzle(id);
    const grid = initGridFromPuzzle(puzzle);
    set({
      currentPuzzle: puzzle,
      grid,
      selectedCell: null,
      conflicts: new Set<string>(),
      cageErrors: new Set<string>(),
      status: 'playing',
    });
  },

  selectCell: (row, col) => {
    set({ selectedCell: [row, col] });
  },

  placeDigit: (digit) => {
    const { selectedCell, grid, currentPuzzle } = get();
    if (!selectedCell || !currentPuzzle) return;
    const [row, col] = selectedCell;
    if (grid[row][col].isGiven) return;

    const newGrid = grid.map(r => r.map(c => ({ ...c })));
    newGrid[row][col].value = digit;

    const conflicts = getAllConflicts(newGrid);

    // Update hasConflict flag on each cell
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        newGrid[r][c].hasConflict = conflicts.has(`${r},${c}`);
      }
    }

    let cageErrors = new Set<string>();
    if (currentPuzzle.mode === 'killer') {
      cageErrors = getAllCageErrors((currentPuzzle as KillerPuzzle).cages, newGrid);
    }

    const won = conflicts.size === 0 && isGridComplete(newGrid, currentPuzzle.solution);

    set({
      grid: newGrid,
      conflicts,
      cageErrors,
      status: won ? 'won' : 'playing',
    });
  },

  clearCell: () => {
    const { selectedCell, grid, currentPuzzle } = get();
    if (!selectedCell || !currentPuzzle) return;
    const [row, col] = selectedCell;
    if (grid[row][col].isGiven) return;

    const newGrid = grid.map(r => r.map(c => ({ ...c })));
    newGrid[row][col].value = null;

    const conflicts = getAllConflicts(newGrid);
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        newGrid[r][c].hasConflict = conflicts.has(`${r},${c}`);
      }
    }

    let cageErrors = new Set<string>();
    if (currentPuzzle.mode === 'killer') {
      cageErrors = getAllCageErrors((currentPuzzle as KillerPuzzle).cages, newGrid);
    }

    set({ grid: newGrid, conflicts, cageErrors });
  },

  reset: () => {
    set({
      currentPuzzle: null,
      grid: createEmptyGrid(),
      selectedCell: null,
      conflicts: new Set<string>(),
      cageErrors: new Set<string>(),
      gameMode: null,
      status: 'idle',
    });
  },
}));
