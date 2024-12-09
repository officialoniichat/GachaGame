import React from 'react';
import Header from './Header';
import WinMessage from './WinMessage';
import ContinuePrompt from './ContinuePrompt';

const CongratulationsScreen = ({ freeSpins }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto scale-90">
        {/* Border container */}
        <div className="relative p-[2px] rounded-[2rem] overflow-hidden bg-gradient-to-r from-purple-400/50 via-purple-300 to-purple-400/50">
          {/* Main content container */}
          <div className="bg-gradient-to-b from-purple-700 to-purple-800 rounded-[2rem]">
            <div className="relative px-12 py-6">
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative z-10 flex flex-col items-center text-center">
                <Header />
                <WinMessage freeSpins={freeSpins} />
                <ContinuePrompt />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CongratulationsScreen;