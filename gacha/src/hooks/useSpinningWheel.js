import { useState } from 'react';

export function useSpinningWheel() {
  const [isSpinning, setIsSpinning] = useState(false);

  const getRandomItem = (array) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  const startSpin = () => {
    return new Promise((resolve) => {
      setIsSpinning(true);

      // Random results
      const multipliers = [1, 3, 5, 7, 10, 15, 20, 25];
      const spins = [5, 8, 10, 12];

      const multiplier = getRandomItem(multipliers);
      const spinCount = getRandomItem(spins);
      const totalSpins = multiplier * spinCount;

      // Resolve after animation
      setTimeout(() => {
        setIsSpinning(false);
        resolve({
          multiplier,
          spins: spinCount,
          totalSpins
        });
      }, 8000); // Match the longest animation duration
    });
  };

  return {
    isSpinning,
    startSpin
  };
}