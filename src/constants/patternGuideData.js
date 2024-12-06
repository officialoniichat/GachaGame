export const PATTERN_SYMBOLS = [
  { 
    src: 'https://firebasestorage.googleapis.com/v0/b/oniichat-2c310.appspot.com/o/Kein%20Titel%20(1024%20x%201536%20px)%20(472%20x%201159%20px)%20(1080%20x%201080%20px)%20(500%20x%20500%20px)%20(1).png?alt=media&token=6bdee1ce-6672-405d-9290-76e0efc0a3ed',
    alt: 'taiyaki'
  },
  { 
    src: 'https://firebasestorage.googleapis.com/v0/b/oniichat-2c310.appspot.com/o/Kein%20Titel%20(1024%20x%201536%20px)%20(472%20x%201159%20px)%20(1080%20x%201080%20px)%20(500%20x%20500%20px).png?alt=media&token=401b3633-c3f6-4fc5-86a7-8ed57d0f8aa6',
    alt: 'pero pero'
  },
  {
    src: 'https://imagedelivery.net/80ncJPif6mMa3mEeTHej8g/646c7428-6b0d-482d-cd92-be2b61473600/mobile',
    alt: 'dumpling'
  },
  {
    src: 'https://firebasestorage.googleapis.com/v0/b/oniichat-2c310.appspot.com/o/onigiri.png?alt=media&token=e234a54b-b597-47fd-98d0-688776c13014',
    alt: 'onigiri'
  },
  {
    src: 'https://imagedelivery.net/80ncJPif6mMa3mEeTHej8g/a6fbc623-5383-45cb-0393-841a157e7e00/mobile',
    alt: 'wolfi'
  },
  {
    src: 'https://imagedelivery.net/80ncJPif6mMa3mEeTHej8g/5ed079d3-8e99-4a57-933b-16d802fd8500/mobile',
    alt: 'demon'
  },
  {
    src: 'https://imagedelivery.net/80ncJPif6mMa3mEeTHej8g/94da9d36-a050-43cf-d35d-5c7ec6426e00/mobile',
    alt: 'angel'
  },
  {
    src: 'https://imagedelivery.net/80ncJPif6mMa3mEeTHej8g/f1fbb163-f44e-4260-7376-a5b8f73f0d00/mobile',
    alt: 'goddess'
  }
];

