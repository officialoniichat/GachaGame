import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@mui/material';

const MULTIPLIER_OPTIONS = [2, 3, 5, 10];

function MultiplierPopup({ isOpen, onClose, onSelect, activeMultiplier }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-md mx-4"
          >
            <div className="bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900 p-1 rounded-2xl">
              <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white text-center mb-6">
                  Select Multiplier
                </h2>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {MULTIPLIER_OPTIONS.map((multiplier) => (
                    <Button
                      key={multiplier}
                      variant="contained"
                      onClick={() => onSelect(multiplier)}
                      sx={{
                        background: activeMultiplier === multiplier
                          ? 'linear-gradient(45deg, #9333ea, #ec4899)'
                          : 'linear-gradient(45deg, #1f2937, #374151)',
                        padding: '16px',
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #7e22ce, #db2777)',
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      {multiplier}x
                    </Button>
                  ))}
                </div>

                <div className="flex justify-center">
                  <Button
                    variant="contained"
                    onClick={() => onSelect(1)}
                    sx={{
                      background: 'linear-gradient(45deg, #dc2626, #b91c1c)',
                      padding: '12px 24px',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #b91c1c, #991b1b)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    Disable Multiplier
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MultiplierPopup;