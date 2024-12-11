import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GemRain = ({ isVisible, onComplete, gems = 0 }) => {
  const [gemElements, setGemElements] = useState([]);
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Create two sets of gems for continuous animation
      const createGems = (offset = 0) => Array.from({ length: 35 }, (_, i) => ({
        id: `${i}-${offset}`,
        x: Math.random() * window.innerWidth,
        delay: Math.random() * 1.5 + offset,
        rotation: Math.random() * 360,
        scale: 0.6 + Math.random() * 0.4, // Increased base scale
      }));

      // Combine multiple sets for denser effect
      setGemElements([
        ...createGems(0),
        ...createGems(0.75),
        ...createGems(1.5)
      ]);

      // Show skip message after 1 second
      const skipTimer = setTimeout(() => setShowSkip(true), 1000);

      return () => {
        clearTimeout(skipTimer);
      };
    }
  }, [isVisible]);

  const handleClick = (e) => {
    e.stopPropagation();
    onComplete();
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-auto"
      onClick={handleClick}
    >
      {/* Gems */}
      <AnimatePresence>
        {gemElements.map((gem) => (
          <motion.img
            key={gem.id}
            src="https://imagedelivery.net/80ncJPif6mMa3mEeTHej8g/91b194b2-a177-49a8-be81-95615a4e3000/mobile"
            alt="Falling Gem"
            className="absolute w-16 h-16 object-contain"
            initial={{
              x: gem.x,
              y: -50,
              rotate: gem.rotation,
              scale: gem.scale,
              opacity: 0,
            }}
            animate={{
              y: window.innerHeight + 100,
              opacity: [0, 1, 1, 0],
              rotate: gem.rotation + 360,
            }}
            transition={{
              duration: 3, // Increased from 2.5 to 3 for slower animation
              delay: gem.delay,
              repeat: Infinity,
              repeatDelay: 0,
              ease: "linear"
            }}
          />
        ))}
      </AnimatePresence>

      {/* Skip message */}
      <AnimatePresence>
        {showSkip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 text-white text-lg font-bold bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm"
          >
            Press Anywhere to Continue
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GemRain;
