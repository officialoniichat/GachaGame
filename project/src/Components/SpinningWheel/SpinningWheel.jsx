import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MULTIPLIERS = [1, 3, 5, 7, 10, 15, 20, 25];
const SLOT_NUMBERS = [1, 2, 3, 4, 5];

const getMultiplierStyle = (multiplier) => {
  if (multiplier <= 3) return "from-yellow-400 to-yellow-500";
  if (multiplier <= 7) return "from-orange-400 to-orange-500";
  if (multiplier <= 10) return "from-red-400 to-red-500";
  if (multiplier <= 15) return "from-purple-400 to-purple-500";
  return "from-pink-400 to-pink-500";
};

const SlotMachine = ({ isSpinning, onSpinComplete }) => {
  const [number, setNumber] = useState(null);

  useEffect(() => {
    if (isSpinning) {
      const finalNumber = SLOT_NUMBERS[Math.floor(Math.random() * SLOT_NUMBERS.length)];
      const interval = setInterval(() => {
        setNumber(SLOT_NUMBERS[Math.floor(Math.random() * SLOT_NUMBERS.length)]);
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        setNumber(finalNumber);
        onSpinComplete(finalNumber);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isSpinning]);

  return (
    <div className="bg-white rounded-lg p-8 w-40 h-40 flex items-center justify-center">
      <div className="text-6xl font-bold text-purple-900">
        {number || '?'}
      </div>
    </div>
  );
};

function SpinningWheel({ isVisible, onComplete }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [isSlotSpinning, setIsSlotSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [slotNumber, setSlotNumber] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [showWheel, setShowWheel] = useState(false);
  const segmentAngle = 360 / MULTIPLIERS.length;

  useEffect(() => {
    if (isVisible && !isSpinning) {
      setShowWheel(true);
      startSpin();
    }
  }, [isVisible]);

  const startSpin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setResult(null);
    setSlotNumber(null);
    
    const finalMultiplier = MULTIPLIERS[Math.floor(Math.random() * MULTIPLIERS.length)];
    const finalRotation = 3600 + ((MULTIPLIERS.indexOf(finalMultiplier) * segmentAngle));
    setRotation(finalRotation);
    
    setTimeout(() => {
      setResult(finalMultiplier);
      setIsSpinning(false);
      setIsSlotSpinning(true);
    }, 8000);
  };

  const handleSlotComplete = (number) => {
    setSlotNumber(number);
    setTimeout(() => {
      setShowWheel(false);
      onComplete(number * result);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {showWheel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-lg" />
          
          <div className="relative max-w-[500px] w-full aspect-square p-8">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 p-1">
                <motion.div
                  className="relative w-full h-full rounded-full bg-gradient-to-br from-purple-900 to-purple-800"
                  animate={{ rotate: rotation }}
                  transition={{
                    duration: 8,
                    ease: "easeOut",
                    times: [0, 0.2, 1],
                  }}
                >
                  <div className="absolute inset-[20%] rounded-full bg-black/80" />
                  
                  {MULTIPLIERS.map((multiplier, index) => {
                    const angle = index * segmentAngle;
                    const radian = (angle - 90) * (Math.PI / 180);
                    const radius = 40;
                    const x = 50 + radius * Math.cos(radian);
                    const y = 50 + radius * Math.sin(radian);
                    
                    return (
                      <div
                        key={multiplier}
                        className="absolute text-center"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          transform: `translate(-50%, -50%) rotate(${angle + 180}deg)`,
                          transformOrigin: 'center',
                        }}
                      >
                        <div className={`bg-gradient-to-r ${getMultiplierStyle(multiplier)} 
                                      p-0.5 rounded-lg shadow-lg`}>
                          <div className="bg-purple-900/90 px-3 py-1 rounded-lg">
                            <span className="text-2xl font-bold text-yellow-400 drop-shadow-lg">
                              {multiplier}x
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>

                {/* Center Container with Slot Machine */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <SlotMachine
                    isSpinning={isSlotSpinning}
                    onSpinComplete={handleSlotComplete}
                  />
                </div>
              </div>

              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20">
                <div className="w-8 h-16">
                  <div className="w-0 h-0 border-l-[16px] border-l-transparent 
                                border-r-[16px] border-r-transparent 
                                border-b-[32px] border-b-yellow-400 
                                filter drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]" />
                </div>
              </div>
            </div>

            {result && slotNumber && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-8 text-center"
              >
                <div className="text-4xl font-bold text-yellow-400">
                  {result}x × {slotNumber} = {result * slotNumber}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SpinningWheel;