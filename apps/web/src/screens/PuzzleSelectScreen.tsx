import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { PuzzleCard } from '../components/PuzzleCard';
import { useGameStore } from '../game/store';
import type { GameMode, PuzzleIndexEntry } from '../types/puzzle';
import styles from './PuzzleSelectScreen.module.css';

const MODE_NAMES: Record<GameMode, string> = {
  classic: 'Classic',
  killer: 'Killer',
  pixel: 'Pixel',
};

export function PuzzleSelectScreen() {
  const { mode } = useParams<{ mode: string }>();
  const gameMode = mode as GameMode;
  const puzzleIndex = useGameStore(s => s.puzzleIndex);
  const fetchPuzzleIndex = useGameStore(s => s.fetchPuzzleIndex);
  const selectMode = useGameStore(s => s.selectMode);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    selectMode(gameMode);
    fetchPuzzleIndex().then(() => setLoading(false));
  }, [gameMode, fetchPuzzleIndex, selectMode]);

  const puzzles = puzzleIndex.filter((p: PuzzleIndexEntry) => p.mode === gameMode);

  return (
    <div className={styles.container}>
      <Header title={MODE_NAMES[gameMode] || 'Sudoku'} backTo="/" />
      <div className={styles.content}>
        <h2 className={styles.heading}>Select Difficulty</h2>
        {loading ? (
          <p className={styles.loading}>Loading puzzles...</p>
        ) : (
          <div className={styles.list}>
            {puzzles.map(p => (
              <PuzzleCard
                key={p.id}
                puzzleId={p.id}
                difficulty={p.difficulty}
                mode={gameMode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
