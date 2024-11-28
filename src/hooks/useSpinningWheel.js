import { useState } from 'react';

export function useSpinningWheel() {
  const [isSpinning, setIsSpinning] = useState(false);

  const startSpin = () => {
    return new Promise((resolve) => {
      setIsSpinning(true);

      // Fixed 5 spins with random multiplier
      const multipliers = [1, 3, 5, 7, 10, 15, 20, 25];
      const multiplier = multipliers[Math.floor(Math.random() * multipliers.length)];
      const spins = 5; // Fixed number of spins
      const totalSpins = multiplier * spins;

      // Resolve after animation
      setTimeout(() => {
        setIsSpinning(false);
        resolve({
          multiplier,
          spins,
          totalSpins
        });
      }, 4000);
    });
  };

  return {
    isSpinning,
    startSpin
  };
}