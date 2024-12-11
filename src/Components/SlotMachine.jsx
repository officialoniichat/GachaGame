import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@mui/material';
import { useSound } from '../hooks/useSound';
import { useAnimation } from '../hooks/useAnimation';
import { useSlotAnimation } from '../hooks/useSlotAnimation';
import { calculatePrize } from '../utils/prizeLogic';
import Reel from './Reel';
import SpinningWheel from './SpinningWheel/SpinningWheel';
import Leaderboard from './Leaderboard';
import PrizeShowcase from './PrizeShowcase';
import PatternGuide from './PatternGuide';
import FreeSpinsCounter from './FreeSpinsCounter';
import MultiplierPopup from './MultiplierPopup';
import { SYMBOLS } from '../constants/symbols';
import CharacterWinScreen from './popups/CharacterWinScreen';
import { motion } from 'framer-motion';
import GemRain from './GemRain';
import HighGemWinScreen from './popups/HighGemWinScreen';


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
  const [isAnimationActive, setIsAnimationActive] = useState(false);
  const [highGemWin, setHighGemWin] = useState(null);
  const [showGemRain, setShowGemRain] = useState(false);
  const [characterWin, setCharacterWin] = useState(null);
  const [reels, setReels] = useState(generateNewReels());
  const [isSpinning, setIsSpinning] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [cooldownActive, setCooldownActive] = useState(false);
  const [gems, setGems] = useState(10000);
  const [freeSpins, setFreeSpins] = useState(0);
  const [activeMultiplier, setActiveMultiplier] = useState(0);
  const [spacebarPressed, setSpacebarPressed] = useState(false);
  const [showSpinningWheel, setShowSpinningWheel] = useState(false);
  const [scatterState, setScatterState] = useState({
    scatterPositions: new Map(),
    teasingColumns: new Set(),
  });
  const [isAutoPlayEnabled, setIsAutoPlayEnabled] = useState(false);
  const [wasAutoPlayEnabled, setWasAutoPlayEnabled] = useState(false);
  const [showMultiplierPopup, setShowMultiplierPopup] = useState(false);
  const [betMultiplier, setBetMultiplier] = useState(1);

  const buttonSpaceBar = useRef();
  const spinControlRef = useRef(null);
  const cooldownTimeoutRef = useRef(null);
  const isAutoPlayEnabledRef = useRef(isAutoPlayEnabled);
  const isSpinningRef = useRef(isSpinning);
  const isAnimatingRef = useRef(isAnimating);
  const cooldownActiveRef = useRef(cooldownActive);
  const showSpinningWheelRef = useRef(showSpinningWheel);

  

  const { playSpinSound, playWinSound, toggleMusic, isMusicEnabled } =
    useSound();
  const { winningAnimation } = useAnimation();
  const { animateReels } = useSlotAnimation();

  useEffect(() => {
    isAutoPlayEnabledRef.current = isAutoPlayEnabled;
  }, [isAutoPlayEnabled]);

  useEffect(() => {
    isSpinningRef.current = isSpinning;
  }, [isSpinning]);

  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);

  useEffect(() => {
    cooldownActiveRef.current = cooldownActive;
  }, [cooldownActive]);

  useEffect(() => {
    showSpinningWheelRef.current = showSpinningWheel;
  }, [showSpinningWheel]);

  useEffect(() => {
    if (freeSpins <= 0) {
      setActiveMultiplier(0);
    }
  }, [freeSpins]);

  const handleMultiplierSelect = (multiplier) => {
    setBetMultiplier(multiplier);
    setShowMultiplierPopup(false);
  };

  const getCurrentSpinCost = () => SPIN_COST * betMultiplier;

  const canSpin = useCallback(() => {
    return (
      !showSpinningWheel &&
      (freeSpins > 0 || gems >= getCurrentSpinCost()) &&
      !isSpinning &&
      !isAnimating &&
      !cooldownActive
    );
  }, [
    showSpinningWheel,
    freeSpins,
    gems,
    isSpinning,
    isAnimating,
    cooldownActive,
    betMultiplier,
  ]);

  const handleWinnings = (winningCombos) => {
    if (winningCombos.length > 0) {
      const { gems: baseGems, characters } = calculatePrize(winningCombos);

      // Calculate total multiplier:
      // If betMultiplier is 1 (default), only use wheel multiplier
      // Otherwise, add both multipliers together
      const wheelMultiplier = freeSpins > 0 ? activeMultiplier : 0;
      const totalMultiplier =
        betMultiplier === 1
          ? wheelMultiplier || 1 // Use 1 if no wheel multiplier
          : betMultiplier + wheelMultiplier;

      const finalGems = baseGems * totalMultiplier;

      if (finalGems > 0) {
        setGems((prevGems) => prevGems + finalGems);
        setShowGemRain(true);
      }

      if (finalGems >= 500 && !characters.length) {
  // Get winning symbols from combinations
  const winningSymbols = winningCombos.map(combo => {
    const symbolElement = combo.elements[0].querySelector('img');
    return {
      src: symbolElement.src,
      alt: symbolElement.alt
    };
  });
  
  setHighGemWin({
    gems: finalGems,
    symbols: [...new Map(winningSymbols.map(s => [s.alt, s])).values()] // Remove duplicates
  });
}


      const characterWin = winningCombos.find((combo) => {
        const firstElement = combo.elements[0]?.querySelector('img');
        return (
          firstElement &&
          ['wolfi', 'demon', 'angel', 'goddess'].includes(firstElement.alt)
        );
      });

      if (characterWin) {
        const symbolElement = characterWin.elements[0].querySelector('img');
        setCharacterWin({
          characterType: symbolElement.alt,
          winType: characterWin.type,
          gems: finalGems,
        });
      }

      if (characters.length > 0) {
        characters.forEach((character) => {
          console.log(
            `Won ${character.count}x ${character.type} character(s)!`
          );
        });
      }
    }
  };

  function handleSpinClick() {
    if (!canSpin() || showSpinningWheelRef.current) {
      return Promise.resolve();
    }

    if (freeSpins > 0) {
      setFreeSpins((prev) => {
        const newValue = prev - 1;
        return newValue;
      });
    } else {
      setGems((prev) => prev - getCurrentSpinCost());
    }

    return spin();
  }

  function spin() {
    return new Promise((resolve) => {
      // Bestehenden Code beibehalten, z. B. Sprites entfernen
      document.querySelectorAll("div[style*='fixed']").forEach((sprite) => sprite.remove());
  
      playSpinSound();
      setIsSpinning(true);
      setIsAnimating(true);
      setCooldownActive(true);
      setScatterState({
        scatterPositions: new Map(),
        teasingColumns: new Set(),
      });
  
      const reels = [
        document.querySelectorAll('.reel1'),
        document.querySelectorAll('.reel2'),
        document.querySelectorAll('.reel3'),
      ];
  
      const scatterSymbol = SYMBOLS.find((s) => s.alt === 'scatter');
      const nonScatterSymbols = SYMBOLS.filter((s) => s.alt !== 'scatter');
  
      // Falls kein Scatter gefunden wurde, abbrechen/loggen
      if (!scatterSymbol) {
        console.error("Es wurde kein einziges Scatter-Symbol in SYMBOLS gefunden!");
        return;
      }
  
      // Falls keine Non-Scatter-Symbole existieren
      if (nonScatterSymbols.length === 0) {
        console.error("Es existieren keine Nicht-Scatter-Symbole. Bitte SYMBOLS prüfen.");
        return;
      }
  
      // Finalen Satz von Symbolen pro Spalte bestimmen
      const finalReelSymbols = reels.map((reel) => {
        const reelLength = reel.length;
  
        // Einen Index für Scatter wählen (z. B. immer 1), um Zufälligkeiten auszuschließen:
        const scatterIndex = 1; // Hardcodieren Sie diesen Wert, um jede Unsicherheit zu eliminieren
  
        const chosenSymbols = [];
        for (let i = 0; i < reelLength; i++) {
          if (i === scatterIndex) {
            chosenSymbols.push(scatterSymbol);
          } else {
            // Immer das erste Non-Scatter Symbol nehmen, um jegliche Randomness zu vermeiden
            chosenSymbols.push(nonScatterSymbols[0]);
          }
        }
  
        // Überprüfen: Es darf nur 1 Scatter geben
        const scatterCount = chosenSymbols.filter(sym => sym.alt === 'scatter').length;
        if (scatterCount > 1) {
          console.error("Mehr als ein Scatter in einer Spalte generiert!", chosenSymbols);
        }
  
        return chosenSymbols;
      });
  
      spinControlRef.current = animateReels(
        reels,
        (reel, reelIndex) => {
          // KEINE neue Logik, KEIN Zufall. Nur finalReelSymbols einsetzen.
          finalReelSymbols[reelIndex].forEach((symbol, i) => {
            reel[i].innerHTML = `<img src="${symbol.src}" alt="${symbol.alt}" />`;
          });
        },
        (totalWins, combos, newScatterState) => {
          setScatterState(newScatterState);
          handleWinnings(combos);
  
          if (totalWins > 0) {
            if (totalWins > 1) {
              if (isAutoPlayEnabledRef.current) {
                setWasAutoPlayEnabled(true);
                setIsAutoPlayEnabled(false);
                isAutoplayActive.current = false;
              }
              setShowSpinningWheel(true);
              setIsSpinning(false);
              setIsAnimating(false);
              setCooldownActive(false);
  
              if (spinControlRef.current?.stop) {
                spinControlRef.current.stop();
                spinControlRef.current = null;
              }
  
              resolve();
              return;
            }
            playWinSound();
          }
  
          if (!newScatterState.teasingColumns.size) {
            setIsSpinning(false);
  
            setTimeout(
              () => {
                setIsAnimating(false);
                setCooldownActive(false);
                resolve();
              },
              isAutoPlayEnabledRef.current ? AUTOPLAY_COOLDOWN : NORMAL_COOLDOWN
            );
          }
        }
      );
    });
  }  

  const toggleAutoPlay = () => {
    setIsAutoPlayEnabled((prev) => !prev);
  };

  const isAutoplayActive = useRef(false);

  const startAutoplay = useCallback(async () => {
    if (isAutoplayActive.current) return;

    isAutoplayActive.current = true;

    while (
      isAutoPlayEnabledRef.current &&
      canSpin() &&
      isAutoplayActive.current
    ) {
      await handleSpinClick();

      if (!isAutoPlayEnabledRef.current || !isAutoplayActive.current) break;

      while (
        (isSpinningRef.current ||
          isAnimatingRef.current ||
          cooldownActiveRef.current ||
          showSpinningWheelRef.current) &&
        isAutoplayActive.current
      ) {
        await new Promise((resolve) => setTimeout(resolve, 100));

        if (!isAutoPlayEnabledRef.current || !isAutoplayActive.current) break;
      }

      if (!isAutoPlayEnabledRef.current || !isAutoplayActive.current) break;
    }

    isAutoplayActive.current = false;
  }, [canSpin]);

  useEffect(() => {
  if (isAutoPlayEnabled && !isAutoplayActive.current && !isAnimationActive) {
    startAutoplay();
  } else if (!isAutoPlayEnabled || isAnimationActive) {
    isAutoplayActive.current = false;
  }
}, [isAutoPlayEnabled, startAutoplay, isAnimationActive]);

  useEffect(() => {
  setIsAnimationActive(showGemRain || characterWin !== null || highGemWin !== null || showSpinningWheel);
}, [showGemRain, characterWin, highGemWin, showSpinningWheel]);

