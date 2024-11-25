import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@mui/material';

const prizes = [
  {
    title: "3x Legendary Match",
    description: "Match 3 symbols in all rows",
    reward: "10,000 Gems",
    color: "from-purple-600 to-pink-600",
    animation: "animate-pulse",
    icon: "🌟"
  },
  {
    title: "2x Epic Match",
    description: "Match 3 symbols in 2 rows",
    reward: "5,000 Gems",
    color: "from-orange-500 to-red-500",
    animation: "animate-bounce",
    icon: "✨"
  },
  {
    title: "Single Match",
    description: "Match 3 symbols in 1 row",
    reward: "1,000 Gems",
    color: "from-blue-500 to-cyan-500",
    animation: "animate-pulse",
    icon: "💫"
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
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl"
            >
              <div className="bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900 p-1 rounded-2xl">
                <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 md:p-8">
                  <h2 className="text-3xl font-bold text-center text-white mb-8 text-shadow">
                    ✨ Prize Guide ✨
                  </h2>
                  
                  <div className="space-y-4">
                    {prizes.map((prize, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`bg-gradient-to-r ${prize.color} p-0.5 rounded-xl`}
                      >
                        <div className="bg-black/30 backdrop-blur-sm rounded-[11px] p-4">
                          <div className="flex items-center gap-4">
                            <span className={`text-4xl ${prize.animation}`}>
                              {prize.icon}
                            </span>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-white">
                                {prize.title}
                              </h3>
                              <p className="text-white/80">
                                {prize.description}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-white">
                                {prize.reward}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-8 text-center">
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