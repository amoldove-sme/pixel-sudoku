import { ModeCard } from '../components/ModeCard';
import styles from './HomeScreen.module.css';

export function HomeScreen() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Pixel Sudoku</h1>
      <p className={styles.subtitle}>Choose your game mode</p>
      <div className={styles.modes}>
        <ModeCard
          mode="classic"
          name="Classic"
          description="Traditional Sudoku. Fill the grid so every row, column, and 3x3 box contains 1-9."
        />
        <ModeCard
          mode="killer"
          name="Killer"
          description="No givens. Dashed cages show sum clues. Digits in each cage must be unique and sum to the target."
        />
        <ModeCard
          mode="pixel"
          name="Pixel"
          description="Sudoku with colors instead of numbers. Place 9 unique colors in every row, column, and box."
        />
      </div>
    </div>
  );
}
