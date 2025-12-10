import React from 'react';

const PauseMenu = ({ onResume, onRestart, onMainMenu }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.9)' }}>
      <div className="bg-arcade-paper border-4 border-neon-cyan pixel-corners p-8 max-w-md w-full mx-4">
        <h2 className="font-pixel text-2xl text-neon-cyan neon-glow-cyan text-center mb-8" data-testid="pause-menu-title">
          PAUSED
        </h2>
        
        <div className="space-y-4">
          <button
            data-testid="resume-button"
            onClick={onResume}
            className="w-full bg-neon-cyan text-black font-ui text-xl py-4 px-6 border-2 border-neon-cyan hover:box-glow-cyan arcade-button uppercase tracking-wider"
          >
            RESUME
          </button>
          
          <button
            data-testid="restart-button"
            onClick={onRestart}
            className="w-full bg-arcade-bg text-neon-yellow font-ui text-xl py-4 px-6 border-2 border-neon-yellow hover:box-glow-yellow arcade-button uppercase tracking-wider"
            style={{ boxShadow: '0 0 10px #F5D300' }}
          >
            RESTART
          </button>
          
          <button
            data-testid="main-menu-button"
            onClick={onMainMenu}
            className="w-full bg-arcade-bg text-neon-red font-ui text-xl py-4 px-6 border-2 border-neon-red hover:box-glow-red arcade-button uppercase tracking-wider"
          >
            MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
};

export default PauseMenu;