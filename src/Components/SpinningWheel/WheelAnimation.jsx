import React from 'react';
import { motion } from 'framer-motion';
import InnerWheel from './InnerWheel';
import WheelSegment from './WheelSegment';

function WheelAnimation({ wheelState, segmentAngle, MULTIPLIERS }) {
  return (
    <div className="relative max-w-[500px] w-full aspect-square p-8">
      <div className="relative w-full h-full">
        <div className="absolute inset-[20%] z-20">
          <InnerWheel
            isSpinning={wheelState.isSpinning}
            finalNumber={{
              number: wheelState.slotNumber,
              rotation: wheelState.innerRotation,
            }}
          />
        </div>

        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 p-1">
          <motion.div
            className="relative w-full h-full rounded-full bg-gradient-to-br from-purple-900 to-purple-800"
            animate={{ rotate: wheelState.rotation }}
            transition={{
              duration: 12,
              ease: "circOut",
              times: [0, 1],
            }}
          >
            <div className="absolute inset-[20%] rounded-full bg-black/80" />
            {MULTIPLIERS.map((multiplier, index) => (
              <WheelSegment
                key={multiplier}
                multiplier={multiplier}
                angle={index * segmentAngle}
                radius={40}
              />
            ))}
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20">
          <div className="w-8 h-16">
            <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[32px] border-b-yellow-400 filter drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default WheelAnimation;