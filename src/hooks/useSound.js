import { useEffect, useRef, useState } from 'react';
import SpinPay from '../Assets/Sounds/SpinPay.wav';
import Win from '../Assets/Sounds/Win.wav';

const BACKGROUND_MUSIC_URL = 'https://firebasestorage.googleapis.com/v0/b/oniichat-2c310.appspot.com/o/videoplayback.mp4?alt=media&token=fa9be123-cb0e-427b-b87d-7c3cec3e3ff7';

export function useSound() {
  const backgroundMusic = useRef(null);
  const spinSound = useRef(null);
  const winSound = useRef(null);
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);

  useEffect(() => {
    // Initialize audio only after user interaction
    const initAudio = () => {
      if (!backgroundMusic.current) {
        backgroundMusic.current = new Audio(BACKGROUND_MUSIC_URL);
        backgroundMusic.current.volume = 0.04; // Set to 5% volume (half of the original 10%)
        backgroundMusic.current.loop = true;
      }
      if (!spinSound.current) {
        spinSound.current = new Audio(SpinPay);
        spinSound.current.volume = 0.3;
      }
      if (!winSound.current) {
        winSound.current = new Audio(Win);
        winSound.current.volume = 0.4;
      }

      // Start background music if enabled
      if (isMusicEnabled) {
        const playPromise = backgroundMusic.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Auto-play was prevented, we'll try again on next user interaction
          });
        }
      }
    };

    // Add click listener to initialize audio
    document.addEventListener('click', initAudio, { once: true });

    return () => {
      if (backgroundMusic.current) backgroundMusic.current.pause();
      if (spinSound.current) spinSound.current.pause();
      if (winSound.current) winSound.current.pause();
      document.removeEventListener('click', initAudio);
    };
  }, [isMusicEnabled]);

  useEffect(() => {
    if (backgroundMusic.current) {
      if (isMusicEnabled) {
        backgroundMusic.current.play().catch(() => {});
      } else {
        backgroundMusic.current.pause();
      }
    }
  }, [isMusicEnabled]);

  const toggleMusic = () => {
    setIsMusicEnabled(prev => !prev);
  };

  const playSpinSound = () => {
    if (spinSound.current && isMusicEnabled) {
      spinSound.current.currentTime = 0;
      const playPromise = spinSound.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  };

  const playWinSound = () => {
    if (winSound.current && isMusicEnabled) {
      winSound.current.currentTime = 0;
      const playPromise = winSound.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  };

  return {
    playBackgroundMusic: () => isMusicEnabled && backgroundMusic.current?.play().catch(() => {}),
    playSpinSound,
    playWinSound,
    toggleMusic,
    isMusicEnabled
  };
}