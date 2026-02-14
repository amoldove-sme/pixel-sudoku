import { useNavigate } from 'react-router-dom';
import styles from './PuzzleCard.module.css';

interface PuzzleCardProps {
  puzzleId: string;
  difficulty: string;
  mode: string;
}

export function PuzzleCard({ puzzleId, difficulty, mode }: PuzzleCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className={styles.card}
      onClick={() => navigate(`/${mode}/${puzzleId}`)}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter') navigate(`/${mode}/${puzzleId}`); }}
    >
      <span className={styles.difficulty}>{difficulty}</span>
      <span className={styles.arrow}>&rarr;</span>
    </div>
  );
}
