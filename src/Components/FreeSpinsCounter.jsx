import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function FreeSpinsCounter({ freeSpins }) {
  if (!freeSpins) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="flex items-center bg-gradient-to-r from-purple-600 to-pink-600 rounded-full px-4 py-1 shadow-lg ml-2"
      >
        <img 
          src="https://imagedelivery.net/80ncJPif6mMa3mEeTHej8g/45eeba65-3b92-4693-b2cc-940e0eb91800/mobile"
          alt="Free Spins"
          className="w-6 h-6 mr-1 animate-spin"
          style={{ animationDuration: '3s' }}
        />
        <div className="flex flex-col">

          <motion.span 
            key={freeSpins}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-lg font-bold text-white"
          >
            {freeSpins}
          </motion.span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default FreeSpinsCounter;