import React from 'react';
import { motion } from 'framer-motion';

function WinnerDisplay({ isWin, winner }) {
  if (!isWin) return null;

  const winnerConfig = {
    Winner1: {
      text: "WINNER!",
      gradient: "from-yellow-400 to-yellow-600",
      scale: 1
    },
    BigWinner: {
      text: "BIG WINNER!",
      gradient: "from-orange-400 to-red-600",
      scale: 1.2
    },
    MegaWinner: {
      text: "MEGA WINNER!!!",
      gradient: "from-purple-400 to-pink-600",
      scale: 1.4
    }
  };

  const config = winnerConfig[winner] || winnerConfig.Winner1;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: config.scale,
        opacity: 1,
        y: [0, -20, 0]
      }}
      transition={{
        duration: 0.5,
        y: {
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
      className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
    >
      <div 
        className={`bg-gradient-to-r ${config.gradient} rounded-full shadow-lg`}
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-shadow text-center px-8 py-4 whitespace-nowrap">
          {config.text}
        </h2>
      </div>
    </motion.div>
  );
}

export default WinnerDisplay;