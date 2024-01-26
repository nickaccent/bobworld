import React, { useContext } from 'react';
import { GUIContext } from '../contexts/GUI';

const StartGUI = () => {
  const { setLoad, setStart } = useContext(GUIContext);
  return (
    <div className="center">
      <div className="glassmorphism p-2 b-r-8 c-intro text-center">
        <h2 className="mt-h">Three World</h2>
        <p>
          Three world is a sim-city style game where can build a functioning city and manage the
          minutia of its day to day running and planning.
        </p>
        <p>
          <button className="button mt-1" onClick={() => setStart(true)}>
            Start New Game
          </button>
        </p>
        <p>
          <button className="button mt-1" onClick={() => setLoad(true)}>
            Load Game
          </button>
        </p>
      </div>
    </div>
  );
};

export default StartGUI;
