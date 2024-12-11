import React from 'react';
import Header from './Header';
import WinMessage from './WinMessage';
import ContinuePrompt from './ContinuePrompt';
import { motion } from 'framer-motion';

const CongratulationsScreen = ({ freeSpins }) => {
  return (
    <div className="min-h-screen bg-black/80 backdrop-blur-lg flex items-center justify-center p-4">
      <div className="relative w-full max-w-[1200px] mx-auto flex items-center justify-center gap-8">
        {/* Main content with side images */}
        <div className="w-full max-w-2xl">
          <div className="relative p-[2px] rounded-[2rem] overflow-hidden bg-gradient-to-r from-yellow-400/50 via-yellow-300 to-yellow-400/50">
            <div className="bg-gradient-to-b from-purple-900/90 to-purple-800/90 backdrop-blur-md rounded-[2rem]">
              <div className="relative px-12 py-6">
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
                
                {/* Left spinning image */}
                <motion.div
                  className="absolute left-[35px] top-[40%] -translate-y-1/2 hidden lg:block"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  <img
                    src="https://imagedelivery.net/80ncJPif6mMa3mEeTHej8g/95f63f20-2b08-4eb4-dd20-d3a247074900/mobile"
                    alt="Spinning Scatter"
                    className="w-48 h-48 object-contain drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]"
                  />
                </motion.div>

                {/* Right static image */}
                <div className="absolute right-[-25px] top-[67%] -translate-y-1/2 hidden lg:block">
                  <img
                    src="https://imagedelivery.net/80ncJPif6mMa3mEeTHej8g/30cc39fc-918f-4ee3-55a7-e44ca4670100/mobile"
                    alt="Character"
                    className="w-72 h-72 object-contain drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]"
                  />
                </div>

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
    </div>
  );
};

export default CongratulationsScreen;