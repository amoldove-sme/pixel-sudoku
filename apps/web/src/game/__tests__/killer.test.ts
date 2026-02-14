import { describe, it, expect } from 'vitest';
import {
  getCageForCell,
  validateCageSum,
  validateCageUniqueness,
  getAllCageErrors,
} from '../killer';
import type { KillerCage } from '../../types/puzzle';
import type { CellState } from '../../types/game';

function makeGrid(values: (number | null)[][]): CellState[][] {
  return values.map(row =>
    row.map(v => ({ value: v, isGiven: false, hasConflict: false }))
  );
}

function emptyGrid(): CellState[][] {
  return makeGrid(Array.from({ length: 9 }, () => Array(9).fill(null)));
}

const sampleCages: KillerCage[] = [
  { id: 'c1', sum: 8, cells: [[0, 0], [0, 1]] },       // 5+3=8
  { id: 'c2', sum: 15, cells: [[0, 2], [0, 3], [0, 4]] }, // 4+6+7=17... we'll use correct sums in tests
  { id: 'c3', sum: 10, cells: [[1, 0], [1, 1]] },
];

describe('getCageForCell', () => {
  it('returns the cage containing the cell', () => {
    const cage = getCageForCell(sampleCages, 0, 0);
    expect(cage).toBeDefined();
    expect(cage!.id).toBe('c1');
  });

  it('returns the correct cage for a different cell', () => {
    const cage = getCageForCell(sampleCages, 0, 3);
    expect(cage).toBeDefined();
    expect(cage!.id).toBe('c2');
  });

  it('returns undefined for a cell not in any cage', () => {
    const cage = getCageForCell(sampleCages, 5, 5);
    expect(cage).toBeUndefined();
  });
});

describe('validateCageSum', () => {
  it('returns complete and valid when sum matches', () => {
    const grid = emptyGrid();
    grid[0][0].value = 5;
    grid[0][1].value = 3;
    const cage: KillerCage = { id: 'c1', sum: 8, cells: [[0, 0], [0, 1]] };
    const result = validateCageSum(cage, grid);
    expect(result.complete).toBe(true);
    expect(result.valid).toBe(true);
  });

  it('returns complete and invalid when sum does not match', () => {
    const grid = emptyGrid();
    grid[0][0].value = 5;
    grid[0][1].value = 4;
    const cage: KillerCage = { id: 'c1', sum: 8, cells: [[0, 0], [0, 1]] };
    const result = validateCageSum(cage, grid);
    expect(result.complete).toBe(true);
    expect(result.valid).toBe(false);
  });

  it('returns incomplete and valid when partial sum is under target', () => {
    const grid = emptyGrid();
    grid[0][0].value = 3;
    const cage: KillerCage = { id: 'c1', sum: 8, cells: [[0, 0], [0, 1]] };
    const result = validateCageSum(cage, grid);
    expect(result.complete).toBe(false);
    expect(result.valid).toBe(true);
  });

  it('returns incomplete and invalid when partial sum exceeds target', () => {
    const grid = emptyGrid();
    grid[0][0].value = 9;
    const cage: KillerCage = { id: 'c1', sum: 8, cells: [[0, 0], [0, 1]] };
    const result = validateCageSum(cage, grid);
    expect(result.complete).toBe(false);
    expect(result.valid).toBe(false);
  });

  it('handles empty cage cells', () => {
    const grid = emptyGrid();
    const cage: KillerCage = { id: 'c1', sum: 8, cells: [[0, 0], [0, 1]] };
    const result = validateCageSum(cage, grid);
    expect(result.complete).toBe(false);
    expect(result.valid).toBe(true); // 0 < 8
  });
});

describe('validateCageUniqueness', () => {
  it('returns true when all values are unique', () => {
    const grid = emptyGrid();
    grid[0][0].value = 1;
    grid[0][1].value = 2;
    grid[0][2].value = 3;
    const cage: KillerCage = { id: 'c1', sum: 6, cells: [[0, 0], [0, 1], [0, 2]] };
    expect(validateCageUniqueness(cage, grid)).toBe(true);
  });

  it('returns false when values repeat', () => {
    const grid = emptyGrid();
    grid[0][0].value = 2;
    grid[0][1].value = 2;
    const cage: KillerCage = { id: 'c1', sum: 4, cells: [[0, 0], [0, 1]] };
    expect(validateCageUniqueness(cage, grid)).toBe(false);
  });

  it('returns true when some cells are empty', () => {
    const grid = emptyGrid();
    grid[0][0].value = 5;
    const cage: KillerCage = { id: 'c1', sum: 8, cells: [[0, 0], [0, 1]] };
    expect(validateCageUniqueness(cage, grid)).toBe(true);
  });

  it('returns true for completely empty cage', () => {
    const grid = emptyGrid();
    const cage: KillerCage = { id: 'c1', sum: 8, cells: [[0, 0], [0, 1]] };
    expect(validateCageUniqueness(cage, grid)).toBe(true);
  });
});

describe('getAllCageErrors', () => {
  it('returns empty set when all cages are valid', () => {
    const grid = emptyGrid();
    grid[0][0].value = 5;
    grid[0][1].value = 3;
    const cages: KillerCage[] = [
      { id: 'c1', sum: 8, cells: [[0, 0], [0, 1]] },
    ];
    const errors = getAllCageErrors(cages, grid);
    expect(errors.size).toBe(0);
  });

  it('returns cage IDs with incorrect sums', () => {
    const grid = emptyGrid();
    grid[0][0].value = 5;
    grid[0][1].value = 5;
    const cages: KillerCage[] = [
      { id: 'c1', sum: 8, cells: [[0, 0], [0, 1]] }, // sum=10, not 8, and duplicates
    ];
    const errors = getAllCageErrors(cages, grid);
    expect(errors.has('c1')).toBe(true);
  });

  it('detects uniqueness violations as errors', () => {
    const grid = emptyGrid();
    grid[0][0].value = 4;
    grid[0][1].value = 4;
    const cages: KillerCage[] = [
      { id: 'c1', sum: 8, cells: [[0, 0], [0, 1]] }, // sum correct but duplicates
    ];
    const errors = getAllCageErrors(cages, grid);
    expect(errors.has('c1')).toBe(true);
  });

  it('does not flag incomplete cages as errors', () => {
    const grid = emptyGrid();
    grid[0][0].value = 3;
    // grid[0][1] is still null
    const cages: KillerCage[] = [
      { id: 'c1', sum: 8, cells: [[0, 0], [0, 1]] },
    ];
    const errors = getAllCageErrors(cages, grid);
    expect(errors.size).toBe(0);
  });

  it('handles multiple cages with mixed validity', () => {
    const grid = emptyGrid();
    grid[0][0].value = 5;
    grid[0][1].value = 3;
    grid[1][0].value = 6;
    grid[1][1].value = 6; // duplicate in c2
    const cages: KillerCage[] = [
      { id: 'c1', sum: 8, cells: [[0, 0], [0, 1]] },  // valid
      { id: 'c2', sum: 12, cells: [[1, 0], [1, 1]] },  // invalid (duplicates)
    ];
    const errors = getAllCageErrors(cages, grid);
    expect(errors.has('c1')).toBe(false);
    expect(errors.has('c2')).toBe(true);
  });
});
