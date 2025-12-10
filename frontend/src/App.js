import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Game from './pages/Game';
import LevelSelect from './pages/LevelSelect';
import Leaderboard from './pages/Leaderboard';
import SavedGames from './pages/SavedGames';
import './App.css';

function App() {
  return (
    <div className="App scanlines vignette">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/game" element={<Game />} />
          <Route path="/game/:levelId" element={<Game />} />
          <Route path="/levels" element={<LevelSelect />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/saves" element={<SavedGames />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;