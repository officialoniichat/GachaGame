import React from 'react';

const WinMessage = ({ freeSpins }) => {
  return (
    <div className="space-y-4 py-4">
      <div className="text-2xl font-bold text-yellow-300 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)] tracking-wide">
        YOU HAVE WON
      </div>
      <div className="relative">
        <div className="text-7xl font-bold text-yellow-300 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]">
          {freeSpins}
        </div>
      </div>
      <div className="text-3xl font-bold bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 text-transparent bg-clip-text tracking-wide">
        FREE SPINS
      </div>
    </div>
  );
};

export default WinMessage;