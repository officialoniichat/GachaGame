import { gsap } from 'gsap';

export const checkSymbolWins = (reels) => {
  const winningCombos = [];
  const scatterPositions = new Map();

  const getSymbolInfo = (cell) => {
    const img = cell.querySelector('img');
    return img ? { src: img.src, alt: img.alt } : null;
  };

  // Track scatters first (max 1 per column)
  reels.forEach((reel, colIndex) => {
    let columnScatterCount = 0;
    Array.from(reel).forEach((cell, rowIndex) => {
      const symbol = getSymbolInfo(cell);
      if (symbol && symbol.alt === 'scatter' && columnScatterCount === 0) {
        scatterPositions.set(`${colIndex}-${rowIndex}`, cell);
        columnScatterCount++;
      }
    });
  });

  // Check rows
  for (let row = 0; row < 3; row++) {
    const symbols = reels.map(reel => getSymbolInfo(reel[row])).filter(Boolean);
    if (symbols.length === 3 && symbols[0].alt !== 'scatter' && 
        symbols.every(symbol => symbol.alt === symbols[0].alt)) {
      winningCombos.push({
        type: 'row',
        row,
        symbol: symbols[0].alt,
        elements: reels.map(reel => reel[row])
      });
    }
  }

  // Check columns
  for (let col = 0; col < 3; col++) {
    const symbols = Array.from(reels[col])
      .map(cell => getSymbolInfo(cell))
      .filter(Boolean);
    if (symbols.length === 3 && symbols[0].alt !== 'scatter' && 
        symbols.every(symbol => symbol.alt === symbols[0].alt)) {
      winningCombos.push({
        type: 'column',
        column: col,
        symbol: symbols[0].alt,
        elements: Array.from(reels[col])
      });
    }
  }

  // Check diagonals
  const diagonal1 = [reels[0][0], reels[1][1], reels[2][2]];
  const diagonal2 = [reels[0][2], reels[1][1], reels[2][0]];

  const checkDiagonal = (diagonal, direction) => {
    const symbols = diagonal
      .map(cell => getSymbolInfo(cell))
      .filter(Boolean);
    if (symbols.length === 3 && symbols[0].alt !== 'scatter' && 
        symbols.every(symbol => symbol.alt === symbols[0].alt)) {
      winningCombos.push({
        type: 'diagonal',
        direction,
        symbol: symbols[0].alt,
        elements: diagonal
      });
    }
  };

  checkDiagonal(diagonal1, 'main');
  checkDiagonal(diagonal2, 'anti');

  // Check full screen
  const allSymbols = reels.flatMap(reel => 
    Array.from(reel)
      .map(cell => getSymbolInfo(cell))
      .filter(Boolean)
  );
  
  if (allSymbols.length === 9 && allSymbols[0].alt !== 'scatter' && 
      allSymbols.every(symbol => symbol.alt === allSymbols[0].alt)) {
    winningCombos.push({
      type: 'fullScreen',
      symbol: allSymbols[0].alt,
      elements: reels.flatMap(reel => Array.from(reel))
    });
  }

  // Add scatter wins if 2 or more scatters (max 3)
  if (scatterPositions.size >= 2 && scatterPositions.size <= 3) {
    winningCombos.push({
      type: 'scatter',
      elements: Array.from(scatterPositions.values())
    });
  }

  return winningCombos;
};

export const animateWinningLine = (combo) => {
  return new Promise(resolve => {
    if (!combo || !combo.elements || combo.elements.length === 0) {
      resolve();
      return;
    }

    const container = document.querySelector('.slot-container');
    if (!container) {
      resolve();
      return;
    }

    const line = document.createElement('div');
    line.className = 'winning-line';
    
    const getLinePosition = () => {
      const firstElement = combo.elements[0].getBoundingClientRect();
      const lastElement = combo.elements[combo.elements.length - 1].getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const startX = firstElement.left - containerRect.left + firstElement.width / 2;
      const startY = firstElement.top - containerRect.top + firstElement.height / 2;
      const endX = lastElement.left - containerRect.left + lastElement.width / 2;
      const endY = lastElement.top - containerRect.top + lastElement.height / 2;

      const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
      const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;

      return { startX, startY, length, angle };
    };

    const { startX, startY, length, angle } = getLinePosition();

    Object.assign(line.style, {
      position: 'absolute',
      left: `${startX}px`,
      top: `${startY}px`,
      width: `${length}px`,
      height: '4px',
      background: 'linear-gradient(90deg, rgba(255,215,0,0.7) 0%, rgba(255,255,255,0.9) 50%, rgba(255,215,0,0.7) 100%)',
      borderRadius: '2px',
      boxShadow: '0 0 10px rgba(255,215,0,0.7), 0 0 20px rgba(255,215,0,0.5)',
      transformOrigin: 'left center',
      transform: `rotate(${angle}deg)`,
      opacity: 0,
      zIndex: 10
    });

    container.appendChild(line);

    const jumpDuration = 0.3;
    const jumpPause = 0.15;
    const cyclePause = 3.5;
    const pulseDuration = 1.0;

    combo.elements.forEach(element => {
      const img = element.querySelector('img');
      if (!img) return;

      const jumpTimeline = gsap.timeline({ repeat: -1 });
      
      jumpTimeline.to(img, {
        y: -20,
        duration: jumpDuration,
        ease: "power2.out"
      })
      .to(img, {
        y: 0,
        duration: jumpDuration,
        ease: "power2.in"
      })
      .to({}, { duration: jumpPause })
      .to(img, {
        y: -20,
        duration: jumpDuration,
        ease: "power2.out"
      })
      .to(img, {
        y: 0,
        duration: jumpDuration,
        ease: "power2.in"
      })
      .to({}, { duration: cyclePause });
    });

    gsap.fromTo(line, 
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(line, {
            opacity: 0.3,
            duration: pulseDuration,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            repeatDelay: 1.5
          });
          resolve();
        }
      }
    );
  });
};

export const clearWinningAnimations = () => {
  const lines = document.querySelectorAll('.winning-line');
  lines.forEach(line => {
    gsap.killTweensOf(line);
    line.remove();
  });

  const allImages = document.querySelectorAll('.reel1 img, .reel2 img, .reel3 img');
  allImages.forEach(img => {
    gsap.killTweensOf(img);
    gsap.set(img, { y: 0 });
  });
};