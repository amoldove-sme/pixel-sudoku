import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { Grid } from '../grid/Grid';
import { NumberPad } from '../grid/NumberPad';
import { useGameStore } from '../game/store';
import type { GameMode } from '../types/puzzle';
import styles from './GameScreen.module.css';

const MODE_NAMES: Record<GameMode, string> = {
  classic: 'Classic',
  killer: 'Killer',
  pixel: 'Pixel',
};

export function GameScreen() {
  const { mode, id } = useParams<{ mode: string; id: string }>();
  const gameMode = mode as GameMode;
  const selectPuzzle = useGameStore(s => s.selectPuzzle);
  const selectMode = useGameStore(s => s.selectMode);
  const status = useGameStore(s => s.status);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    selectMode(gameMode);
    if (id) {
      selectPuzzle(id).then(() => setLoading(false));
    }
  }, [gameMode, id, selectPuzzle, selectMode]);

  return (
    <div className={styles.container}>
      <Header title={MODE_NAMES[gameMode] || 'Sudoku'} backTo={`/${mode}`} />
      <div className={styles.content}>
        {loading ? (
          <p className={styles.loading}>Loading puzzle...</p>
        ) : (
          <>
            <Grid />
            {status !== 'won' && <NumberPad />}
            {status === 'won' && (
              <div className={styles.winBanner}>Puzzle Complete!</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
