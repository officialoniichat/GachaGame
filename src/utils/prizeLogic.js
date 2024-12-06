export const PRIZE_MAP = {
  taiyaki: {
    row: 3,
    column: 7,
    diagonal: 9,
    doubleRow: 13,
    doubleColumn: 17,
    doubleDiagonal: 20,
    fullScreen: 100
  },
  'pero pero': {
    row: 4,
    column: 8,
    diagonal: 10,
    doubleRow: 16,
    doubleColumn: 21,
    doubleDiagonal: 23,
    fullScreen: 130
  },
  dumpling: {
    row: 8,
    column: 11,
    diagonal: 13,
    doubleRow: 21,
    doubleColumn: 33,
    doubleDiagonal: 40,
    fullScreen: 285
  },
  onigiri: {
    row: 25,
    column: 40,
    diagonal: 55,
    doubleRow: 70,
    doubleColumn: 120,
    doubleDiagonal: 250,
    fullScreen: 1750
  },
  wolfi: {
    row: 2150,
    diagonal: 300,
    doubleRow: 3000,
    doubleColumn: 5000,
    doubleDiagonal: 6000,
    fullScreen: 6500
  },
  demon: {
    row: 4150,
    diagonal: 700,
    doubleRow: 7000,
    doubleColumn: 9000,
    doubleDiagonal: 12000,
    fullScreen: 15000
  },
  angel: {
    row: 4150,
    diagonal: 700,
    doubleRow: 7000,
    doubleColumn: 9000,
    doubleDiagonal: 12000,
    fullScreen: 15000
  },
  goddess: {
    row: 14150,
    diagonal: 15500,
    doubleRow: 25000,
    doubleColumn: 37000,
    doubleDiagonal: 70000,
    fullScreen: 250000
  }
};

export const calculatePrize = (combinations) => {
  let totalGems = 0;
  let wonCharacters = [];

  if (!Array.isArray(combinations)) return { gems: 0, characters: [] };

  combinations.forEach(combo => {
    if (!combo || !combo.elements || !combo.elements[0]) return;

    const symbolElement = combo.elements[0].querySelector('img');
    if (!symbolElement || !symbolElement.alt) return;

    const symbol = symbolElement.alt.toLowerCase();
    if (!PRIZE_MAP[symbol]) return;

    const isCharacterSymbol = ['wolfi', 'demon', 'angel', 'goddess'].includes(symbol);

    // Handle character wins for column patterns
    if (isCharacterSymbol && combo.type === 'column') {
      wonCharacters.push({
        type: symbol,
        count: 1
      });
      return;
    }

    let prizeAmount = 0;

    switch (combo.type) {
      case 'row':
        prizeAmount = PRIZE_MAP[symbol].row || 0;
        break;
      case 'column':
        if (!isCharacterSymbol) {
          prizeAmount = PRIZE_MAP[symbol].column || 0;
        }
        break;
      case 'diagonal':
        prizeAmount = PRIZE_MAP[symbol].diagonal || 0;
        break;
      case 'fullScreen':
        prizeAmount = PRIZE_MAP[symbol].fullScreen || 0;
        if (isCharacterSymbol) {
          wonCharacters.push({
            type: symbol,
            count: 2
          });
        }
        break;
      case 'doubleRow':
        prizeAmount = PRIZE_MAP[symbol].doubleRow || 0;
        break;
      case 'doubleColumn':
        if (!isCharacterSymbol) {
          prizeAmount = PRIZE_MAP[symbol].doubleColumn || 0;
        }
        break;
      case 'doubleDiagonal':
        prizeAmount = PRIZE_MAP[symbol].doubleDiagonal || 0;
        break;
      default:
        break;
    }

    totalGems += prizeAmount;
  });

  return {
    gems: totalGems,
    characters: wonCharacters
  };
};