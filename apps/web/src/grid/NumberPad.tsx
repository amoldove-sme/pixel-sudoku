import { useGameStore } from '../game/store';
import { SUDOKU_COLORS } from '../game/colors';
import styles from './NumberPad.module.css';

export function NumberPad() {
  const placeDigit = useGameStore(s => s.placeDigit);
  const clearCell = useGameStore(s => s.clearCell);
  const currentPuzzle = useGameStore(s => s.currentPuzzle);
  const isPixel = currentPuzzle?.mode === 'pixel';

  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className={styles.pad}>
      {digits.map(d => (
        <button
          key={d}
          className={styles.btn}
          onClick={() => placeDigit(d)}
          aria-label={`Place ${d}`}
        >
          {isPixel ? (
            <span
              className={styles.colorSwatch}
              style={{ backgroundColor: SUDOKU_COLORS[d] }}
            />
          ) : (
            d
          )}
        </button>
      ))}
      <button
        className={`${styles.btn} ${styles.clearBtn}`}
        onClick={clearCell}
        aria-label="Clear cell"
      >
        Clear
      </button>
    </div>
  );
}
