import React, { useState } from 'react';

const GameOver = ({ score, isVictory, level, onRestart, onMainMenu, onSubmitScore }) => {
  const [playerName, setPlayerName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!playerName.trim()) return;
    
    await onSubmitScore(playerName);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.95)' }}>
      <div className={`bg-arcade-paper border-4 ${isVictory ? 'border-neon-green' : 'border-neon-red'} pixel-corners p-8 max-w-md w-full mx-4`}>
        <h2 
          className={`font-pixel text-2xl ${isVictory ? 'text-neon-green neon-glow-green' : 'text-neon-red neon-glow-red'} text-center mb-6`}
          data-testid="game-over-title"
        >
          {isVictory ? 'VICTORY!' : 'GAME OVER'}
        </h2>
        
        <div className="bg-black border-2 border-gray-700 p-6 mb-6 space-y-3">
          <div className="flex justify-between font-mono text-sm">
            <span className="text-gray-400">FINAL SCORE:</span>
            <span className="text-neon-green neon-glow-green font-pixel" data-testid="final-score">{score.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-mono text-sm">
            <span className="text-gray-400">LEVEL REACHED:</span>
            <span className="text-neon-cyan" data-testid="level-reached">{level}</span>
          </div>
        </div>

        {!submitted ? (
          <div className="mb-6">
            <label className="font-mono text-sm text-gray-400 mb-2 block">ENTER YOUR NAME</label>
            <input
              data-testid="player-name-input"
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="PLAYER"
              className="w-full bg-black text-neon-green border-2 border-neon-green p-3 font-mono mb-3 focus:outline-none focus:box-glow-green"
              maxLength={15}
            />
            <button
              data-testid="submit-score-button"
              onClick={handleSubmit}
              className="w-full bg-neon-green text-black font-ui text-lg py-3 px-4 border-2 border-neon-green hover:box-glow-green arcade-button uppercase"
            >
              SUBMIT SCORE
            </button>
          </div>
        ) : (
          <div className="mb-6 text-center">
            <p className="font-mono text-neon-green neon-glow-green">Score submitted!</p>
          </div>
        )}
        
        <div className="space-y-3">
          <button
            data-testid="restart-game-button"
            onClick={onRestart}
            className={`w-full bg-arcade-bg ${isVictory ? 'text-neon-green border-neon-green hover:box-glow-green' : 'text-neon-yellow border-neon-yellow'} font-ui text-lg py-3 px-4 border-2 arcade-button uppercase`}
            style={!isVictory ? { boxShadow: '0 0 10px #F5D300' } : {}}
          >
            PLAY AGAIN
          </button>
          
          <button
            data-testid="main-menu-game-over"
            onClick={onMainMenu}
            className="w-full bg-arcade-bg text-neon-red font-ui text-lg py-3 px-4 border-2 border-neon-red hover:box-glow-red arcade-button uppercase"
          >
            MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOver;