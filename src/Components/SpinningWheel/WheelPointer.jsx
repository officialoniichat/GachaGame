import React from 'react';
import { motion } from 'framer-motion';

function WheelPointer() {
  return (
    <motion.div
      className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-10"
      initial={{ y: 20 }}
      animate={{ y: 0 }}
      transition={{
        duration: 0.5,
        ease: "easeOut"
      }}
    >
      <div className="w-16 h-20 relative">
        {/* Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      w-8 h-8 bg-yellow-400 rounded-full blur-xl opacity-50" />
        
        {/* Arrow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 
                      border-l-[25px] border-l-transparent
                      border-r-[25px] border-r-transparent
                      border-b-[40px] border-b-yellow-400
                      filter drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]" />
        
        {/* Base */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 
                      w-12 h-12 bg-gradient-to-b from-yellow-300 to-yellow-500
                      rounded-full shadow-[0_0_20px_rgba(255,215,0,0.4)]
                      border-4 border-yellow-400
                      transform -translate-y-2" />
      </div>
    </motion.div>
  );
}

export default WheelPointer;