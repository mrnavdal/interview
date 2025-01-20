export const generateFibSequence = (sideSize) => {
  const fibArray = [1, 1];
  let next = 0;
  
  for (let i = 0; i < sideSize; i++) {
    next = fibArray[fibArray.length - 1] + fibArray[fibArray.length - 2];
    fibArray.push(next);
  }
  
  return fibArray;
};

export const generateFibNeighborsMap = (sideSize) => {
  const fibArray = generateFibSequence(sideSize);
  const neighborsMap = {};

  // Pro každé číslo v posloupnosti najdeme nejbližší menší a větší
  for (let i = 0; i < sideSize; i++) {
    const current = fibArray[i];
    const smaller = i > 0 ? fibArray[i - 1] : null;
    const bigger = i < fibArray.length - 1 ? fibArray[i + 1] : null;
    
    neighborsMap[current] = [smaller, bigger];
  }

  return neighborsMap;
};
