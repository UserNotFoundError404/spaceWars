import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
         style={{
           backgroundImage: 'url(https://images.unsplash.com/photo-1696360172919-f7fdaaa78a92?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxyZXRybyUyMGFyY2FkZSUyMG5lb24lMjBsaWdodHMlMjBnYW1pbmclMjBzZXR1cHxlbnwwfHx8fDE3NjUzNjgwMDN8MA&ixlib=rb-4.1.0&q=85)',
           backgroundSize: 'cover',
           backgroundPosition: 'center',
         }}>
      <div className="absolute inset-0 bg-black/80"></div>
      
      <div className="relative z-10 max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="font-pixel text-3xl sm:text-4xl lg:text-5xl neon-glow-green mb-4"
              data-testid="game-title">
            NEON ARCADE
          </h1>
          <p className="font-mono text-base sm:text-lg text-neon-cyan neon-glow-cyan">
            SPACE SHOOTER EDITION
          </p>
        </div>

        <div className="bg-arcade-paper border-4 border-neon-green pixel-corners p-8 max-w-md mx-auto space-y-4">
          <button
            data-testid="new-game-button"
            onClick={() => navigate('/game')}
            className="w-full bg-neon-green text-black font-ui text-xl py-4 px-6 border-2 border-neon-green hover:box-glow-green arcade-button uppercase tracking-wider"
          >
            NEW GAME
          </button>

          <button
            data-testid="continue-game-button"
            onClick={() => navigate('/saves')}
            className="w-full bg-arcade-bg text-neon-green font-ui text-xl py-4 px-6 border-2 border-neon-green hover:box-glow-green arcade-button uppercase tracking-wider"
          >
            CONTINUE
          </button>

          <button
            data-testid="levels-button"
            onClick={() => navigate('/levels')}
            className="w-full bg-arcade-bg text-neon-cyan font-ui text-xl py-4 px-6 border-2 border-neon-cyan hover:box-glow-cyan arcade-button uppercase tracking-wider"
            style={{ boxShadow: '0 0 10px #00F0FF' }}
          >
            LEVELS
          </button>

          <button
            data-testid="leaderboard-button"
            onClick={() => navigate('/leaderboard')}
            className="w-full bg-arcade-bg text-neon-red font-ui text-xl py-4 px-6 border-2 border-neon-red hover:box-glow-red arcade-button uppercase tracking-wider"
          >
            LEADERBOARD
          </button>
        </div>

        <div className="text-center mt-8">
          <p className="font-mono text-sm text-gray-400">
            USE ARROW KEYS OR WASD TO MOVE • SPACE TO SHOOT • P TO PAUSE
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;