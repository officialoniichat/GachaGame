import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SLOT_NUMBERS = [1, 2, 3, 4, 5];

function SlotMachine({ isSpinning, onSpinComplete }) {
  const [currentNumber, setCurrentNumber] = useState('?');
  const [finalNumber, setFinalNumber] = useState(null);
  const animationRef = useRef(null);
  const spinCompleteRef = useRef(false);

  useEffect(() => {
    if (isSpinning && !spinCompleteRef.current) {
      spinCompleteRef.current = false; // Ensure it's false at the start
      const final = SLOT_NUMBERS[Math.floor(Math.random() * SLOT_NUMBERS.length)];
      setFinalNumber(final);

      const startTime = Date.now();
      const spinDuration = 6000;
      const accelerationDuration = 1000;
      const maxSpeedDuration = 3000;
      const decelerationDuration = spinDuration - accelerationDuration - maxSpeedDuration;

      const animate = () => {
        const elapsed = Date.now() - startTime;

        if (elapsed < spinDuration) {
          let speed;

          if (elapsed < accelerationDuration) {
            const progress = elapsed / accelerationDuration;
            speed = 300 - 200 * progress;
          } else if (elapsed < accelerationDuration + maxSpeedDuration) {
            speed = 100;
          } else {
            const decelerationProgress = (elapsed - accelerationDuration - maxSpeedDuration) / decelerationDuration;
            const easeOutQuart = 1 - Math.pow(1 - decelerationProgress, 4);
            speed = 100 + 600 * easeOutQuart;
          }

          if (elapsed % Math.floor(speed) < 16) {
            const randomIndex = Math.floor(Math.random() * SLOT_NUMBERS.length);
            setCurrentNumber(SLOT_NUMBERS[randomIndex]);
          }

          animationRef.current = requestAnimationFrame(animate);
        } else {
          setCurrentNumber(final);
          spinCompleteRef.current = true;
          onSpinComplete(final);
        }
      };

      animationRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    } else if (!isSpinning) {
      spinCompleteRef.current = false;
      setCurrentNumber('?');
      setFinalNumber(null);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  }, [isSpinning, onSpinComplete]);

  return (
    <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-900/90 to-purple-800/90 backdrop-blur-sm flex items-center justify-center">
      <div className="relative w-4/5 h-4/5 rounded-full bg-black/50 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-purple-900/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-purple-900/20" />
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentNumber}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ 
              type: "tween",
              duration: 0.15, // Slightly increased for smoother transitions
              ease: "easeOut"
            }}
            className="relative"
          >
            <span className={`text-8xl font-bold ${
              currentNumber === '?' 
                ? 'text-white/40' 
                : 'text-white'
            } filter drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)]`}>
              {currentNumber}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Subtle radial lines */}
        <div className="absolute inset-0">
          {[...Array(24)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent"
              style={{ transform: `translate(-50%, -50%) rotate(${i * 15}deg)` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SlotMachine;