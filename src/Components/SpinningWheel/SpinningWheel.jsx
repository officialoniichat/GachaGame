import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MULTIPLIERS,
  INNER_NUMBERS,
  getMultiplierAtPointer,
  calculateFinalRotation,
  calculateInnerRotation
} from '../../utils/wheelUtils';
import WheelAnimation from './WheelAnimation';
import CongratulationsScreen from '../popups/CongratulationsScreen';

function SpinningWheel({ isVisible, onComplete }) {
  const [wheelState, setWheelState] = useState({
    isSpinning: false,
    result: null,
    slotNumber: null,
    rotation: 0,
    innerRotation: 0,
    showWheel: false,
    readyToClose: false,
    showCongratulations: false,
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
      showCongratulations: false,
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
      const timer = setTimeout(() => {
        setWheelState(prev => ({ ...prev, showCongratulations: true }));
      }, 1000); // Short delay for better transition
      return () => clearTimeout(timer);
    }
  }, [wheelState.readyToClose]);

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

  const handleCongratulationsClick = () => {
    setWheelState(prev => ({ ...prev, showCongratulations: false }));
    onComplete(wheelState.slotNumber, wheelState.result);
    resetWheel();
  };

  return (
    <AnimatePresence mode="wait">
      {wheelState.showCongratulations ? (
        <motion.div
          key="congratulations"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCongratulationsClick}
          className="fixed inset-0 z-50"
        >
          <CongratulationsScreen freeSpins={wheelState.slotNumber} />
        </motion.div>
      ) : wheelState.showWheel ? (
        <motion.div
          key="wheel"
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

          <WheelAnimation 
            wheelState={wheelState}
            segmentAngle={segmentAngle}
            MULTIPLIERS={MULTIPLIERS}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default SpinningWheel;