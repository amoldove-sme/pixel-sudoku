export type GameStatus = 'idle' | 'mode-select' | 'puzzle-select' | 'playing' | 'won';

export interface CellState {
  value: number | null;
  isGiven: boolean;
  hasConflict: boolean;
}
