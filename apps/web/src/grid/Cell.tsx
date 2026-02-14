import { useGameStore } from '../game/store';
import { getCageForCell } from '../game/killer';
import { SUDOKU_COLORS } from '../game/colors';
import type { KillerPuzzle, KillerCage } from '../types/puzzle';
import styles from './Cell.module.css';

interface CellProps {
  row: number;
  col: number;
}

function getCageBorders(
  cage: KillerCage,
  row: number,
  col: number
): string[] {
  const classes: string[] = [];
  const inCage = (r: number, c: number) =>
    cage.cells.some(([cr, cc]) => cr === r && cc === c);

  if (!inCage(row - 1, col)) classes.push(styles.cageTop);
  if (!inCage(row + 1, col)) classes.push(styles.cageBottom);
  if (!inCage(row, col - 1)) classes.push(styles.cageLeft);
  if (!inCage(row, col + 1)) classes.push(styles.cageRight);

  return classes;
}

function isTopLeftOfCage(cage: KillerCage, row: number, col: number): boolean {
  // Top-left = the cell with the smallest row, then smallest col
  let minRow = 9, minCol = 9;
  for (const [r, c] of cage.cells) {
    if (r < minRow || (r === minRow && c < minCol)) {
      minRow = r;
      minCol = c;
    }
  }
  return row === minRow && col === minCol;
}

export function Cell({ row, col }: CellProps) {
  const cell = useGameStore(s => s.grid[row][col]);
  const selectedCell = useGameStore(s => s.selectedCell);
  const currentPuzzle = useGameStore(s => s.currentPuzzle);
  const cageErrors = useGameStore(s => s.cageErrors);
  const selectCell = useGameStore(s => s.selectCell);

  const isSelected = selectedCell?.[0] === row && selectedCell?.[1] === col;
  const isPixel = currentPuzzle?.mode === 'pixel';
  const isKiller = currentPuzzle?.mode === 'killer';

  const classNames = [styles.cell];
  if (cell.isGiven) classNames.push(styles.given);
  if (isSelected) classNames.push(styles.selected);
  if (cell.hasConflict) classNames.push(styles.conflict);

  let cage: KillerCage | undefined;
  if (isKiller) {
    const killerPuzzle = currentPuzzle as KillerPuzzle;
    cage = getCageForCell(killerPuzzle.cages, row, col);
    if (cage) {
      classNames.push(...getCageBorders(cage, row, col));
      if (cageErrors.has(cage.id)) {
        classNames.push(styles.cageError);
      }
    }
  }

  if (isPixel && cell.value) {
    classNames.push(styles.pixelCell);
  }

  const pixelStyle = isPixel && cell.value
    ? { backgroundColor: SUDOKU_COLORS[cell.value] }
    : undefined;

  return (
    <div
      className={classNames.join(' ')}
      style={pixelStyle}
      onClick={() => selectCell(row, col)}
      role="gridcell"
      aria-label={`Row ${row + 1}, Column ${col + 1}${cell.value ? `, value ${cell.value}` : ', empty'}`}
    >
      {isKiller && cage && isTopLeftOfCage(cage, row, col) && (
        <span className={styles.cageSum}>{cage.sum}</span>
      )}
      {!isPixel && cell.value}
    </div>
  );
}
