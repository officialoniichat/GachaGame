import React from 'react';

function WheelSegment({ multiplier, angle, radius }) {
  const radian = (angle - 90) * (Math.PI / 180);
  const x = 50 + radius * Math.cos(radian);
  const y = 50 + radius * Math.sin(radian);
  
  return (
    <div
      className="absolute text-center"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) rotate(${angle + 180}deg)`,
        transformOrigin: 'center',
      }}
    >
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-0.5 rounded-lg shadow-lg">
        <div className="bg-purple-900/90 px-3 py-1 rounded-lg">
          <span className="text-2xl font-bold text-yellow-400 drop-shadow-lg">
            {multiplier}x
          </span>
        </div>
      </div>
    </div>
  );
}

export default WheelSegment;