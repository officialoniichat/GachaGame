// src/Components/SpinningWheel/InnerWheel.jsx
import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { INNER_NUMBERS } from '../../utils/wheelUtils';

function InnerWheel({ isSpinning, finalNumber }) {
  const controls = useAnimation();
  const hasSpunRef = useRef(false);
  const mountedRef = useRef(false);
  const previousFinalNumberRef = useRef(finalNumber);

  // Reset state when component mounts
  useEffect(() => {
    mountedRef.current = true;
    hasSpunRef.current = false;
    previousFinalNumberRef.current = finalNumber;

    return () => {
      mountedRef.current = false;
      hasSpunRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!mountedRef.current) return;

    if (finalNumber !== previousFinalNumberRef.current) {
      hasSpunRef.current = false;
      previousFinalNumberRef.current = finalNumber;
    }

    const startSpinning = async () => {
      try {
        if (isSpinning && !hasSpunRef.current && mountedRef.current) {
          hasSpunRef.current = true;
          await controls.start({
            rotate: finalNumber.rotation,
            transition: {
              duration: 12,
              ease: [0.34, 1.56, 0.64, 1],
              times: [0, 1]
            }
          });
        }
      } catch (error) {
        console.error('Animation failed:', error);
        if (mountedRef.current) {
          hasSpunRef.current = false;
        }
      }
    };

    startSpinning();

    if (!isSpinning && mountedRef.current) {
      hasSpunRef.current = false;
    }
  }, [isSpinning, finalNumber, controls]);

  const wheelContent = (
    <>
      <div className="absolute inset-[20%] rounded-full bg-black/80 flex items-center justify-center overflow-hidden">
        
        <motion.img 
  src="https://imagedelivery.net/80ncJPif6mMa3mEeTHej8g/95f63f20-2b08-4eb4-dd20-d3a247074900/mobile"
  alt="Scatter"
  className="w-25 h-25 object-contain rounded-full"
  style={{
    clipPath: 'circle(50%)',
    background: 'linear-gradient(to right, rgba(255,215,0,0.1), rgba(255,215,0,0.2))',
    padding: '2px'
  }}
  animate={{
    rotate: isSpinning ? 360 : 0,
    filter: isSpinning ? [
      'drop-shadow(0 0 8px rgba(255,215,0,0.3))',
      'drop-shadow(0 0 15px rgba(255,215,0,0.6))',
      'drop-shadow(0 0 8px rgba(255,215,0,0.3))'
    ] : 'drop-shadow(0 0 8px rgba(255,215,0,0.3))'
  }}
  transition={{
    rotate: {
      duration: 2,
      repeat: Infinity,
      ease: "linear"
    },
    filter: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: "reverse"
    }
  }}
/>



      </div>
      {INNER_NUMBERS.map((number, index) => {
        const angle = (index * 360) / INNER_NUMBERS.length;
        const radian = (angle - 90) * (Math.PI / 180);
        const x = 50 + 40 * Math.cos(radian);
        const y = 50 + 40 * Math.sin(radian);
        
        return (
          <div
            key={number}
            className="absolute text-center"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: `translate(-50%, -50%) rotate(${angle + 180}deg)`,
              transformOrigin: 'center',
            }}
          >
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-0.5 rounded-lg shadow-lg">
              <div className="bg-purple-900/90 px-3 py-1 rounded-lg">
                <span className="text-2xl font-bold text-yellow-400 drop-shadow-lg">
                  {number}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );

  return (
    <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 p-1 shadow-[0_0_20px_rgba(255,215,0,0.4)]">
      <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-900/90 to-purple-800/90 backdrop-blur-sm flex items-center justify-center">
        <motion.div
          className="relative w-full h-full rounded-full bg-gradient-to-br from-purple-900 to-purple-800"
          initial={{ rotate: 0 }}
          animate={controls}
        >
          {wheelContent}
        </motion.div>
      </div>
    </div>
  );
}

export default InnerWheel;
