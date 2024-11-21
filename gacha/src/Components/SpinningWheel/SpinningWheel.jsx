import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WheelPlate from './WheelPlate';
import WheelPointer from './WheelPointer';
import { useSpinningWheel } from '../../hooks/useSpinningWheel';

const multipliers = [1, 3, 5, 7, 10, 15, 20, 25];
const spins = [5, 8, 10, 12];

function SpinningWheel({ isVisible, onComplete }) {
  const [result, setResult] = useState(null);
  const { startSpin, isSpinning } = useSpinningWheel();

  useEffect(() => {
    if (isVisible && !isSpinning) {
      handleSpin();
    }
  }, [isVisible]);

  const handleSpin = async () => {
    const spinResult = await startSpin();
    setResult(spinResult);
    setTimeout(() => {
      onComplete(spinResult.totalSpins);
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          <div className="absolute inset-0 bg-gradient-radial from-purple-900/90 via-purple-900/95 to-black backdrop-blur-xl" />
          
          <div className="relative w-[80vh] h-[80vh] max-w-[90vw] max-h-[90vw]">
            {/* Main Wheel Container */}
            <div className="absolute inset-0">
              {/* Outer Decorative Frame */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 p-2 shadow-[0_0_50px_rgba(255,215,0,0.3)]">
                {/* Inner Frame */}
                <div className="absolute inset-2 bg-gradient-to-br from-purple-900 to-purple-800 rounded-full shadow-inner">
                  {/* Wheel Container */}
                  <div className="relative w-full h-full">
                    {/* Plates Container - Ensures plates are centered and overlapping */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {/* Outer Plate */}
                      <div className="absolute w-full h-full">
                        <WheelPlate
                          items={multipliers}
                          isOuter={true}
                          isSpinning={isSpinning}
                          rotationDirection={1}
                        />
                      </div>
                      {/* Inner Plate */}
                      <div className="absolute w-[75%] h-[75%]">
                        <WheelPlate
                          items={spins}
                          isOuter={false}
                          isSpinning={isSpinning}
                          rotationDirection={-1}
                        />
                      </div>
                    </div>
                    <WheelPointer />
                  </div>
                </div>
              </div>
            </div>

            {/* Result Display */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 text-center mt-8
                           bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl p-1"
                >
                  <div className="bg-purple-900 rounded-lg px-8 py-4">
                    <h2 className="text-4xl font-bold text-transparent bg-clip-text 
                                 bg-gradient-to-r from-yellow-400 to-yellow-600 mb-2">
                      {result.multiplier}x Multiplier
                    </h2>
                    <p className="text-2xl text-white">
                      {result.spins} Free Spins = {result.totalSpins} Total Spins!
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SpinningWheel;