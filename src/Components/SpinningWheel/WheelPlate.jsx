import React from 'react';
import { motion } from 'framer-motion';

function WheelPlate({ items, isOuter, isSpinning, rotationDirection }) {
  const segments = items.length;
  const segmentAngle = 360 / segments;
  
  return (
    <motion.div
      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                  ${isOuter ? 'w-full h-full' : 'w-[80%] h-[80%]'} rounded-full`}
      style={{
        transformOrigin: 'center',
        zIndex: isOuter ? 1 : 2
      }}
      animate={isSpinning ? {
        rotate: [0, 360 * 5 * rotationDirection + Math.random() * 360]
      } : {}}
      transition={{
        duration: isOuter ? 8 : 10,
        ease: [0.13, 0.99, 0.29, 1.0],
        times: [0, 1]
      }}
    >
      <div className={`w-full h-full rounded-full relative overflow-hidden
                      ${isOuter ? 'bg-gradient-to-br from-indigo-900 to-indigo-800' : 
                                'bg-gradient-to-br from-purple-900 to-purple-800'}`}>
        {items.map((item, index) => {
          const angle = segmentAngle * index;
          return (
            <div
              key={index}
              className="absolute top-0 left-0 w-full h-full"
              style={{
                transform: `rotate(${angle}deg)`,
                transformOrigin: '50% 50%',
                clipPath: `polygon(50% 50%, 50% 0, ${50 + Math.cos((segmentAngle * Math.PI) / 180) * 50}% ${50 - Math.sin((segmentAngle * Math.PI) / 180) * 50}%)`
              }}
            >
              <div className={`absolute top-0 left-0 w-full h-full 
                              ${index % 2 === 0 ? 
                                'bg-gradient-to-t from-blue-700/80 to-blue-600/80' : 
                                'bg-gradient-to-t from-blue-800/80 to-blue-700/80'}`}>
                <div className="absolute top-[20%] left-1/2 -translate-x-1/2 transform -rotate-[90deg]
                               flex items-center justify-center">
                  <span className={`font-bold text-yellow-400 drop-shadow-lg
                                  ${isOuter ? 'text-4xl' : 'text-3xl'}`}>
                    {isOuter ? `${item}x` : item}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Decorative Ring */}
      <div className={`absolute inset-0 rounded-full border-4
                      ${isOuter ? 'border-yellow-400' : 'border-purple-400'}
                      shadow-[0_0_15px_rgba(255,215,0,0.3)]`} />
    </motion.div>
  );
}

export default WheelPlate;