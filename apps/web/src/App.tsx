import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomeScreen } from './screens/HomeScreen';
import { PuzzleSelectScreen } from './screens/PuzzleSelectScreen';
import { GameScreen } from './screens/GameScreen';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/:mode" element={<PuzzleSelectScreen />} />
        <Route path="/:mode/:id" element={<GameScreen />} />
      </Routes>
    </BrowserRouter>
  );
}
