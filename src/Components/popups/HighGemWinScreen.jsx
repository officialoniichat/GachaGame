import React from 'react';
import { motion } from 'framer-motion';
import CharacterWinHeader from './CharacterWinHeader';
import ContinuePrompt from './ContinuePrompt';

const HighGemWinMessage = ({ gems, symbols }) => (
  <div className="space-y-4 py-4 min-h-[200px] flex flex-col justify-center">
    <div className="text-2xl font-bold text-yellow-300 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)] tracking-wide mb-4">
      YOU HAVE WON
    </div>
    <div className="space-y-4">
      <div className="text-4xl font-bold text-yellow-300 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]">
        {gems.toLocaleString()} Gems
      </div>
      <div className="flex justify-center gap-4 mt-4">
        {symbols.map((symbol, index) => (
          <motion.div
            key={index}
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.5
            }}
          >
            <img
              src={symbol.src}
              alt={symbol.alt}
              className="w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(234,179,8,0.5)] rounded-2xl overflow-hidden"
            />
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

const HighGemWinScreen = ({ gems, symbols }) => {
  return (
    <div className="min-h-screen bg-black/80 backdrop-blur-lg flex items-center justify-center p-4">
      <div className="relative w-full max-w-[1200px] mx-auto flex items-center justify-center gap-8">
        <div className="w-full max-w-2xl">
          <div className="relative p-[2px] rounded-[2rem] overflow-hidden bg-gradient-to-r from-yellow-400/50 via-yellow-300 to-yellow-400/50">
            <div className="bg-gradient-to-b from-purple-900/90 to-purple-800/90 backdrop-blur-md rounded-[2rem]">
              <div className="relative px-12 py-6">
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
                
                <div className="relative z-10 flex flex-col items-center text-center">
                  <CharacterWinHeader />
                  <HighGemWinMessage gems={gems} symbols={symbols} />
                  <ContinuePrompt />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HighGemWinScreen;