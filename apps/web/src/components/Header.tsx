import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

interface HeaderProps {
  title: string;
  backTo?: string;
}

export function Header({ title, backTo }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      {backTo && (
        <button
          className={styles.backBtn}
          onClick={() => navigate(backTo)}
          aria-label="Go back"
        >
          &larr; Back
        </button>
      )}
      <h1 className={styles.title}>{title}</h1>
    </header>
  );
}
