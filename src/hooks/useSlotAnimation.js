import gsap from 'gsap';
import { SYMBOLS } from '../constants/symbols';

function getRandomElement() {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

export function useSlotAnimation() {
  let activeWinningLines = [];
  let isSpinning = false;

  const clearActiveWinningLines = () => {
    const existingLines = document.querySelectorAll('.winning-line');
    existingLines.forEach(line => {
      gsap.killTweensOf(line);
      line.remove();
    });
    activeWinningLines = [];
  };

  const createWinningLine = () => {
    const line = document.createElement('div');
    line.className = 'winning-line';
    line.style.position = 'absolute';
    line.style.height = '4px';
    line.style.background = 'linear-gradient(90deg, rgba(255,215,0,0.7) 0%, rgba(255,255,255,0.9) 50%, rgba(255,215,0,0.7) 100%)';
    line.style.borderRadius = '2px';
    line.style.boxShadow = '0 0 10px rgba(255,215,0,0.7), 0 0 20px rgba(255,215,0,0.5)';
    line.style.transformOrigin = 'left center';
    line.style.zIndex = '10';
    
    const slotContainer = document.querySelector('.slot-container');
    if (slotContainer) {
      slotContainer.appendChild(line);
    }
    return line;
  };

  const animateWinningLine = (elements, type) => {
    const getElementCenter = (el) => {
      const rect = el.getBoundingClientRect();
      const containerRect = document.querySelector('.slot-container').getBoundingClientRect();
      return {
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top + rect.height / 2
      };
    };

    const drawLine = (start, end) => {
      const startPoint = getElementCenter(elements[0]);
      const endPoint = getElementCenter(elements[elements.length - 1]);
      
      const line = createWinningLine();
      const angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x) * 180 / Math.PI;
      const distance = Math.hypot(endPoint.x - startPoint.x, endPoint.y - startPoint.y);
      
      line.style.left = `${startPoint.x}px`;
      line.style.top = `${startPoint.y}px`;
      line.style.width = `${distance}px`;
      line.style.transform = `rotate(${angle}deg)`;

      // Enhanced pulsating animation
      const tl = gsap.timeline({
        repeat: -1,
        defaults: { duration: 2.5, ease: "power1.inOut" }
      });

      tl.to(line, {
        opacity: [1, 0.3, 1],
        boxShadow: [
          '0 0 15px rgba(255,215,0,0.9), 0 0 30px rgba(255,215,0,0.7), 0 0 45px rgba(255,215,0,0.5)',
          '0 0 8px rgba(255,215,0,0.4), 0 0 16px rgba(255,215,0,0.3), 0 0 24px rgba(255,215,0,0.2)',
          '0 0 15px rgba(255,215,0,0.9), 0 0 30px rgba(255,215,0,0.7), 0 0 45px rgba(255,215,0,0.5)'
        ],
        background: [
          'linear-gradient(90deg, rgba(255,215,0,0.9) 0%, rgba(255,255,255,1) 50%, rgba(255,215,0,0.9) 100%)',
          'linear-gradient(90deg, rgba(255,215,0,0.4) 0%, rgba(255,255,255,0.6) 50%, rgba(255,215,0,0.4) 100%)',
          'linear-gradient(90deg, rgba(255,215,0,0.9) 0%, rgba(255,255,255,1) 50%, rgba(255,215,0,0.9) 100%)'
        ],
        scale: [1, 0.95, 1],
        yoyo: true,
        repeat: -1
      });

      activeWinningLines.push(line);
    };

    if (elements.length > 1) {
      drawLine(elements[0], elements[elements.length - 1]);
    }
  };

  // Rest of the code remains exactly the same...
  const checkForWinningCombinations = (reels) => {
    const winningCombos = [];
    let totalWins = 0;
    
    const getSymbolInfo = (element) => {
      const img = element.querySelector('img');
      return { src: img.src, alt: img.alt };
    };

    // Check rows
    for (let row = 0; row < 3; row++) {
      const symbols = reels.map(reel => getSymbolInfo(reel[row]).src);
      if (symbols.every(src => src === symbols[0])) {
        winningCombos.push({ 
          type: 'row', 
          elements: reels.map(reel => reel[row])
        });
        totalWins++;
      }
    }
    
    // Check columns
    for (let col = 0; col < 3; col++) {
      const symbols = Array.from(reels[col]).map(cell => getSymbolInfo(cell).src);
      if (symbols.every(src => src === symbols[0])) {
        winningCombos.push({ 
          type: 'column', 
          elements: Array.from(reels[col])
        });
        totalWins++;
      }
    }

    // Check diagonals
    const diagonal1 = [reels[0][0], reels[1][1], reels[2][2]];
    const diagonal2 = [reels[0][2], reels[1][1], reels[2][0]];

    const isDiagonalWin = (diagonal) => {
      const symbols = diagonal.map(cell => getSymbolInfo(cell).src);
      return symbols.every(src => src === symbols[0]);
    };

    if (isDiagonalWin(diagonal1)) {
      winningCombos.push({ 
        type: 'diagonal',
        elements: diagonal1
      });
      totalWins++;
    }

    if (isDiagonalWin(diagonal2)) {
      winningCombos.push({ 
        type: 'diagonal',
        elements: diagonal2
      });
      totalWins++;
    }

    // Check for full screen
    const allSymbols = reels.flatMap(reel => 
      Array.from(reel).map(cell => getSymbolInfo(cell).src)
    );
    
    if (allSymbols.every(src => src === allSymbols[0])) {
      winningCombos.push({ 
        type: 'fullScreen',
        elements: reels.flatMap(reel => Array.from(reel))
      });
      totalWins = 'mega';
    }

    return { combos: winningCombos, totalWins };
  };

  const animateWinningCombination = (combo) => {
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
      }
    });

    if (combo.type !== 'fullScreen') {
      animateWinningLine(combo.elements, combo.type);
    }
  };

  const animateReels = (reels, updateReelContent, onComplete) => {
    clearActiveWinningLines();
    isSpinning = true;

    const spinAnimations = [];
    const updateIntervals = [];

    reels.forEach((reel, index) => {
      const tl = createSpinAnimation(reel, index);
      spinAnimations.push(tl);

      const updateInterval = setInterval(() => {
        if (isSpinning) {
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
      isSpinning = false;

      for (let i = 0; i < reels.length; i++) {
        spinAnimations[i].kill();
        clearInterval(updateIntervals[i]);
        await stopReel(reels[i], i * 0.3);
      }

      const { combos, totalWins } = checkForWinningCombinations(reels);
      
      if (combos.length > 0) {
        setTimeout(() => {
          combos.forEach(combo => {
            animateWinningCombination(combo);
          });
        }, 300);
      }

      onComplete(totalWins, combos);
    };

    setTimeout(stopSequence, 2000);

    return {
      stop: () => {
        clearActiveWinningLines();
        isSpinning = false;
        spinAnimations.forEach(anim => anim.kill());
        updateIntervals.forEach(interval => clearInterval(interval));
        
        reels.forEach((reel, index) => {
          stopReel(reel, index * 0.15);
        });

        setTimeout(() => onComplete(0, []), 600);
      }
    };
  };

  const createSpinAnimation = (reel, index) => {
    const images = Array.from(reel).map(cell => cell.querySelector('img'));
    const tl = gsap.timeline();
    
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

    return tl;
  };

  const stopReel = (reel, delay) => {
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
        ease: "back.out(1)",
        stagger: {
          amount: 0.1,
          from: "start"
        },
        onComplete: resolve
      });
    });
  };

  return { animateReels };
}