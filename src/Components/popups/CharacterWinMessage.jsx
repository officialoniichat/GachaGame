import React from 'react';

const getWinMessage = (characterType, winType, gems) => {
  const characterNames = {
    wolfi: "Normal Character",
    demon: "Freaky Character",
    angel: "Clean/Special Character",
    goddess: "Goddess Character"
  };

  const characterName = characterNames[characterType];
  
  if (winType === 'fullScreen') {
    return (
      <>
        <div className="text-2xl font-bold text-yellow-300 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)] tracking-wide mb-4">
          YOU HAVE WON
        </div>
        <div className="space-y-4">
          <div className="text-4xl font-bold text-yellow-300 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]">
            2 {characterName}s
          </div>
          <div className="text-3xl font-bold text-yellow-300">
            + {gems.toLocaleString()} Gems
          </div>
        </div>
      </>
    );
  }

  if (winType === 'row') {
    return (
      <>
        <div className="text-2xl font-bold text-yellow-300 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)] tracking-wide mb-4">
          YOU HAVE WON
        </div>
        <div className="min-h-[120px] flex flex-col justify-center">
          <div className="text-4xl font-bold text-yellow-300 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]">
            {gems.toLocaleString()} Gems
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="text-2xl font-bold text-yellow-300 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)] tracking-wide mb-4">
        YOU HAVE WON
      </div>
      <div className="space-y-4">
        <div className="text-4xl font-bold text-yellow-300 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]">
          1 {characterName}
        </div>
        {gems > 0 && (
          <div className="text-3xl font-bold text-yellow-300">
            + {gems.toLocaleString()} Gems
          </div>
        )}
      </div>
    </>
  );
};

const CharacterWinMessage = ({ characterType, winType, gems }) => {
  return (
    <div className="space-y-4 py-4 min-h-[200px] flex flex-col justify-center">
      {getWinMessage(characterType, winType, gems)}
    </div>
  );
};

export default CharacterWinMessage;
