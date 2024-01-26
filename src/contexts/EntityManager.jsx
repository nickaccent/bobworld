import React, { createContext, useState, useMemo } from 'react';
import EntityManager from '../classes/EntityManager';

export const EntityManagerContext = createContext(null);

export function EntityManagerContextProvider({ children }) {
  const [entityManager, setEntityManager] = useState(new EntityManager());

  const EntityManagerProviderValue = useMemo(
    () => ({
      entityManager,
    }),
    [entityManager],
  );

  return (
    <EntityManagerContext.Provider value={EntityManagerProviderValue}>
      {children}
    </EntityManagerContext.Provider>
  );
}
