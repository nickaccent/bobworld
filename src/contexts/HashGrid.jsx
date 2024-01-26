import React, { createContext, useState, useMemo } from 'react';
import HashGrid from '../classes/HashGrid';

export const HashGridContext = createContext(null);

export function HashGridContextProvider({ children }) {
  const [hashGrid, setHashGrid] = useState(null);

  const HashGridProviderValue = useMemo(
    () => ({
      hashGrid,
      setHashGrid,
    }),
    [hashGrid, setHashGrid],
  );

  return (
    <HashGridContext.Provider value={HashGridProviderValue}>{children}</HashGridContext.Provider>
  );
}