useEffect(() => {
  if (isAnimationActive && isAutoPlayEnabled) {
    setWasAutoPlayEnabled(true);
    setIsAutoPlayEnabled(false);
  } else if (!isAnimationActive && wasAutoPlayEnabled) {
    setIsAutoPlayEnabled(true);
    setWasAutoPlayEnabled(false);
  }
}, [isAnimationActive, isAutoPlayEnabled]);


  useEffect(() => {
    if (!showSpinningWheel && wasAutoPlayEnabled) {
      setIsAutoPlayEnabled(true);
      setWasAutoPlayEnabled(false);
    }
  }, [showSpinningWheel, wasAutoPlayEnabled]);

  useEffect(() => {
    const handleSpacebar = (event) => {
      if (
        event.code === 'Space' &&
        !spacebarPressed &&
        canSpin() &&
        !isAutoPlayEnabledRef.current
      ) {
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
      if (cooldownTimeoutRef.current) {
        clearTimeout(cooldownTimeoutRef.current);
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
                <span className="text-white text-lg font-bold">
                  {gems.toLocaleString()}
                </span>
              </div>
              <FreeSpinsCounter
                freeSpins={freeSpins}
                multiplier={activeMultiplier}
              />
            </div>

            <div className="w-full max-w-[384px] sm:max-w-[384px] mx-auto">
              <div className="overflow-hidden backdrop-blur-md bg-white/10 rounded-2xl p-2 shadow-2xl slot-container">
                <table className="relative mx-auto w-full">
                  <tbody>
                    {reels.map((reelRow, i) => (
                      <tr key={i}>
                        <Reel
                          className="reel1"
                          symbol={reelRow.reel1}
                          showGoldenBox={scatterState.scatterPositions.has(
                            `0-${i}`
                          )}
                          isTeasing={scatterState.teasingColumns.has(0)}
                        />
                        <Reel
                          className="reel2"
                          symbol={reelRow.reel2}
                          showGoldenBox={scatterState.scatterPositions.has(
                            `1-${i}`
                          )}
                          isTeasing={scatterState.teasingColumns.has(1)}
                        />
                        <Reel
                          className="reel3"
                          symbol={reelRow.reel3}
                          showGoldenBox={scatterState.scatterPositions.has(
                            `2-${i}`
                          )}
                          isTeasing={scatterState.teasingColumns.has(2)}
                        />
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <div className="flex gap-2">
                  <Button
                    ref={buttonSpaceBar}
                    variant="contained"
                    size="large"
                    onClick={handleSpinClick}
                    disabled={!canSpin() || isAutoPlayEnabled}
                    sx={{
                      flex: 1,
                      background:
                        isSpinning || isAnimating || cooldownActive
                          ? 'linear-gradient(45deg, #2c3e50, #3498db)'
                          : 'linear-gradient(45deg, #ff6b6b, #ff8e8e)',
                      boxShadow:
                        isSpinning || isAnimating || cooldownActive
                          ? '0 4px 15px rgba(44, 62, 80, 0.4)'
                          : '0 4px 15px rgba(255, 107, 107, 0.4)',
                      border:
                        isSpinning || isAnimating || cooldownActive
                          ? '2px solid rgba(255, 255, 255, 0.1)'
                          : '2px solid rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(5px)',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      letterSpacing: '1px',
                      padding: '10px 0',
                      textTransform: 'uppercase',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background:
                          isSpinning || isAnimating || cooldownActive
                            ? 'linear-gradient(45deg, #2c3e50, #3498db)'
                            : 'linear-gradient(45deg, #ff8e8e, #ff6b6b)',
                        transform:
                          isSpinning || isAnimating || cooldownActive
                            ? 'none'
                            : 'translateY(-2px)',
                        boxShadow:
                          isSpinning || isAnimating || cooldownActive
                            ? '0 4px 15px rgba(44, 62, 80, 0.4)'
                            : '0 6px 20px rgba(255, 107, 107, 0.6)',
                      },
                      '&:disabled': {
                        background: 'linear-gradient(45deg, #95a5a6, #7f8c8d)',
                        border: '2px solid rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.5)',
                        cursor: 'not-allowed',
                      },
                      '&:active': {
                        transform:
                          isSpinning || isAnimating || cooldownActive
                            ? 'none'
                            : 'translateY(1px)',
                      },
                    }}
                  >
                    {isSpinning || isAnimating || cooldownActive ? (
                      <div className="flex items-center justify-center gap-2">
                        <span className="animate-pulse">Wait</span>
                        <span
                          className="inline-block w-2 h-2 bg-white rounded-full animate-bounce"
                          style={{ animationDelay: '0s' }}
                        />
                        <span
                          className="inline-block w-2 h-2 bg-white rounded-full animate-bounce"
                          style={{ animationDelay: '0.2s' }}
                        />
                        <span
                          className="inline-block w-2 h-2 bg-white rounded-full animate-bounce"
                          style={{ animationDelay: '0.4s' }}
                        />
                      </div>
                    ) : freeSpins > 0 ? (
                      `FREE SPIN (${freeSpins} left)`
                    ) : (
                      `PLAY (${getCurrentSpinCost()} gems)`
                    )}
                  </Button>

                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => setShowMultiplierPopup(true)}
                    disabled={isSpinning || isAnimating || cooldownActive}
                    sx={{
                      minWidth: '120px',
                      background:
                        betMultiplier > 1
                          ? 'linear-gradient(45deg, #9333ea, #ec4899)'
                          : 'linear-gradient(45deg, #4b5563, #6b7280)',
                      boxShadow: '0 4px 15px rgba(147, 51, 234, 0.3)',
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(5px)',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      padding: '10px 0',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background:
                          betMultiplier > 1
                            ? 'linear-gradient(45deg, #7e22ce, #db2777)'
                            : 'linear-gradient(45deg, #374151, #4b5563)',
                        transform: 'translateY(-2px)',
                      },
                      '&:disabled': {
                        background: 'linear-gradient(45deg, #95a5a6, #7f8c8d)',
                        border: '2px solid rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.5)',
                      },
                    }}
                  >
                    {betMultiplier}x
                  </Button>
                </div>

                <Button
                  variant="contained"
                  size="large"
                  onClick={() => {
                    const characters = ['wolfi', 'demon', 'angel', 'goddess'];
                    const types = ['row', 'column', 'diagonal', 'fullScreen'];
                    const randomCharacter =
                      characters[Math.floor(Math.random() * characters.length)];
                    const randomType =
                      types[Math.floor(Math.random() * types.length)];

                    // Calculate random gems based on type and character
                    let gems = 0;
                    if (randomType === 'row') {
                      gems = {
                        wolfi: 2150,
                        demon: 4150,
                        angel: 4150,
                        goddess: 14150,
                      }[randomCharacter];
                    } else if (randomType === 'fullScreen') {
                      gems = {
                        wolfi: 6500,
                        demon: 15000,
                        angel: 15000,
                        goddess: 250000,
                      }[randomCharacter];
                    } else if (randomType === 'diagonal') {
                      gems = {
                        wolfi: 300,
                        demon: 700,
                        angel: 700,
                        goddess: 15500,
                      }[randomCharacter];
                    }

                    setCharacterWin({
                      characterType: randomCharacter,
                      winType: randomType,
                      gems: gems,
                    });
                  }}
                  sx={{
                    minWidth: '120px',
                    background: 'linear-gradient(45deg, #9333ea, #ec4899)',
                    boxShadow: '0 4px 15px rgba(147, 51, 234, 0.3)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(5px)',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    padding: '10px 0',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #7e22ce, #db2777)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Test Character Win
                </Button>

                <Button
                  variant="contained"
                  size="large"
                  onClick={() => {
                    const gemAmounts = [50, 250, 750, 1500]; // Different gem amounts for different durations
                    const randomGems =
                      gemAmounts[Math.floor(Math.random() * gemAmounts.length)];
                    setShowGemRain(true);
                    setCharacterWin({
                      characterType: 'wolfi',
                      winType: 'row',
                      gems: randomGems,
                    });
                  }}
                  sx={{
                    minWidth: '120px',
                    background: 'linear-gradient(45deg, #9333ea, #ec4899)',
                    boxShadow: '0 4px 15px rgba(147, 51, 234, 0.3)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(5px)',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    padding: '10px 0',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #7e22ce, #db2777)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Test Gem Rain
                </Button>

                <Button
  variant="contained"
  size="large"
  onClick={() => {
    // Get random symbols (2-3 symbols)
    const symbolTypes = ['taiyaki', 'pero pero', 'dumpling', 'onigiri'];
    const numSymbols = 2 + Math.floor(Math.random() * 2); // Random 2-3 symbols
    const selectedSymbols = [];
    
    for (let i = 0; i < numSymbols; i++) {
      const randomType = symbolTypes[Math.floor(Math.random() * symbolTypes.length)];
      const symbol = SYMBOLS.find(s => s.alt === randomType);
      if (symbol) {
        selectedSymbols.push({
          src: symbol.src,
          alt: symbol.alt
        });
      }
    }

    // Random gem amount between 500 and 2000
    const gems = 500 + Math.floor(Math.random() * 1500);

    setHighGemWin({
      gems,
      symbols: selectedSymbols
    });
  }}
  sx={{
    minWidth: '120px',
    background: 'linear-gradient(45deg, #9333ea, #ec4899)',
    boxShadow: '0 4px 15px rgba(147, 51, 234, 0.3)',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(5px)',
    fontSize: '1rem',
    fontWeight: 'bold',
    padding: '10px 0',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'linear-gradient(45deg, #7e22ce, #db2777)',
      transform: 'translateY(-2px)',
    },
  }}
>
  Test High Gem Win
</Button>


                <Button
                  variant="contained"
                  size="large"
                  onClick={toggleAutoPlay}
                  disabled={!canSpin() && !isAutoPlayEnabled}
                  fullWidth
                  sx={{
                    background: isAutoPlayEnabled
                      ? 'linear-gradient(45deg, #2ecc71, #27ae60)'
                      : 'linear-gradient(45deg, #3498db, #2980b9)',
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
                      background: isAutoPlayEnabled
                        ? 'linear-gradient(45deg, #27ae60, #2ecc71)'
                        : 'linear-gradient(45deg, #2980b9, #3498db)',
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
                    },
                  }}
                >
                  {isAutoPlayEnabled ? 'Stop Auto Play' : 'Auto Play'}
                </Button>
              </div>
            </div>

            <div className="w-full">
              <Leaderboard
                onToggleMusic={toggleMusic}
                isMusicEnabled={isMusicEnabled}
              />
            </div>
          </div>
        </div>
      </div>

      {characterWin && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setCharacterWin(null)}
          className="fixed inset-0 z-50"
        >
          <CharacterWinScreen
            characterType={characterWin.characterType}
            winType={characterWin.winType}
            gems={characterWin.gems}
          />
        </motion.div>
      )}

      {highGemWin && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={() => setHighGemWin(null)}
    className="fixed inset-0 z-50"
  >
    <HighGemWinScreen
      gems={highGemWin.gems}
      symbols={highGemWin.symbols}
    />
  </motion.div>
)}


      <GemRain
  isVisible={showGemRain || (highGemWin !== null)}
  onComplete={() => {
    setShowGemRain(false);
    setHighGemWin(null);
  }}
  gems={highGemWin?.gems || characterWin?.gems || 0}
/>



      <SpinningWheel
        isVisible={showSpinningWheel}
        onComplete={(spins, multiplier) => {
          setShowSpinningWheel(false);
          setFreeSpins((prev) => prev + spins);
          setActiveMultiplier((prev) => prev + multiplier);
        }}
      />

      <MultiplierPopup
        isOpen={showMultiplierPopup}
        onClose={() => setShowMultiplierPopup(false)}
        onSelect={handleMultiplierSelect}
        activeMultiplier={betMultiplier}
      />
    </main>
  );
}

export default SlotMachine;
