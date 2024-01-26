import React, { createContext, useState, useMemo } from 'react';

export const PathFindingGridContext = createContext(null);

export function PathFindingGridContextProvider({ children }) {
  const [pathFindingGrid, setPathFindingGrid] = useState(null);
  const [startPosition, setStartPosition] = useState(null);

  const PathFindingGridProviderValue = useMemo(
    () => ({
      pathFindingGrid,
      setPathFindingGrid,
      startPosition,
      setStartPosition,
    }),
    [pathFindingGrid, setPathFindingGrid, startPosition, setStartPosition],
  );

  return (
    <PathFindingGridContext.Provider value={PathFindingGridProviderValue}>
      {children}
    </PathFindingGridContext.Provider>
  );
}
