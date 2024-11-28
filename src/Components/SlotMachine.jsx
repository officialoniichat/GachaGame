import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@mui/material';
import { useSound } from '../hooks/useSound';
import { useAnimation } from '../hooks/useAnimation';
import { useSlotAnimation } from '../hooks/useSlotAnimation';
import Reel from './Reel';
import SpinningWheel from './SpinningWheel/SpinningWheel';
import Leaderboard from './Leaderboard';
import PrizeShowcase from './PrizeShowcase';
import PatternGuide from './PatternGuide';
import FreeSpinsCounter from './FreeSpinsCounter';
import { SYMBOLS } from '../constants/symbols';

const SPIN_COST = 10;
const NORMAL_COOLDOWN = 2850;
const AUTOPLAY_COOLDOWN = 5000;

function getRandomElement() {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

function generateNewReels() {
  const newReels = [];
  for (let i = 0; i < 3; i++) {
    newReels.push({
      reel1: getRandomElement(),
      reel2: getRandomElement(),
      reel3: getRandomElement(),
    });
  }
  return newReels;
}

function SlotMachine() {
  console.log('SlotMachine component rendered');

  const [reels, setReels] = useState(generateNewReels());
  const [isSpinning, setIsSpinning] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [cooldownActive, setCooldownActive] = useState(false);
  const [gems, setGems] = useState(10000);
  const [freeSpins, setFreeSpins] = useState(0);
  const [spacebarPressed, setSpacebarPressed] = useState(false);
  const [showSpinningWheel, setShowSpinningWheel] = useState(false);
  const [scatterState, setScatterState] = useState({
    scatterPositions: new Map(),
    teasingColumns: new Set(),
  });
  const [isAutoPlayEnabled, setIsAutoPlayEnabled] = useState(false);
  const [wasAutoPlayEnabled, setWasAutoPlayEnabled] = useState(false);

  const buttonSpaceBar = useRef();
  const spinControlRef = useRef(null);
  const cooldownTimeoutRef = useRef(null);

  const { playSpinSound, playWinSound, toggleMusic, isMusicEnabled } = useSound();
  const { winningAnimation } = useAnimation();
  const { animateReels } = useSlotAnimation();

  // Initialize refs for state variables
  const isAutoPlayEnabledRef = useRef(isAutoPlayEnabled);
  const isSpinningRef = useRef(isSpinning);
  const isAnimatingRef = useRef(isAnimating);
  const cooldownActiveRef = useRef(cooldownActive);
  const showSpinningWheelRef = useRef(showSpinningWheel);

  // Update refs when state changes
  useEffect(() => {
    isAutoPlayEnabledRef.current = isAutoPlayEnabled;
    console.log('isAutoPlayEnabled updated:', isAutoPlayEnabled);
  }, [isAutoPlayEnabled]);

  useEffect(() => {
    isSpinningRef.current = isSpinning;
    console.log('isSpinning updated:', isSpinning);
  }, [isSpinning]);

  useEffect(() => {
    isAnimatingRef.current = isAnimating;
    console.log('isAnimating updated:', isAnimating);
  }, [isAnimating]);

  useEffect(() => {
    cooldownActiveRef.current = cooldownActive;
    console.log('cooldownActive updated:', cooldownActive);
  }, [cooldownActive]);

  useEffect(() => {
    showSpinningWheelRef.current = showSpinningWheel;
    console.log('showSpinningWheel updated:', showSpinningWheel);
  }, [showSpinningWheel]);

  const canSpin = useCallback(() => {
    const result =
      !showSpinningWheel &&
      (freeSpins > 0 || gems >= SPIN_COST) &&
      !isSpinning &&
      !isAnimating &&
      !cooldownActive;
  
    console.log('canSpin called:', result, {
      showSpinningWheel,
      freeSpins,
      gems,
      isSpinning,
      isAnimating,
      cooldownActive,
    });
  
    return result;
  }, [showSpinningWheel, freeSpins, gems, isSpinning, isAnimating, cooldownActive]);  

  function handleSpinClick() {
    console.log('handleSpinClick called');
    return new Promise((resolve) => {
      console.log('handleSpinClick check:', {
        canSpin: canSpin(),
        showSpinningWheel: showSpinningWheelRef.current,
      });

      if (!canSpin() || showSpinningWheelRef.current) {
        console.log('Cannot spin. Exiting handleSpinClick.');
        return resolve();
      }

      if (freeSpins > 0) {
        setFreeSpins((prev) => {
          const newFreeSpins = prev - 1;
          console.log('Free spins decremented:', newFreeSpins);
          return newFreeSpins;
        });
      } else {
        setGems((prev) => {
          const newGems = prev - SPIN_COST;
          console.log('Gems decremented:', newGems);
          return newGems;
        });
      }

      spin().then(() => {
        console.log('Spin completed');
        resolve();
      });
    });
  }

  function spin() {
    console.log('spin function called');
    return new Promise((resolve) => {
      // Clear existing sprites or animations if necessary
      document.querySelectorAll("div[style*='fixed']").forEach((sprite) => {
        sprite.remove();
      });

      playSpinSound();
      setIsSpinning(true);
      setIsAnimating(true);
      setCooldownActive(true);
      setScatterState({ scatterPositions: new Map(), teasingColumns: new Set() });

      console.log('Spin state updated:', {
        isSpinning: true,
        isAnimating: true,
        cooldownActive: true,
      });

      const reels = [
        document.querySelectorAll('.reel1'),
        document.querySelectorAll('.reel2'),
        document.querySelectorAll('.reel3'),
      ];

      spinControlRef.current = animateReels(
        reels,
        updateReelContent,
        (totalWins, combos, newScatterState) => {
          console.log('Spin animation callback called:', {
            totalWins,
            combos,
            newScatterState,
          });
          setScatterState(newScatterState);

          if (totalWins > 0) {
            if (totalWins > 1) {
              console.log('Total wins > 1, triggering spinning wheel');
              if (isAutoPlayEnabledRef.current) {
                setWasAutoPlayEnabled(true);
                setIsAutoPlayEnabled(false);
                isAutoplayActive.current = false; // Stop the autoplay loop immediately
                console.log('Autoplay disabled due to spinning wheel');
              }
              setShowSpinningWheel(true);

              // Stop the spin immediately when spinning wheel appears
              setIsSpinning(false);
              setIsAnimating(false);
              setCooldownActive(false);

              // Stop any ongoing animations
              if (spinControlRef.current && spinControlRef.current.stop) {
                spinControlRef.current.stop();
                spinControlRef.current = null; // Clear the reference
                console.log('Spin animation stopped');
              }

              resolve(); // Resolve the promise to allow autoplay loop to continue
              return; // Exit the function
            }
            playWinSound();
          }

          if (!newScatterState.teasingColumns.size) {
            setIsSpinning(false);
            console.log('Spin finished without teasing columns');

            setTimeout(() => {
              setIsAnimating(false);
              setCooldownActive(false);
              console.log('Cooldown finished');
              resolve(); // Resolve when spin completes
            }, isAutoPlayEnabledRef.current ? AUTOPLAY_COOLDOWN : NORMAL_COOLDOWN);
          }
        }
      );
    });
  }

  function updateReelContent(reel) {
    reel.forEach((el) => {
      const newElement = getRandomElement();
      el.innerHTML = `<img src="${newElement.src}" alt="${newElement.alt}" />`;
    });
    console.log('Reel content updated');
  }

  const toggleAutoPlay = () => {
    setIsAutoPlayEnabled((prev) => {
      const newState = !prev;
      isAutoPlayEnabledRef.current = newState; // Update ref immediately
      console.log('AutoPlay toggled:', newState);
  
      if (!newState) {
        isAutoplayActive.current = false; // Stop autoplay immediately
        console.log('Autoplay stopped.');
      }
  
      return newState;
    });
  };  

  const isAutoplayActive = useRef(false);

  const startAutoplay = useCallback(async () => {
    if (isAutoplayActive.current) {
      console.log('Autoplay already active, not starting another one.');
      return;
    }
    console.log('Autoplay started.');
    isAutoplayActive.current = true;
  
    while (isAutoPlayEnabledRef.current && canSpin() && isAutoplayActive.current) {
      await handleSpinClick();
  
      if (!isAutoPlayEnabledRef.current || !isAutoplayActive.current) {
        console.log('Autoplay stopped during loop.');
        break;
      }
  
      while (
        (isSpinningRef.current ||
          isAnimatingRef.current ||
          cooldownActiveRef.current ||
          showSpinningWheelRef.current) &&
        isAutoplayActive.current
      ) {
        console.log('Waiting for spin to finish', {
          isSpinning: isSpinningRef.current,
          isAnimating: isAnimatingRef.current,
          cooldownActive: cooldownActiveRef.current,
          showSpinningWheel: showSpinningWheelRef.current,
        });
        await new Promise((resolve) => setTimeout(resolve, 100));
  
        if (!isAutoPlayEnabledRef.current || !isAutoplayActive.current) {
          console.log('Autoplay stopped during spin wait.');
          break;
        }
      }
  
      if (!isAutoPlayEnabledRef.current || !isAutoplayActive.current) {
        console.log('Autoplay stopped after spin completion.');
        break;
      }
    }
  
    console.log('Autoplay loop exited.');
    isAutoplayActive.current = false;
  }, [canSpin]);
  

  useEffect(() => {
    console.log('useEffect for isAutoPlayEnabled triggered:', isAutoPlayEnabled);
    if (isAutoPlayEnabled && !isAutoplayActive.current) {
      startAutoplay();
    } else if (!isAutoPlayEnabled) {
      isAutoplayActive.current = false;
    }
  }, [isAutoPlayEnabled, startAutoplay]);

  useEffect(() => {
    console.log('useEffect for showSpinningWheel triggered:', showSpinningWheel);
    if (!showSpinningWheel && wasAutoPlayEnabled) {
      setIsAutoPlayEnabled(true);
      setWasAutoPlayEnabled(false);
      console.log('Autoplay re-enabled after spinning wheel');
    }
  }, [showSpinningWheel, wasAutoPlayEnabled]);

  useEffect(() => {
    console.log('useEffect for spacebar event listeners');
    const handleSpacebar = (event) => {
      if (event.code === 'Space' && !spacebarPressed && canSpin() && !isAutoPlayEnabledRef.current) {
        event.preventDefault();
        console.log('Spacebar pressed, triggering spin');
        buttonSpaceBar.current?.click();
        setSpacebarPressed(true);
      }
    };

    const handleSpacebarUp = (event) => {
      if (event.code === 'Space') {
        setSpacebarPressed(false);
        console.log('Spacebar released');
      }
    };

    window.addEventListener('keydown', handleSpacebar);
    window.addEventListener('keyup', handleSpacebarUp);

    return () => {
      window.removeEventListener('keydown', handleSpacebar);
      window.removeEventListener('keyup', handleSpacebarUp);
      if (cooldownTimeoutRef.current) {
        clearTimeout(cooldownTimeoutRef.current);
        console.log('Cooldown timeout cleared');
      }
    };
  }, [spacebarPressed, canSpin]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-pink-800">
      <div className="relative min-h-screen overflow-y-auto">
        <div className="fixed inset-0 opacity-30 pointer-events-none">
          <img 
            src="https://imagedelivery.net/80ncJPif6mMa3mEeTHej8g/27cbc2d2-3366-4102-d3a6-1e159cae6500/mobile" 
            alt="Character 1"
            className="fixed left-0 h-full object-contain md:block hidden"
          />
          <img 
            src="https://imagedelivery.net/80ncJPif6mMa3mEeTHej8g/733474e8-7795-4e81-ef59-0fedce06ab00/mobile" 
            alt="Character 2"
            className="fixed right-0 h-full object-contain md:block hidden"
          />
          <img 
            src="https://imagedelivery.net/80ncJPif6mMa3mEeTHej8g/bf4efd1e-ed21-4c43-b72e-a234b5574a00/mobile" 
            alt="Character"
            className="fixed left-1/2 -translate-x-1/2 h-full object-contain md:hidden block"
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="flex flex-col items-center space-y-6">
            <div className="w-full max-w-md">
              <PrizeShowcase />
            </div>

            <div className="w-full max-w-md">
              <PatternGuide />
            </div>

            <div className="flex items-center">
              <div className="flex items-center bg-black/30 backdrop-blur-md rounded-full px-3 py-1 shadow-lg">
                <img 
                  src="https://imagedelivery.net/80ncJPif6mMa3mEeTHej8g/d4824501-1568-453e-6760-c5370144e400/small" 
                  alt="Gem"
                  className="w-6 h-6 mr-2"
                />
                <span className="text-white text-lg font-bold">{gems.toLocaleString()}</span>
              </div>
              <FreeSpinsCounter freeSpins={freeSpins} />
            </div>

            <div className="w-full max-w-[384px] sm:max-w-[384px] mx-auto">
              <div className="overflow-hidden backdrop-blur-md bg-white/10 rounded-2xl p-2 shadow-2xl slot-container">
                <table className='relative mx-auto w-full'>
                  <tbody>
                    {reels.map((reelRow, i) => (
                      <tr key={i}>
                        <Reel 
                          className="reel1" 
                          symbol={reelRow.reel1} 
                          showGoldenBox={scatterState.scatterPositions.has(`0-${i}`)}
                          isTeasing={scatterState.teasingColumns.has(0)}
                        />
                        <Reel 
                          className="reel2" 
                          symbol={reelRow.reel2} 
                          showGoldenBox={scatterState.scatterPositions.has(`1-${i}`)}
                          isTeasing={scatterState.teasingColumns.has(1)}
                        />
                        <Reel 
                          className="reel3" 
                          symbol={reelRow.reel3} 
                          showGoldenBox={scatterState.scatterPositions.has(`2-${i}`)}
                          isTeasing={scatterState.teasingColumns.has(2)}
                        />
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <Button 
                  ref={buttonSpaceBar}
                  variant="contained"
                  size="large"
                  onClick={handleSpinClick}
                  disabled={!canSpin() || isAutoPlayEnabled}
                  fullWidth
                  sx={{
                    background: isSpinning || isAnimating || cooldownActive ? 
                      'linear-gradient(45deg, #2c3e50, #3498db)' : 
                      'linear-gradient(45deg, #ff6b6b, #ff8e8e)',
                    boxShadow: isSpinning || isAnimating || cooldownActive ? 
                      '0 4px 15px rgba(44, 62, 80, 0.4)' : 
                      '0 4px 15px rgba(255, 107, 107, 0.4)',
                    border: isSpinning || isAnimating || cooldownActive ? 
                      '2px solid rgba(255, 255, 255, 0.1)' : 
                      '2px solid rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(5px)',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    letterSpacing: '1px',
                    padding: '10px 0',
                    textTransform: 'uppercase',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: isSpinning || isAnimating || cooldownActive ? 
                        'linear-gradient(45deg, #2c3e50, #3498db)' : 
                        'linear-gradient(45deg, #ff8e8e, #ff6b6b)',
                      transform: isSpinning || isAnimating || cooldownActive ? 'none' : 'translateY(-2px)',
                      boxShadow: isSpinning || isAnimating || cooldownActive ? 
                        '0 4px 15px rgba(44, 62, 80, 0.4)' : 
                        '0 6px 20px rgba(255, 107, 107, 0.6)',
                    },
                    '&:disabled': {
                      background: 'linear-gradient(45deg, #95a5a6, #7f8c8d)',
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                      color: 'rgba(255, 255, 255, 0.5)',
                      cursor: 'not-allowed',
                    },
                    '&:active': {
                      transform: isSpinning || isAnimating || cooldownActive ? 'none' : 'translateY(1px)',
                    }
                  }}
                >
                  {isSpinning || isAnimating || cooldownActive ? (
                    <div className="flex items-center justify-center gap-2">
                      <span className="animate-pulse">Wait</span>
                      <span className="inline-block w-2 h-2 bg-white rounded-full animate-bounce" 
                            style={{ animationDelay: '0s' }}/>
                      <span className="inline-block w-2 h-2 bg-white rounded-full animate-bounce" 
                            style={{ animationDelay: '0.2s' }}/>
                      <span className="inline-block w-2 h-2 bg-white rounded-full animate-bounce" 
                            style={{ animationDelay: '0.4s' }}/>
                    </div>
                  ) : (
                    freeSpins > 0 ? `FREE SPIN (${freeSpins} left)` : `PLAY (${SPIN_COST} gems)`
                  )}
                </Button>

                <Button
                  variant="contained"
                  size='large'
                  onClick={toggleAutoPlay}
                  disabled={!canSpin() && !isAutoPlayEnabled}
                  fullWidth
                  sx={{
                    background: isAutoPlayEnabled ? 
                      'linear-gradient(45deg, #2ecc71, #27ae60)' : 
                      'linear-gradient(45deg, #3498db, #2980b9)',
                    boxShadow: '0 4px 15px rgba(52, 152, 219, 0.4)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(5px)',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    letterSpacing: '1px',
                    padding: '10px 0',
                    textTransform: 'uppercase',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: isAutoPlayEnabled ?
                        'linear-gradient(45deg, #27ae60, #2ecc71)' :
                        'linear-gradient(45deg, #2980b9, #3498db)',
                      transform: 'translateY(-2px)',
                    },
                    '&:disabled': {
                      background: 'linear-gradient(45deg, #95a5a6, #7f8c8d)',
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                      color: 'rgba(255, 255, 255, 0.5)',
                      cursor: 'not-allowed',
                    },
                    '&:active': {
                      transform: 'translateY(1px)',
                    }
                  }}
                >
                  {isAutoPlayEnabled ? 'Stop Auto Play' : 'Auto Play'}
                </Button>
              </div>
            </div>

            <div className="w-full">
              <Leaderboard onToggleMusic={toggleMusic} isMusicEnabled={isMusicEnabled} />
            </div>
          </div>
        </div>
      </div>

      <SpinningWheel 
        isVisible={showSpinningWheel}
        onComplete={(totalSpins) => {
          setShowSpinningWheel(false);
          setFreeSpins(prev => prev + totalSpins);
        }}
      />
    </main>
  );
}

export default SlotMachine;