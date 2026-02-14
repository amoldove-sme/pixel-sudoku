import type { CellState } from '../types/game';

type Grid = CellState[][];

export function getRowConflicts(grid: Grid, row: number, col: number): [number, number][] {
  const val = grid[row][col].value;
  if (val === null) return [];
  const conflicts: [number, number][] = [];
  for (let c = 0; c < 9; c++) {
    if (c !== col && grid[row][c].value === val) {
      conflicts.push([row, c]);
    }
  }
  return conflicts;
}

export function getColConflicts(grid: Grid, row: number, col: number): [number, number][] {
  const val = grid[row][col].value;
  if (val === null) return [];
  const conflicts: [number, number][] = [];
  for (let r = 0; r < 9; r++) {
    if (r !== row && grid[r][col].value === val) {
      conflicts.push([r, col]);
    }
  }
  return conflicts;
}

export function getBoxConflicts(grid: Grid, row: number, col: number): [number, number][] {
  const val = grid[row][col].value;
  if (val === null) return [];
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  const conflicts: [number, number][] = [];
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if ((r !== row || c !== col) && grid[r][c].value === val) {
        conflicts.push([r, c]);
      }
    }
  }
  return conflicts;
}

export function getAllConflicts(grid: Grid): Set<string> {
  const conflicts = new Set<string>();
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c].value === null) continue;
      const rowC = getRowConflicts(grid, r, c);
      const colC = getColConflicts(grid, r, c);
      const boxC = getBoxConflicts(grid, r, c);
      if (rowC.length > 0 || colC.length > 0 || boxC.length > 0) {
        conflicts.add(`${r},${c}`);
        for (const [cr, cc] of [...rowC, ...colC, ...boxC]) {
          conflicts.add(`${cr},${cc}`);
        }
      }
    }
  }
  return conflicts;
}

export function isGridComplete(grid: Grid, solution: number[][]): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c].value !== solution[r][c]) return false;
    }
  }
  return true;
}
