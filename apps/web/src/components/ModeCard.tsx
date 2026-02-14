import { useNavigate } from 'react-router-dom';
import type { GameMode } from '../types/puzzle';
import styles from './ModeCard.module.css';

interface ModeCardProps {
  mode: GameMode;
  name: string;
  description: string;
}

export function ModeCard({ mode, name, description }: ModeCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className={styles.card}
      onClick={() => navigate(`/${mode}`)}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter') navigate(`/${mode}`); }}
    >
      <span className={styles.name}>{name}</span>
      <span className={styles.description}>{description}</span>
    </div>
  );
}
