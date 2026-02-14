export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameMode = 'classic' | 'killer' | 'pixel';

export interface PuzzleMeta {
  id: string;
  mode: GameMode;
  difficulty: Difficulty;
}

export interface ClassicPuzzle extends PuzzleMeta {
  mode: 'classic' | 'pixel';
  givens: [number, number, number][];
  solution: number[][];
}

export interface KillerCage {
  id: string;
  sum: number;
  cells: [number, number][];
}

export interface KillerPuzzle extends PuzzleMeta {
  mode: 'killer';
  cages: KillerCage[];
  solution: number[][];
}

export type Puzzle = ClassicPuzzle | KillerPuzzle;

export interface PuzzleIndexEntry {
  id: string;
  mode: GameMode;
  difficulty: Difficulty;
  filename: string;
}
