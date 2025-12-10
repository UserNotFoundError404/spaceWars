import React from 'react';

const HUD = ({ score, health, level, onPause, onSave }) => {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 100 }}>
      <div className="absolute top-6 left-6 bg-black/80 border-2 border-neon-green pixel-corners p-4 pointer-events-auto">
        <div className="font-mono text-sm space-y-1">
          <div className="text-gray-400">SCORE</div>
          <div className="font-pixel text-xl text-neon-green neon-glow-green" data-testid="hud-score">
            {score.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="absolute top-6 right-6 bg-black/80 border-2 border-neon-red pixel-corners p-4 pointer-events-auto">
        <div className="font-mono text-sm space-y-1">
          <div className="text-gray-400">HEALTH</div>
          <div className="w-32 h-4 bg-black border border-neon-red">
            <div
              data-testid="hud-health-bar"
              className="h-full bg-neon-red"
              style={{ width: `${health}%`, transition: 'width 0.3s' }}
            ></div>
          </div>
        </div>
      </div>

      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-black/80 border-2 border-neon-cyan pixel-corners p-4 pointer-events-auto">
        <div className="font-pixel text-sm text-neon-cyan neon-glow-cyan" data-testid="hud-level">
          LEVEL {level}
        </div>
      </div>

      <div className="absolute bottom-6 right-6 flex gap-3 pointer-events-auto">
        <button
          data-testid="pause-button"
          onClick={onPause}
          className="bg-black text-neon-yellow font-ui text-lg py-2 px-4 border-2 border-neon-yellow hover:box-glow-yellow arcade-button uppercase"
          style={{ boxShadow: '0 0 10px #F5D300' }}
        >
          PAUSE
        </button>
        <button
          data-testid="save-button"
          onClick={onSave}
          className="bg-black text-neon-green font-ui text-lg py-2 px-4 border-2 border-neon-green hover:box-glow-green arcade-button uppercase"
        >
          SAVE
        </button>
      </div>
    </div>
  );
};

export default HUD;