import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LevelSelect = () => {
  const navigate = useNavigate();
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevels = async () => {
    try {
      const response = await axios.get(`${API}/levels`);
      setLevels(response.data);
    } catch (error) {
      console.error('Failed to fetch levels:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'neon-green';
      case 'medium':
        return 'neon-cyan';
      case 'hard':
        return 'neon-yellow';
      case 'expert':
        return 'neon-red';
      case 'impossible':
        return 'neon-purple';
      default:
        return 'neon-green';
    }
  };

  return (
    <div
      className="min-h-screen px-4 py-12"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1709409903284-2b830126d01e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwzfHxwaXhlbCUyMGFydCUyMHNwYWNlJTIwYmFja2dyb3VuZCUyMHN0YXJzJTIwbmVidWxhfGVufDB8fHx8MTc2NTM2ODAwMHww&ixlib=rb-4.1.0&q=85)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/80"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-pixel text-2xl sm:text-3xl lg:text-4xl neon-glow-cyan text-neon-cyan mb-4" data-testid="level-select-title">
            SELECT MISSION
          </h1>
          <p className="font-mono text-sm sm:text-base text-gray-400">
            Choose your battlefield
          </p>
        </div>

        {loading ? (
          <div className="text-center">
            <p className="font-mono text-neon-green neon-glow-green text-xl blink">LOADING...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {levels.map((level) => {
              const color = getDifficultyColor(level.difficulty);
              return (
                <div
                  key={level.id}
                  data-testid={`level-${level.id}-card`}
                  className={`bg-arcade-paper border-4 border-${color} pixel-corners p-6 hover:scale-105 transition-transform cursor-pointer`}
                  onClick={() => navigate(`/game/${level.id}`)}
                  style={{ boxShadow: `0 0 20px var(--tw-${color})` }}
                >
                  <div className="text-center">
                    <div className={`font-pixel text-4xl text-${color} neon-glow-${color.split('-')[1]} mb-4`}>
                      {level.id}
                    </div>
                    <h3 className="font-ui text-2xl text-white uppercase tracking-wider mb-2">
                      {level.name}
                    </h3>
                    <p className={`font-mono text-sm text-${color} mb-4`}>
                      {level.difficulty}
                    </p>
                    <div className="space-y-2 text-left font-mono text-xs text-gray-400">
                      <p>Enemies: {level.enemy_count}</p>
                      <p>Speed: {level.enemy_speed}x</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="text-center">
          <button
            data-testid="back-to-menu-button"
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

export default LevelSelect;