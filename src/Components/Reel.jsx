import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function Reel({ className, symbol, showGoldenBox, isTeasing }) {
  return (
    <td className={`${className} w-[33.33%] relative overflow-hidden`}>
      <motion.div 
        className="relative w-full pb-[100%]"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-0">
          <img 
            src={symbol.src} 
            alt={symbol.alt} 
            className="w-full h-full object-cover transform-gpu"
            style={{ 
              backfaceVisibility: 'hidden'
            }}
          />
          <AnimatePresence>
            {(showGoldenBox || isTeasing) && (
              <motion.div
                className={`absolute inset-0 border-4 golden-box ${
                  showGoldenBox ? 'border-yellow-400' : 'border-yellow-400/50'
                }`}
                initial={{ opacity: 0, scale: 1.2 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  boxShadow: showGoldenBox 
                    ? '0 0 10px #FFD700, inset 0 0 10px #FFD700'
                    : '0 0 10px rgba(255, 215, 0, 0.5), inset 0 0 10px rgba(255, 215, 0, 0.5)'
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ 
                  duration: 0.3,
                  ease: "backOut"
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </td>
  );
}

export default Reel;