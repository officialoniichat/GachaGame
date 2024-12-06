// Utility functions for wheel calculations
export const MULTIPLIERS = [2, 3, 5, 8, 10, 15, 20, 25];

export const getMultiplierAtPointer = (finalRotation) => {
  // Normalize the rotation to 0-360 degrees
  const normalizedRotation = ((finalRotation % 360) + 360) % 360;
  
  // Calculate segment size
  const segmentSize = 360 / MULTIPLIERS.length;
  
  // Calculate which segment is at the pointer (bottom, 180 degrees)
  const pointerPosition = (360 - normalizedRotation + 180) % 360;
  
  // Calculate index - no offset needed now since we align exactly
  const index = Math.floor(pointerPosition / segmentSize) % MULTIPLIERS.length;
  
  return MULTIPLIERS[index];
};

export const calculateFinalRotation = (targetMultiplier) => {
  const segmentSize = 360 / MULTIPLIERS.length;
  const targetIndex = MULTIPLIERS.indexOf(targetMultiplier);
  
  // Calculate base rotation to align exactly with pointer
  const baseRotation = 360 - (targetIndex * segmentSize + 180);
  
  // Add extra full rotations (5-7 complete spins)
  const extraRotations = (5 + Math.floor(Math.random() * 3)) * 360;
  
  return extraRotations + baseRotation;
};