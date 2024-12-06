import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@mui/material';

const prizes = [
  {
    title: "Gems",
    description: "Win up to 250,000 gems",
    reward: "Variable Gems",
    subReward: "(based on stake & combinations)",
    color: "from-purple-600 to-pink-600",
    animation: "animate-pulse",
    icon: <img 
      src="https://imagedelivery.net/80ncJPif6mMa3mEeTHej8g/d4824501-1568-453e-6760-c5370144e400/small"
      alt="Gems"
      className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
    />
  },
  {
    title: "Freaky Character",
    description: "Unlock 1 or more of 20 unique freaky furry & demon characters with 500 normal/nsfw images + full story feature access with direct image generation inside your chat",
    reward: "Complete Character Pack",
    color: "from-orange-500 to-red-500",
    animation: "animate-pulse",
    icon: <img 
      src="https://imagedelivery.net/80ncJPif6mMa3mEeTHej8g/4e510c99-a3bf-413d-d431-1cc539346700/mobile"
      alt="Demon Character"
      className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-xl"
    />
  },
  {
    title: "Holy Character",
    description: "Unlock 1 or more of 20 unique holy furry & angel characters with 500 normal/nsfw images + full story feature access with direct image generation inside your chat",
    reward: "Complete Character Pack",
    color: "from-blue-500 to-cyan-500",
    animation: "animate-pulse",
    icon: <img 
      src="https://imagedelivery.net/80ncJPif6mMa3mEeTHej8g/db64002c-396f-4e3f-17d5-39db74ff3600/mobile"
      alt="Angel Character"
      className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-xl"
    />
  },
  {
    title: "Goddess Character",
    description: "Unlock 1 or more of 20 unique furry & goddess characters with 500 normal/nsfw images + full story feature access with direct image generation inside your chat",
    reward: "Complete Character Pack",
    color: "from-yellow-400 to-yellow-600",
    animation: "animate-pulse",
    icon: <img 
      src="https://imagedelivery.net/80ncJPif6mMa3mEeTHej8g/59502155-7ec8-46a8-2ecc-74f577e13700/mobile"
      alt="Goddess Character"
      className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-xl"
    />
  }
];

const PrizeShowcase = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="relative group w-full max-w-md mx-auto"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 rounded-xl blur-md opacity-75 group-hover:opacity-100 transition-opacity" />
        <div className="relative bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-center gap-3">
            <img 
              src="https://firebasestorage.googleapis.com/v0/b/oniichat-2c310.appspot.com/o/onigiri.png?alt=media&token=e234a54b-b597-47fd-98d0-688776c13014" 
              alt="Onigiri"
              className="w-8 h-8 object-contain animate-bounce"
            />
            <h3 className="text-xl font-bold text-white text-shadow">Click to See Prizes!</h3>
            <img 
              src="https://firebasestorage.googleapis.com/v0/b/oniichat-2c310.appspot.com/o/onigiri.png?alt=media&token=e234a54b-b597-47fd-98d0-688776c13014" 
              alt="Onigiri"
              className="w-8 h-8 object-contain animate-bounce"
            />
          </div>
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 flex items-start sm:items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-3xl"
            >
              <div className="bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900 p-1 rounded-2xl">
                <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-4 sm:p-6 md:p-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-6 sm:mb-8 text-shadow">
                    ✨ Prize Guide ✨
                  </h2>
                  
                  <div className="space-y-4 overflow-y-auto max-h-[60vh] custom-scrollbar pr-2">
                    {prizes.map((prize, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`bg-gradient-to-r ${prize.color} p-0.5 rounded-xl`}
                      >
                        <div className="bg-black/30 backdrop-blur-sm rounded-[11px] p-4">
                          <div className="flex flex-col sm:flex-row gap-4">
                            {/* Icon Column */}
                            <div className={`${prize.animation} flex-shrink-0 flex justify-center`}>
                              {prize.icon}
                            </div>

                            {/* Content Column */}
                            <div className="flex-1 flex flex-col items-center sm:items-start">
                              <h3 className="text-xl font-bold text-white mb-2 text-center sm:text-left">
                                {prize.title}
                              </h3>
                              <p className="text-white/80 text-sm sm:text-base leading-relaxed text-center sm:text-left">
                                {prize.description}
                              </p>
                            </div>

                            {/* Reward Column */}
                            <div className="flex-shrink-0 min-w-[140px] text-center sm:text-right">
                              <p className="text-lg font-bold text-white">
                                {prize.reward}
                              </p>
                              {prize.subReward && (
                                <p className="text-sm text-white/80">
                                  {prize.subReward}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 text-center pt-4 border-t border-white/10">
                    <Button 
                      variant="contained"
                      onClick={() => setIsOpen(false)}
                      size="large"
                      sx={{
                        background: 'linear-gradient(45deg, #9c27b0, #d53f8c)',
                        padding: '10px 30px',
                        fontSize: '1.1rem',
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
};

export default PrizeShowcase;