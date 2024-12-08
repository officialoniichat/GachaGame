import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function FreeSpinsCounter({ freeSpins, multiplier }) {
  // Only render if there are free spins remaining
  if (freeSpins <= 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="flex items-center bg-gradient-to-r from-purple-600 to-pink-600 rounded-full px-4 py-2 shadow-lg ml-2"
      >
        <div className="flex items-center">
          <img 
            src="https://imagedelivery.net/80ncJPif6mMa3mEeTHej8g/45eeba65-3b92-4693-b2cc-940e0eb91800/mobile"
            alt="Free Spins"
            className="w-6 h-6 mr-2 animate-spin"
            style={{ animationDuration: '3s' }}
          />
          <div className="flex flex-col items-start">
            <motion.span 
              key={freeSpins}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-lg font-bold text-white"
            >
              {freeSpins} Free Spin{freeSpins !== 1 ? 's' : ''}
            </motion.span>
            {multiplier > 0 && (
              <motion.span
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-sm text-yellow-400 font-bold"
              >
                {multiplier}x Multiplier Active
              </motion.span>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default FreeSpinsCounter;