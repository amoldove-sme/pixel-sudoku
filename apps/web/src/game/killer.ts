import type { KillerCage } from '../types/puzzle';
import type { CellState } from '../types/game';

type Grid = CellState[][];

export function getCageForCell(cages: KillerCage[], row: number, col: number): KillerCage | undefined {
  return cages.find(cage => cage.cells.some(([r, c]) => r === row && c === col));
}

export function validateCageSum(cage: KillerCage, grid: Grid): { complete: boolean; valid: boolean } {
  let sum = 0;
  let filledCount = 0;
  for (const [r, c] of cage.cells) {
    const val = grid[r][c].value;
    if (val !== null) {
      sum += val;
      filledCount++;
    }
  }
  const complete = filledCount === cage.cells.length;
  if (complete) {
    return { complete: true, valid: sum === cage.sum };
  }
  // Partial: check if current sum already exceeds target
  return { complete: false, valid: sum < cage.sum };
}

export function validateCageUniqueness(cage: KillerCage, grid: Grid): boolean {
  const seen = new Set<number>();
  for (const [r, c] of cage.cells) {
    const val = grid[r][c].value;
    if (val !== null) {
      if (seen.has(val)) return false;
      seen.add(val);
    }
  }
  return true;
}

export function getAllCageErrors(cages: KillerCage[], grid: Grid): Set<string> {
  const errors = new Set<string>();
  for (const cage of cages) {
    const sumResult = validateCageSum(cage, grid);
    const unique = validateCageUniqueness(cage, grid);
    if ((sumResult.complete && !sumResult.valid) || !unique) {
      errors.add(cage.id);
    }
  }
  return errors;
}
