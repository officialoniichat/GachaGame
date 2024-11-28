import { gsap } from 'gsap';
import { SYMBOLS } from '../constants/symbols';
import { checkSymbolWins, animateWinningLine, clearWinningAnimations } from '../utils/symbolWinningLogic';

function getRandomElement() {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

export function useSlotAnimation() {
  let activeWinningLines = [];
  let isSpinning = false;
  let scatterPositions = new Map();
  let teasingColumns = new Set();
  let stoppedColumns = new Set();
  let animationInProgress = false;

  const clearActiveWinningLines = () => {
    clearWinningAnimations();
    activeWinningLines = [];
  };

  const updateScatterState = (reelIndex, reelElements, onStateUpdate) => {
    if (!stoppedColumns.has(reelIndex)) {
      stoppedColumns.add(reelIndex);
      
      // Clear previous scatter positions for this reel
      for (let i = 0; i < 3; i++) {
        scatterPositions.delete(`${reelIndex}-${i}`);
      }

      // Update scatter positions for this reel
      let hasScatter = false;
      reelElements.forEach((cell, rowIndex) => {
        const img = cell.querySelector('img');
        if (img && img.alt === 'scatter') {
          scatterPositions.set(`${reelIndex}-${rowIndex}`, true);
          hasScatter = true;
        }
      });

      // Update teasing columns based on scatter positions
      if (reelIndex === 0) {
        teasingColumns.clear();
        if (hasScatter) {
          teasingColumns.add(1);
          teasingColumns.add(2);
        }
      } else if (reelIndex === 1) {
        teasingColumns.delete(1);
        const hasLeftScatter = Array.from(scatterPositions.keys()).some(key => key.startsWith('0-'));
        const hasMiddleScatter = hasScatter;
        
        if (hasLeftScatter || hasMiddleScatter) {
          teasingColumns.add(2);
        } else {
          teasingColumns.clear();
        }
      } else if (reelIndex === 2) {
        teasingColumns.clear();
      }

      onStateUpdate({
        scatterPositions: new Map(scatterPositions),
        teasingColumns: new Set(teasingColumns)
      });
    }
  };

  const stopReel = async (reel, delay, reelIndex, onStateUpdate) => {
    return new Promise(resolve => {
      const images = Array.from(reel).map(cell => cell.querySelector('img'));
      
      images.forEach(img => {
        const nextElement = getRandomElement();
        img.src = nextElement.src;
        img.alt = nextElement.alt;
      });

      gsap.to(images, {
        y: 0,
        duration: 0.5,
        delay,
        ease: "power2.out",
        stagger: {
          amount: 0.1,
          from: "start"
        },
        onComplete: () => {
          updateScatterState(reelIndex, reel, onStateUpdate);
          resolve();
        }
      });
    });
  };

  const animateReels = (reels, updateReelContent, onComplete) => {
    clearActiveWinningLines();
    isSpinning = true;
    animationInProgress = true;
    scatterPositions.clear();
    teasingColumns.clear();
    stoppedColumns.clear();

    const spinAnimations = [];
    const updateIntervals = [];

    reels.forEach((reel, index) => {
      const tl = gsap.timeline();
      const images = Array.from(reel).map(cell => cell.querySelector('img'));
      
      gsap.set(images, { y: 0 });

      tl.to(images, {
        y: '+=120',
        duration: 0.1,
        ease: 'none',
        repeat: -1,
        modifiers: {
          y: y => `${parseFloat(y) % 120}px`
        }
      });

      const baseSpeed = 2;
      tl.timeScale(baseSpeed + (index * 0.2));
      
      spinAnimations.push(tl);

      const updateInterval = setInterval(() => {
        if (isSpinning && !stoppedColumns.has(index)) {
          Array.from(reel).forEach(cell => {
            const img = cell.querySelector('img');
            const nextElement = getRandomElement();
            img.src = nextElement.src;
            img.alt = nextElement.alt;
          });
        }
      }, 100);
      
      updateIntervals.push(updateInterval);
    });

    const stopSequence = async () => {
      for (let i = 0; i < reels.length; i++) {
        spinAnimations[i].kill();
        clearInterval(updateIntervals[i]);
        await stopReel(reels[i], i * 0.3, i, (state) => {
          onComplete(0, [], state);
        });
        
        // Wait for 2.5 seconds after each reel stops if there's a scatter symbol
        const hasScatterInStoppedColumns = Array.from(scatterPositions.keys()).some(key => 
          parseInt(key.split('-')[0]) <= i
        );
        
        if (hasScatterInStoppedColumns && i < reels.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2500));
        }
      }

      isSpinning = false;
      const winningCombos = checkSymbolWins(reels);
      let totalWins = 0;

      // Check for scatter wins
      const scatterCount = Array.from(scatterPositions.keys()).length;
      if (scatterCount >= 2) {
        const scatterElements = [];
        reels.forEach((reel, colIndex) => {
          Array.from(reel).forEach((cell, rowIndex) => {
            if (scatterPositions.has(`${colIndex}-${rowIndex}`)) {
              scatterElements.push(cell);
            }
          });
        });

        if (scatterElements.length >= 2) {
          winningCombos.push({
            type: 'scatter',
            elements: scatterElements
          });
          totalWins += scatterCount;
        }
      }

      // Add regular symbol wins
      totalWins += winningCombos.length;
      
      if (winningCombos.length > 0) {
        setTimeout(() => {
          winningCombos.forEach(combo => {
            if (combo.type === 'scatter') {
              const winningImages = combo.elements.map(el => el.querySelector('img'));
              gsap.to(winningImages, {
                scale: 1.2,
                duration: 0.3,
                ease: "power2.out",
                yoyo: true,
                repeat: 5,
                stagger: {
                  each: 0.1,
                  from: "start"
                },
                onComplete: () => {
                  if (!teasingColumns.size) {
                    setTimeout(() => {
                      animationInProgress = false;
                    }, 2000); // 2-second cooldown
                  }
                }
              });
            } else {
              animateWinningLine(combo).then(() => {
                if (!teasingColumns.size) {
                  setTimeout(() => {
                    animationInProgress = false;
                  }, 2000); // 2-second cooldown
                }
              });
            }
          });
        }, 300);
      } else {
        if (!teasingColumns.size) {
          setTimeout(() => {
            animationInProgress = false;
          }, 2000); // 2-second cooldown
        }
      }

      onComplete(totalWins, winningCombos, { 
        scatterPositions: new Map(scatterPositions), 
        teasingColumns: new Set(teasingColumns) 
      });
    };

    setTimeout(stopSequence, 2000);

    return {
      stop: () => {
        clearActiveWinningLines();
        isSpinning = false;
        animationInProgress = false;
        spinAnimations.forEach(anim => anim.kill());
        updateIntervals.forEach(interval => clearInterval(interval));
        
        reels.forEach((reel, index) => {
          stopReel(reel, index * 0.15, index, (state) => {
            onComplete(0, [], state);
          });
        });
      }
    };
  };

  return { animateReels };
}