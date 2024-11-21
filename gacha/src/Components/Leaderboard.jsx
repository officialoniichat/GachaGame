import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@mui/material';

const leaderboardData = {
  mostSpentGems: {
    username: "@WhaleKing_420",
    amount: "1,234,567",
    badge: <img 
      src="https://imagedelivery.net/80ncJPif6mMa3mEeTHej8g/33522a75-f3d3-4397-449d-8cbe57195a00/mobile" 
      alt="Gem Whale"
      className="w-12 h-12 object-contain"
    />,
    title: "Gem Whale",
    color: "from-blue-500 to-purple-600",
    description: "Awarded to players who have spent the most gems in the game. These legendary players keep the economy thriving!"
  },
  mostWins: {
    username: "@LuckyNeko_777",
    amount: "2,891",
    badge: "🎰",
    title: "Slot Champion",
    color: "from-yellow-500 to-red-600",
    description: "Champions who have achieved the highest number of winning combinations in the slot machine."
  },
  mostValuableWins: {
    username: "@Gacha_Queen",
    amount: "789,123",
    badge: "👑",
    title: "Fortune Emperor",
    color: "from-pink-500 to-rose-600",
    description: "The elite players who have won the most valuable prizes from their spins."
  },
  mostMessages: {
    username: "@ChatMaster_UwU",
    amount: "50,432",
    badge: "💬",
    title: "Message King",
    color: "from-green-500 to-teal-600",
    description: "Given to the most active chatters who keep our community vibrant and engaging with their messages."
  }
};

const BadgeAnimation = ({ children }) => (
  <motion.div
    initial={{ scale: 0.8, rotate: -10 }}
    animate={{ 
      scale: [0.8, 1.2, 0.9, 1.1, 1],
      rotate: [-10, 10, -5, 5, 0]
    }}
    transition={{ 
      duration: 0.5,
      times: [0, 0.2, 0.4, 0.6, 0.8],
      repeat: Infinity,
      repeatDelay: 3
    }}
    className="text-4xl flex items-center justify-center w-14 h-14"
  >
    {children}
  </motion.div>
);

const BadgeInfoPopup = ({ isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="relative w-[95%] sm:w-[85%] md:w-[75%] lg:w-[60%] max-w-2xl max-h-[90vh] m-4 overflow-hidden"
        >
          <div className="bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900 p-1 rounded-2xl">
            <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 md:p-8">
              <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-6 text-shadow">
                ✨ Badge Guide ✨
              </h3>
              <div className="space-y-4 max-h-[50vh] overflow-y-auto custom-scrollbar">
                {Object.entries(leaderboardData).map(([key, data]) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Object.keys(leaderboardData).indexOf(key) * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-white/10 to-white/5 hover:from-white/15 hover:to-white/10 transition-all duration-300"
                  >
                    <div className="text-3xl md:text-4xl">
                      {typeof data.badge === 'string' ? data.badge : 
                        <img 
                          src="https://imagedelivery.net/80ncJPif6mMa3mEeTHej8g/33522a75-f3d3-4397-449d-8cbe57195a00/mobile" 
                          alt="Gem Whale"
                          className="w-12 h-12 object-contain"
                        />
                      }
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white text-lg md:text-xl">{data.title}</h4>
                      <p className="text-sm md:text-base text-white/90">{data.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <Button 
                  variant="contained"
                  onClick={onClose}
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
);

const LeaderCard = ({ data, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${data.color} p-0.5 shadow-xl`}
  >
    <div className="relative flex items-center gap-4 rounded-[11px] bg-black/30 backdrop-blur-sm p-4">
      <BadgeAnimation>{data.badge}</BadgeAnimation>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-white text-xl truncate">{data.username}</h3>
        <p className="text-base text-white/80">{data.title}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-lg font-bold text-white">{data.amount}</p>
      </div>
    </div>
  </motion.div>
);

function Leaderboard({ onToggleMusic, isMusicEnabled }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2 mb-6"
      >
        <div className="flex items-center justify-center gap-4">
          {/* Music Toggle Button (Always visible) */}
          <button
            onClick={onToggleMusic}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-300 text-white text-xl"
          >
            {isMusicEnabled ? '🔊' : '🔇'}
          </button>

          <h2 className="text-2xl font-bold text-white text-shadow">
            Leaderboard 
          </h2>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-300"
          >
            <motion.span
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="block text-white text-xl"
            >
              ▼
            </motion.span>
          </button>
        </div>
        <button
          onClick={() => setIsPopupOpen(true)}
          className="text-sm text-white/80 hover:text-white transition-colors underline decoration-dotted"
        >
          What do these badges mean?
        </button>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 lg:p-8 shadow-xl">
              <div className="lg:grid lg:grid-cols-2 lg:gap-8 space-y-4 lg:space-y-0">
                {/* Left Column */}
                <div className="space-y-4">
                  <LeaderCard data={leaderboardData.mostValuableWins} index={0} />
                  <LeaderCard data={leaderboardData.mostMessages} index={1} />
                </div>
                
                {/* Right Column */}
                <div className="space-y-4">
                  <LeaderCard data={leaderboardData.mostSpentGems} index={2} />
                  <LeaderCard data={leaderboardData.mostWins} index={3} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BadgeInfoPopup 
        isOpen={isPopupOpen} 
        onClose={() => setIsPopupOpen(false)} 
      />
    </div>
  );
}

export default Leaderboard;