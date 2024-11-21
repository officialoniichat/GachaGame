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
          {(showGoldenBox || isTeasing) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 border-4 border-yellow-400"
              style={{
                boxShadow: '0 0 10px #FFD700, inset 0 0 10px #FFD700',
                animation: isTeasing ? 'pulse 1s infinite' : 'none'
              }}
            />
          )}
        </div>
      </motion.div>
    </td>
  );
}

export default Reel;