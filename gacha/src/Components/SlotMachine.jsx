import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@mui/material';
import { useSound } from '../hooks/useSound';
import { useAnimation } from '../hooks/useAnimation';
import { useSlotAnimation } from '../hooks/useSlotAnimation';
import Reel from './Reel';
import WinnerDisplay from './WinnerDisplay';
import SpinningWheel from './SpinningWheel/SpinningWheel';
import Leaderboard from './Leaderboard';
import PrizeShowcase from './PrizeShowcase';
import PatternGuide from './PatternGuide';
import { SYMBOLS } from '../constants/symbols';

const SPIN_COST = 10;

function getRandomElement() {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

function generateNewReels() {
  const newReels = [];
  for (let i = 0; i < 3; i++) {
    newReels.push({
      reel1: getRandomElement(),
      reel2: getRandomElement(),
      reel3: getRandomElement()
    });
  }
  return newReels;
}

function SlotMachine() {
  const [reels, setReels] = useState(generateNewReels());
  const [isSpinning, setIsSpinning] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [winner, setWinner] = useState('');
  const [gems, setGems] = useState(10000);
  const [spacebarPressed, setSpacebarPressed] = useState(false);
  const [showSpinningWheel, setShowSpinningWheel] = useState(false);
  const [scatterState, setScatterState] = useState({ scatterPositions: new Map(), teasingColumns: new Set() });
  
  const buttonSpaceBar = useRef();
  const spinControlRef = useRef(null);
  
  const { playSpinSound, playWinSound, toggleMusic, isMusicEnabled } = useSound();
  const { winningAnimation } = useAnimation();
  const { animateReels } = useSlotAnimation();

  const canSpin = () => {
    return gems >= SPIN_COST;
  };

  function handleSpinClick() {
    if (!isSpinning && !canSpin()) {
      return;
    }

    if (!isSpinning) {
      setGems(prev => prev - SPIN_COST);
      spin();
    }
  }

  function spin() {
    document.querySelectorAll("div[style*='fixed']").forEach((sprite) => {
      sprite.remove();
    });
    
    playSpinSound();
    setIsWin(false);
    setIsSpinning(true);
    setScatterState({ scatterPositions: new Map(), teasingColumns: new Set() });

    const reels = [
      document.querySelectorAll(".reel1"),
      document.querySelectorAll(".reel2"),
      document.querySelectorAll(".reel3")
    ];

    spinControlRef.current = animateReels(
      reels,
      updateReelContent,
      (totalWins, combos, newScatterState) => {
        setIsSpinning(false);
        setScatterState(newScatterState);
        
        if (totalWins > 0) {
          setIsWin(true);
          if (totalWins === 'mega') {
            setWinner('MegaWinner');
          } else if (totalWins > 1) {
            setShowSpinningWheel(true);
          } else {
            setWinner('Winner1');
          }
          playWinSound();
        }
      }
    );
  }

  function updateReelContent(reel) {
    reel.forEach((el) => {
      const newElement = getRandomElement();
      el.innerHTML = `<img src="${newElement.src}" alt="${newElement.alt}" />`;
    });
  }

  useEffect(() => {
    const handleSpacebar = (event) => {
      if (event.code === 'Space' && !spacebarPressed) {
        event.preventDefault();
        buttonSpaceBar.current?.click();
        setSpacebarPressed(true);
      }
    };

    const handleSpacebarUp = (event) => {
      if (event.code === 'Space') {
        setSpacebarPressed(false);
      }
    };

    window.addEventListener('keydown', handleSpacebar);
    window.addEventListener('keyup', handleSpacebarUp);
    
    return () => {
      window.removeEventListener('keydown', handleSpacebar);
      window.removeEventListener('keyup', handleSpacebarUp);
    };
  }, [spacebarPressed]);

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
            <WinnerDisplay isWin={isWin} winner={winner} />
            
            <div className="w-full max-w-md">
              <PrizeShowcase />
            </div>

            <div className="w-full max-w-md">
              <PatternGuide />
            </div>

            <div className="flex items-center bg-black/30 backdrop-blur-md rounded-full px-3 py-1 shadow-lg">
              <img 
                src="https://imagedelivery.net/80ncJPif6mMa3mEeTHej8g/d4824501-1568-453e-6760-c5370144e400/small" 
                alt="Gem"
                className="w-6 h-6 mr-2"
              />
              <span className="text-white text-lg font-bold">{gems.toLocaleString()}</span>
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

              <div className="text-center mt-4">
                <Button 
                  ref={buttonSpaceBar}
                  variant="contained"
                  size='large'
                  onClick={handleSpinClick}
                  disabled={isSpinning || (!isSpinning && !canSpin())}
                  fullWidth
                  sx={{
                    background: isSpinning ? 
                      'linear-gradient(45deg, #2c3e50, #3498db)' : 
                      'linear-gradient(45deg, #ff6b6b, #ff8e8e)',
                    boxShadow: isSpinning ? 
                      '0 4px 15px rgba(44, 62, 80, 0.4)' : 
                      '0 4px 15px rgba(255, 107, 107, 0.4)',
                    border: isSpinning ? 
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
                      background: isSpinning ? 
                        'linear-gradient(45deg, #2c3e50, #3498db)' : 
                        'linear-gradient(45deg, #ff8e8e, #ff6b6b)',
                      transform: isSpinning ? 'none' : 'translateY(-2px)',
                      boxShadow: isSpinning ? 
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
                      transform: isSpinning ? 'none' : 'translateY(1px)',
                    }
                  }}
                >
                  {isSpinning ? (
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
                    `PLAY (${SPIN_COST} gems)`
                  )}
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
          console.log(`Won ${totalSpins} free spins!`);
        }}
      />
    </main>
  );
}

export default SlotMachine;