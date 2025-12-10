import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SavedGames = () => {
  const navigate = useNavigate();
  const [savedGames, setSavedGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedGames();
  }, []);

  const fetchSavedGames = async () => {
    try {
      const response = await axios.get(`${API}/game/saves`);
      setSavedGames(response.data);
    } catch (error) {
      console.error('Failed to fetch saved games:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (gameId) => {
    if (!window.confirm('Delete this save?')) return;

    try {
      await axios.delete(`${API}/game/delete/${gameId}`);
      setSavedGames(savedGames.filter((game) => game.id !== gameId));
    } catch (error) {
      console.error('Failed to delete game:', error);
    }
  };

  const handleLoad = (gameId) => {
    navigate(`/game`, { state: { loadGameId: gameId } });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="min-h-screen px-4 py-12" style={{ background: '#050505' }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-pixel text-2xl sm:text-3xl lg:text-4xl neon-glow-green text-neon-green mb-4" data-testid="saved-games-title">
            SAVED GAMES
          </h1>
          <p className="font-mono text-sm sm:text-base text-gray-400">
            Continue your journey
          </p>
        </div>

        {loading ? (
          <div className="text-center">
            <p className="font-mono text-neon-green neon-glow-green text-xl blink">LOADING...</p>
          </div>
        ) : savedGames.length === 0 ? (
          <div className="text-center">
            <p className="font-mono text-gray-400 text-lg mb-8">No saved games found.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-neon-green text-black font-ui text-xl py-3 px-8 border-2 border-neon-green hover:box-glow-green arcade-button uppercase tracking-wider"
            >
              START NEW GAME
            </button>
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            {savedGames.map((game) => (
              <div
                key={game.id}
                data-testid={`saved-game-${game.id}`}
                className="bg-arcade-paper border-4 border-neon-green pixel-corners p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <h3 className="font-ui text-2xl text-neon-green uppercase tracking-wider mb-2">
                    {game.game_name}
                  </h3>
                  <div className="font-mono text-sm text-gray-400 space-y-1">
                    <p>Score: {game.game_state.score}</p>
                    <p>Level: {game.game_state.current_level}</p>
                    <p>Health: {game.game_state.player_health}%</p>
                    <p>Saved: {formatDate(game.timestamp)}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    data-testid={`load-game-${game.id}`}
                    onClick={() => handleLoad(game.id)}
                    className="bg-neon-green text-black font-ui text-lg py-3 px-6 border-2 border-neon-green hover:box-glow-green arcade-button uppercase"
                  >
                    LOAD
                  </button>
                  <button
                    data-testid={`delete-game-${game.id}`}
                    onClick={() => handleDelete(game.id)}
                    className="bg-black text-neon-red font-ui text-lg py-3 px-6 border-2 border-neon-red hover:box-glow-red arcade-button uppercase"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center">
          <button
            data-testid="back-to-menu-saves"
            onClick={() => navigate('/')}
            className="bg-arcade-bg text-neon-green font-ui text-xl py-3 px-8 border-2 border-neon-green hover:box-glow-green arcade-button uppercase tracking-wider"
          >
            BACK TO MENU
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavedGames;