import React from 'react';
import { ClockContextProvider } from './contexts/Clock';
import { GUIContextProvider } from './contexts/GUI';
import { EntityManagerContextProvider } from './contexts/EntityManager';
import { HashGridContextProvider } from './contexts/HashGrid';
import { PathFindingGridContextProvider } from './contexts/PathFindingGrid';
import { SoundManagerContextProvider } from './contexts/SoundManager';
import Game from './components/Game';

function App() {
  return (
    <>
      <>
        <EntityManagerContextProvider>
          <HashGridContextProvider>
            <PathFindingGridContextProvider>
              <SoundManagerContextProvider>
                <GUIContextProvider>
                  <ClockContextProvider>
                    <Game />
                  </ClockContextProvider>
                </GUIContextProvider>
              </SoundManagerContextProvider>
            </PathFindingGridContextProvider>
          </HashGridContextProvider>
        </EntityManagerContextProvider>
      </>
    </>
  );
}

export default App;
