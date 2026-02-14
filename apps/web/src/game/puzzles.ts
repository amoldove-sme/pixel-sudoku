import type { Puzzle, PuzzleIndexEntry } from '../types/puzzle';

let cachedIndex: PuzzleIndexEntry[] | null = null;

export async function loadPuzzleIndex(): Promise<PuzzleIndexEntry[]> {
  if (cachedIndex) return cachedIndex;
  const resp = await fetch('/puzzles/puzzle-index.json');
  if (!resp.ok) throw new Error('Failed to load puzzle index');
  cachedIndex = await resp.json();
  return cachedIndex!;
}

export async function loadPuzzle(id: string): Promise<Puzzle> {
  const index = await loadPuzzleIndex();
  const entry = index.find(e => e.id === id);
  if (!entry) throw new Error(`Puzzle not found: ${id}`);
  const resp = await fetch(`/puzzles/${entry.filename}`);
  if (!resp.ok) throw new Error(`Failed to load puzzle: ${id}`);
  return resp.json();
}
