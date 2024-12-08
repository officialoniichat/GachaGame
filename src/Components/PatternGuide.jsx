import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@mui/material';
import { PATTERN_SYMBOLS, PATTERN_DATA } from '../constants/patternGuideData';

const getPatternColor = (patternName) => {
  switch (patternName) {
    case "Single Row": return "from-blue-500 to-cyan-500";
    case "Single Column": return "from-green-500 to-teal-600";
    case "Diagonal": return "from-purple-600 to-pink-600";
    case "Mixed Patterns": return "from-yellow-500 to-orange-500";
    case "Double Row": return "from-orange-400 to-red-500";
    case "Double Column": return "from-pink-500 to-rose-600";
    case "Double Diagonal": return "from-purple-400 to-pink-500";
    case "Full House": return "from-yellow-400 to-yellow-600";
    default: return "from-blue-500 to-cyan-500";
  }
};

function PatternGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState(null);

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="relative group w-full"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 rounded-xl blur-md opacity-75 group-hover:opacity-100 transition-opacity" />
        <div className="relative bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-center gap-3">
            <img 
              src="https://imagedelivery.net/80ncJPif6mMa3mEeTHej8g/a6fbc623-5383-45cb-0393-841a157e7e00/mobile"
              alt="Wolf"
              className="w-12 h-12 object-contain"
            />
            <h3 className="text-xl font-bold text-white text-shadow">Winning Symbols</h3>
            <img 
              src="https://imagedelivery.net/80ncJPif6mMa3mEeTHej8g/a6fbc623-5383-45cb-0393-841a157e7e00/mobile"
              alt="Wolf"
              className="w-12 h-12 object-contain"
            />
          </div>
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => {
                setSelectedSymbol(null);
                setIsOpen(false);
              }}
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900 p-1 rounded-2xl">
                <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-4 sm:p-6 md:p-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-6 text-shadow">
                    ✨ Slot Symbols ✨
                  </h2>
                  
                  {!selectedSymbol ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                      {PATTERN_SYMBOLS.map((symbol, index) => (
                        <motion.button
                          key={index}
                          className="bg-gradient-to-br from-white/10 to-white/5 hover:from-white/15 hover:to-white/10 p-3 sm:p-4 rounded-xl backdrop-blur-sm transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSymbol(symbol);
                          }}
                        >
                          <img 
                            src={symbol.src} 
                            alt={symbol.alt}
                            className="w-full h-16 sm:h-20 md:h-24 object-contain mb-2"
                          />
                          <p className="text-white font-bold text-center capitalize text-sm sm:text-base">
                            {symbol.alt}
                          </p>
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <button
                          onClick={() => setSelectedSymbol(null)}
                          className="text-white hover:text-white/80 transition-colors text-sm sm:text-base"
                        >
                          ← Back
                        </button>
                        <div className="flex items-center gap-2 sm:gap-4">
                          <img 
                            src={selectedSymbol.src} 
                            alt={selectedSymbol.alt}
                            className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                          />
                          <h3 className="text-xl sm:text-2xl font-bold text-white capitalize">
                            {selectedSymbol.alt} Patterns
                          </h3>
                        </div>
                      </div>

                      <div className="space-y-3 sm:space-y-4 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto custom-scrollbar">
                        {PATTERN_DATA[selectedSymbol.alt.toLowerCase()]?.map((pattern, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`bg-gradient-to-r ${getPatternColor(pattern.name)} p-0.5 rounded-xl`}
                          >
                            <div className="bg-black/30 backdrop-blur-sm rounded-[11px] p-3 sm:p-4">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                <div className="text-2xl sm:text-4xl font-bold text-white">
                                  {pattern.pattern}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-lg sm:text-xl font-bold text-white">
                                    {pattern.name}
                                  </h3>
                                  <p className="text-sm sm:text-base text-white/80">
                                    {pattern.description}
                                  </p>
                                </div>
                                <div className="text-right whitespace-nowrap mt-2 sm:mt-0">
                                  <p className="text-base sm:text-lg font-bold text-white">
                                    {pattern.reward}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 sm:mt-8 text-center">
                    <Button 
                      variant="contained"
                      onClick={() => {
                        setSelectedSymbol(null);
                        setIsOpen(false);
                      }}
                      size="large"
                      sx={{
                        background: 'linear-gradient(45deg, #9c27b0, #d53f8c)',
                        padding: '8px 20px',
                        fontSize: { xs: '0.9rem', sm: '1.1rem' },
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #d53f8c, #9c27b0)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Close Guide
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default PatternGuide;