import React from 'react';
import { motion } from 'framer-motion';
import CharacterWinHeader from './CharacterWinHeader';
import CharacterWinMessage from './CharacterWinMessage';
import ContinuePrompt from './ContinuePrompt';

const SYMBOL_IMAGES = {
  wolfi: 'https://imagedelivery.net/80ncJPif6mMa3mEeTHej8g/a6fbc623-5383-45cb-0393-841a157e7e00/mobile',
  demon: 'https://imagedelivery.net/80ncJPif6mMa3mEeTHej8g/5ed079d3-8e99-4a57-933b-16d802fd8500/mobile',
  angel: 'https://imagedelivery.net/80ncJPif6mMa3mEeTHej8g/94da9d36-a050-43cf-d35d-5c7ec6426e00/mobile',
  goddess: 'https://imagedelivery.net/80ncJPif6mMa3mEeTHej8g/f1fbb163-f44e-4260-7376-a5b8f73f0d00/mobile'
};

const CharacterWinScreen = ({ characterType, winType, gems }) => {
  const symbolImage = SYMBOL_IMAGES[characterType];

  return (
    <div className="min-h-screen bg-black/80 backdrop-blur-lg flex items-center justify-center p-4">
      <div className="relative w-full max-w-[1200px] mx-auto flex items-center justify-center gap-8">
        <div className="w-full max-w-2xl">
          <div className="relative p-[2px] rounded-[2rem] overflow-hidden bg-gradient-to-r from-yellow-400/50 via-yellow-300 to-yellow-400/50">
            <div className="bg-gradient-to-b from-purple-900/90 to-purple-800/90 backdrop-blur-md rounded-[2rem]">
              <div className="relative px-12 py-6">
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
                
                {/* Left character image */}
                <motion.div
                  className="absolute left-[35px] top-[40%] -translate-y-1/2 hidden lg:block rounded-2xl"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <img
  src={symbolImage}
  alt={characterType}
  className="w-48 h-48 object-contain drop-shadow-[0_0_15px_rgba(234,179,8,0.5)] rounded-2xl overflow-hidden"
/>
                </motion.div>

                {/* Right character image */}
                <div className="absolute right-[-25px] top-[67%] -translate-y-1/2 hidden lg:block">
                  <motion.img
                    src={symbolImage}
                    alt={characterType}
                    className="w-72 h-72 object-contain drop-shadow-[0_0_15px_rgba(234,179,8,0.5)] rounded-2xl overflow-hidden"
                    animate={{ 
                      scale: [1, 1.05, 1],
                      rotate: [0, -5, 5, 0]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: 0.5
                    }}
                  />
                </div>

                <div className="relative z-10 flex flex-col items-center text-center">
                  <CharacterWinHeader />
                  <CharacterWinMessage 
                    characterType={characterType}
                    winType={winType}
                    gems={gems}
                  />
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

export default CharacterWinScreen;