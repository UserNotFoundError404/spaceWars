import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Leaderboard = () => {
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`${API}/leaderboard`);
      setScores(response.data);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'neon-yellow';
    if (rank === 2) return 'neon-cyan';
    if (rank === 3) return 'neon-purple';
    return 'neon-green';
  };

  return (
    <div className="min-h-screen px-4 py-12" style={{ background: '#050505' }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-pixel text-2xl sm:text-3xl lg:text-4xl neon-glow-red text-neon-red mb-4" data-testid="leaderboard-title">
            HIGH SCORES
          </h1>
          <p className="font-mono text-sm sm:text-base text-gray-400">
            Hall of Fame
          </p>
        </div>

        {loading ? (
          <div className="text-center">
            <p className="font-mono text-neon-green neon-glow-green text-xl blink">LOADING...</p>
          </div>
        ) : scores.length === 0 ? (
          <div className="text-center">
            <p className="font-mono text-gray-400 text-lg">No scores yet. Be the first!</p>
          </div>
        ) : (
          <div className="bg-arcade-paper border-4 border-neon-red pixel-corners p-6 mb-8">
            <div className="space-y-4">
              {scores.map((score, index) => {
                const rank = index + 1;
                const color = getRankColor(rank);
                return (
                  <div
                    key={score.id}
                    data-testid={`score-${rank}`}
                    className={`bg-black border-2 border-${color} p-4 flex items-center justify-between`}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`font-pixel text-3xl text-${color}`}>
                        {rank}
                      </div>
                      <div>
                        <div className="font-ui text-xl text-white uppercase">
                          {score.player_name}
                        </div>
                        <div className="font-mono text-sm text-gray-400">
                          Level {score.level_reached}
                        </div>
                      </div>
                    </div>
                    <div className={`font-pixel text-2xl text-${color} neon-glow-${color.split('-')[1]}`}>
                      {score.score.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="text-center">
          <button
            data-testid="back-to-menu-leaderboard"
            onClick={() => navigate('/')}
            className="bg-arcade-bg text-neon-red font-ui text-xl py-3 px-8 border-2 border-neon-red hover:box-glow-red arcade-button uppercase tracking-wider"
          >
            BACK TO MENU
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;