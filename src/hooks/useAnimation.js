import { useCallback } from 'react';
import gsap from 'gsap';
import spritesheet from '../Assets/Images/sym_anim.png';
import spritesheetData from '../Assets/Images/sym_anim.json';

export function useAnimation() {
  const createSpriteAnimation = (combo, frames, imageNames, spriteAnimation) => {
    let spritesInCombo = [];
    const reel = document.querySelectorAll(`.reel1`)[0];
    const { top, height } = reel.children[0].getBoundingClientRect();
    const { left, width } = reel.children[0].getBoundingClientRect();
    const elementName = combo.winningElement;

    if (!imageNames[elementName]) {
      return;
    }

    imageNames[elementName].forEach((imageName) => {
      const frame = frames[imageName];
      const spriteWidth = frame.frame.w;
      const spriteHeight = frame.frame.h;

      for (let i = combo.reelRow - 1; i < combo.reelRow + 2; i++) {
        const x = frame.frame.x;
        const y = frame.frame.y;
        const sprite = document.createElement("div");
        sprite.style.position = "fixed";
        sprite.style.width = spriteWidth + "px";
        sprite.style.height = spriteHeight + "px";
        sprite.style.backgroundImage = `url(${spritesheet})`;
        sprite.style.backgroundPosition = `-${x}px -${y}px`;
        sprite.style.transform = "scale(0.75)";
        sprite.style.opacity = 0;
        document.body.appendChild(sprite);
        spritesInCombo.push(sprite);

        gsap.set(sprite, {
          top: top + (combo.reelRow) * height - 152,
          left: left + (i - combo.reelRow) * width * 1.15 + 115 + i,
        });
      }
    });

    gsap.to(spritesInCombo, {
      opacity: 1,
      duration: 0.07,
      stagger: 0.018,
      repeat: -1,
      yoyo: true,
    });

    gsap.to(spritesInCombo, {
      opacity: 0,
      duration: 0.8,
      delay: 2,
    });
  };

  const winningAnimation = useCallback((winningCombinations) => {
    const image = new Image();
    image.src = spritesheet;
    
    image.onload = () => {
      const frames = spritesheetData.frames;
      const imageNames = {
        lemon: Array.from({length: 12}, (_, i) => `sym_lemon_${String(i + 2).padStart(3, '0')}`),
        orange: Array.from({length: 12}, (_, i) => `sym_orange_${String(i + 2).padStart(3, '0')}`),
        plum: Array.from({length: 12}, (_, i) => `sym_plum_${String(i + 2).padStart(3, '0')}`)
      };

      winningCombinations.forEach((combo) => {
        createSpriteAnimation(combo, frames, imageNames);
      });
    };
  }, []);

  return { winningAnimation };
}