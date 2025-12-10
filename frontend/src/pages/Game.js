import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import GameEngine from '../components/GameEngine';
import HUD from '../components/HUD';
import PauseMenu from '../components/PauseMenu';
import GameOver from '../components/GameOver';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Game = () => {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const gameEngineRef = useRef(null);
  const [gameState, setGameState] = useState({
    score: 0,
    health: 100,
    level: parseInt(levelId) || 1,
    isPaused: false,
    isGameOver: false,
    isVictory: false,
  });
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveName, setSaveName] = useState('');

  useEffect(() => {
    if (canvasRef.current) {
      gameEngineRef.current = new GameEngine(
        canvasRef.current,
        parseInt(levelId) || 1,
        updateGameState
      );
      gameEngineRef.current.start();
    }

    return () => {
      if (gameEngineRef.current) {
        gameEngineRef.current.stop();
      }
    };
  }, [levelId]);

  const updateGameState = (newState) => {
    setGameState((prev) => ({ ...prev, ...newState }));
  };

  const handlePause = () => {
    if (gameEngineRef.current) {
      gameEngineRef.current.togglePause();
      setGameState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
    }
  };

  const handleResume = () => {
    if (gameEngineRef.current) {
      gameEngineRef.current.togglePause();
      setGameState((prev) => ({ ...prev, isPaused: false }));
    }
  };

  const handleRestart = () => {
    if (gameEngineRef.current) {
      gameEngineRef.current.restart();
      setGameState({
        score: 0,
        health: 100,
        level: parseInt(levelId) || 1,
        isPaused: false,
        isGameOver: false,
        isVictory: false,
      });
    }
  };

  const handleSaveGame = async () => {
    if (!saveName.trim()) return;

    try {
      const gameData = gameEngineRef.current.getGameState();
      await axios.post(`${API}/game/save`, {
        game_name: saveName,
        game_state: gameData,
      });
      setShowSaveDialog(false);
      setSaveName('');
      alert('Game saved successfully!');
    } catch (error) {
      console.error('Failed to save game:', error);
      alert('Failed to save game');
    }
  };

  const handleSubmitScore = async (playerName) => {
    try {
      await axios.post(`${API}/leaderboard`, {
        player_name: playerName,
        score: gameState.score,
        level_reached: gameState.level,
      });
    } catch (error) {
      console.error('Failed to submit score:', error);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'p' || e.key === 'P') {
        handlePause();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="game-container" data-testid="game-page">
      <canvas
        ref={canvasRef}
        width={1200}
        height={700}
        className="border-4 border-neon-green"
        style={{ background: '#050505' }}
      />
      
      <HUD
        score={gameState.score}
        health={gameState.health}
        level={gameState.level}
        onPause={handlePause}
        onSave={() => setShowSaveDialog(true)}
      />

      {gameState.isPaused && !gameState.isGameOver && (
        <PauseMenu
          onResume={handleResume}
          onRestart={handleRestart}
          onMainMenu={() => navigate('/')}
        />
      )}

      {gameState.isGameOver && (
        <GameOver
          score={gameState.score}
          isVictory={gameState.isVictory}
          level={gameState.level}
          onRestart={handleRestart}
          onMainMenu={() => navigate('/')}
          onSubmitScore={handleSubmitScore}
        />
      )}

      {showSaveDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.9)' }}>
          <div className="bg-arcade-paper border-4 border-neon-green pixel-corners p-8 max-w-md w-full mx-4">
            <h2 className="font-pixel text-xl text-neon-green neon-glow-green mb-6">SAVE GAME</h2>
            <input
              data-testid="save-game-input"
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="Enter save name"
              className="w-full bg-black text-neon-green border-2 border-neon-green p-3 font-mono mb-4 focus:outline-none focus:box-glow-green"
              maxLength={20}
            />
            <div className="flex gap-4">
              <button
                data-testid="confirm-save-button"
                onClick={handleSaveGame}
                className="flex-1 bg-neon-green text-black font-ui text-lg py-3 px-4 border-2 border-neon-green hover:box-glow-green arcade-button uppercase"
              >
                SAVE
              </button>
              <button
                data-testid="cancel-save-button"
                onClick={() => setShowSaveDialog(false)}
                className="flex-1 bg-black text-neon-red font-ui text-lg py-3 px-4 border-2 border-neon-red hover:box-glow-red arcade-button uppercase"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;