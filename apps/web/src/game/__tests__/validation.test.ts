import { describe, it, expect } from 'vitest';
import {
  getRowConflicts,
  getColConflicts,
  getBoxConflicts,
  getAllConflicts,
  isGridComplete,
} from '../validation';
import type { CellState } from '../../types/game';

function makeGrid(values: (number | null)[][]): CellState[][] {
  return values.map(row =>
    row.map(v => ({ value: v, isGiven: false, hasConflict: false }))
  );
}

function emptyGrid(): CellState[][] {
  return makeGrid(Array.from({ length: 9 }, () => Array(9).fill(null)));
}

const VALID_SOLUTION = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9],
];

describe('getRowConflicts', () => {
  it('returns empty array when no conflicts', () => {
    const grid = emptyGrid();
    grid[0][0].value = 1;
    grid[0][1].value = 2;
    grid[0][2].value = 3;
    expect(getRowConflicts(grid, 0, 0)).toEqual([]);
  });

  it('returns empty array for null cell', () => {
    const grid = emptyGrid();
    expect(getRowConflicts(grid, 0, 0)).toEqual([]);
  });

  it('detects row duplicates', () => {
    const grid = emptyGrid();
    grid[0][0].value = 5;
    grid[0][4].value = 5;
    const conflicts = getRowConflicts(grid, 0, 0);
    expect(conflicts).toEqual([[0, 4]]);
  });

  it('detects multiple row duplicates', () => {
    const grid = emptyGrid();
    grid[0][0].value = 5;
    grid[0][3].value = 5;
    grid[0][7].value = 5;
    const conflicts = getRowConflicts(grid, 0, 0);
    expect(conflicts).toHaveLength(2);
    expect(conflicts).toContainEqual([0, 3]);
    expect(conflicts).toContainEqual([0, 7]);
  });
});

describe('getColConflicts', () => {
  it('returns empty array when no conflicts', () => {
    const grid = emptyGrid();
    grid[0][0].value = 1;
    grid[1][0].value = 2;
    expect(getColConflicts(grid, 0, 0)).toEqual([]);
  });

  it('detects column duplicates', () => {
    const grid = emptyGrid();
    grid[0][0].value = 3;
    grid[5][0].value = 3;
    const conflicts = getColConflicts(grid, 0, 0);
    expect(conflicts).toEqual([[5, 0]]);
  });
});

describe('getBoxConflicts', () => {
  it('returns empty array when no conflicts in box', () => {
    const grid = emptyGrid();
    grid[0][0].value = 1;
    grid[0][1].value = 2;
    grid[1][0].value = 3;
    expect(getBoxConflicts(grid, 0, 0)).toEqual([]);
  });

  it('detects box duplicates', () => {
    const grid = emptyGrid();
    grid[0][0].value = 7;
    grid[2][2].value = 7;
    const conflicts = getBoxConflicts(grid, 0, 0);
    expect(conflicts).toEqual([[2, 2]]);
  });

  it('works for middle box', () => {
    const grid = emptyGrid();
    grid[3][3].value = 4;
    grid[5][5].value = 4;
    const conflicts = getBoxConflicts(grid, 3, 3);
    expect(conflicts).toEqual([[5, 5]]);
  });

  it('does not detect conflict across box boundaries', () => {
    const grid = emptyGrid();
    grid[0][0].value = 1;
    grid[0][3].value = 1; // Different box
    expect(getBoxConflicts(grid, 0, 0)).toEqual([]);
  });
});

describe('getAllConflicts', () => {
  it('returns empty set for valid partial grid', () => {
    const grid = emptyGrid();
    grid[0][0].value = 1;
    grid[1][1].value = 2;
    const conflicts = getAllConflicts(grid);
    expect(conflicts.size).toBe(0);
  });

  it('returns empty set for empty grid', () => {
    const grid = emptyGrid();
    expect(getAllConflicts(grid).size).toBe(0);
  });

  it('returns all conflicting cells', () => {
    const grid = emptyGrid();
    grid[0][0].value = 5;
    grid[0][4].value = 5; // row conflict
    const conflicts = getAllConflicts(grid);
    expect(conflicts.has('0,0')).toBe(true);
    expect(conflicts.has('0,4')).toBe(true);
  });

  it('returns empty set for complete valid solution', () => {
    const grid = makeGrid(VALID_SOLUTION);
    expect(getAllConflicts(grid).size).toBe(0);
  });

  it('detects conflict in complete grid with error', () => {
    const badSolution = VALID_SOLUTION.map(r => [...r]);
    badSolution[0][0] = 3; // was 5, now conflicts with [0][1] which is 3
    const grid = makeGrid(badSolution);
    const conflicts = getAllConflicts(grid);
    expect(conflicts.size).toBeGreaterThan(0);
    expect(conflicts.has('0,0')).toBe(true);
  });
});

describe('isGridComplete', () => {
  it('returns true when grid matches solution', () => {
    const grid = makeGrid(VALID_SOLUTION);
    expect(isGridComplete(grid, VALID_SOLUTION)).toBe(true);
  });

  it('returns false when grid has null cells', () => {
    const grid = makeGrid(VALID_SOLUTION);
    grid[0][0].value = null;
    expect(isGridComplete(grid, VALID_SOLUTION)).toBe(false);
  });

  it('returns false when grid has wrong value', () => {
    const grid = makeGrid(VALID_SOLUTION);
    grid[0][0].value = 9; // should be 5
    expect(isGridComplete(grid, VALID_SOLUTION)).toBe(false);
  });

  it('returns false for empty grid', () => {
    const grid = emptyGrid();
    expect(isGridComplete(grid, VALID_SOLUTION)).toBe(false);
  });
});
