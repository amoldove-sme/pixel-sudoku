import { Cell } from './Cell';
import styles from './Grid.module.css';

export function Grid() {
  const cells: React.ReactNode[] = [];

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const extraClasses: string[] = [];
      if (row === 2 || row === 5) extraClasses.push(styles.row3Border);
      if (row === 3 || row === 6) extraClasses.push(styles.row4Border);

      cells.push(
        <div key={`${row}-${col}`} className={extraClasses.join(' ')}>
          <Cell row={row} col={col} />
        </div>
      );
    }
  }

  return (
    <div className={styles.grid} role="grid" aria-label="Sudoku grid">
      {cells}
    </div>
  );
}
