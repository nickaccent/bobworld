import React, { createContext, useState, useMemo } from 'react';

export const SoundManagerContext = createContext(null);

export function SoundManagerContextProvider({ children }) {
  const [soundManager, setSoundManager] = useState(null);

  const SoundManagerProviderValue = useMemo(
    () => ({
      soundManager,
      setSoundManager,
    }),
    [soundManager, setSoundManager],
  );

  return (
    <SoundManagerContext.Provider value={SoundManagerProviderValue}>
      {children}
    </SoundManagerContext.Provider>
  );
}