export const PATTERN_DATA = {
  taiyaki: [
    { name: "Single Row", reward: "3 Gems", description: "Match 3 symbols in any horizontal row", pattern: "→ → →" },
    { name: "Single Column", reward: "7 Gems", description: "Match 3 symbols in any vertical column", pattern: "↓" },
    { name: "Diagonal", reward: "9 Gems", description: "Match 3 symbols diagonally", pattern: "↘ or ↗" },
    { name: "Mixed Patterns", reward: "Combined Gems", description: "Two different patterns combine their rewards", pattern: "Mix" },
    { name: "Double Row", reward: "13 Gems", description: "Two complete rows of matching symbols", pattern: "→→" },
    { name: "Double Column", reward: "17 Gems", description: "Two complete columns of matching symbols", pattern: "↓↓" },
    { name: "Double Diagonal", reward: "20 Gems", description: "Both diagonals with matching symbols", pattern: "X" },
    { name: "Full House", reward: "100 Gems", description: "Fill the entire grid with Taiyaki", pattern: "All" }
  ],
  'pero pero': [
    { name: "Single Row", reward: "4 Gems", description: "Match 3 symbols in any horizontal row", pattern: "→ → →" },
    { name: "Single Column", reward: "8 Gems", description: "Match 3 symbols in any vertical column", pattern: "↓" },
    { name: "Diagonal", reward: "10 Gems", description: "Match 3 symbols diagonally", pattern: "↘ or ↗" },
    { name: "Mixed Patterns", reward: "Combined Gems", description: "Two different patterns combine their rewards", pattern: "Mix" },
    { name: "Double Row", reward: "16 Gems", description: "Two complete rows of matching symbols", pattern: "→→" },
    { name: "Double Column", reward: "21 Gems", description: "Two complete columns of matching symbols", pattern: "↓↓" },
    { name: "Double Diagonal", reward: "23 Gems", description: "Both diagonals with matching symbols", pattern: "X" },
    { name: "Full House", reward: "130 Gems", description: "Fill the entire grid with Pero Pero", pattern: "All" }
  ],
  dumpling: [
    { name: "Single Row", reward: "8 Gems", description: "Match 3 symbols in any horizontal row", pattern: "→ → →" },
    { name: "Single Column", reward: "11 Gems", description: "Match 3 symbols in any vertical column", pattern: "↓" },
    { name: "Diagonal", reward: "13 Gems", description: "Match 3 symbols diagonally", pattern: "↘ or ↗" },
    { name: "Mixed Patterns", reward: "Combined Gems", description: "Two different patterns combine their rewards", pattern: "Mix" },
    { name: "Double Row", reward: "21 Gems", description: "Two complete rows of matching symbols", pattern: "→→" },
    { name: "Double Column", reward: "33 Gems", description: "Two complete columns of matching symbols", pattern: "↓↓" },
    { name: "Double Diagonal", reward: "40 Gems", description: "Both diagonals with matching symbols", pattern: "X" },
    { name: "Full House", reward: "285 Gems", description: "Fill the entire grid with Dumplings", pattern: "All" }
  ],
  onigiri: [
    { name: "Single Row", reward: "25 Gems", description: "Match 3 symbols in any horizontal row", pattern: "→ → →" },
    { name: "Single Column", reward: "40 Gems", description: "Match 3 symbols in any vertical column", pattern: "↓" },
    { name: "Diagonal", reward: "55 Gems", description: "Match 3 symbols diagonally", pattern: "↘ or ↗" },
    { name: "Mixed Patterns", reward: "Combined Gems", description: "Two different patterns combine their rewards", pattern: "Mix" },
    { name: "Double Row", reward: "70 Gems", description: "Two complete rows of matching symbols", pattern: "→→" },
    { name: "Double Column", reward: "120 Gems", description: "Two complete columns of matching symbols", pattern: "↓↓" },
    { name: "Double Diagonal", reward: "250 Gems", description: "Both diagonals with matching symbols", pattern: "X" },
    { name: "Full House", reward: "1,750 Gems", description: "Fill the entire grid with Onigiri", pattern: "All" }
  ],
  wolfi: [
    { name: "Single Row", reward: "2,150 Gems", description: "Match 3 symbols in any horizontal row", pattern: "→ → →" },
    { name: "Single Column", reward: "Normal Character", description: "Win a Normal Character", pattern: "↓" },
    { name: "Diagonal", reward: "Normal Character + 300 Gems", description: "Win a Normal Character plus bonus gems", pattern: "↘ or ↗" },
    { name: "Mixed Patterns", reward: "500 Gems", description: "Consolation prize for any two different patterns", pattern: "Mix" },
    { name: "Double Row", reward: "Normal Character + 3,000 Gems", description: "Win a Normal Character plus bonus gems", pattern: "→→" },
    { name: "Double Column", reward: "Normal Character + 5,000 Gems", description: "Win a Normal Character plus bonus gems", pattern: "↓↓" },
    { name: "Double Diagonal", reward: "Normal Character + 6,000 Gems", description: "Win a Normal Character plus bonus gems", pattern: "X" },
    { name: "Full House", reward: "2 Characters + 6,500 Gems", description: "Win two Normal Characters plus bonus gems", pattern: "All" }
  ],
  demon: [
    { name: "Single Row", reward: "4,150 Gems", description: "Match 3 symbols in any horizontal row", pattern: "→ → →" },
    { name: "Single Column", reward: "Freaky Character", description: "Win a Freaky Character", pattern: "↓" },
    { name: "Diagonal", reward: "Freaky Character + 700 Gems", description: "Win a Freaky Character plus bonus gems", pattern: "↘ or ↗" },
    { name: "Mixed Patterns", reward: "1,000 Gems", description: "Consolation prize for any two different patterns", pattern: "Mix" },
    { name: "Double Row", reward: "Freaky Character + 7,000 Gems", description: "Win a Freaky Character plus bonus gems", pattern: "→→" },
    { name: "Double Column", reward: "Freaky Character + 9,000 Gems", description: "Win a Freaky Character plus bonus gems", pattern: "↓↓" },
    { name: "Double Diagonal", reward: "Freaky Character + 12,000 Gems", description: "Win a Freaky Character plus bonus gems", pattern: "X" },
    { name: "Full House", reward: "2 Freaky + 15,000 Gems", description: "Win two Freaky Characters plus bonus gems", pattern: "All" }
  ],
  angel: [
    { name: "Single Row", reward: "4,150 Gems", description: "Match 3 symbols in any horizontal row", pattern: "→ → →" },
    { name: "Single Column", reward: "Clean/Special Character", description: "Win a Clean/Special Character", pattern: "↓" },
    { name: "Diagonal", reward: "Clean/Special Character + 700 Gems", description: "Win a Clean/Special Character plus bonus gems", pattern: "↘ or ↗" },
    { name: "Mixed Patterns", reward: "1,000 Gems", description: "Consolation prize for any two different patterns", pattern: "Mix" },
    { name: "Double Row", reward: "Clean/Special Character + 7,000 Gems", description: "Win a Clean/Special Character plus bonus gems", pattern: "→→" },
    { name: "Double Column", reward: "Clean/Special Character + 9,000 Gems", description: "Win a Clean/Special Character plus bonus gems", pattern: "↓↓" },
    { name: "Double Diagonal", reward: "Clean/Special Character + 12,000 Gems", description: "Win a Clean/Special Character plus bonus gems", pattern: "X" },
    { name: "Full House", reward: "2 Clean/Special + 15,000 Gems", description: "Win two Clean/Special Characters plus bonus gems", pattern: "All" }
  ],
  goddess: [
    { name: "Single Row", reward: "14,150 Gems", description: "Match 3 symbols in any horizontal row", pattern: "→ → →" },
    { name: "Single Column", reward: "Goddess Character", description: "Win a Goddess Character", pattern: "↓" },
    { name: "Diagonal", reward: "Goddess Character + 15,500 Gems", description: "Win a Goddess Character plus bonus gems", pattern: "↘ or ↗" },
    { name: "Mixed Patterns", reward: "10,000 Gems", description: "Consolation prize for any two different patterns", pattern: "Mix" },
    { name: "Double Row", reward: "Goddess Character + 25,000 Gems", description: "Win a Goddess Character plus bonus gems", pattern: "→→" },
    { name: "Double Column", reward: "Goddess Character + 37,000 Gems", description: "Win a Goddess Character plus bonus gems", pattern: "↓↓" },
    { name: "Double Diagonal", reward: "Goddess Character + 70,000 Gems", description: "Win a Goddess Character plus bonus gems", pattern: "X" },
    { name: "Full House", reward: "2 Goddess + 250,000 Gems", description: "Win two Goddess Characters plus bonus gems", pattern: "All" }
  ]
};