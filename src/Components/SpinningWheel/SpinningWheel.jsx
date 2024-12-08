// src/Components/SpinningWheel/SpinningWheel.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MULTIPLIERS,
  INNER_NUMBERS,
  getMultiplierAtPointer,
  calculateFinalRotation,
  calculateInnerRotation
} from '../../utils/wheelUtils';
import InnerWheel from './InnerWheel';
import WheelSegment from './WheelSegment';

function SpinningWheel({ isVisible, onComplete }) {
  const [wheelState, setWheelState] = useState({
    isSpinning: false,
    result: null,
    slotNumber: null,
    rotation: 0,
    innerRotation: 0,
    showWheel: false,
    readyToClose: false,
  });

  const segmentAngle = 360 / MULTIPLIERS.length;

  const resetWheel = useCallback(() => {
    setWheelState({
      isSpinning: false,
      result: null,
      slotNumber: null,
      rotation: 0,
      innerRotation: 0,
      showWheel: false,
      readyToClose: false,
    });
  }, []);

  useEffect(() => {
    if (!isVisible) {
      resetWheel();
    } else if (isVisible && !wheelState.isSpinning && !wheelState.showWheel) {
      setWheelState((prev) => ({ ...prev, showWheel: true }));
      startSpin();
    }
  }, [isVisible, wheelState.isSpinning, wheelState.showWheel, resetWheel]);

  useEffect(() => {
    if (wheelState.readyToClose) {
      const closeTimer = setTimeout(() => {
        onComplete(wheelState.slotNumber, wheelState.result);
        resetWheel();
      }, 2000);

      return () => clearTimeout(closeTimer);
    }
  }, [wheelState.readyToClose, wheelState.result, wheelState.slotNumber, onComplete, resetWheel]);

  const startSpin = () => {
    if (wheelState.isSpinning) return;

    const targetMultiplier = MULTIPLIERS[Math.floor(Math.random() * MULTIPLIERS.length)];
    const targetNumber = INNER_NUMBERS[Math.floor(Math.random() * INNER_NUMBERS.length)];
    const finalRotation = calculateFinalRotation(targetMultiplier);
    const innerRotation = calculateInnerRotation(targetNumber);

    setWheelState((prev) => ({
      ...prev,
      isSpinning: true,
      rotation: finalRotation,
      innerRotation: innerRotation,
      slotNumber: targetNumber,
    }));

    setTimeout(() => {
      const selectedMultiplier = getMultiplierAtPointer(finalRotation);
      setWheelState((prev) => ({
        ...prev,
        isSpinning: false,
        result: selectedMultiplier,
        readyToClose: true,
      }));
    }, 12000);
  };

  return (
    <AnimatePresence>
      {wheelState.showWheel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-lg">
            {wheelState.isSpinning && (
              <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                    initial={{
                      x: Math.random() * window.innerWidth,
                      y: Math.random() * window.innerHeight,
                      scale: 0,
                      opacity: 0
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                      x: Math.random() * window.innerWidth,
                      y: Math.random() * window.innerHeight
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: Math.random() * 2
                    }}
                  />
                ))}
              </div>
            )}
          </div>

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
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SpinningWheel;
